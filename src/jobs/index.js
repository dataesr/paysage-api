import os from "os";
import { Agenda } from "agenda";
import config from "../config";
import logger from "../services/logger.service";
import { db } from "../services/mongo.service";
import askForEmailRevalidation from "./ask-for-email-validation";
import {
  sendAccountConfirmedEmail,
  sendAuthenticationEmail,
  sendContactEmail,
  sendNewUserNotificationEmail,
  sendPasswordRecoveryEmail,
  sendWelcomeEmail,
} from "./emails";
import reindex from "./indexer";
import updateKeyNumbers from "./key-numbers";
import {
  exportFrEsrAnnelisPaysageEtablissements,
  exportFrEsrPaysageFonctionsGourvernance,
  exportFrEsrPaysageLaureatAll,
  exportFrEsrPersonIdentifiers,
  exportFrEsrPrizes,
  exportFrEsrStructureIdentifiers,
  exportFrEsrStructureWebsites,
} from "./opendata";
import { monitorSiren, monitorSiret } from "./sirene";
import synchronizeAnnuaireCollection from "./synchronize/annuaire-collection";
import synchronizeCuriexploreActors from "./synchronize/curiexplore-actors";
import synchronizeFrEsrReferentielGeographique from "./synchronize/fr-esr-referentiel-geographique";
import deletePassedGouvernancePersonnalInformation from "./treatments/delete-passed-gouvernance-personal-infos";
import { setStructureStatus, setIdentifierStatus } from "./treatments/set-statuses";
import dedupLegalCategorySirene from "./dedup-legal-category-sirene";

const { taskName } = config.sirene;

const agenda = new Agenda()
  .mongo(db, "_jobs")
  .name(`worker-${os.hostname}-${process.pid}`)
  .processEvery("30 seconds");

agenda.define(
  "send user creation notification email",
  { shouldSaveResult: true },
  sendNewUserNotificationEmail,
);
agenda.define(
  "send welcome email",
  { shouldSaveResult: true },
  sendWelcomeEmail,
);
agenda.define(
  "send confirmed email",
  { shouldSaveResult: true },
  sendAccountConfirmedEmail,
);
agenda.define(
  "send signin email",
  { shouldSaveResult: true },
  sendAuthenticationEmail,
);
agenda.define(
  "send recovery email",
  { shouldSaveResult: true },
  sendPasswordRecoveryEmail,
);
agenda.define(
  "send contact email",
  { shouldSaveResult: true },
  sendContactEmail,
);
agenda.define(
  "update key numbers",
  {
    shouldSaveResult: true,
    lockLifetime: 1000 * 60 * 60 * 5,
  },
  updateKeyNumbers,
);
agenda.define("reindex", { shouldSaveResult: true }, reindex);
agenda.define(
  "export fr-esr-paysage_prix",
  { shouldSaveResult: true },
  exportFrEsrPrizes,
);
agenda.define(
  "export fr-esr-paysage_structures_identifiants",
  { shouldSaveResult: true },
  exportFrEsrStructureIdentifiers,
);
agenda.define(
  "export fr-esr-paysage_personnes_identifiants",
  { shouldSaveResult: true },
  exportFrEsrPersonIdentifiers,
);
agenda.define(
  "export fr-esr-paysage-fonctions-gourvernance",
  { shouldSaveResult: true },
  exportFrEsrPaysageFonctionsGourvernance,
);
agenda.define(
  "export fr-esr-annelis-paysage-etablissements",
  { shouldSaveResult: true },
  exportFrEsrAnnelisPaysageEtablissements,
);
agenda.define(
  "export fr-esr-paysage_structures_websites",
  { shouldSaveResult: true },
  exportFrEsrStructureWebsites,
);
agenda.define(
  "export fr_esr_paysage_laureat_all",
  { shouldSaveResult: true },
  exportFrEsrPaysageLaureatAll,
);
agenda.define(
  "synchronize fr-esr-referentiel-geographique",
  { shouldSaveResult: true },
  synchronizeFrEsrReferentielGeographique,
);
agenda.define(
  "synchronize curiexplore actors",
  { shouldSaveResult: true },
  synchronizeCuriexploreActors,
);
agenda.define(
  "ask for email revalidation with otp",
  { shouldSaveResult: true },
  askForEmailRevalidation,
);
agenda.define(
  "delete passed gouvernance personal info",
  { shouldSaveResult: true },
  deletePassedGouvernancePersonnalInformation,
);
agenda.define(
  "synchronize governance collection",
  { shouldSaveResult: true },
  synchronizeAnnuaireCollection,
);
agenda.define(
  "synchronize structures' status",
  { shouldSaveResult: true },
  setStructureStatus,
);
agenda.define(
  "synchronize identifiers' status",
  { shouldSaveResult: true },
  setIdentifierStatus,
);
agenda.define(
  "check de double catégories juridiques pour une unité légale",
  { shouldSaveResult: true },
  dedupLegalCategorySirene,
);
agenda.define(
  taskName,
  {
    shouldSaveResult: true,
    lockLifetime: 1000 * 60 * 60 * 2,
  },
  monitorSiren,
);
agenda.define(
  `${taskName}-etab`,
  {
    shouldSaveResult: true,
    lockLifetime: 1000 * 60 * 60 * 2,
  },
  monitorSiret,
);

agenda
  .on("ready", () => {
    logger.info("Agenda connected to mongodb");
  })
  .on("error", () => {
    logger.info("Agenda connexion to mongodb failed");
  });

agenda.on("complete", async (job) => {
  if (job.attrs?.type !== "single") return null;

  const keepFailureFields = job.attrs.failedAt &&
    job.attrs.failedAt === job.attrs.lastFinishedAt;

  const {
    _id,
    repeatInterval,
    repeatTimezone,
    skipDays,
    startDate,
    endDate,
    nextRunAt,
    failedAt,
    failReason,
    failCount,
    ...rest
  } = job.attrs;

  return db.collection("_jobs").insertOne({
    ...(keepFailureFields ? { failedAt, failReason, failCount } : {}),
    ...rest,
    type: "normal",
  });
});

async function graceful() {
  logger.info("Gracefully stopping agenda");
  await agenda.stop();
  process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

export default agenda;
