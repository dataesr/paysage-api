import path from 'path';
import express from 'express';
import 'express-async-errors';
import multer from 'multer';
import * as OAV from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import health from '@cloudnative/health-connect';
import { handleErrors } from './api/commons/middlewares/handle-errors.middlewares';
import { authenticate } from './api/commons/middlewares/authenticate.middlewares';

import structuresRoutes from './api/structures/structures.routes';
import personsRoutes from './api/persons/persons.routes';
import officialDocumentsRoutes from './api/official-documents/od.routes';
import legalCategoriesRoutes from './api/legal-categories/lc.routes';
import pricesRoutes from './api/prices/prices.routes';
import termsRoutes from './api/terms/terms.routes';
import documentsRoutes from './api/documents/documents.routes';
import categoriesRoutes from './api/categories/categories.routes';

import assetsRoutes from './api/assets/assets.routes';

// Load API specifications
const apiSpec = path.join(path.resolve(), 'docs/reference/openapi.yml');
const swaggerDocument = YAML.load(apiSpec);

// Application setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health checker
const healthcheck = new health.HealthChecker();
const isReady = async (expressApp) => {
  if (!expressApp.isReady) { throw new Error('App in not running yet.'); }
  return 'Listening to requests';
};
const liveCheck = new health.LivenessCheck('LivenessCheck', () => isReady(app));
const readyCheck = new health.ReadinessCheck('ReadinessCheck', () => isReady(app));
healthcheck.registerLivenessCheck(liveCheck);
healthcheck.registerReadinessCheck(readyCheck);
app.use('/livez', health.LivenessEndpoint(healthcheck));
app.use('/readyz', health.ReadinessEndpoint(healthcheck));
// Expose swagger API documentation
app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs/specs.yml', (req, res) => { res.send(swaggerDocument); });

// express-openapi-validator setup to validate requests
app.use(OAV.middleware({
  apiSpec,
  validateRequests: {
    removeAdditional: 'all',
  },
  validateResponses: true,
  fileUploader: { storage: multer.memoryStorage() },
  ignoreUndocumented: true,
}));

// Authenticate currentUser
app.use(authenticate);

// Register api routes
app.use(structuresRoutes);
app.use(personsRoutes);
app.use(officialDocumentsRoutes);
app.use(legalCategoriesRoutes);
app.use(pricesRoutes);
app.use(termsRoutes);
app.use(documentsRoutes);
app.use(categoriesRoutes);

// Assets
app.use(assetsRoutes);

// Error handler
app.use(handleErrors);

export default app;
