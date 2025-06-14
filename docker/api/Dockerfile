# Compilation API Service
# Handles Docker-based compilation requests

FROM node:18-alpine

# Install Docker CLI for container orchestration
RUN apk add --no-cache docker-cli

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create directories
RUN mkdir -p /app/output /app/temp

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start server
CMD ["node", "server.js"]