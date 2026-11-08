output "vpc_id" {
  description = "ID of provisioned VPC"
  value       = module.vpc.vpc_id
}

output "ec2_public_ip" {
  description = "Public Elastic IP address of production EC2 instance"
  value       = module.ec2.public_ip
}

output "ecr_frontend_url" {
  description = "AWS ECR Repository URL for Frontend"
  value       = module.ecr.frontend_repository_url
}

output "ecr_backend_url" {
  description = "AWS ECR Repository URL for Backend"
  value       = module.ecr.backend_repository_url
}
