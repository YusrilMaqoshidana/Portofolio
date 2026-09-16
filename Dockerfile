FROM node:22-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY . .

ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG PUBLIC_SUPABASE_ANON_KEY

ENV PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
ENV PUBLIC_SUPABASE_PUBLISHABLE_KEY=${PUBLIC_SUPABASE_PUBLISHABLE_KEY}
ENV PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}

ENV NODE_ENV=production

RUN npm run build

FROM base AS prod-deps

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

USER node

COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/build ./build

EXPOSE 3000

CMD ["node", "build/index.js"]
