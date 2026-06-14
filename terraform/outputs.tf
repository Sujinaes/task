output "instance_public_ip" {
  value = module.ec2.public_ip
}

output "ecr_repo_urls" {
  value = module.ecr.repo_urls
}

output "region_used" {
  value = var.region
}