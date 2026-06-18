#!/bin/bash
set -euo pipefail

AWS_REGION="$1"
AWS_ACCOUNT_ID="$2"
NEW_TAG="$3"

ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
APP_DIR="/home/ec2-user"

cd "$APP_DIR"

echo "$(date) 🚀 Deploying version: $NEW_TAG"

# -----------------------------
# STEP 1: Read previous version
# -----------------------------
OLD_TAG=""
if [ -f current_version.txt ]; then
    OLD_TAG=$(cat current_version.txt)
fi

# -----------------------------
# STEP 2: Validate input
# -----------------------------
if [ -z "$NEW_TAG" ]; then
    echo "❌ NEW_TAG is empty. Exiting."
    exit 1
fi

# -----------------------------
# STEP 3: Login to ECR
# -----------------------------
aws ecr get-login-password --region "$AWS_REGION" \
| docker login --username AWS --password-stdin "$ECR_REGISTRY"

# -----------------------------
# STEP 4: Update image tag safely
# -----------------------------
export IMAGE_TAG="$NEW_TAG"
echo "IMAGE_TAG=$NEW_TAG" > .env.tmp
mv .env.tmp .env

# -----------------------------
# STEP 5: Deploy application
# -----------------------------
docker compose pull
docker compose up -d --force-recreate

echo "✅ Containers started successfully"

# -----------------------------
# STEP 6: Save deployed version
# -----------------------------
echo "$NEW_TAG" > current_version.txt

echo "$(date) ✅ Deployment completed: $NEW_TAG"