# ☕ Coffee Tracker API

Una API REST construida con NestJS y PostgreSQL para gestionar usuarios y cafés con funcionalidad de soft delete.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Entidades](#entidades)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)

## 📖 Descripción

Coffee Tracker API es una aplicación backend que permite gestionar usuarios y diferentes tipos de café. Implementa un patrón de "soft delete" para mantener la integridad de datos históricos, donde los registros se marcan como eliminados en lugar de ser removidos físicamente de la base de datos.

## 🚀 Tecnologías

- **Framework**: [NestJS](https://nestjs.com/) - Framework progresivo de Node.js
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Validación**: [class-validator](https://github.com/typestack/class-validator)
- **Transformación**: [class-transformer](https://github.com/typestack/class-transformer)

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (gestor de paquetes)
- [PostgreSQL](https://www.postgresql.org/) (versión 12 o superior)
- [Git](https://git-scm.com/)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/drdaza/coffee-tracker-api.git
   cd coffee-tracker-api
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tu configuración:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/coffee_tracker"
   ```

## 🗄️ Configuración de Base de Datos

1. **Crear la base de datos**
   ```sql
   CREATE DATABASE coffee_tracker;
   ```

2. **Ejecutar migraciones**
   ```bash
   npx prisma migrate deploy
   ```

3. **Generar cliente de Prisma**
   ```bash
   npx prisma generate
   ```

4. **Verificar estado de migraciones**
   ```bash
   npx prisma migrate status
   ```

## ▶️ Ejecutar el Proyecto

### Desarrollo
```bash
# Modo desarrollo con recarga automática
pnpm run start:dev
```

### Producción
```bash
# Compilar para producción
pnpm run build

# Ejecutar en modo producción
pnpm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

## 🏗️ Entidades

### 👤 User (Usuario)
Representa a los usuarios del sistema.

**Campos:**
- `id`: UUID único
- `name`: Nombre del usuario
- `email`: Email único del usuario
- `password`: Contraseña del usuario
- `deleted`: Soft delete flag (boolean)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización
- `coffees`: Relación many-to-many con Coffee

### ☕ Coffee (Café)
Representa los diferentes tipos de café disponibles.

**Campos:**
- `id`: UUID único
- `name`: Nombre del café
- `price`: Precio en centavos (número entero)
- `deleted`: Soft delete flag (boolean)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización
- `users`: Relación many-to-many con User

## 🔌 API Endpoints

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/users` | Crear nuevo usuario |
| `GET` | `/users` | Obtener todos los usuarios activos |
| `GET` | `/users/:id` | Obtener usuario por ID |
| `PATCH` | `/users/:id` | Actualizar usuario |
| `DELETE` | `/users/:id` | Soft delete de usuario |

### Cafés

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/coffees` | Crear nuevo café |
| `GET` | `/coffees` | Obtener todos los cafés activos |
| `GET` | `/coffees/:id` | Obtener café por ID |
| `PATCH` | `/coffees/:id` | Actualizar café |
| `DELETE` | `/coffees/:id` | Soft delete de café |

### Ejemplos de Payloads

**Crear Usuario:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securePassword123"
}
```

**Crear Café:**
```json
{
  "name": "Cappuccino",
  "price": 350
}
```

**Actualizar Café:**
```json
{
  "name": "Cappuccino Premium",
  "price": 400
}
```

## 🧪 Testing

```bash
# Tests unitarios
pnpm run test

# Tests e2e
pnpm run test:e2e

# Cobertura de tests
pnpm run test:cov
```

## 📁 Estructura del Proyecto

```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── coffees/
│   ├── dto/
│   │   ├── create-coffee.dto.ts
│   │   └── update-coffee.dto.ts
│   ├── coffees.controller.ts
│   ├── coffees.service.ts
│   └── coffees.module.ts
├── app.module.ts
└── main.ts

prisma/
├── schema.prisma
└── migrations/
    ├── 20250519201758_init/
    ├── 20250520200002_add_unique_email/
    ├── 20250521200915_add_deleted_user_atribute/
    ├── 20250521201247_add_deleted_user_atribute_asdas/
    └── 20250524212114_add_coffee_soft_delete/
```

## 🔧 Comandos Útiles

### Prisma

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset

# Ver estado de migraciones
npx prisma migrate status

# Generar cliente
npx prisma generate

# Abrir Prisma Studio
npx prisma studio
```

### Desarrollo

```bash
# Linter
pnpm run lint

# Formatear código
pnpm run format

# Construir proyecto
pnpm run build
```

## 📝 Notas Importantes

1. **Soft Delete**: Todos los endpoints de eliminación implementan soft delete, marcando registros como `deleted: true` en lugar de eliminarlos físicamente.

2. **Validaciones**: Todos los DTOs incluyen validaciones usando decoradores de `class-validator`.

3. **Relaciones**: Existe una relación many-to-many entre User y Coffee para futuras funcionalidades.

4. **Precios**: Los precios se almacenan en centavos como números enteros para evitar problemas de precisión decimal.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Desarrollado con ❤️ y ☕ usando NestJS
</p>
