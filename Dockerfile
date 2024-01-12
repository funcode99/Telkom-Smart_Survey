FROM node:16-alpine AS base
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./

FROM base AS dependencies
RUN yarn install --production


FROM base AS builder
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

# FROM base AS starter
# RUN npm add nuxt-start

FROM base AS release
ENV NODE_ENV=production
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

CMD ["node_modules/.bin/next", "start"]
