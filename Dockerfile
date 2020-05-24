
FROM node:8 as react-build
WORKDIR /app
ARG NPM_TOKEN  
COPY .npmrc .npmrc  
COPY package.json package.json 
COPY .env.production .env.production
RUN yarn  
RUN rm -f .npmrc
COPY . ./
ENV GENERATE_SOURCEMAP false
RUN yarn build-with-high-memory


FROM node:8 as exec
WORKDIR /app/workspace
COPY --from=react-build /app/build ./build
COPY --from=react-build /app/node_modules ./node_modules
RUN mkdir -p ./tmp
COPY .env.production .env.production
COPY server.js .
RUN ["du", "-h"]
EXPOSE 3000
CMD ["node", "server.js"]
