FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use ci for consistent installs)
# --omit=dev can be used if we separate build from run, but we need tsc to build
# So we install all deps first
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port (matches envConfig.port default or expected)
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
