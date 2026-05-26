# ARG: define a imagem base Node.js a ser usada para ambos os estágios (build e final)
ARG NODE_BASE=node:26-alpine

### Stage 1: build da aplicação Next.js
# FROM: estágio de build (constrói a aplicação)
FROM ${NODE_BASE} AS builder

# WORKDIR: define diretório de trabalho dentro do container para o estágio de build
WORKDIR /frontend

# COPY: copia manifests para aproveitar cache de camadas
COPY package.json package-lock.json ./ 
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev --no-audit --no-fund --prefer-offline
# RUN: instala dependências de forma reprodutível (npm ci)
# --mount=type=cache: usa cache BuildKit para acelerar reinstalações
# --include=dev: inclui devDependencies necessários para o build

COPY . .

RUN npm run build

### Stage 2: base mínima comum
# FROM: cria um estágio base mínimo reutilizável para imagens finais
FROM ${NODE_BASE} AS base

# ENV: define ambiente de produção dentro da imagem
ENV NODE_ENV=production
# ENV: desativa telemetria do Next
ENV NEXT_TELEMETRY_DISABLED=1

# WORKDIR: define diretório de trabalho no estágio base
WORKDIR /frontend
# RUN: instala apenas certificados CA necessários e cria usuário/grupo com UID/GID fixos
RUN apk add --no-cache ca-certificates \
	&& addgroup -S -g 10001 frontgroup \
	&& adduser -S -D -H -u 10001 -G frontgroup frontuser
# adduser: cria usuário sem shell e sem home (mais seguro)

### Stage 3: imagem final endurecida
# FROM: usa o estágio `base` como ponto de partida para a imagem endurecida
FROM base AS hardened

# COPY: copia apenas `public` do builder e ajusta dono para o usuário não-root
COPY --from=builder --chown=frontuser:frontgroup /frontend/public ./public
# COPY: copia arquivos estáticos gerados pelo Next
COPY --from=builder --chown=frontuser:frontgroup /frontend/.next/static ./.next/static
# COPY: copia o output standalone do Next (apenas runtime necessário)
COPY --from=builder --chown=frontuser:frontgroup /frontend/.next/standalone ./

USER frontuser

# CMD: comando padrão para iniciar o servidor Node gerado pelo Next standalone
CMD ["node", "server.js"]