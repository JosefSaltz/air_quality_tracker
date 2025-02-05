
FROM denoland/deno:2.1.9 AS builder

# Set the working directory in the container
WORKDIR /app

# Bundle app source inside Docker image
COPY . .

# Install any needed packages specified in package.json
RUN deno install --allow-scripts

# Build the SvelteKit application for production
RUN deno task build

RUN deno task serve
# # Use Deno as a new stage to serve the application
# FROM denoland/deno:2.1.9

# # Copy the output from the builder stage
# COPY --from=builder /app/build .


