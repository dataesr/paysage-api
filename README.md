# Paysage API

## Developpement
### Install
`npm install`

### Start the app in dev
`npm start`

### Run tests
* Run all tests

`npm test`

* Run only one tests file

`npm test my_file.test.js`

* Run test into a Docker container

`npm run docker:test`

### Reindex / sync the Mongo database into ES

`npm run reindex [TYPE]`

Where type could be omitted, or be one value between "categories", "legal-categories", "official-texts", "persons", "prices", "projects", "structures", "terms", "users".

Example: `NODE_ENV=local ES_NODE=http://localhost:9200 MONGO_URI="mongodb://mongo:27017" ES_USERNAME=elastic-user ES_PASSWORD=eslatic-password npm run reindex structures`


### Docker


To run the full app in a Docker container :

`docker-compose up --build`

To stop the docker container :

`docker-compose down`

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
 
## Deploy in prod

To deploy in production, create a new release and push on the main branch. Github workflow will do the rest !

`npm version patch && git push origin main --tags`
