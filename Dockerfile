# Production Dockerfile for FocusMatrix (Cloud Run & Render)
FROM node:20-slim

# Create and set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Configure default port environment (Matches Render 10000 & Cloud Run overrides)
ENV NODE_ENV=production
ENV PORT=10000

# Expose port
EXPOSE 10000

# Start server
CMD [ "node", "server.js" ]
