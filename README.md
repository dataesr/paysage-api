# Paysage API

## Developpement
### Install
`npm install`

### Start the app in dev
`npm run start`

### Run tests
* Run all tests

`npm test`

* Run only one tests file

`npm test my_file.test.js`

* Run test into a Docker container

`docker-compose -f docker-compose-test.yml up --build --exit-code-from paysage-api`

### Docker

:warning: As our auth app "paysage-auth" is private, you need to be logged to ghcr.io to use this docker-compose file.

To run the full app in a Docker container :

`docker-compose up --build`

This run a docker container, with a MongoDB inside, the paysage-auth app and the paysage-api app.

To acces the MongoDB from inside, use host : `mongodb://mongo:27017`.

To acces the MongoDB from outside, use host : `mongodb://127.0.0.1:27017`.

To access the paysage-api from outside, use host : `http://localhost:3003/`.

To acess the paysage-auth from outside, use host : `http://localhost:3004/`.

To see the API docs, see : http://localhost:3003/docs/api/.

## Route