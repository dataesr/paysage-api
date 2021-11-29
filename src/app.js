import path from 'path';
import express from 'express';
import 'express-async-errors';
import * as OAV from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { handleErrors, authenticate } from './utils/middlewares';
import structure from './modules/structure/structure.routes';

// Load API specifications
const apiSpec = path.join(path.resolve(), 'docs/openapi.yml');
const swaggerDocument = YAML.load(apiSpec);

// Application setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Expose swagger API documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/specs.yml', (req, res) => { res.send(swaggerDocument); });

// express-openapi-validator setup to validate requests
app.use(OAV.middleware({
  apiSpec,
  validateRequests: true,
  // validateResponses: true,
  ignorePaths: /(.*\/docs\/?|.*\/health\/?|\/specs\.yml\/?)/,
}));

app.use(authenticate);

// Register routes
app.use('/api/structure', structure);

// Erreurs personnalisées
app.use(handleErrors);

export default app;
