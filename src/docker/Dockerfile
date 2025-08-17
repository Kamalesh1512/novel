# 🏗️ Stage 1: Builder
FROM node:22-slim AS builder

WORKDIR /app

# Copy only necessary files for installing dependencies
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy the rest of your app
COPY . .

# Enable standalone build
RUN npm run build

# 🏃‍♂️ Stage 2: Runner
FROM node:22-slim AS runner

# Set environment variables for production
ENV NODE_ENV=production

WORKDIR /app

# Create a non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy standalone output and static assets only
COPY --from=builder --chown=appuser:appuser /app/.next/standalone ./
COPY --from=builder --chown=appuser:appuser /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appuser /app/public ./public
COPY --from=builder --chown=appuser:appuser /app/package.json ./package.json

# Switch to non-root user
USER appuser

# Expose port for app
EXPOSE 3000

# Start the Next.js standalone server
CMD ["node", "server.js"]
