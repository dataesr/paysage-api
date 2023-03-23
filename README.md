# Paysage API

## Developpement

### Install

`npm install`

### Start the app in dev

`npm start`

### Run tests

- Run all tests

`npm test`

- Run only one tests file

`npm test my_file.test.js`

- Run test into a Docker container

`npm run docker:test`

### Reindex / sync the Mongo database into ES

`npm run reindex [TYPE]`

Where type could be omitted, or be one value between "categories", "legal-categories", "official-texts", "persons", "prizes", "projects", "structures", "terms", "users".

Example: `NODE_ENV=development ES_NODE=http://localhost:9200 MONGO_URI="mongodb://localhost:27017" ES_USERNAME= ES_PASSWORD= npm run reindex`

:warning: Keep in mind that our wifi network "la-boucherie-Sanzot" can not connect to our MongoDB prod right now. Please make sure that your are on another wifi network before reindexing in production.

### Docker

To run the full app in a Docker container :

`docker-compose up --build`

To stop the docker container :

`docker-compose down`

To run the app being sure that everythiing else is down :

`docker-compose down && docker system prune -f && docker-compose up --build`

This run a docker container, with a MongoDB inside, the paysage-auth app and the paysage-api app.

To acces the MongoDB from inside, use host : `mongodb://mongo:27017`.

To acces the MongoDB from outside, use host : `mongodb://127.0.0.1:27017`.

To access the Elasticsearch from inside, use host : `http://elasticsearch:9200/`.

To access the Elasticsearch from outside, use host : `http://localhost:9200/`.

To access the paysage-api from inside, use host : `http://localhost:3000/`.

To access the paysage-api from outside, use host : `http://localhost:3003/`.

To acess the paysage-auth from outside, use host : `http://localhost:3004/`.

To see the API docs, see : http://localhost:3003/docs/api/.

## Documentation

https://dataesr.stoplight.io/docs/paysage-api-1/95201cd74824d-bienvenue-sur-la-documentation-paysage

## Deployment

To deploy in production, simply run this command from your staging branch :

```sh
npm run deploy --level=[patch|minor|major]
```

:warning: Obviously, only members of the [dataesr organization](https://github.com/dataesr/) have rights to push on the repo.
