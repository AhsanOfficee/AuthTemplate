# Build-time args
ARG LANGUAGE_NAME
ARG LANGUAGE_VERSION

# Use the official base image dynamically
FROM ${LANGUAGE_NAME}:${LANGUAGE_VERSION} AS base

# Build-time args
ARG VOLUME_LOCATION

# Set the working directory
WORKDIR /${VOLUME_LOCATION}

# Copy package.json and package-lock.json first (to optimize caching)
COPY package*.json ./

# Install packages
RUN npm install
RUN npm install pm2 -g
RUN npm install -g bun
RUN npm install -g ts-node typescript
# RUN npm run build

# Copy the rest of the application code
COPY . .

# Start the application using pm2
FROM base AS production
CMD [ "npm","start" ]

FROM base AS development
CMD [ "npm","run","dev"]

