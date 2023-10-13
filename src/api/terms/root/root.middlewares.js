import { client } from '../../../services/mongo.service';
import { BadRequestError, UnauthorizedError } from '../../commons/http-errors';
import readQuery from '../../commons/queries/terms.query';
import catalog from '../../commons/catalog';
import { identifiersRepository, officialtextsRepository, termsRepository as repository, weblinksRepository } from '../../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { creationOfficialTextId, closureOfficialTextId } = req.body;
  if (creationOfficialTextId) {
    const text = await officialtextsRepository.get(creationOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.creationOfficialTextId', message: `official text ${creationOfficialTextId} does not exist` }); }
  }
  if (closureOfficialTextId) {
    const text = await officialtextsRepository.get(closureOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.closureOfficialTextId', message: `official text ${closureOfficialTextId} does not exist` }); }
  }
  if (errors.length) throw new BadRequestError('Validation failed', errors);
  return next();
}

export const fromPayloadToTerms = async (req, res, next) => {
  const payload = req.body;
  const termsId = req?.context?.id;
  const terms = {
    usualNameFr: payload.usualNameFr,
    usualNameEn: payload.usualNameEn,
    shortNameEn: payload.shortNameEn,
    shortNameFr: payload.shortNameFr,
    acronymFr: payload.acronymFr,
    pluralNameFr: payload.pluralNameFr,
    otherNamesFr: payload.otherNamesFr,
    otherNamesEn: payload.otherNamesEn,
    descriptionFr: payload.descriptionFr,
    descriptionEn: payload.descriptionEn,
    priority: payload.priority,
    creationOfficialTextId: payload.creationOfficialTextId,
    closureOfficialTextId: payload.closureOfficialTextId,
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: termsId,
  };

  const termsWebsites = [];
  if (payload.websiteFr) {
    termsWebsites.push({
      url: payload.websiteFr,
      type: 'website',
      language: 'fr',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }

  if (payload.websiteEn) {
    termsWebsites.push({
      url: payload.websiteEn,
      type: 'website',
      language: 'en',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }

  const termsIdentifiers = [];
  if (payload.wikidata) {
    termsIdentifiers.push({
      value: payload.wikidata,
      type: 'wikidata',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
   if (payload.rncp) {
    termsIdentifiers.push({
      value: payload.rncp,
      type: 'rncp',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }

  if (termsIdentifiers.length) {
    terms.identifiers = termsIdentifiers;
  }
  if (termsWebsites.length) {
    terms.websites = termsWebsites;
  }

  req.body = terms;
  return next();
};


export const storeTerms = async (req, res, next) => {
  const { identifiers, websites, ...rest } = req.body;
  const { id: resourceId } = rest;
  const session = client.startSession();
  await session.withTransaction(async () => {
    await repository.create(rest);
    if (identifiers?.length) {
      await identifiers.forEach(async (identifier) => {
        await identifiersRepository.create({ ...identifier, resourceId });
      });
    }
    if (websites?.length) {
      await websites.forEach(async (website) => {
        await weblinksRepository.create({ ...website, resourceId });
      });
    }
    await session.endSession();
  });
  return next();
};

export const createTermsResponse = async (req, res, next) => {
  const resource = await repository.get(req.body.id, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};


export function setDefaultPriorityField(req, res, next) {
  if (!req.body.priority) {
    req.body.priority = 99;
  }
  return next();
}

export const canIDelete = async (req, res, next) => {
  const resource = await repository.get(req.params.id, { useQuery: readQuery });
  if (
    (resource?.creationOfficialText?.id || false)
    || (resource?.closureOfficialText?.id || false)
  ) throw new UnauthorizedError();
  return next();
};
