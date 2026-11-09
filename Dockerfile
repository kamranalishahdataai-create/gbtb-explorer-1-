# Gardens by the Bay Explorer: container for Railway (or any Docker host)
FROM node:20-alpine

WORKDIR /app

# No npm dependencies, so we just copy the app
COPY package.json server.js ./
COPY public ./public

ENV NODE_ENV=production
# Railway sets PORT automatically; 3000 is the local default
ENV PORT=3000
EXPOSE 3000

# Run as the non-root "node" user that ships with the image
USER node

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "server.js"]
