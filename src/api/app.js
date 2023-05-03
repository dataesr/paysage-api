import health from '@cloudnative/health-connect';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import * as OAV from 'express-openapi-validator';
import multer from 'multer';
import path from 'path';
import YAML from 'yamljs';
import { authenticate } from './commons/middlewares/authenticate.middlewares';
import { handleErrors } from './commons/middlewares/handle-errors.middlewares';

import apiKeysRoutes from './apikeys/apikeys.routes';
import assetsRoutes from './assets/assets.routes';
import authRoutes from './auth/auth.routes';
import categoriesRoutes from './categories/categories.routes';
import { forbidReadersToWrite, requireAuth } from './commons/middlewares/rbac.middlewares';
import contactRoutes from './contacts/contacts.routes';
import documentTypesRoutes from './document-types/document-types.routes';
import documentsRoutes from './documents/documents.routes';
import emailTypesRoutes from './email-types/email-types.routes';
import followUpsRoutes from './followups/followups.routes';
import usersGroupsRoutes from './groups/groups.routes';
import jobsRoutes from './jobs/jobs.routes';
import journalRoutes from './journal/journal.routes';
import legalCategoriesRoutes from './legalcategories/legalcategories.routes';
import meRoutes from './me/me.routes';
import metadataRoutes from './metadata/metadata.routes';
import officialTextsRoutes from './officialtexts/officialtexts.routes';
import opendataRoutes from './opendata/opendata.routes';
import personsRoutes from './persons/persons.routes';
import pressRoutes from './press/press.routes';
import prizesRoutes from './prizes/prizes.routes';
import projectsRoutes from './projects/projects.routes';
import relationsGroupsRoutes from './relations-groups/relations-groups.routes';
import relationsRoutes from './relations/relations.routes';
import relationTypesRoutes from './relationtypes/relationtypes.routes';
import searchRoutes from './search/search.routes';
import structuresRoutes from './structures/structures.routes';
import supervisingMinistersRoutes from './supervising-ministers/supervising-ministers.routes';
import termsRoutes from './terms/terms.routes';
import usersRoutes from './users/users.routes';

// Load API specifications
const apiSpec = path.join(path.resolve(), 'docs/reference/api.yml');
const apiDocument = YAML.load(apiSpec);

// Application setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
}

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
const { schemas } = apiDocument.components;
app.get('/docs/specs', (req, res) => { res.status(200).json(apiDocument); });
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

// Require authentication
app.use(requireAuth);
app.use(forbidReadersToWrite);

// Register api routes
app.use(apiKeysRoutes);
app.use(authRoutes);
app.use(assetsRoutes);
app.use(categoriesRoutes);
app.use(contactRoutes);
app.use(documentsRoutes);
app.use(documentTypesRoutes);
app.use(emailTypesRoutes);
app.use(followUpsRoutes);
app.use(journalRoutes);
app.use(jobsRoutes);
app.use(legalCategoriesRoutes);
app.use(meRoutes);
app.use(metadataRoutes);
app.use(officialTextsRoutes);
app.use(opendataRoutes);
app.use(personsRoutes);
app.use(pressRoutes);
app.use(prizesRoutes);
app.use(projectsRoutes);
app.use(relationsRoutes);
app.use(relationsGroupsRoutes);
app.use(relationTypesRoutes);
app.use(structuresRoutes);
app.use(searchRoutes);
app.use(supervisingMinistersRoutes);
app.use(termsRoutes);
app.use(usersRoutes);
app.use(usersGroupsRoutes);

// Error handler
app.use(handleErrors);

export default app;
