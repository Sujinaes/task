variable "region" {
  default = "ap-south-1"
}

variable "key_name" {
  default = "lab-key"
}

variable "ecr_repositories" {
  type    = list(string)
  default = ["frontend-repo", "backend-repo"]
}