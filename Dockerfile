# Stage 1: Building the code
FROM node:22-alpine AS builder

WORKDIR /app

# Add build args for env variables
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_DOCUMENT_STORE_API
# ... other env vars

# Set env variables for build time
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_DOCUMENT_STORE_API=$NEXT_PUBLIC_DOCUMENT_STORE_API

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

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.mjs ./
COPY --from=builder /app/components.json ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/.firebaserc ./
COPY --from=builder /app/firestore.rules ./
COPY --from=builder /app/firebase.json ./
COPY --from=builder /app/firestore.indexes.json ./
COPY --from=builder /app/tsconfig.scripts.json ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next


EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN chown -R node:node .
USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
