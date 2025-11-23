# GitHub SSH Setup Guide

## Current Configuration

✅ **Local Git Configuration (This Project Only)**
- **Email**: ashishraimse@gmail.com
- **Name**: Ashish Raimse
- **Remote URL**: git@github.com:shubhamprakashrai/Ashutosh_ojha.git (SSH)

## Your SSH Public Key

Copy this key and add it to your GitHub account:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL/p3b4/pdkkRxzmRypN20RDti3TTPLMVZb5qbnyiTbs ashishraimse@gmail.com
```

## Steps to Add SSH Key to GitHub

### Option 1: Quick Command (Copies to Clipboard)

Run this command to copy your SSH key to clipboard:

```bash
cat ~/.ssh/id_ed25519.pub | pbcopy
```

Then:
1. Go to: https://github.com/settings/ssh/new
2. **Title**: Enter a name like "Mac - Ashutosh Ojha Project"
3. **Key**: Paste the key (Cmd+V)
4. Click **"Add SSH key"**

### Option 2: Manual Steps

1. **Login to GitHub** with `ashishraimse@gmail.com`
2. Go to **Settings** → **SSH and GPG keys**
   - Direct link: https://github.com/settings/keys
3. Click **"New SSH key"**
4. **Title**: Enter a descriptive name (e.g., "Mac - Ashutosh Ojha Project")
5. **Key**: Paste the SSH key shown above
6. Click **"Add SSH key"**
7. Confirm with your GitHub password if prompted

## Verify SSH Connection

After adding the key to GitHub, run:

```bash
ssh -T git@github.com
```

You should see:
```
Hi ashishraimse! You've successfully authenticated, but GitHub does not provide shell access.
```

## Push Your Changes

Once SSH is configured, you can push with:

```bash
git push origin main
```

Or use your alias:

```bash
git acp "Your commit message"
```

## Important Notes

> [!IMPORTANT]
> - This SSH key is already associated with `ashishraimse@gmail.com`
> - The Git configuration is set **locally** for this project only
> - Other projects will continue to use your global Git configuration
> - You need to have **write access** to the `shubhamprakashrai/Ashutosh_ojha` repository

## Troubleshooting

### Still Getting Permission Denied?

1. **Check if key is added to GitHub**:
   - Visit: https://github.com/settings/keys
   - Verify your key is listed

2. **Test SSH connection**:
   ```bash
   ssh -T git@github.com
   ```

3. **Check repository access**:
   - Make sure `ashishraimse@gmail.com` account has write access to the repository
   - The repository owner (`shubhamprakashrai`) needs to add you as a collaborator

### Need to Add Collaborator Access?

If you don't have access to the repository:

1. Repository owner goes to: https://github.com/shubhamprakashrai/Ashutosh_ojha/settings/access
2. Click **"Add people"**
3. Enter: `ashishraimse@gmail.com` or GitHub username
4. Select **"Write"** or **"Admin"** permission
5. Send invitation

## Alternative: Use Personal Access Token (PAT)

If SSH doesn't work, you can use HTTPS with a Personal Access Token:

### Create a PAT:

1. Go to: https://github.com/settings/tokens/new
2. **Note**: "Ashutosh Ojha Project"
3. **Expiration**: Choose duration
4. **Scopes**: Select `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### Update Remote URL:

```bash
git remote set-url origin https://github.com/shubhamprakashrai/Ashutosh_ojha.git
```

### Push with PAT:

When prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Paste your Personal Access Token (not your GitHub password)

## Quick Reference

### View Current Configuration

```bash
# Check local git config
git config --local --list

# Check remote URL
git remote -v

# Check SSH connection
ssh -T git@github.com
```

### Switch Between HTTPS and SSH

```bash
# Use SSH (recommended)
git remote set-url origin git@github.com:shubhamprakashrai/Ashutosh_ojha.git

# Use HTTPS
git remote set-url origin https://github.com/shubhamprakashrai/Ashutosh_ojha.git
```

---

**Next Step**: Add your SSH key to GitHub using the steps above, then try pushing again!
