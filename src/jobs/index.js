import { Agenda } from 'agenda';
import os from 'os';
import logger from '../services/logger.service';
import {
  sendAccountConfirmedEmail,
  sendAuthenticationEmail,
  sendContactEmail,
  sendPasswordRecoveryEmail,
  sendWelcomeEmail,
  sendNewUserNotificationEmail,
} from './emails';
import updateKeyNumbers from './key-numbers';
import reindex from './indexer';
import { db } from '../services/mongo.service';
import {
  exportFrEsrPaysageFonctionsGourvernance,
  exportFrEsrAnnelisPaysageEtablissements,
  exportFrEsrStructureIdentifiers,
  exportFrEsrPersonIdentifiers,
  exportFrEsrStructureWebsites,
} from './opendata';
import synchronizeAnnuaireCollection from './synchronize/annuaire-collection';
import synchronizeCuriexploreActors from './synchronize/curiexplore-actors';
import synchronizeFrEsrReferentielGeographique from './synchronize/fr-esr-referentiel-geographique';
import askForEmailRevalidation from './ask-for-email-validation';
import deletePassedGouvernancePersonnalInformation from './treatments/delete-passed-gouvernance-personal-infos';

const agenda = new Agenda()
  .mongo(db, '_jobs')
  .name(`worker-${os.hostname}-${process.pid}`)
  .processEvery('30 seconds');

agenda.define('send user creation notification email', { shouldSaveResult: true }, sendNewUserNotificationEmail);
agenda.define('send welcome email', { shouldSaveResult: true }, sendWelcomeEmail);
agenda.define('send confirmed email', { shouldSaveResult: true }, sendAccountConfirmedEmail);
agenda.define('send signin email', { shouldSaveResult: true }, sendAuthenticationEmail);
agenda.define('send recovery email', { shouldSaveResult: true }, sendPasswordRecoveryEmail);
agenda.define('send contact email', { shouldSaveResult: true }, sendContactEmail);
agenda.define('update key numbers', { shouldSaveResult: true }, updateKeyNumbers);
agenda.define('reindex', { shouldSaveResult: true }, reindex);
agenda.define('export fr-esr-paysage_structures_identifiants', { shouldSaveResult: true }, exportFrEsrStructureIdentifiers);
agenda.define('export fr-esr-paysage_personnes_identifiants', { shouldSaveResult: true }, exportFrEsrPersonIdentifiers);
agenda.define('export fr-esr-paysage-fonctions-gourvernance', { shouldSaveResult: true }, exportFrEsrPaysageFonctionsGourvernance);
agenda.define('export fr-esr-annelis-paysage-etablissements', { shouldSaveResult: true }, exportFrEsrAnnelisPaysageEtablissements);
agenda.define('export fr-esr-paysage_structures_websites', { shouldSaveResult: true }, exportFrEsrStructureWebsites);
agenda.define('synchronize fr-esr-referentiel-geographique', { shouldSaveResult: true }, synchronizeFrEsrReferentielGeographique);
agenda.define('synchronize curiexplore actors', { shouldSaveResult: true }, synchronizeCuriexploreActors);
agenda.define('ask for email revalidation with otp', { shouldSaveResult: true }, askForEmailRevalidation);
agenda.define('delete passed gouvernance personal info', { shouldSaveResult: true }, deletePassedGouvernancePersonnalInformation);
agenda.define('synchronize governance collection', { shouldSaveResult: true }, synchronizeAnnuaireCollection);

agenda
  .on('ready', () => { logger.info('Agenda connected to mongodb'); })
  .on('error', () => { logger.info('Agenda connexion to mongodb failed'); });

agenda.on('complete', async (job) => {
  if (job.attrs?.type !== 'single') return null;
  const {
    _id,
    repeatInterval,
    repeatTimezone,
    skipDays,
    startDate,
    endDate,
    nextRunAt,
    ...rest
  } = job.attrs;
  return db.collection('_jobs')
    .insertOne({
      ...rest,
      type: 'normal',
    });
});

async function graceful() {
  logger.info('Gracefully stopping agenda');
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

export default agenda;
