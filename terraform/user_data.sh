#!/bin/bash
yum update -y

yum install -y docker
systemctl start docker
systemctl enable docker

usermod -aG docker ec2-user

# install docker compose plugin (correct way)
mkdir -p /usr/local/lib/docker/cli-plugins/

curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
-o /usr/local/lib/docker/cli-plugins/docker-compose

chmod +x /usr/local/lib/docker/cli-plugins/docker-compose