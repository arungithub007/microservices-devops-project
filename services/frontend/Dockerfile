# ==============================================================================
# Production Multi-Stage Dockerfile for Frontend (ReactJS)
# Stage 1: Build static assets using Node.js
# Stage 2: Serve optimized static bundle using Nginx Alpine
# ==============================================================================

# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Cache package manifests
COPY package.json package-lock.json* ./

RUN npm ci --prefer-offline --no-audit

COPY . .

# Pass build time environment variables
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build


# Production Web Server Stage
FROM nginx:1.25-alpine

# Install curl for container health check
RUN apk add --no-cache curl

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom reverse proxy & SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
