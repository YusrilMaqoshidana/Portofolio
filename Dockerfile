# Stage 1: Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock ./

# Install all dependencies (including devDependencies needed for build)
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build arguments for SvelteKit PUBLIC_ environment variables
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG PUBLIC_SUPABASE_ANON_KEY

ENV PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
ENV PUBLIC_SUPABASE_PUBLISHABLE_KEY=${PUBLIC_SUPABASE_PUBLISHABLE_KEY}
ENV PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}

# Build SvelteKit application
RUN bun run build

# Install production dependencies only
RUN rm -rf node_modules && bun install --production --frozen-lockfile

# Stage 2: Production runner stage
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy dependencies and build artifact from builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# Expose application port
EXPOSE 3000

# Start server with Bun
CMD ["bun", "build/index.js"]
