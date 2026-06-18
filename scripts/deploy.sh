#!/bin/bash

set -euo pipefail

AWS_REGION=$1
AWS_ACCOUNT_ID=$2
NEW_TAG=$3

ECR_REGISTRY=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

cd /home/ec2-user

echo "🚀 Deploying version: $NEW_TAG"

# STEP 1: store previous version
if [ -f current_version.txt ]; then
    cp current_version.txt previous_version.txt
fi

echo "$NEW_TAG" > current_version.txt

# STEP 2: login to ECR
aws ecr get-login-password --region "$AWS_REGION" \
| docker login --username AWS --password-stdin "$ECR_REGISTRY"

# STEP 3: export tag safely
export IMAGE_TAG="$NEW_TAG"

# STEP 4: deploy new version (force recreate for safety)
docker compose pull
docker compose up -d --force-recreate

sleep 10

# STEP 5: strong health check (backend-specific)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/actuator/health || true)

echo "Health check code: $HTTP_CODE"

if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ Deployment failed → starting rollback"

    # cleanup broken containers
    docker compose down

    if [ -f previous_version.txt ]; then
        OLD_TAG=$(cat previous_version.txt)

        echo "🔁 Rolling back to: $OLD_TAG"

        export IMAGE_TAG="$OLD_TAG"
        docker compose up -d --force-recreate

        echo "✅ Rollback completed"
    else
        echo "⚠️ No previous version found"
    fi

    exit 1
fi

echo "✅ Deployment successful"