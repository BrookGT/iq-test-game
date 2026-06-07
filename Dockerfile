FROM node:18-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1
ENV CI=true
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV NEXT_PUBLIC_BASE_URL=http://127.0.0.1:5000
ENV NEXT_PUBLIC_APP_WEB_URL=http://localhost:3000
ENV NEXT_PUBLIC_END_POINT=/api/
ENV NEXT_PUBLIC_SEO=true
ENV NEXT_PUBLIC_DEFAULT_COUNTRY=in
ENV NEXT_PUBLIC_DEFAULT_LANGUAGE=en
ENV NEXT_PUBLIC_LANGUAGE_CONFIGURATION="['en','hi','ar','es']"
ENV NEXT_PUBLIC_INSPECT_ELEMENT=false
ENV NEXT_PUBLIC_DEMO=false
ENV NEXT_PUBLIC_BATTLE_EMOJI_TEXT_MILI_SECONDS=4000
COPY . /app
RUN npm ci --legacy-peer-deps \
    && NODE_ENV=production npm run build:docker \
    && npm prune --omit=dev --legacy-peer-deps

FROM node:18-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV NEXT_PUBLIC_BASE_URL=http://127.0.0.1:5000
ENV NEXT_PUBLIC_APP_WEB_URL=http://localhost:3000
ENV NEXT_PUBLIC_END_POINT=/api/
ENV NEXT_PUBLIC_SEO=true
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs quiz
COPY --chown=quiz:nodejs --from=builder /app /app
USER quiz
EXPOSE 3000
CMD ["npm", "start"]
