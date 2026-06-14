terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}
# ECR Module

module "ecr" {
  source = "./modules/ecr"

  repositories = var.ecr_repositories
}

# Data Sources

data "aws_ami" "al2023" {
  most_recent = true

  owners = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*"]
  }
}

data "aws_vpc" "default" {
  default = true
}
# Key Pair
resource "aws_key_pair" "lab_key" {
  key_name   = var.key_name
  public_key = file("C:/Users/NewUser/.ssh/lab_key.pub")
}

# Security Group Module
module "security_group" {
  source = "./modules/security-group"

  vpc_id = data.aws_vpc.default.id
}
# EC2 Module
module "ec2" {
  source = "./modules/ec2"

  ami            = data.aws_ami.al2023.id
  key_name       = aws_key_pair.lab_key.key_name
  security_group = module.security_group.sg_id
  user_data      = "${path.module}/user_data.sh"
}