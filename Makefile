# NextH - Tableau de bord bien-être
# Makefile pour faciliter les opérations Docker

.PHONY: help build up down logs restart clean dev prod check

# Couleurs pour les messages
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

help: ## Afficher l'aide
	@echo "$(BLUE)NextH - Tableau de bord bien-être$(NC)"
	@echo "$(BLUE)=================================$(NC)"
	@echo ""
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

check: ## Vérifier la configuration Docker
	@if command -v powershell.exe > /dev/null 2>&1; then \
		powershell.exe -ExecutionPolicy Bypass -File check-setup.ps1; \
	else \
		echo "$(RED)PowerShell n'est pas disponible$(NC)"; \
	fi

build: ## Construire les images Docker
	@echo "$(BLUE)Construction des images Docker...$(NC)"
	docker-compose build

up: ## Lancer les conteneurs en arrière-plan
	@echo "$(BLUE)Lancement des conteneurs...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Application accessible sur:$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"

down: ## Arrêter les conteneurs
	@echo "$(YELLOW)Arrêt des conteneurs...$(NC)"
	docker-compose down

logs: ## Afficher les logs des conteneurs
	docker-compose logs -f

restart: ## Redémarrer les conteneurs
	@echo "$(BLUE)Redémarrage des conteneurs...$(NC)"
	docker-compose restart

clean: ## Nettoyer les conteneurs, volumes et images
	@echo "$(RED)Nettoyage complet...$(NC)"
	docker-compose down -v --remove-orphans
	docker system prune -f

dev: ## Lancer en mode développement (avec hot-reload)
	@echo "$(BLUE)Lancement en mode développement...$(NC)"
	docker-compose -f docker-compose.dev.yml up

prod: ## Lancer en mode production
	@echo "$(BLUE)Lancement en mode production...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Application accessible sur:$(NC)"
	@echo "  Frontend: http://localhost:3003"
	@echo "  Backend:  http://localhost:3002"

install: ## Installer les dépendances npm
	@echo "$(BLUE)Installation des dépendances...$(NC)"
	cd frontend && npm install
	cd backend && npm install

setup: ## Configuration initiale complète
	@echo "$(BLUE)Configuration initiale...$(NC)"
	@if [ ! -f .env ]; then \
		cp docker.env.example .env; \
		echo "$(YELLOW)Veuillez éditer le fichier .env avec vos vraies valeurs$(NC)"; \
	fi
	@echo "$(GREEN)Configuration terminée. Lancez 'make dev' pour démarrer.$(NC)"

status: ## Afficher le statut des conteneurs
	docker-compose ps

check: ## Vérifier l'état des services et endpoints
	@if command -v powershell.exe > /dev/null 2>&1; then \
		powershell.exe -ExecutionPolicy Bypass -File check-docker.ps1; \
	else \
		echo "$(YELLOW)PowerShell non disponible, vérification manuelle:$(NC)"; \
		echo "Conteneurs:"; \
		docker-compose ps; \
		echo ""; \
		echo "Testez manuellement:"; \
		echo "  Backend: curl http://localhost:3002/health"; \
		echo "  Frontend: curl http://localhost:3003"; \
	fi
