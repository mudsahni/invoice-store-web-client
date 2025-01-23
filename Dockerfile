# Stage 1: Building the code
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json ./
COPY package*.json ./
RUN npm ci --verbose

# Copy rest of the code
COPY . .
RUN npm run build

# Stage 2: Running the app
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/components.json ./
COPY --from=builder /app/next.d.ts ./
COPY --from=builder /app/.firebaserc ./
COPY --from=builder /app/firestore.rules ./
COPY --from=builder /app/firebase.json ./

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]