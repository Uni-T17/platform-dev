# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the app (including prisma/)
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy prisma schema for runtime usage
COPY prisma ./prisma

# Copy package files and install only prod dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built app from previous stage
COPY --from=build /app/dist ./dist

# Generate Prisma client again for production
RUN npx prisma generate

EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]