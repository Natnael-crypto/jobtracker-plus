FROM node:20-alpine AS builder
WORKDIR /app
COPY . .


RUN npm install --frozen-lockfile
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone server
COPY --from=builder /app/.next/standalone ./
# Copy static files
COPY --from=builder /app/.next/static ./.next/static
# Copy public assets
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
