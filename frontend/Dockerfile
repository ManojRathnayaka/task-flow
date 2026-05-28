# =============================================================================
# Stage 1: Build Phase
# =============================================================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install clean, exact dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the TypeScript React application
RUN npm run build

# =============================================================================
# Stage 2: Web Server Runtime Phase
# =============================================================================
FROM nginx:alpine

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from Stage 1 into Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose standard web traffic port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
