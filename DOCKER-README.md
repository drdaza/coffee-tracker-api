# 🐳 Coffee Tracker API - Docker Setup

Este documento explica cómo ejecutar la aplicación Coffee Tracker API usando Docker, tanto para desarrollo como para producción.

## 📋 Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose v3.8 o superior
- Puerto 3000 y 5432 disponibles (o configura otros en el `.env`)

## 🚀 Configuración Inicial

### 1. Crear archivo de variables de entorno

Copia el archivo de template y configura tus variables:

```bash
cp env.template .env
```

Edita el archivo `.env` con tus configuraciones:

```bash
# Ejemplo de configuración mínima
NODE_ENV=development
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu-password-seguro
POSTGRES_DB=coffee_tracker
STAGE=dev
```

## 🛠 Comandos de Docker

### Para Desarrollo

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Ejecutar en modo detached (background)
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo de la API
docker-compose logs -f api

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (¡cuidado! se perderán los datos)
docker-compose down -v
```

### Para Producción

```bash
# Levantar en modo producción
docker-compose -f docker-compose.prod.yml up --build -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar servicios de producción
docker-compose -f docker-compose.prod.yml down
```

## 🗃 Gestión de Base de Datos

### Ejecutar Migraciones

```bash
# Dentro del contenedor de la API
docker-compose exec api npx prisma migrate dev

# O desde fuera del contenedor (si tienes pnpm local)
pnpm prisma migrate dev
```

### Generar Cliente de Prisma

```bash
# Dentro del contenedor
docker-compose exec api npx prisma generate

# O localmente
pnpm prisma generate
```

### Seed de datos (si tienes un seed configurado)

```bash
# Dentro del contenedor
docker-compose exec api npx prisma db seed
```

## 📊 Monitoreo y Debug

### Acceder a la Base de Datos

```bash
# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d coffee_tracker

# O usando un cliente externo en localhost:5432
```

### Acceder al contenedor de la API

```bash
# Ejecutar bash en el contenedor
docker-compose exec api sh

# Ver archivos generados
docker-compose exec api ls -la generated/
```

### Health Checks

En producción, los servicios tienen health checks configurados:

- **API**: `GET http://localhost:3000/health`
- **PostgreSQL**: Comando interno `pg_isready`

## 🔧 Troubleshooting

### Problemas Comunes

1. **Puerto ya en uso**:
   ```bash
   # Cambiar puerto en .env
   PORT=3001
   ```

2. **Problemas con Prisma**:
   ```bash
   # Regenerar cliente
   docker-compose exec api npx prisma generate
   ```

3. **Base de datos no conecta**:
   ```bash
   # Verificar que PostgreSQL esté corriendo
   docker-compose ps
   
   # Ver logs de PostgreSQL
   docker-compose logs postgres
   ```

4. **Limpiar todo y empezar de nuevo**:
   ```bash
   # Parar todo
   docker-compose down -v
   
   # Limpiar imágenes
   docker system prune -a
   
   # Reconstruir
   docker-compose up --build
   ```

## 🏗 Arquitectura Docker

### Multi-stage Build

El `Dockerfile` usa múltiples etapas para optimización con **Node.js 22 LTS**:

- **dev**: Para desarrollo con hot-reload
- **dev-deps**: Instalación de dependencias completas
- **builder**: Compilación del código TypeScript
- **prod-deps**: Solo dependencias de producción
- **prod**: Imagen final optimizada para producción

### Volúmenes

- **postgres_data**: Persistencia de datos de PostgreSQL (desarrollo)
- **postgres_data_prod**: Persistencia de datos de PostgreSQL (producción)
- **Bind mount**: En desarrollo, el código se monta para hot-reload

### Redes

Se crea una red `coffee-tracker-network` para la comunicación entre servicios.

## 📝 Variables de Entorno Disponibles

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto de la API | `3000` |
| `POSTGRES_USER` | Usuario de PostgreSQL | `tuusuario` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `tucontraseña` |
| `POSTGRES_DB` | Nombre de la base de datos | `coffee_tracker` |
| `POSTGRES_PORT` | Puerto de PostgreSQL | `5432` |
| `STAGE` | Etapa de Docker para usar | `dev` |
| `JWT_SECRET` | Secreto para JWT | - |

## 🚀 Despliegue

Para desplegar en un servidor:

1. Clona el repositorio
2. Configura las variables de entorno
3. Ejecuta: `docker-compose -f docker-compose.prod.yml up -d`
4. Configura un reverse proxy (nginx) si es necesario

¡Ya tienes tu Coffee Tracker API corriendo en Docker! ☕ 