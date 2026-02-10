.PHONY: help up down build logs ps backend-shell frontend-shell db-shell test clean

help:
	@echo "Available commands:"
	@echo "  make up             - Start all services (detached)"
	@echo "  make down           - Stop and remove containers"
	@echo "  make build          - Build or rebuild services"
	@echo "  make logs           - Follow logs from all services"
	@echo "  make ps             - List running containers"
	@echo "  make backend-shell  - Open a shell in the backend container"
	@echo "  make frontend-shell - Open a shell in the frontend container"
	@echo "  make db-shell       - Open a shell in the database container (psql)"
	@echo "  make test           - Run backend tests inside Docker"
	@echo "  make clean          - Remove unused Docker images and volumes"

up:
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
	fi
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

ps:
	docker compose ps

backend-shell:
	docker compose exec backend bash

frontend-shell:
	docker compose exec frontend sh

db-shell:
	docker compose exec database psql -U user_admin -d user_db

test:
	docker compose exec backend python -m pytest -v

clean:
	docker system prune -f
	docker volume prune -f
