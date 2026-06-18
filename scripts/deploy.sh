#!/bin/bash

set -euo pipefail

AWS_REGION=$1
AWS_ACCOUNT_ID=$2
NEW_TAG=$3

ECR_REGISTRY=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

cd /home/ec2-user

echo "🚀 Deploying version: $NEW_TAG"

# STEP 1: read previous known-good version (do NOT write current_version.txt yet)
if [ -f current_version.txt ]; then
    OLD_TAG=$(cat current_version.txt)
else
    OLD_TAG=""
fi

# STEP 2: login to ECR
aws ecr get-login-password --region "$AWS_REGION" \
| docker login --username AWS --password-stdin "$ECR_REGISTRY"

# STEP 3: set tag for docker compose
export IMAGE_TAG="$NEW_TAG"
echo "IMAGE_TAG=$NEW_TAG" > .env

# STEP 4: deploy new version (force recreate for safety)
docker compose pull
docker compose up -d --force-recreate

sleep 10

# STEP 5: health check (no Actuator available — just confirm the app responds to HTTP)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/ || true)

echo "Health check code: $HTTP_CODE"

# 000 means curl couldn't connect at all (app is down). Any real HTTP response
# (200, 404, 401, etc.) means the server process is up and answering requests.
if [ "$HTTP_CODE" = "000" ]; then
    echo "❌ Deployment failed → starting rollback"

    if [ -n "$OLD_TAG" ]; then
        echo "🔁 Rolling back to: $OLD_TAG"

        export IMAGE_TAG="$OLD_TAG"
        echo "IMAGE_TAG=$OLD_TAG" > .env
        docker compose up -d --force-recreate wpoms_admin wpoms_web

        echo "✅ Rollback completed (current_version.txt left unchanged at $OLD_TAG)"
    else
        echo "⚠️ No previous version found, cannot roll back"
    fi

    exit 1
fi

# STEP 6: only record the new tag as "current" once it's confirmed healthy
echo "$NEW_TAG" > current_version.txt

echo "✅ Deployment successful"