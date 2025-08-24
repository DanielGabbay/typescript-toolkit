# 🚀 Publishing Guide

This project uses **semantic versioning** with **automated publishing** to NPM on every push to `main`.

## 🔄 Automatic Publishing Process

### How it works:
1. **Push to `main`** triggers GitHub Actions
2. **Tests run** automatically (lint, typecheck, test, build)  
3. **Semantic Release** analyzes commits since last release
4. **Version bump** based on commit types (patch/minor/major)
5. **Changelog** updated automatically
6. **NPM publish** happens automatically
7. **GitHub release** created with release notes

### Commit Message Format (Conventional Commits):

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types that trigger releases:

- `fix:` → **Patch release** (1.0.0 → 1.0.1)
- `feat:` → **Minor release** (1.0.0 → 1.1.0)
- `feat!:` or `BREAKING CHANGE:` → **Major release** (1.0.0 → 2.0.0)

### Examples:

```bash
# Patch release (bug fix)
git commit -m "fix(array): handle empty arrays in median function"

# Minor release (new feature)  
git commit -m "feat(string): add new pluralize function"

# Major release (breaking change)
git commit -m "feat!: change API signature for deepClone function

BREAKING CHANGE: deepClone now requires options parameter"
```

## 🛠️ Setup Instructions

### 1. NPM Token Setup
1. Go to [npmjs.com](https://npmjs.com) → Account → Access Tokens
2. Generate **Automation** token
3. Copy token value
4. Go to GitHub repository → Settings → Secrets and variables → Actions  
5. Add secret: `NPM_TOKEN` with your token value

### 2. Repository Settings
1. Go to Settings → Actions → General
2. Set "Workflow permissions" to **Read and write permissions**
3. Enable "Allow GitHub Actions to create and approve pull requests"

### 3. First Release
```bash
# Initialize git repo
git init
git add .
git commit -m "feat: initial release of TypeScript Toolkit

Complete utility library with 87+ functions for modern TypeScript development"

# Add remote and push
git remote add origin https://github.com/danielgabbay/typescript-toolkit.git
git branch -M main
git push -u origin main
```

## 📋 Manual Publishing (Backup)

If you need to publish manually:

```bash
# Make sure you're logged in to npm
npm login

# Run all checks
npm run lint
npm run typecheck  
npm run test
npm run build

# Publish
npm publish
```

## 🔍 Monitoring Releases

- **GitHub Actions**: Check workflow status in Actions tab
- **NPM Package**: Monitor at https://npmjs.com/package/typescript-toolkit
- **Changelog**: Auto-generated in `CHANGELOG.md`
- **GitHub Releases**: Auto-created with release notes

## 🚫 What NOT to do

- ❌ Don't manually edit `package.json` version
- ❌ Don't use `npm version` commands
- ❌ Don't create releases manually on GitHub
- ❌ Don't publish manually unless emergency

## 📈 Version Strategy

- **Patch (1.0.x)**: Bug fixes, documentation, internal refactoring
- **Minor (1.x.0)**: New functions, new features, non-breaking improvements  
- **Major (x.0.0)**: Breaking API changes, major architecture changes

## 🐛 Troubleshooting

### Build fails on GitHub Actions:
1. Check if all tests pass locally
2. Verify package.json scripts work
3. Check if dependencies are properly listed

### NPM publish fails:
1. Verify NPM_TOKEN secret is set correctly
2. Check if package name is available on NPM
3. Ensure you have publish permissions

### Semantic Release doesn't trigger:
1. Verify commit message follows conventional format
2. Check if there are any commits since last release
3. Ensure branch is `main` and push event (not PR)

## 📞 Support

If you encounter issues with publishing:
1. Check GitHub Actions logs
2. Review semantic-release documentation
3. Create an issue in the repository

---

## 🎯 Quick Reference

```bash
# Bug fix release
git commit -m "fix(array): correct edge case in chunk function"

# New feature release  
git commit -m "feat(performance): add new memory profiling utilities"

# Breaking change release
git commit -m "feat!: redesign API for better TypeScript inference

BREAKING CHANGE: all utility functions now return Result<T, Error> type"

# Push to trigger release
git push origin main
```

**Remember**: Every push to `main` with conventional commits will trigger an automatic release! 🚀