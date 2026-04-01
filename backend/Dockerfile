# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app

# Install root dependencies (zod for shared)
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy shared module
COPY shared/ ./shared/

# Install backend dependencies (including devDeps for tsx)
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ .
RUN npx prisma generate

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx src/index.ts"]
