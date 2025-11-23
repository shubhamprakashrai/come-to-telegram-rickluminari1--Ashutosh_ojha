# Makefile Guide

This project includes a Makefile to simplify common development tasks. Instead of remembering long commands, you can use simple `make` commands.

---

## 📋 Quick Reference

### Most Used Commands

```bash
make dev              # Start development server
make deploy           # Build and deploy to Firebase
make git-push MSG='message'  # Commit and push changes
```

---

## 📚 All Available Commands

### 📦 Development Commands

| Command | Description | Equivalent |
|---------|-------------|------------|
| `make install` | Install all dependencies | `npm install` |
| `make dev` | Start development server | `npm run dev` |
| `make build` | Build for production | `npm run build` |
| `make preview` | Preview production build | `npm run preview` |
| `make lint` | Run ESLint | `npm run lint` |
| `make clean` | Remove dist folder | `rm -rf dist` |
| `make clean-all` | Remove dist and node_modules | Full cleanup |

### 🚀 Deployment Commands

| Command | Description |
|---------|-------------|
| `make deploy` | Build and deploy to Firebase Hosting |
| `make deploy-preview` | Deploy to Firebase preview channel |
| `make firebase-login` | Login to Firebase CLI |
| `make firebase-info` | Show Firebase project information |

### 📝 Git Commands

| Command | Description | Example |
|---------|-------------|---------|
| `make git-push MSG='message'` | Add, commit, and push | `make git-push MSG='Update homepage'` |
| `make git-sync` | Pull latest changes | `make git-sync` |

### 🔧 Maintenance Commands

| Command | Description |
|---------|-------------|
| `make update-deps` | Update npm dependencies |
| `make update-browser` | Update browserslist database |
| `make setup` | First-time project setup |
| `make status` | Show project status (git, firebase, versions) |
| `make pre-deploy` | Run lint and build checks |

### ⚡ Special Commands

| Command | Description |
|---------|-------------|
| `make quick-deploy MSG='message'` | Build, commit, push, and deploy in one command |
| `make help` | Show all available commands |

---

## 💡 Usage Examples

### Starting Development

```bash
# First time setup
make setup

# Start dev server
make dev
```

### Making Changes and Deploying

```bash
# After making changes
make git-push MSG='Add new feature'

# Deploy to Firebase
make deploy
```

### Quick Deploy (All in One)

```bash
# Build, commit, push, and deploy
make quick-deploy MSG='Release v1.2.0'
```

### Cleaning Up

```bash
# Remove build artifacts
make clean

# Full cleanup (including node_modules)
make clean-all
make install
```

### Checking Status

```bash
# See git status, firebase project, and versions
make status
```

---

## 🎯 Common Workflows

### Daily Development Workflow

```bash
# 1. Start your day
make git-sync          # Get latest changes
make dev               # Start development

# 2. After making changes
make lint              # Check for errors
make build             # Test production build

# 3. Commit and push
make git-push MSG='Implement user profile page'
```

### Deployment Workflow

```bash
# Option 1: Step by step
make pre-deploy        # Run checks
make deploy            # Deploy to Firebase

# Option 2: Quick deploy
make quick-deploy MSG='Deploy new features'
```

### Troubleshooting Workflow

```bash
# If something breaks
make clean-all         # Full cleanup
make install           # Reinstall dependencies
make build             # Test build
```

---

## ⚙️ How It Works

### The `git-push` Command

When you run:
```bash
make git-push MSG='Update styles'
```

It executes:
1. `git add .` - Stages all changes
2. `git commit -m "Update styles"` - Commits with your message
3. `git push origin main` - Pushes to GitHub

### The `deploy` Command

When you run:
```bash
make deploy
```

It executes:
1. `npm run build` - Builds the project
2. `firebase deploy --only hosting` - Deploys to Firebase
3. Shows the live URL

### The `quick-deploy` Command

When you run:
```bash
make quick-deploy MSG='Release v1.0'
```

It executes:
1. `make build` - Builds the project
2. `make git-push MSG='Release v1.0'` - Commits and pushes
3. `make deploy` - Deploys to Firebase

---

## 🔍 Understanding Makefile Syntax

### Basic Structure

```makefile
command-name:
    @echo "Message"
    actual-command
```

- `command-name:` - The name you use with `make`
- `@echo` - Prints a message (@ hides the command itself)
- `actual-command` - The command that gets executed

### Variables

```makefile
make git-push MSG='your message'
```

- `MSG='your message'` - Passes a variable to the Makefile
- Used inside with `$(MSG)`

### Dependencies

```makefile
deploy: build
```

- Means: Run `build` before `deploy`
- Ensures the project is built before deploying

---

## 🚨 Important Notes

> [!IMPORTANT]
> - Always use quotes for commit messages: `MSG='message'`
> - Some commands require variables (like `git-push` needs `MSG`)
> - The Makefile uses tabs, not spaces (don't edit manually unless you know what you're doing)

> [!TIP]
> - Run `make help` anytime to see all commands
> - Run `make status` to check your project state
> - Use `make quick-deploy` for fast iterations

> [!WARNING]
> - `make clean-all` removes node_modules (you'll need to run `make install` after)
> - `make deploy` deploys to production immediately
> - Always run `make lint` and `make build` before deploying

---

## 🆚 Makefile vs NPM Scripts

### When to Use Makefile

✅ **Use `make` for:**
- Complex workflows (build + deploy + git)
- Commands that combine multiple steps
- System-level operations (cleaning, setup)
- Git operations

### When to Use NPM Scripts

✅ **Use `npm run` for:**
- Simple, single-purpose commands
- When you prefer npm ecosystem
- CI/CD pipelines (more portable)

### Comparison

| Task | Makefile | NPM Script |
|------|----------|------------|
| Start dev | `make dev` | `npm run dev` |
| Deploy | `make deploy` | `npm run deploy` |
| Commit & Push | `make git-push MSG='...'` | Manual git commands |
| Full workflow | `make quick-deploy MSG='...'` | Multiple commands |

---

## 🎓 Learning More

### Makefile Resources

- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Makefile Tutorial](https://makefiletutorial.com/)

### Project-Specific

- See [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) for Firebase details
- See [GITHUB_SSH_SETUP.md](./GITHUB_SSH_SETUP.md) for Git setup

---

## 🐛 Troubleshooting

### "make: command not found"

**Solution:** Install make (usually pre-installed on Mac/Linux)
```bash
# macOS
xcode-select --install

# Linux
sudo apt-get install build-essential
```

### "No rule to make target"

**Solution:** Check spelling of the command
```bash
make help  # See all available commands
```

### "Missing separator" error

**Solution:** The Makefile uses tabs, not spaces. Don't edit manually.

### Git push fails

**Solution:** Check your Git configuration
```bash
make status  # Check current state
git config --local --list  # Verify config
```

---

**Pro Tip:** Add `make help` to your terminal startup message to always remember available commands! 🚀
