<h1 align="center">✨ Fullstack Chat & Video Calling App ✨</h1>

![Demo App](/image.png)

### Highlights

- 🌐 Real-time Messaging with Typing Indicators & Reactions
- 📹 1-on-1 and Group Video Calls with Screen Sharing & Recording
- 🔐 JWT Authentication & Protected Routes
- 🌍 Language Exchange Platform with 32 Unique UI Themes
- ⚡ Tech Stack: React + Express + MongoDB + TailwindCSS + TanStack Query
- 🧠 Global State Management with Zustand
- 🚨 Error Handling (Frontend & Backend)
- 🚀 Free Deployment
- 🎯 Built with Scalable Technologies like Stream

---

## 🧪 .env Setup

### Backend (`/backend`)

```env
PORT=5001
MONGO_URI=your_mongo_uri
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

### Frontend (`/frontend`)

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

> ⚠️ **Nota:** Las variables que empiezan con `VITE_` deben estar presentes al **build del frontend** si vas a usar Docker o producción.

---

## 🔧 Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en `http://localhost:5173`.

---

## 🐳 Run with Docker

### 1. Build the Docker Image

Desde la raíz del proyecto:

```bash
docker build \
  --build-arg VITE_STREAM_API_KEY=your_stream_api_key \
  -t streamify-app .
```

### 2. Run the App in a Container

```bash
docker run --env-file .env -p 5001:8080 streamify-app
```

- `-p 5001:8080` → expone el puerto 8080 del contenedor al puerto 5001 de tu máquina.
- `.env` → variables de entorno para backend (MongoDB, JWT, Stream secret).

Accede a la app en: `http://localhost:5001`.

### 3. Stop the Container

```bash
docker ps           # lista contenedores en ejecución
docker stop <id>    # detener tu contenedor
```

---

## ☁️ Deploy on Koyeb (Docker)

1. Crear un **nuevo servicio** en Koyeb.
2. Seleccionar **Docker Registry** o subir tu imagen Docker.
3. Configurar **puerto público**:
   - Interno del contenedor: `8080`
   - Público: `8080` (El mismo que el contenedor)
4. Configurar **health check HTTP**:
   - Path: `/api/health`
   - Port: `8080` (interno del contenedor)
   - Method: `GET`
   - Interval: `30s`, Timeout: `5s`
5. Variables de entorno (Runtime para backend): `.env`
6. Asegúrate de **inyectar VITE\_STREAM\_API\_KEY al build** del frontend para que el frontend tenga acceso a la API Key de Stream.

Después del deploy, la app estará accesible en `https://<subdomain>.koyeb.app`.

---

## ⚡ Notes

- Las variables `VITE_` son **reemplazadas en build time**, no funcionan si solo las pones en runtime.
- El backend puede leer variables de `.env` en ejecución.
- Si usas ruta pública anidada para frontend, configura `base` en `vite.config.js`:

```js
export default defineConfig({
  base: "/my/public/path/",
});
```

---

