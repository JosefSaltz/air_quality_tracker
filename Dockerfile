
FROM denoland/deno:2.1.9 AS builder

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
# Set the working directory in the container
WORKDIR /app

# Install jq
RUN apt-get update && apt-get install -y jq

# Extract certs
RUN jq -r '.letsencrypt.Certificates[] | select(.domain.main=="piita.org") | .certificate' /data/coolify/proxy/acme.json | base64 -d > tls_cert.pem

# Set environment
ENV DENO_CERT="./tls_cert.pem"

# Bundle app source inside Docker image
COPY . .

# Install any needed packages specified in package.json
RUN deno install --allow-scripts

# Build the App
ARG DOTENV_KEY

RUN DOTENV_KEY=${DOTENV_KEY} deno task build

# Use Deno as a new stage to serve the application
FROM denoland/deno:alpine-2.1.9

# Set the working directory in the container
WORKDIR /app

COPY --from=builder /app/build ./build

COPY --from=builder ["/app/deno*", "/app/.env.vault", "/app/package*", "./"]

CMD deno task serve
