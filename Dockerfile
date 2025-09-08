ARG NODE_VERSION=24.7.0

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app

FROM base AS builder
# Copiar solo lockfiles y package.json de todos los paquetes para cache
COPY package.json  ./
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
COPY backend/package.json backend/pnpm-lock.yaml ./backend/

RUN pnpm install:all

COPY . .
# Definir variables VITE para build
ARG VITE_STREAM_API_KEY
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY

RUN pnpm build:frontend

# -----------------------------
# Etapa 2: Production Stage
# -----------------------------
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /usr/src/app
# Instalar solo prod dependencies

# Copiar backend y lockfile
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
COPY backend ./backend

# Copiar node_modules del backend desde builder
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules

# Copiar frontend ya construido
COPY --from=builder /usr/src/app/frontend/dist ./frontend/dist

EXPOSE ${PORT}
# Ejecutar backend
CMD ["node", "backend/src/server.js"]
