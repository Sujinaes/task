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
# STEP 4: Set new deployment tag safely
# -----------------------------
export IMAGE_TAG="$NEW_TAG"
echo "IMAGE_TAG=$NEW_TAG" > .env.tmp
mv .env.tmp .env

# -----------------------------
# STEP 5: Deploy new version
# -----------------------------
docker compose pull
docker compose up -d --force-recreate

# -----------------------------
# STEP 6: Wait for backend readiness
# -----------------------------
echo "⏳ Waiting for backend to become healthy..."

HTTP_CODE="000"

for i in {1..15}; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:8001/actuator/health || true)

    echo "Attempt $i → HTTP: $HTTP_CODE"

    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Backend is healthy"
        break
    fi

    sleep 5
done

# If still not healthy, mark failure
if [ "$HTTP_CODE" != "200" ]; then
    HTTP_CODE="000"
fi

# -----------------------------
# STEP 7: Failure → Rollback
# -----------------------------
if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ Deployment failed → triggering rollback"

    if [ -n "$OLD_TAG" ] && [ "$OLD_TAG" != "$NEW_TAG" ]; then
        echo "🔁 Rolling back to: $OLD_TAG"

        export IMAGE_TAG="$OLD_TAG"
        echo "IMAGE_TAG=$OLD_TAG" > .env

        docker compose pull
        docker compose up -d --force-recreate

        echo "✅ Rollback completed successfully"
    else
        echo "⚠️ No valid previous version found. Cannot rollback."
    fi

    echo "$(date) ❌ Deployment FAILED for $NEW_TAG"
    exit 1
fi

# -----------------------------
# STEP 8: Success → Save state
# -----------------------------
echo "$NEW_TAG" > current_version.txt

echo "$(date) ✅ Deployment successful: $NEW_TAG"