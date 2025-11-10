# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Faster layer caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# Generate Prisma client using dev deps present in this stage
RUN npx prisma generate
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled app and prisma schema/migrations
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Generate Prisma client in the final image (matches runtime node_modules)
RUN npx prisma generate

# Railway will set PORT; no need to EXPOSE, but harmless if you keep it
# EXPOSE 3000

# Apply DB migrations first, then start the server
# Adjust the entrypoint to your actual built file (commonly dist/src/index.js)
CMD sh -c "npx prisma migrate deploy && node dist/src/index.js"