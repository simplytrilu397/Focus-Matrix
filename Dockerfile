# Production Dockerfile for Google Cloud Run
FROM node:20-slim

# Create and set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy application code
COPY . .

# Configure default Cloud Run environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run port
EXPOSE 8080

# Start server
CMD [ "node", "server.js" ]
