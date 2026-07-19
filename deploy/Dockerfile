# Hermes web app — self-hosted build for the VPS.
# Build from the repo root:  docker compose -f deploy/docker-compose.vps.yml up -d --build
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 8090
ENV PORT=8090
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
