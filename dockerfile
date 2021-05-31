FROM node:14.15.5-buster as build
LABEL MAINTAINER "Philip Dalen <philip.dalen@bcc.no>"

# Vote server
#------------------------------------

# copy server files and install dependencies
WORKDIR /opt/vote/server
ARG GITHUB_PACKAGES_ACCESS_KEY
COPY ./server/package.json ./server/package-lock.json .npmrc /opt/vote/server/
RUN npm ci
COPY ./server/ /opt/vote/server

# install deps client app
WORKDIR /opt/vote/client
COPY ./client/package.json ./client/package-lock.json /opt/vote/client/
RUN npm ci

COPY ./client /opt/vote/client
RUN npm run build



# build db and server
WORKDIR /opt/vote/server
RUN npm run build    
CMD ["npm", "start"]