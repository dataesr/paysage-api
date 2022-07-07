// import path from 'path';
import express from 'express';
import 'express-async-errors';
import multer from 'multer';
import * as OAV from 'express-openapi-validator';
import health from '@cloudnative/health-connect';
import { handleErrors } from './commons/middlewares/handle-errors.middlewares';
import { authenticate } from './commons/middlewares/authenticate.middlewares';

import assetsRoutes from './assets/assets.routes';
import categoriesRoutes from './categories/categories.routes';
import documentsRoutes from './documents/documents.routes';
import documentTypesRoutes from './document-types/document-types.routes';
import emailTypesRoutes from './email-types/email-types.routes';
import legalCategoriesRoutes from './legalcategories/legalcategories.routes';
import officialTextsRoutes from './officialtexts/officialtexts.routes';
import personsRoutes from './persons/persons.routes';
import pricesRoutes from './prices/prices.routes';
import projectsRoutes from './projects/projects.routes';
import structuresRoutes from './structures/structures.routes';
import supervisingMinistersRoutes from './supervising-ministers/supervising-ministers.routes';
import termsRoutes from './terms/terms.routes';
import apiSpec from '../../docs/reference/api.json' assert { type: 'json' };

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
const { schemas } = apiSpec.components;
app.get('/docs/specs', (req, res) => { res.status(200).json(apiSpec); });
app.get('/docs/enums', (req, res) => {
  res.status(200).json(
    Object.fromEntries(Object.entries(schemas).filter(([key]) => key.match(/Enum$/))),
  );
});

// express-openapi-validator setup to validate requests
app.use(OAV.middleware({
  apiSpec,
  validateRequests: {
    removeAdditional: true,
  },
  validateResponses: true,
  fileUploader: { storage: multer.memoryStorage() },
  ignoreUndocumented: true,
}));

// Authenticate currentUser
app.use(authenticate);

// Register api routes
app.use(assetsRoutes);
app.use(categoriesRoutes);
app.use(documentsRoutes);
app.use(documentTypesRoutes);
app.use(emailTypesRoutes);
app.use(legalCategoriesRoutes);
app.use(officialTextsRoutes);
app.use(personsRoutes);
app.use(pricesRoutes);
app.use(projectsRoutes);
app.use(structuresRoutes);
app.use(supervisingMinistersRoutes);
app.use(termsRoutes);

// Error handler
app.use(handleErrors);

export default app;
