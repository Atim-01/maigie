# Backend Deployment Guide

This guide explains how to deploy the Maigie backend to Contabo VPS using Docker and GitHub Actions.

## Architecture Overview

- **Production/Staging**: Deploy to Contabo VPS with external managed databases (Neon/Supabase)
- **PR Previews**: Each PR gets its own temporary Docker container with embedded Postgres DB
- **CI/CD**: GitHub Actions handles testing, building, and deployment

## Prerequisites

1. **Contabo VPS** with SSH access
2. **External Database** (Neon, Supabase, or PlanetScale) for production/staging
3. **GitHub Repository** with Actions enabled
4. **SSH Key** for VPS access

## Initial VPS Setup

1. SSH into your Contabo VPS:
   ```bash
   ssh user@your-vps-ip
   ```

2. Run the setup script:
   ```bash
   # Clone your repository or upload the script
   bash scripts/vps-setup.sh
   ```

3. Copy Dockerfile to production and staging directories:
   ```bash
   cp apps/backend/Dockerfile /opt/maigie/production/
   cp apps/backend/Dockerfile /opt/maigie/staging/
   ```

4. Create `.env` files:
   ```bash
   # Production
   cd /opt/maigie/production
   cat > .env << EOF
   DATABASE_URL=postgresql://user:password@your-neon-host/dbname
   REDIS_URL=redis://redis:6379/0
   ENVIRONMENT=production
   EOF

   # Staging
   cd /opt/maigie/staging
   cat > .env << EOF
   DATABASE_URL=postgresql://user:password@your-neon-host/staging-db
   REDIS_URL=redis://redis:6379/0
   ENVIRONMENT=staging
   EOF
   ```

## GitHub Secrets Configuration

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Required Secrets

- `VPS_HOST` - Your Contabo VPS IP address or domain name
- `VPS_USER` - SSH username (usually `root` or `ubuntu`)
- `VPS_SSH_KEY` - Private SSH key for VPS access (generate with `ssh-keygen -t ed25519`)
- `PRODUCTION_DATABASE_URL` - Full PostgreSQL connection string for production
- `STAGING_DATABASE_URL` - Full PostgreSQL connection string for staging

### Generating SSH Key

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/github_actions.pub user@your-vps-ip

# Add private key to GitHub Secrets
cat ~/.ssh/github_actions  # Copy this to VPS_SSH_KEY secret
```

## Database Setup

### External Databases (Production/Staging)

1. **Neon** (Recommended):
   - Sign up at https://neon.tech
   - Create two databases: `maigie_production` and `maigie_staging`
   - Copy connection strings to GitHub secrets

2. **Supabase**:
   - Sign up at https://supabase.com
   - Create projects for production and staging
   - Get connection strings from project settings

3. **PlanetScale**:
   - Sign up at https://planetscale.com
   - Create branches for production and staging
   - Get connection strings from dashboard

### Preview Databases

Preview environments use temporary Postgres databases inside Docker containers. Each PR gets:
- Isolated Postgres container
- Isolated Redis container
- Isolated backend container
- **Automatic cleanup when PR is closed** (immediate)
- **Automatic cleanup after 3 days** if PR remains open

## Deployment Flow

### 1. Pull Request (Preview)

When a PR is opened:
1. GitHub Actions runs tests and linting
2. Builds Docker image
3. Deploys to VPS in `/opt/maigie/previews/pr-{PR_NUMBER}/`
4. Creates temporary Postgres database
5. Runs migrations and seeds data
6. Comments preview URL on PR

### 2. Push to Development (Staging)

When code is pushed to `development` branch:
1. GitHub Actions runs tests and linting
2. Builds Docker image tagged as `staging`
3. Deploys to VPS in `/opt/maigie/staging/`
4. Connects to external staging database
5. Runs migrations and seeds data

### 3. Push to Main (Production)

When code is pushed to `main` branch:
1. GitHub Actions runs tests and linting
2. Builds Docker image tagged as `latest`
3. Deploys to VPS in `/opt/maigie/production/`
4. Connects to external production database
5. Runs migrations (no seed in production)

## Local Development

### Running with Docker Compose

```bash
cd apps/backend

# Preview environment (with embedded Postgres)
PREVIEW_ID=local docker-compose -f docker-compose.preview.yml up

# Production-like environment (requires DATABASE_URL)
docker-compose up
```

### Testing Seed Script

```bash
cd apps/backend
poetry install
poetry run prisma generate
poetry run prisma db seed
```

## Monitoring and Maintenance

### View Logs

```bash
# Production
cd /opt/maigie/production
docker-compose logs -f backend

# Staging
cd /opt/maigie/staging
docker-compose logs -f backend

# Preview
cd /opt/maigie/previews/pr-{PR_NUMBER}
docker-compose logs -f backend
```

### Manual Cleanup

```bash
# Clean up old previews manually (checks PR status via GitHub API)
# Requires: GITHUB_TOKEN, REPO_OWNER, REPO_NAME as arguments
bash /opt/maigie/scripts/cleanup-previews.sh "$GITHUB_TOKEN" "your-org" "your-repo"

# Or cleanup specific preview manually
cd /opt/maigie/previews/pr-{PR_NUMBER}
docker-compose down -v
cd ..
rm -rf pr-{PR_NUMBER}
```

### Automatic Cleanup

Preview environments are automatically cleaned up in two ways:

1. **On PR Close/Merge**: GitHub Actions workflow automatically cleans up when PR is closed
2. **Cron Job**: Runs daily at 2 AM to clean up:
   - Previews for closed/merged PRs (immediate cleanup)
   - Previews older than 3 days (if PR is still open)

To enable GitHub API checking in cron job, add a GitHub token:

```bash
# Edit crontab
crontab -e

# Update the cleanup job with your GitHub token and repo details
0 2 * * * /opt/maigie/scripts/cleanup-previews.sh "your_github_token" "your-org" "your-repo" >> /var/log/maigie-cleanup.log 2>&1
```

### Health Checks

- Production: `http://your-vps-ip:8000/health`
- Staging: `http://your-vps-ip:8001/health`
- Preview: `http://your-vps-ip:{DYNAMIC_PORT}/health`

## Troubleshooting

### Preview Not Starting

1. Check logs: `docker-compose logs`
2. Verify port is available
3. Check database connection
4. Ensure migrations completed successfully

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check firewall rules allow connections
3. Verify database credentials
4. Test connection: `psql $DATABASE_URL`

### Docker Build Fails

1. Check Dockerfile syntax
2. Verify all dependencies in `pyproject.toml`
3. Check build logs in GitHub Actions
4. Test build locally: `docker build -t test .`

## Security Considerations

1. **SSH Keys**: Use strong SSH keys and rotate regularly
2. **Database URLs**: Never commit database URLs to repository
3. **Preview Cleanup**: Ensure previews are cleaned up automatically
4. **Firewall**: Configure VPS firewall to only allow necessary ports
5. **Secrets**: Use GitHub Secrets for all sensitive data

## Cost Optimization

- Preview environments are automatically cleaned up when PRs are closed (immediate)
- Preview environments older than 3 days are cleaned up automatically (if PR is still open)
- Use external managed databases to avoid VPS database overhead
- Consider using Docker image registry to reduce build times
- Monitor VPS resource usage

## Next Steps

1. Set up external databases (Neon/Supabase)
2. Configure GitHub Secrets
3. Run VPS setup script
4. Push to `development` or `main` to trigger first deployment
5. Monitor deployments and adjust as needed

