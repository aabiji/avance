FROM ubuntu:noble
FROM oven/bun:latest

# Setup the project in a directory called "avance"
WORKDIR /avance
COPY . /avance
RUN bun install --production

# Run the web server
WORKDIR /avance/backend
EXPOSE 8080
CMD ["bun", "run", "start"]