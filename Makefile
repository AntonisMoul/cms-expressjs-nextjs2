# CMS Development Makefile

.PHONY: help install setup dev dev-api dev-web build clean docker-up docker-down db-reset

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	pnpm install

setup: ## Setup the project (install deps, setup database, seed data)
	pnpm install:all
	pnpm db:generate
	pnpm db:push
	pnpm db:seed
	@echo "🎉 Setup complete! Run 'make dev' to start development servers"

dev: ## Start all development servers
	pnpm dev:all

dev-api: ## Start API development server only
	pnpm dev:api

dev-web: ## Start web development server only
	pnpm dev:web

build: ## Build all packages and apps
	pnpm build

clean: ## Clean all build artifacts
	pnpm clean

docker-up: ## Start all services with Docker
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-build: ## Build Docker images
	docker-compose build

db-generate: ## Generate Prisma client
	pnpm db:generate

db-push: ## Push database schema
	pnpm db:push

db-migrate: ## Run database migrations
	pnpm db:migrate

db-studio: ## Open Prisma Studio
	pnpm db:studio

db-seed: ## Seed database with initial data
	pnpm db:seed

db-reset: ## Reset database (WARNING: This will delete all data)
	pnpm db:push --force-reset
	pnpm db:seed

test: ## Run all tests
	pnpm test

lint: ## Run linting
	pnpm lint

format: ## Format code with Prettier
	pnpm prettier --write .

# Development helpers
logs-api: ## Show API container logs
	docker-compose logs -f api

logs-web: ## Show web container logs
	docker-compose logs -f web

logs-db: ## Show database container logs
	docker-compose logs -f db

shell-api: ## Open shell in API container
	docker-compose exec api sh

shell-web: ## Open shell in web container
	docker-compose exec web sh

shell-db: ## Open shell in database container
	docker-compose exec db mysql -u cms -p cms_db

