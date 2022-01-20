import path from 'path';
import express from 'express';
import 'express-async-errors';
import * as OAV from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { handleErrors } from './modules/commons/middlewares/handle-errors.middlewares';
import { authenticate } from './modules/commons/middlewares/authenticate.middlewares';
// import { requireActiveUser } from './modules/commons/middlewares/rbac.middlewares';

import structuresRoutes from './modules/structures/structures.routes';
import eventsRoutes from './modules/events/events.routes';
import officialDocumentsRoutes from './modules/official-documents/official-documents.routes';
import categoriesRoutes from './modules/categories/categories.routes';

// Load API specifications
const apiSpec = path.join(path.resolve(), 'docs/reference/openapi.yml');
const swaggerDocument = YAML.load(apiSpec);

// Application setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health checker
app.all('/health', (req, res) => res.status(200).json({ ok: 1 }));

// Expose swagger API documentation
app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs/specs.yml', (req, res) => { res.send(swaggerDocument); });

// express-openapi-validator setup to validate requests
app.use(OAV.middleware({
  apiSpec,
  validateRequests: true,
  validateResponses: true,
  ignorePaths: /(.*\/docs\/?|.*\/health\/?|\/specs\.yml\/?)/,
}));

// Authenticate currentUser
app.use(authenticate);

// Require active user
// router.use(requireActiveUser);

// Register routes
app.use(structuresRoutes);
app.use(officialDocumentsRoutes);
app.use(categoriesRoutes);
app.use(eventsRoutes);

// Erreurs personnalisées
app.use(handleErrors);

export default app;
