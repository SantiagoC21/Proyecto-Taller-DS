import os
import sys
import time
import json
import shutil
import subprocess
import urllib.request, urllib.error

# Ruta del ngrok.yml que llevas en el proyecto
script_dir = os.path.dirname(os.path.abspath(__file__))
ngrok_config = os.path.join(script_dir, "ngrok.yml")

# Ruta .env en ../client/.env
parent_dir = os.path.abspath(os.path.join(script_dir, os.pardir))
env_path = os.path.join(parent_dir, "client", ".env")

# Buscar ngrok en PATH
ngrok_path = shutil.which("ngrok")
if not ngrok_path:
    print("❌ ngrok no encontrado. Instálalo con: choco install ngrok")
    sys.exit(1)

print(f"🔎 Usando ngrok: {ngrok_path}")

# Iniciar ngrok
print("🚀 Iniciando ngrok...")
ngrok_proc = subprocess.Popen(
    [ngrok_path, "start", "--all", "--config", ngrok_config],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

# Esperar API
print("⌛ Esperando API...")
def wait_api(timeout=30):
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

data = wait_api()
if not data:
    print("❌ La API no respondió.")
    sys.exit(1)

# Buscar flask y react
flask_url = None
react_url = None
for t in data.get("tunnels", []):
    name = (t.get("name") or "").lower()
    if name == "flask":
        flask_url = t.get("public_url")
    elif name == "react":
        react_url = t.get("public_url")

if not flask_url:
    print("❌ Túnel 'flask' no encontrado. Detectados:", [t.get("name") for t in data.get("tunnels", [])])
    sys.exit(1)

if not react_url:
    print("⚠️ Túnel 'react' no encontrado.")

# Imprimir ambos links en terminal
print("\n🌐 Links de ngrok:")
print(f"Flask: {flask_url}")
if react_url:
    print(f"React: {react_url}")

# Actualizar .env solo con flask
content = f"VITE_API_BASE={flask_url}\n"
with open(env_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\n✅ .env actualizado en {env_path}")
print(content.strip())
