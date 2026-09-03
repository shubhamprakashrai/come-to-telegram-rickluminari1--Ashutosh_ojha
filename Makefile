# ==============================================================================
# ⚖️ Ashutosh Law Chambers - Master Automation Makefile
# ==============================================================================

VPS_IP = 222.167.207.35
SSH_KEY = ~/.ssh/toonshala_vps
SSH_TARGET = root@$(VPS_IP)
VPS_API_DIR = /opt/ashutosh-law-api-new/backend-api

.PHONY: help all \
        web-dev web-build web-deploy web-clean \
        mobile-run mobile-build-apk mobile-build-bundle mobile-icons mobile-clean \
        api-dev api-deploy api-logs api-restart api-status \
        deploy-all git-sync

# ------------------------------------------------------------------------------
# 📖 Help & Command List
# ------------------------------------------------------------------------------
help:
	@echo "========================================================================"
	@echo "⚖️  ASHUTOSH LAW - MASTER DEVELOPMENT & DEPLOYMENT TOOLKIT"
	@echo "========================================================================"
	@echo ""
	@echo "📱 MOBILE APP (Flutter):"
	@echo "  make mobile-run           - Run mobile app on connected device/emulator"
	@echo "  make mobile-build-apk     - Build production APK with Obfuscation & Symbol Stripping"
	@echo "  make mobile-build-bundle  - Build production AAB (App Bundle) with Obfuscation"
	@echo "  make mobile-icons         - Re-generate luxury golden app launcher icons"
	@echo "  make mobile-clean         - Clean Flutter build artifacts"
	@echo ""
	@echo "🌐 WEB APPLICATION (Next.js & Firebase):"
	@echo "  make web-dev              - Start local Next.js development server"
	@echo "  make web-build            - Create optimized static production build"
	@echo "  make web-deploy           - Build & deploy live to Firebase Hosting (ashutoshojha.com)"
	@echo "  make web-clean            - Remove .next and out build caches"
	@echo ""
	@echo "🛡️  BACKEND API & DATABASE (Rust Axum & VPS):"
	@echo "  make api-dev              - Run local Rust backend server"
	@echo "  make api-deploy           - Rsync to VPS, build Docker container & restart"
	@echo "  make api-logs             - Stream live backend container logs on VPS"
	@echo "  make api-restart          - Restart backend Docker container on VPS"
	@echo "  make api-status           - Check VPS container health & PostgreSQL status"
	@echo ""
	@echo "🚀 COMPLETE SYSTEM:"
	@echo "  make deploy-all           - Deploy both Web Frontend and VPS Backend API"
	@echo "  make git-sync MSG=\"...\"    - Commit and push all changes to GitHub"
	@echo "========================================================================"

# ------------------------------------------------------------------------------
# 📱 Mobile App Commands
# ------------------------------------------------------------------------------
mobile-run:
	@echo "🚀 Launching Admin Mobile App..."
	cd admin_mobile_app && flutter run

mobile-icons:
	@echo "🎨 Generating luxury app launcher icons..."
	cd admin_mobile_app && flutter pub get && dart run flutter_launcher_icons

mobile-build-apk: mobile-icons
	@echo "📦 Building Production Release APKs (Split per ABI with Obfuscation)..."
	mkdir -p admin_mobile_app/build/app/outputs/symbols
	cd admin_mobile_app && flutter build apk --release \
		--split-per-abi \
		--obfuscate \
		--split-debug-info=build/app/outputs/symbols \
		--tree-shake-icons
	@echo "✅ Optimized APKs generated in admin_mobile_app/build/app/outputs/flutter-apk/"


mobile-build-bundle: mobile-icons
	@echo "📦 Building Production Release AppBundle with Obfuscation..."
	mkdir -p admin_mobile_app/build/app/outputs/symbols
	cd admin_mobile_app && flutter build appbundle --release \
		--obfuscate \
		--split-debug-info=build/app/outputs/symbols \
		--tree-shake-icons
	@echo "✅ AAB generated: admin_mobile_app/build/app/outputs/bundle/release/app-release.aab"

mobile-clean:
	@echo "🧹 Cleaning Flutter build cache..."
	cd admin_mobile_app && flutter clean && flutter pub get

# ------------------------------------------------------------------------------
# 🌐 Web App Commands
# ------------------------------------------------------------------------------
web-dev:
	@echo "💻 Starting Next.js development server..."
	npm run dev

web-build:
	@echo "🏗️ Building Next.js production bundle..."
	npm run build

web-deploy: web-build
	@echo "🚀 Deploying web portal to Firebase Hosting..."
	firebase deploy --only hosting

web-clean:
	@echo "🧹 Cleaning Next.js build cache..."
	rm -rf .next out

# ------------------------------------------------------------------------------
# 🛡️ Backend API Commands
# ------------------------------------------------------------------------------
api-dev:
	@echo "🦀 Running Rust backend locally..."
	cd backend-api && cargo run

api-deploy:
	@echo "🚀 Syncing backend files to VPS ($(VPS_IP))..."
	rsync -avz -e "ssh -i $(SSH_KEY)" --exclude 'target' --exclude '.git' backend-api/ $(SSH_TARGET):$(VPS_API_DIR)/
	@echo "🔨 Building Docker image & starting container on VPS..."
	ssh -i $(SSH_KEY) $(SSH_TARGET) "cd $(VPS_API_DIR) && docker build -t ashutosh-law-api-backend:latest --network=host . && docker compose up -d --force-recreate api"
	@echo "✅ Backend deployed and restarted on VPS!"

api-logs:
	@echo "📜 Streaming VPS Backend Logs..."
	ssh -i $(SSH_KEY) $(SSH_TARGET) "docker logs backend-api-api-1 -f --tail 100"

api-restart:
	@echo "🔄 Restarting Backend on VPS..."
	ssh -i $(SSH_KEY) $(SSH_TARGET) "cd $(VPS_API_DIR) && docker compose restart api"

api-status:
	@echo "🩺 Checking VPS Backend Health..."
	ssh -i $(SSH_KEY) $(SSH_TARGET) "docker ps --filter name=backend-api"
	@echo "🌐 Testing API endpoint:"
	curl -s https://ashutosh-api.toonshala.com/health || echo "API unreachable"

# ------------------------------------------------------------------------------
# 🚀 Master Deploy & Git
# ------------------------------------------------------------------------------
deploy-all: api-deploy web-deploy
	@echo "🎉 Complete platform (Backend + Frontend) successfully deployed!"

git-sync:
	@echo "📦 Syncing repository..."
	git add .
	git commit -m "$${MSG:-chore: update codebase and sync deployment changes}" || true
	git push
