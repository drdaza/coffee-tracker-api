# Coffee Tracker API - Docker Makefile
.PHONY: help

help: ## Mostrar esta ayuda
	@echo "Coffee Tracker API - Comandos disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# === DESARROLLO ===
dev: ## Levantar aplicación en modo desarrollo
	docker-compose up --build

dev-d: ## Levantar aplicación en modo desarrollo (background)
	docker-compose up --build -d

stop: ## Parar todos los servicios
	docker-compose down

logs: ## Ver logs en tiempo real
	docker-compose logs -f

logs-api: ## Ver logs solo de la API
	docker-compose logs -f api

logs-db: ## Ver logs solo de la base de datos
	docker-compose logs -f postgres

# === PRODUCCIÓN ===
prod: ## Levantar aplicación en modo producción
	docker-compose -f docker-compose.prod.yml up --build -d

prod-stop: ## Parar servicios de producción
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## Ver logs de producción
	docker-compose -f docker-compose.prod.yml logs -f

# === BASE DE DATOS ===
migrate: ## Ejecutar migraciones de Prisma
	docker-compose exec api npx prisma migrate dev

migrate-deploy: ## Ejecutar migraciones en producción
	docker-compose exec api npx prisma migrate deploy

generate: ## Generar cliente de Prisma
	docker-compose exec api npx prisma generate

studio: ## Abrir Prisma Studio
	docker-compose exec api npx prisma studio

seed: ## Ejecutar seed de la base de datos
	docker-compose exec api npx prisma db seed

db-reset: ## Resetear base de datos
	docker-compose exec api npx prisma migrate reset

# === UTILIDADES ===
shell: ## Acceder al shell del contenedor de la API
	docker-compose exec api sh

db-shell: ## Acceder al shell de PostgreSQL
	docker-compose exec postgres psql -U postgres -d coffee_tracker

clean: ## Limpiar contenedores, imágenes y volúmenes
	docker-compose down -v
	docker system prune -a -f

restart: ## Reiniciar servicios
	docker-compose restart

rebuild: ## Reconstruir y levantar
	docker-compose down
	docker-compose up --build

status: ## Ver estado de los contenedores
	docker-compose ps

# === SETUP INICIAL ===
setup: ## Configuración inicial del proyecto
	@echo "🚀 Configurando Coffee Tracker API..."
	@if [ ! -f .env ]; then \
		echo "📝 Creando archivo .env desde template..."; \
		cp env.template .env; \
		echo "✅ Archivo .env creado. ¡Edítalo con tus configuraciones!"; \
	else \
		echo "ℹ️  El archivo .env ya existe."; \
	fi
	@echo "🐳 Levantando servicios..."
	make dev-d
	@echo "⏳ Esperando que los servicios estén listos..."
	sleep 10
	@echo "🔄 Ejecutando migraciones..."
	make generate
	make migrate
	@echo "✅ ¡Setup completado! La API está disponible en http://localhost:3000"

# === TESTING ===
test: ## Ejecutar tests dentro del contenedor
	docker-compose exec api pnpm test

test-e2e: ## Ejecutar tests e2e
	docker-compose exec api pnpm test:e2e

test-cov: ## Ejecutar tests con cobertura
	docker-compose exec api pnpm test:cov 