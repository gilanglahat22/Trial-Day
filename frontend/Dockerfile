FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application for production
RUN npm run build

# Install a simple HTTP server for serving static content
RUN npm install -g http-server

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Start the application with host specified
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 