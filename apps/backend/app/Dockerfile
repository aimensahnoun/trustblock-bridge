# From latest node image
FROM node:latest

RUN npm i npm@latest -g
RUN mkdir /opt/node_app
# Create app directory
WORKDIR /opt/node_app

# Install app dependencies

COPY package*.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force

COPY . .

CMD ["npm" , "start"]