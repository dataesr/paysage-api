import path from 'path';
import express from 'express';
import 'express-async-errors';
import * as OAV from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { handleErrors } from './modules/commons/middlewares/handle-errors.middlewares';
import { authenticate } from './modules/commons/middlewares/authenticate.middlewares';
import structuresRoutes from './modules/structures/structures.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import officialDocumentsRoutes from './modules/official-documents/official-documents.routes';

// Load API specifications
const apiSpec = path.join(path.resolve(), 'docs/openapi.yml');
const swaggerDocument = YAML.load(apiSpec);

// Application setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Expose swagger API documentation
app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('docs/api/specs.yml', (req, res) => { res.send(swaggerDocument); });

// express-openapi-validator setup to validate requests
app.use(OAV.middleware({
  apiSpec,
  validateRequests: true,
  validateResponses: true,
  ignorePaths: /(.*\/docs\/?|.*\/health\/?|\/specs\.yml\/?)/,
}));

// Authenticate currentUser
app.use(authenticate);

// Register routes
app.use(structuresRoutes);
app.use(categoriesRoutes);
app.use(officialDocumentsRoutes);

// Erreurs personnalisées
app.use(handleErrors);

export default app;
