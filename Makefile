# Makefile for Ashutosh Ojha Project
# Project: React + TypeScript + Vite + Firebase

.PHONY: help install dev build preview lint clean deploy deploy-preview git-push git-sync firebase-login firebase-info update-deps

# Default target - show help
help:
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║          Ashutosh Ojha Project - Available Commands           ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 Development:"
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Start development server"
	@echo "  make build          - Build for production"
	@echo "  make preview        - Preview production build locally"
	@echo "  make lint           - Run ESLint"
	@echo "  make clean          - Clean build artifacts"
	@echo ""
	@echo "🚀 Deployment:"
	@echo "  make deploy         - Build and deploy to Firebase"
	@echo "  make deploy-preview - Deploy to Firebase preview channel"
	@echo "  make firebase-login - Login to Firebase"
	@echo "  make firebase-info  - Show Firebase project info"
	@echo ""
	@echo "📝 Git Operations:"
	@echo "  make git-push MSG='message' - Add, commit, and push changes"
	@echo "  make git-sync       - Pull latest changes from remote"
	@echo ""
	@echo "🔧 Maintenance:"
	@echo "  make update-deps    - Update dependencies"
	@echo "  make update-browser - Update browserslist database"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed successfully!"

# Start development server
dev:
	@echo "🚀 Starting development server..."
	npm run dev

# Build for production
build:
	@echo "🔨 Building for production..."
	npm run build
	@echo "✅ Build completed! Output in dist/"

# Preview production build
preview:
	@echo "👀 Previewing production build..."
	npm run preview

# Run linter
lint:
	@echo "🔍 Running ESLint..."
	npm run lint

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist
	rm -rf node_modules/.vite
	@echo "✅ Clean completed!"

# Full clean (including node_modules)
clean-all: clean
	@echo "🧹 Removing node_modules..."
	rm -rf node_modules
	rm -rf package-lock.json
	@echo "✅ Full clean completed!"

# Deploy to Firebase
deploy: build
	@echo "🚀 Deploying to Firebase..."
	firebase deploy --only hosting
	@echo "✅ Deployment completed!"
	@echo "🌐 Live at: https://ashutosh-ojha-18afc.web.app"

# Deploy to Firebase preview channel
deploy-preview: build
	@echo "🚀 Deploying to Firebase preview channel..."
	firebase hosting:channel:deploy preview
	@echo "✅ Preview deployment completed!"

# Firebase login
firebase-login:
	@echo "🔐 Logging in to Firebase..."
	firebase login

# Show Firebase project info
firebase-info:
	@echo "ℹ️  Firebase Project Information:"
	@echo ""
	firebase projects:list
	@echo ""
	@echo "Current project:"
	firebase use

# Git operations - add, commit, and push
git-push:
ifndef MSG
	@echo "❌ Error: Please provide a commit message"
	@echo "Usage: make git-push MSG='your commit message'"
	@exit 1
endif
	@echo "📝 Adding changes..."
	git add .
	@echo "💾 Committing changes..."
	git commit -m "$(MSG)"
	@echo "⬆️  Pushing to remote..."
	git push origin main
	@echo "✅ Changes pushed successfully!"

# Pull latest changes
git-sync:
	@echo "⬇️  Pulling latest changes..."
	git pull origin main
	@echo "✅ Synced with remote!"

# Update dependencies
update-deps:
	@echo "🔄 Updating dependencies..."
	npm update
	@echo "✅ Dependencies updated!"

# Update browserslist database
update-browser:
	@echo "🔄 Updating browserslist database..."
	npx update-browserslist-db@latest
	@echo "✅ Browserslist updated!"

# Quick deploy (build + deploy + git push)
quick-deploy:
ifndef MSG
	@echo "❌ Error: Please provide a commit message"
	@echo "Usage: make quick-deploy MSG='your commit message'"
	@exit 1
endif
	@echo "🚀 Starting quick deploy..."
	@$(MAKE) build
	@$(MAKE) git-push MSG="$(MSG)"
	@$(MAKE) deploy
	@echo "✅ Quick deploy completed!"

# Development setup (first time)
setup: install
	@echo "🔧 Running initial setup..."
	@echo "✅ Setup completed!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Run 'make dev' to start development server"
	@echo "  2. Run 'make firebase-login' if not logged in to Firebase"
	@echo "  3. Run 'make deploy' to deploy to production"

# Check project status
status:
	@echo "📊 Project Status:"
	@echo ""
	@echo "Git Status:"
	@git status --short
	@echo ""
	@echo "Firebase Project:"
	@firebase use
	@echo ""
	@echo "Node Version:"
	@node --version
	@echo ""
	@echo "NPM Version:"
	@npm --version

# Run all checks before deployment
pre-deploy: lint build
	@echo "✅ All pre-deployment checks passed!"
	@echo "Ready to deploy with: make deploy"
