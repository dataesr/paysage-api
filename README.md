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

`docker-compose -f docker-compose-test.yml up --build --exit-code-from app`

### Docker
To run the full app in a Docker container :

`docker-compose up --build`

This run a docker container, with a MongoDB inside.
To acces the MongoDB from the outside, use host :
`mongodb://127.0.0.1:27017`.

To access the API, use host : `http://localhost:3000/`

To see the API docs, see : http://localhost:3000/docs/api/.

## Route