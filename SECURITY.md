# Security Policy

## 🔒 Security Notice

This repository contains **DEMO CREDENTIALS ONLY** for development and testing purposes.

### Demo Credentials (NOT REAL)

The following credentials are used for **local development and testing only**:

```
Admin Demo Account:
- Email: admin@aaramba.com
- Password: admin123

Customer Demo Account:
- Email: customer@aaramba.com  
- Password: customer123
```

⚠️ **IMPORTANT**: These are **NOT real credentials**. They are:
- Created by the database seed script
- Only work in local development
- Reset every time you run `npm run prisma:seed`
- **Never used in production**

## 🛡️ Production Security

### Environment Variables

**NEVER commit these files to Git:**
- `backend/.env` - Contains real database credentials
- `frontend/.env.local` - Contains API configuration
- Any file with real passwords, API keys, or secrets

**Safe to commit:**
- `backend/.env.example` - Template with placeholder values
- `frontend/.env.example` - Template with placeholder values

### .gitignore Protection

The `.gitignore` file is configured to prevent committing sensitive files:

```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🔐 Best Practices

### For Development

1. **Copy example files**:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

2. **Update with your local values**:
   - Database credentials
   - JWT secret (generate a strong random string)
   - API URLs

3. **Never commit .env files**:
   ```bash
   # Verify .env is ignored
   git status backend/.env
   # Should show: "nothing to commit"
   ```

### For Production

1. **Use environment variables** provided by your hosting platform:
   - Vercel: Environment Variables in dashboard
   - Railway: Environment Variables in settings
   - Render: Environment Variables in service settings

2. **Use strong, unique passwords**:
   - Database: Generate 32+ character random password
   - JWT Secret: Generate 64+ character random string
   - Admin accounts: Use password manager

3. **Enable security features**:
   - 2FA on all accounts
   - IP whitelisting for database
   - HTTPS only
   - Rate limiting
   - CORS restrictions

## 🚨 If You Accidentally Commit Secrets

1. **Change the exposed credentials immediately**
2. **Remove from Git history**:
   ```bash
   # Install BFG Repo-Cleaner
   brew install bfg
   
   # Remove the file from all history
   bfg --delete-files .env
   
   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # Force push (rewrites history)
   git push origin --force --all
   ```

3. **Update .gitignore** to prevent future commits
4. **Rotate all exposed credentials**

## 📧 Reporting Security Issues

If you discover a security vulnerability, please email:
- **DO NOT** create a public GitHub issue
- Contact the repository owner directly
- Provide details about the vulnerability

## ✅ Security Checklist

Before deploying to production:

- [ ] All `.env` files are in `.gitignore`
- [ ] No real credentials in code or documentation
- [ ] Strong, unique passwords for all services
- [ ] 2FA enabled on critical accounts
- [ ] Database has strong password and IP restrictions
- [ ] JWT secret is long and random (64+ characters)
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies are up to date
- [ ] Security headers are configured (Helmet.js)

## 🔍 Regular Security Audits

Run these commands regularly:

```bash
# Check for known vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check what's tracked in Git
git ls-files | grep env

# Verify .gitignore is working
git status
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

**Last Updated**: February 15, 2026  
**Version**: 1.0