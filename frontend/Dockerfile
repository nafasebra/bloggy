# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
ARG PNPM_VERSION=9.0.0
ARG TURBO_VERSION=2.7.2

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

FROM base AS pruner
ARG APP=web
COPY . .
RUN pnpm dlx turbo@${TURBO_VERSION} prune ${APP} --docker

FROM base AS builder
ARG APP=web
ARG API_URL=http://localhost:3030
ARG JWT_SECRET=change-me
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001
ARG VITE_API_URL=http://localhost:3030
ARG VITE_WEB_URL=http://localhost:3000

WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

ENV NODE_ENV=production
ENV API_URL=${API_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_DASHBOARD_URL=${NEXT_PUBLIC_DASHBOARD_URL}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WEB_URL=${VITE_WEB_URL}

RUN pnpm turbo build --filter=${APP}

FROM node:${NODE_VERSION}-alpine AS web
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ > /dev/null || exit 1

CMD ["node", "apps/web/server.js"]

FROM nginx:1.27-alpine AS dashboard

COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ > /dev/null || exit 1
