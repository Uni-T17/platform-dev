# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# 1) install deps
COPY package*.json ./
RUN npm ci

# 2) copy src and build
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# 3) install only prod deps, but make sure prisma/ exists for postinstall
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
# (postinstall runs here and can now see prisma/schema.prisma)

# 4) copy compiled app
COPY --from=build /app/dist ./dist

# 5) (optional, safe) regenerate to match runtime node_modules
RUN npx prisma generate

# 6) start: run migrations then boot
#    adjust path if your entry is dist/index.js (not dist/src/index.js)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]