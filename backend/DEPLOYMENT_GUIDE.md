# Jymo Backend - GitHub Actions CI/CD Setup Guide

This guide will help you set up automatic deployment for your Jymo backend on Oracle Cloud Free Tier.

## 📁 Files Created

```
Jymo/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Continuous Integration
│       └── deploy.yml      # Continuous Deployment
├── backend/
│   ├── deploy.sh           # Manual deployment script
│   └── DEPLOYMENT_GUIDE.md # This file
└── ...
```

## 🚀 Quick Setup

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name      | Description                     | Example                              |
| ---------------- | ------------------------------- | ------------------------------------ |
| `ORACLE_HOST`    | Your Oracle VM public IP        | `123.45.67.89`                       |
| `ORACLE_USER`    | SSH username (usually `ubuntu`) | `ubuntu`                             |
| `ORACLE_SSH_KEY` | Private SSH key content         | `-----BEGIN RSA PRIVATE KEY-----...` |

### Step 2: Generate SSH Key (if not already have one)

On your local machine, generate an SSH key:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_rsa

# Display public key (add this to Oracle VM)
cat ~/.ssh/id_rsa.pub
```

### Step 3: Add SSH Key to Oracle VM

Connect to your Oracle VM:

```bash
ssh ubuntu@YOUR_ORACLE_HOST
```

On the VM, add your public key:

```bash
# Add public key to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Step 4: Test SSH Connection

Test from your local machine:

```bash
ssh -i ~/.ssh/id_rsa ubuntu@YOUR_ORACLE_HOST
```

### Step 5: Initial Manual Deployment

Before GitHub Actions can work, do a manual deployment:

```bash
# SSH into your VM
ssh ubuntu@YOUR_ORACLE_HOST

# Navigate to JYMO directory
cd /home/ubuntu/JYMO

# Clone or pull the repository
git clone https://github.com/YOUR_USERNAME/Jymo.git .
# OR if already exists: git pull origin main

# Install dependencies
npm ci --production

# Start with PM2
pm2 start index.js --name jymo
pm2 save
pm2 startup
```

### Step 6: Push to GitHub

Push your changes to GitHub:

```bash
git add .
git commit -m "Add GitHub Actions CI/CD for backend"
git push origin main
```

## 🎯 What Happens Next

1. **CI Pipeline runs first:**
   - Checks out code
   - Installs dependencies
   - Validates Node.js setup
   - Checks syntax

2. **If CI passes, CD Pipeline runs:**
   - Connects to your Oracle VM via SSH
   - Pulls latest code from GitHub
   - Installs dependencies
   - Restarts application with PM2
   - Verifies deployment

## 🔧 Manual Deployment

If you ever need to deploy manually, SSH into your VM and run:

```bash
cd /home/ubuntu/JYMO
chmod +x deploy.sh
./deploy.sh
```

Or use PM2 directly:

```bash
cd /home/ubuntu/JYMO
git pull origin main
npm ci --production
pm2 restart jymo
pm2 logs jymo
```

## 📊 PM2 Commands

Useful PM2 commands for managing your backend:

```bash
# Check status
pm2 status

# View logs
pm2 logs jymo

# View logs with timestamps
pm2 logs jymo --timestamp

# Restart application
pm2 restart jymo

# Stop application
pm2 stop jymo

# Monitor resources
pm2 monit

# Save PM2 process list (auto-restart on reboot)
pm2 save

# Setup PM2 startup script
pm2 startup
```

## 🔍 Troubleshooting

### Deployment fails with "Connection refused"

1. Check if Oracle VM is running
2. Verify firewall rules allow SSH (port 22)
3. Check security list in Oracle Cloud console

### PM2 shows error status

1. Check logs: `pm2 logs jymo`
2. Verify environment variables are set on VM
3. Check MongoDB connection

### GitHub Actions SSH connection fails

1. Verify SSH key format (must be private key, not public)
2. Ensure public key is added to VM's `~/.ssh/authorized_keys`
3. Check if IP is allowed in Oracle Cloud security rules

### Application not responding

1. Check if port 3003 is open in Oracle security rules
2. Verify app is running: `pm2 status`
3. Check application logs: `pm2 logs jymo`

## 🔐 Security Recommendations

1. **Use SSH keys, not passwords**
2. **Restrict SSH access to your IP** (if possible)
3. **Keep secrets in GitHub Secrets**, not in code
4. **Regularly update dependencies**: `npm update`
5. **Monitor logs**: Set up log rotation for PM2

## 📈 Monitoring

### Set up PM2 Log Rotation

```bash
# Install log rotation module
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 30
```

## 📝 Environment Variables on Oracle VM

Your `.env` file on Oracle VM should have:

```env
MONGO_URI=mongodb+srv://...
PORT=3003
JWT_SECRET=your-super-secret
NODE_ENV=production
FRONTEND_URI=https://your-frontend-domain.com
FIREBASE_PROJECT_ID=your-firebase-project-id
# Add other secrets as needed
```

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Oracle VM provisioned and running
- [ ] SSH key generated and added to VM
- [ ] GitHub secrets configured
- [ ] MongoDB connection working
- [ ] PM2 installed on VM (`npm install -g pm2`)
- [ ] PM2 startup script configured (`pm2 startup`)
- [ ] First manual deployment successful
- [ ] Health check endpoint working
- [ ] Firewall/security rules configured

## 🎉 You're All Set!

Every time you push to the `main` branch:

1. CI pipeline validates your code
2. If tests pass, deployment automatically starts
3. Your backend is live in a few minutes!

---

**Need Help?** Check the troubleshooting section above or review GitHub Actions logs for detailed error messages.
