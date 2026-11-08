variable "aws_region" {
  description = "Target AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment lifecycle stage environment"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project identifier tag"
  type        = string
  default     = "microservices-ecommerce"
}

variable "vpc_cidr" {
  description = "VPC Classless Inter-Domain Routing block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "List of public subnet CIDR allocations"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "instance_type" {
  description = "AWS EC2 virtual machine sizing"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "AWS SSH Key Pair name"
  type        = string
  default     = "devops-key"
}
