import 'dotenv/config';
import path from 'path';
import express from 'express';
import 'express-async-errors';
import * as OAV from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { handleErrors, authenticate } from './src/utils/middlewares';

// import configs from './config';
import routes from './src/routes';

// const config = configs[process.env.NODE_ENV];

// Load API specifications
const apiSpec = path.join(path.resolve(), 'src/openapi.yml');
const swaggerDocument = YAML.load(apiSpec);

// Application setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express-openapi-validator setup to validate requests
app.use(OAV.middleware({
  apiSpec,
  validateRequests: true,
  validateResponses: true,
  ignorePaths: /(.*\/docs\/?|.*\/health\/?|\/specs\.yml\/?)/,
}));

// Expose swagger API documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/specs.yml', (req, res) => { res.send(swaggerDocument); });

app.use(authenticate);

// Register routes
app.use(routes);

// Erreurs personnalisées
app.use(handleErrors);

app.listen(3000, () => console.log('Lancement du serveur ok - 3000'));
