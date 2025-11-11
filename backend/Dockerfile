# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# 1) Install deps WITHOUT running postinstall
COPY package*.json ./
RUN npm ci --ignore-scripts

# 2) Copy source (includes prisma/) and build
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# 3) Install only prod deps WITHOUT scripts
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# 4) Bring prisma schema + built code, then generate client
COPY prisma ./prisma
COPY --from=build /app/dist ./dist
RUN npx prisma generate

# 5) Start (adjust entry if it's dist/index.js)
CMD ["sh","-c","npx prisma migrate deploy && node dist/index.js"]