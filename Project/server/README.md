
# 📊 Vensim Web Viewer con Flask, PySD y React (Integración en curso)

Este proyecto permite simular modelos dinámicos desarrollados en **Vensim** utilizando **PySD**, visualizar resultados interactivos con **matplotlib** embebido en HTML (`mpld3`), y consultar datos desde una **base de datos MySQL**. El sistema está construido con **Python + Flask** en el backend y está en proceso de migración a un **frontend moderno en React (Bolt + TailwindCSS)**.

## 🚀 Características

- ✅ Simulación de modelos `.mdl` de Vensim usando `pysd`
- ✅ Visualización de resultados con gráficos interactivos
- ✅ Consulta dinámica desde base de datos MySQL (XAMPP)
- ✅ Panel con modales que muestran datos tabulados por variable
- ✅ Uso de `.env` para configuración segura
- 🔄 En desarrollo: conexión con frontend React moderno

## 🧱 Estructura del Proyecto

```
📁 proyect/
├── app.py                       # App Flask principal
├── .env                         # Variables de entorno (configuración)
├── src/
│   ├── Controllers/
│   │   └── controller.py        # Lógica de simulación, descarga y graficado
│   ├── Models/
│   │   └── model.py             # Acceso a la base de datos (getModelAll)
│   └── Routes/
│       └── route.py             # Ruta principal de Flask ('/')
├── Connection/
│   └── connection.py            # Conexión MySQL (usa decouple)
├── static/
│   ├── css/, js/, images/       # Recursos estáticos
│   └── vensim/                  # Carpeta donde se descargan archivos .mdl
├── templates/
│   └── template.html            # Vista con gráficos y tablas (Jinja2)
├── Backup/
│   ├── vensimweb.sql            # Script de creación de BD
│   └── document.mdl             # Modelo Vensim base
```

## ⚙️ Requisitos

- Python 3.10+
- Flask
- PySD
- Matplotlib
- Mpld3
- Python-Decouple
- MySQL (XAMPP o similar)
- Ngrok (opcional, para exponer localhost)

Instalación de dependencias:

```bash
pip install -r requirements.txt
```

## 🔐 Variables de Entorno (.env)

Configura tu archivo `.env` en la raíz del proyecto:

```env
APP_URL_VENSIM=http://localhost/assets/vensim/
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vensimweb
DB_USERNAME=usuario
DB_PASSWORD=contraseña
```

## 🛠️ Cómo Ejecutar

1. Asegúrate de tener el servidor MySQL corriendo en XAMPP.
2. Crea la base de datos usando el script `Backup/vensimweb.sql`.
3. Ejecuta la app Flask:

```bash
python app.py
```

4. Si deseas exponer con Ngrok (opcional):

```bash
ngrok http 5000
```

## 🧪 Simulación y Visualización

- Se descargan múltiples modelos `.mdl` desde la URL configurada.
- Cada archivo es simulado individualmente con PySD.
- Se generan gráficos y tablas organizadas por modelo → submodelo → variable.
- La vista usa Bootstrap 5 y modales para mostrar los datos tabulados.

## 🧩 Roadmap

- [x] Simulación múltiple de modelos
- [x] Gráficos interactivos con mpld3
- [x] Panel con tablas dinámicas
- [ ] Integración completa con frontend React Bolt (⚙️ en progreso)
- [ ] Login de usuario y gestión de sesiones
- [ ] Exportación a Excel o PDF

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT.

---

**Desarrollado por estudiantes de la Universidad Nacional de Ingeniería (UNI)**  
Taller de Dinámica de Sistemas – 2025

