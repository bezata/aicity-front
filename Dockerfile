# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    gcc \
    linux-headers \
    udev \
    eudev-dev

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && \
    npm rebuild usb --build-from-source

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Ensure public directory exists
RUN mkdir -p public

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p public

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy environment files to runtime
COPY --from=builder /app/.env.local ./.env.local

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"] 