terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# 1. VPC & Networking Module
module "vpc" {
  source              = "../../modules/vpc"
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  environment         = var.environment
  project_name        = var.project_name
}

# 2. Security Groups Module
module "security_groups" {
  source       = "../../modules/security_groups"
  vpc_id       = module.vpc.vpc_id
  environment  = var.environment
  project_name = var.project_name
}

# 3. AWS ECR Container Registries Module
module "ecr" {
  source       = "../../modules/ecr"
  environment  = var.environment
  project_name = var.project_name
}

# 4. Compute EC2 Instance Module
module "ec2" {
  source             = "../../modules/ec2"
  subnet_id          = module.vpc.public_subnet_ids[0]
  security_group_id  = module.security_groups.web_security_group_id
  instance_type      = var.instance_type
  key_name           = var.key_name
  environment        = var.environment
  project_name       = var.project_name
}
