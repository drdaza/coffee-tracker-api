# Coffee Tracker API - Multi-stage Docker Build
# Usando Node.js 22 LTS (compatible con tu versión local v22.14.0)

# === DESARROLLO ===
FROM node:22-alpine as dev
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copiar schema de Prisma y generar cliente
COPY prisma ./prisma
RUN npx prisma generate

CMD ["pnpm", "run", "start:dev"]

# === DEPENDENCIAS DE DESARROLLO ===
FROM node:22-alpine as dev-deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# === BUILDER (Compilación) ===
FROM node:22-alpine as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Construir la aplicación
RUN pnpm run build

# === DEPENDENCIAS DE PRODUCCIÓN ===
FROM node:22-alpine as prod-deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# === PRODUCCIÓN ===
FROM node:22-alpine as prod
WORKDIR /app

# Instalar pnpm para generar Prisma
RUN npm install -g pnpm

# Variables de entorno de producción
ENV NODE_ENV=production

# Copiar dependencias de producción
COPY --from=prod-deps /app/node_modules ./node_modules

# Copiar aplicación construida
COPY --from=builder /app/dist ./dist

# Copiar archivos de Prisma y esquema
COPY --from=builder /app/generated ./generated
COPY prisma ./prisma
COPY package*.json ./

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "run", "start:prod"] 