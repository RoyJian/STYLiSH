FROM node:lts-alpine
COPY ./src/Backend /workspace
WORKDIR /workspace
RUN yarn install
EXPOSE 3000
CMD yarn start
