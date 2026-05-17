### Stage 1: build da aplicação Next.js
FROM node:26-alpine AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=production
WORKDIR /app

# Copia package* e instala deps de forma determinística
COPY package*.json ./
RUN npm ci

# Copia código
COPY . .

# Build da aplicação e remove devDependencies
RUN npm run build
RUN npm prune --production

### Stage 2: imagem final de produção
FROM node:26-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup -S appgroup && adduser -S frontuser -G appgroup
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

RUN chown -R frontuser:appgroup /app
USER frontuser


CMD ["npm", "run", "start"]
