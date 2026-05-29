.PHONY: dev build stop clean logs logs-api db-migrate db-reset db-seed db-studio test lint install setup help

# Default target
.DEFAULT_GOAL := help

## Start development environment
dev:
	docker-compose up -d
	@echo "✅ Ambiente iniciado!"
	@echo "   → Web:  http://localhost:3000"
	@echo "   → API:  http://localhost:3001/api"
	@echo "   → Docs: http://localhost:3001/api/docs"

## Build all Docker images
build:
	docker-compose build

## Stop all containers
stop:
	docker-compose down

## Remove containers, volumes and images
clean:
	docker-compose down -v --remove-orphans
	@echo "✅ Ambiente limpo!"

## Show logs from all containers
logs:
	docker-compose logs -f

## Show API logs only
logs-api:
	docker-compose logs -f api

## Run Prisma migrations
db-migrate:
	docker-compose exec api pnpm db:migrate

## Reset database and reseed
db-reset:
	docker-compose exec api npx prisma migrate reset --force

## Run seed only
db-seed:
	docker-compose exec api pnpm db:seed

## Open Prisma Studio
db-studio:
	docker-compose exec api pnpm db:studio

## Run all tests
test:
	pnpm test

## Run lint
lint:
	pnpm lint

## Install dependencies
install:
	pnpm install

## Setup: install + start infra + migrate + seed
setup: install
	docker-compose up -d postgres redis
	@echo "⏳ Aguardando PostgreSQL..."
	@sleep 5
	cd apps/api && pnpm db:migrate
	cd apps/api && pnpm db:seed
	@echo "✅ Setup completo!"
	@echo "   → Rode 'make dev' para iniciar todos os serviços"

## Show this help
help:
	@grep -E '^##' $(MAKEFILE_LIST) | sed 's/## //'
