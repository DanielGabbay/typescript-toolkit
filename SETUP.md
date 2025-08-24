# 🚀 Setup Instructions for NPM Publishing

## 📋 Pre-Requirements

1. **NPM Account**: Create account at [npmjs.com](https://npmjs.com)
2. **GitHub Repository**: Create repository `typescript-toolkit`
3. **Git configured**: `git config --global user.name "Your Name"`

## 🔑 Step 1: NPM Token Setup

### Create NPM Access Token:
1. Go to [npmjs.com](https://npmjs.com) → Profile → Access Tokens
2. Click **"Generate New Token"**
3. Select **"Automation"** (for CI/CD)
4. Copy the token (starts with `npm_...`)

### Add Token to GitHub:
1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `NPM_TOKEN`
4. Value: Your NPM token
5. Click **"Add secret"**

## ⚙️ Step 2: GitHub Actions Permissions

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - Select **"Read and write permissions"**
   - Check **"Allow GitHub Actions to create and approve pull requests"**
3. Click **"Save"**

## 📦 Step 3: Package Name Check

Verify the package name is available:
```bash
npm view typescript-toolkit
# Should return "npm ERR! 404 'typescript-toolkit' is not in the npm registry"
```

If taken, update `package.json` with a unique name:
```json
{
  "name": "@danielgabbay/typescript-toolkit"
}
```

## 🎬 Step 4: Initial Repository Setup

```bash
# Initialize git repo
cd /Users/danielgabbay/Software/private/typescript-toolkit
git init
git add .

# Use conventional commit for first release
git commit -m "feat: initial release of TypeScript Toolkit

Complete utility library with 87+ functions for modern TypeScript development.

Features:
- Tree-shakable ES modules
- Full TypeScript support  
- 97%+ test coverage
- Zero dependencies
- Modular design with 6 utility categories"

# Add GitHub remote
git remote add origin https://github.com/danielgabbay/typescript-toolkit.git

# Set main branch and push
git branch -M main
git push -u origin main
```

## 🎯 Step 5: Watch the Magic Happen

1. **GitHub Actions** will automatically run
2. **Tests** will execute (all 117 should pass)
3. **Semantic Release** will determine version (likely 1.0.0)
4. **NPM Package** will be published
5. **GitHub Release** will be created
6. **CHANGELOG.md** will be generated

Monitor progress at:
- GitHub Actions: `https://github.com/danielgabbay/typescript-toolkit/actions`
- NPM Package: `https://npmjs.com/package/typescript-toolkit`

## 🔄 Future Releases

Every push to `main` with conventional commits will trigger automatic release:

```bash
# Bug fix (patch: 1.0.0 → 1.0.1)
git commit -m "fix(array): handle empty arrays in median function"

# New feature (minor: 1.0.0 → 1.1.0)  
git commit -m "feat(string): add pluralize function"

# Breaking change (major: 1.0.0 → 2.0.0)
git commit -m "feat!: redesign API for better performance

BREAKING CHANGE: all functions now return Result<T, Error> type"

# Push to release
git push origin main
```

## 🚨 Troubleshooting

### GitHub Actions fails:
- Check secrets are set correctly
- Verify package name is unique
- Ensure all tests pass locally

### NPM publish fails:
- Verify NPM_TOKEN has publish permissions
- Check if package name conflicts
- Ensure you're a member of organization (for scoped packages)

### No release triggered:
- Commit must follow conventional format
- Must push to `main` branch
- Must have changes since last release

## ✅ Verify Success

After first push, check:

1. **GitHub Actions**: Green checkmark ✅
2. **NPM Package**: Available at npmjs.com
3. **GitHub Releases**: Version 1.0.0 created
4. **CHANGELOG.md**: Updated with release notes

## 📞 Next Steps

1. **Test installation**: `npm install typescript-toolkit`
2. **Update README**: Fix any GitHub usernames/links
3. **Add documentation**: Examples, API docs
4. **Promote**: Share on social media, dev communities

---

**🎉 Congratulations! Your library is now published and will auto-update with every push!**

For detailed commit guidelines, see [PUBLISHING.md](./PUBLISHING.md)