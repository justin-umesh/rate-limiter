# Base image for shared dependecies
FROM node:24-alpine as baseimage
WORKDIR /app
COPY package*.json .

# For development and HMR
FROM baseimage as development
RUN npm install
COPY . ./
CMD [ "npm", "run", "dev" ]

# Production Build
FROM baseimage as build
RUN npm install
COPY . ./
RUN npm run build

# Starting the Production server
FROM baseimage as production
WORKDIR /app
# Only copy the compiled code from build step
COPY --from=build /app/dist ./dist
# install only the prod dependencies to keep smaller image
RUN npm install --omit=dev
CMD [ "npm", "run", "start" ]