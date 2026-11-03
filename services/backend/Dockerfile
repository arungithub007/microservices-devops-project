# ==============================================================================
# Production Dockerfile for Backend API (Python Flask)
# Multi-stage security, non-root user, healthcheck enabled
# ==============================================================================

FROM python:3.11-slim AS builder

WORKDIR /install

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# Final Runtime Stage
FROM python:3.11-slim

WORKDIR /app

# Install runtime PostgreSQL client library & curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed python dependencies from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Create non-root user for security hardening
RUN groupadd -r devops && useradd -r -g devops devops \
    && chown -R devops:devops /app

USER devops

EXPOSE 5000

ENV FLASK_ENV=production \
    PYTHONUNBUFFERED=1

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "--threads", "2", "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
