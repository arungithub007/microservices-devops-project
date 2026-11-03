# Microservices DevOps Automation Project

An enterprise-grade, end-to-end Three-Tier Microservices Deployment & Observability Architecture.

## Architecture Stack
- **Source Control:** GitHub
- **Containerization:** Docker & Docker Compose
- **Container Registry:** AWS ECR
- **Compute Infrastructure:** AWS EC2
- **Reverse Proxy / Ingress:** Nginx
- **Continuous Integration & Delivery:** Jenkins CI/CD
- **Infrastructure as Code (IaC):** Terraform
- **Monitoring & Observability:** Prometheus & Grafana

## Repository Layout
```
microservices-devops-project/
├── .gitignore
├── README.md
├── project-report.md       # Authoritative Living Audit & Compliance Report
├── evidence/               # Compliance and activity evidence artifacts
│   ├── day-1/
│   ├── day-2/
│   ├── day-3/
│   └── day-4/
├── terraform/              # Infrastructure as Code modules & environments
├── jenkins/                # Jenkinsfile pipeline definitions
├── nginx/                  # Nginx reverse proxy configuration
├── monitoring/             # Prometheus scrape configs & Grafana dashboards
└── services/               # Microservices application source code
    ├── frontend/
    ├── backend/
    └── database/
```

## Governance & Auditing
All deployment milestones, commands executed, architecture decisions, and verification steps are tracked in [project-report.md](project-report.md).
