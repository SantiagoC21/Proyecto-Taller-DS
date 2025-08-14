import os
import sys
import time
import json
import shutil
import subprocess
import urllib.request, urllib.error
import signal

# ========================
#  RUTAS BÁSICAS
# ========================
script_dir = os.path.dirname(os.path.abspath(__file__))
ngrok_config = os.path.join(script_dir, "ngrok.yml")
print(ngrok_config)

parent_dir = os.path.abspath(os.path.join(script_dir, os.pardir))
env_path = os.path.join(parent_dir, "client", ".env")

# ========================
#  UTILIDADES
# ========================

def resolve_ngrok_path():
    preferred = r"C:\\ProgramData\\chocolatey\\bin\\ngrok.exe"
    candidates = [
        preferred if os.path.exists(preferred) else None,
        shutil.which("ngrok.exe"),
        shutil.which("ngrok"),
    ]
    for p in candidates:
        if not p:
            continue
        pl = p.lower()
        if not pl.endswith(".exe"):
            continue
        if "\\.venv\\" in pl or "/.venv/" in pl or "\\venv\\" in pl or "/venv/" in pl:
            continue
        return p
    return None


def graceful_stop(proc: subprocess.Popen, timeout: float = 5.0):
    if not proc:
        return
    try:
        if os.name == "nt":
            try:
                proc.send_signal(signal.CTRL_BREAK_EVENT)
                proc.wait(timeout=timeout)
                return
            except Exception:
                pass
        proc.terminate()
        proc.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        if os.name == "nt":
            subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            proc.kill()
    except Exception as e:
        print(f"⚠️ Error al detener ngrok: {e}")


def wait_api(timeout=60):
    url = "http://127.0.0.1:4040/api/tunnels"
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if "tunnels" in data:
                    return data
        except Exception:
            pass
        time.sleep(1)
    return None


def wait_for_keypress(prompt: str = "\nPulsa cualquier tecla para detener ngrok…"):
    print(prompt)
    try:
        import msvcrt  # type: ignore
        msvcrt.getch()
    except Exception:
        input()

# ========================
#  RESOLVER NGROK + VALIDAR CONFIG + EXTRAER NOMBRES
# ========================
ngrok_path = resolve_ngrok_path()
if not ngrok_path:
    print("❌ ngrok.exe no encontrado. Instálalo con: choco install ngrok")
    sys.exit(1)

print(f"🔎 Usando ngrok: {ngrok_path}")

if not os.path.exists(ngrok_config):
    print(f"❌ No existe el archivo de configuración: {ngrok_config}")
    sys.exit(1)

# Chequeo rápido por si alguien deshabilitó la API
try:
    with open(ngrok_config, "r", encoding="utf-8") as _f:
        _cfg_text = _f.read()
    if "web_addr:" in _cfg_text and "web_addr: false" in _cfg_text:
        print("❌ Tu ngrok.yml tiene 'web_addr: false' y eso deshabilita la API 4040. Quítalo o coméntalo.")
        sys.exit(1)
except Exception:
    pass

# Extraer nombres de túneles (fallback si --all no los levanta)
def extract_tunnel_names(cfg_text: str):
    names = []
    lines = cfg_text.splitlines()
    in_tunnels = False
    for i, line in enumerate(lines):
        # Normaliza tabs
        l = line.replace("	", "    ")
        if not in_tunnels and l.strip().startswith("tunnels:"):
            in_tunnels = True
            continue
        if in_tunnels:
            # Si encontramos otra clave top-level, salimos
            if l and not l.startswith(" ") and not l.startswith("-"):
                break
            # Claves de 2+ espacios seguidas de identificador y :
            if l.startswith("  ") and ":" in l:
                key = l.strip().split(":", 1)[0]
                # evita claves internas tipo 'addr:'
                if key not in ("addr", "proto", "inspect", "labels", "schemes", "domain", "host_header", "basic_auth", "oauth", "headers"):
                    # Claves válidas suelen no contener espacios
                    if " " not in key and key:
                        names.append(key)
    return names

_tunnel_names = extract_tunnel_names(_cfg_text)
if not _tunnel_names:
    print("⚠️ No se detectaron nombres bajo 'tunnels:' en tu ngrok.yml. 'start --all' no levantará nada.")
    

chk = subprocess.run([ngrok_path, "config", "check", "--config", ngrok_config], capture_output=True, text=True)
if chk.returncode != 0:
    print("❌ Error en ngrok.yml (config check):")
    sys.stdout.write(chk.stdout)
    sys.stderr.write(chk.stderr)
    sys.exit(1)

# ========================
#  LANZAR NGROK
# ========================
print("🚀 Iniciando ngrok…")
redirect = os.getenv("NGROK_DEBUG", "0") != "1"

launch_args = [ngrok_path, "start"]
if _tunnel_names:
    launch_args += _tunnel_names  # levantar explícitamente por nombre
else:
    launch_args += ["--all"]
launch_args += ["--config", ngrok_config]

print("🧪 Comando:", " ".join(launch_args))

ngrok_proc = subprocess.Popen(
    launch_args,
    stdout=(subprocess.DEVNULL if redirect else None),
    stderr=(subprocess.DEVNULL if redirect else None),
    text=False,
    creationflags=(subprocess.CREATE_NEW_PROCESS_GROUP if hasattr(subprocess, 'CREATE_NEW_PROCESS_GROUP') else 0),
)


# ========================
#  ESPERAR API
# ========================
print("⌛ Esperando API…")
# Da un pequeño margen antes de consultar la API por primera vez
time.sleep(3)

data = wait_api(timeout=60)
if not data:
    print("❌ La API no respondió. Revisa autenticación (authtoken), que los puertos existan y que el ngrok.yml sea válido.")
    print("   Consejo: setea NGROK_DEBUG=1 para ver logs en consola; y prueba 'ngrok start --config <file> <nombres>'.")
    graceful_stop(ngrok_proc)
    sys.exit(1)

# ========================
#  SI NO HAY TÚNELES, MOSTRAR LOGS Y SALIR
# ========================
tunnels = data.get("tunnels", [])
print("🔗 Túneles detectados:", [t.get("name") for t in tunnels])
if not tunnels:
    print("⚠️ No hay túneles activos. Muestra de configuración actual:")
    try:
        with open(ngrok_config, "r", encoding="utf-8") as f:
            print(f.read())
    except Exception:
        pass
    graceful_stop(ngrok_proc)
    sys.exit(1)

# ========================
#  EXTRAER URLS
# ========================
flask_url = None
react_url = None
for t in tunnels:
    name = (t.get("name") or "").lower()
    if name == "flask" or ":5000" in (t.get("public_url") or ""):
        flask_url = t.get("public_url")
    if name == "react" or ":5173" in (t.get("public_url") or ""):
        react_url = t.get("public_url")

if not flask_url:
    print("❌ No se encontró un túnel para Flask.")
    graceful_stop(ngrok_proc)
    sys.exit(1)

print("\n🌐 Links de ngrok:")
print(f"Flask: {flask_url}")
print(f"React: {react_url if react_url else '(no encontrado)'}")

# ========================
#  ACTUALIZAR .ENV
# ========================
content = f"VITE_API_BASE={flask_url}\n"
try:
    with open(env_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\n✅ .env actualizado en {env_path}")
    print(content.strip())
except Exception as e:
    print(f"⚠️ No se pudo escribir el .env: {e}")

# ========================
#  ESPERAR TECLA Y CERRAR
# ========================
wait_for_keypress()

graceful_stop(ngrok_proc)
if os.name == "nt":
    subprocess.run(["taskkill", "/IM", "ngrok.exe", "/T", "/F"], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("✅ ngrok detenido. ¡Hasta luego!")
