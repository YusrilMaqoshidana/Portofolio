FROM oven/bun:1-slim AS base

WORKDIR /app

FROM base AS deps

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY . .

ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG PUBLIC_SUPABASE_ANON_KEY

ENV PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
ENV PUBLIC_SUPABASE_PUBLISHABLE_KEY=${PUBLIC_SUPABASE_PUBLISHABLE_KEY}
ENV PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}

ENV NODE_ENV=production

RUN bun run build

FROM base AS prod-deps

COPY package.json bun.lock ./

RUN bun install --production --frozen-lockfile

FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

USER bun

COPY --chown=bun:bun --from=builder /app/package.json ./package.json
COPY --chown=bun:bun --from=prod-deps /app/node_modules ./node_modules
COPY --chown=bun:bun --from=builder /app/build ./build

EXPOSE 3000

CMD ["bun", "build/index.js"]
