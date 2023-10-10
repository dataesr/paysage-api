import { client } from '../../../services/mongo.service';
import catalog from '../../commons/catalog';
import { BadRequestError, UnauthorizedError } from '../../commons/http-errors';
import readQuery from '../../commons/queries/prizes.query';
import {
  categoriesRepository,
  identifiersRepository,
  officialtextsRepository,
  prizesRepository as repository,
  relationshipsRepository,
  weblinksRepository,
} from '../../commons/repositories';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { categories: categoryIds, creationOfficialTextId, closureOfficialTextId } = req.body;
  if (creationOfficialTextId) {
    const text = await officialtextsRepository.get(creationOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.creationOfficialTextId', message: `official text ${creationOfficialTextId} does not exist` }); }
  }
  if (closureOfficialTextId) {
    const text = await officialtextsRepository.get(closureOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.closureOfficialTextId', message: `official text ${closureOfficialTextId} does not exist` }); }
  }
  if (categoryIds) {
    const { data: categoriesData } = await categoriesRepository.find({ filters: { id: { $in: categoryIds } } });
    const savedCategories = categoriesData.reduce((arr, parent) => [...arr, parent.id], []);
    const notFoundCategories = categoryIds.filter((x) => savedCategories.indexOf(x) === -1);
    if (notFoundCategories.length) {
      notFoundCategories.forEach((category, i) => (errors.push({
        path: `.body.categories[${i}]`,
        message: `Category '${category}' does not exist`,
      })));
    }
  }
  if (errors.length) throw new BadRequestError('Validation failed', errors);
  return next();
}

export const fromPayloadToPrizes = async (req, res, next) => {
  const payload = req.body;
  const prizeId = req?.context?.id;
  const prize = {
    nameFr: payload.nameFr,
    nameEn: payload.nameEn,
    descriptionFr: payload.descriptionFr,
    descriptionEn: payload.descriptionEn,
    parentIds: payload.parentIds,
    startDate: payload.startDate,
    endDate: payload.endDate,
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: prizeId,
  };

  const structures = [];
  payload?.structures?.forEach(async (structure) => structures.push({
    relatedObjectId: structure,
    relationTag: 'prix-porteur',
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: await catalog.getUniqueId('relations', 15),
  }));

  const categories = [];
  payload?.categories?.forEach(async (category) => categories.push({
    relatedObjectId: category,
    relationTag: 'prix-categorie',
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: await catalog.getUniqueId('relations', 15),
  }));

  const prizesWebsites = [];
  if (payload.websiteFr) {
    prizesWebsites.push({
      url: payload.websiteFr,
      type: 'website',
      language: 'fr',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  if (payload.websiteEn) {
    prizesWebsites.push({
      url: payload.websiteEn,
      type: 'website',
      language: 'en',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  const prizesIdentifiers = [];
  if (payload.wikidata) {
    prizesIdentifiers.push({
      value: payload.wikidata,
      type: 'wikidata',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (structures.length) {
    prize.structures = structures;
  }
  if (categories.length) {
    prize.categories = categories;
  }
  if (prizesIdentifiers.length) {
    prize.identifiers = prizesIdentifiers;
  }
  if (prizesWebsites.length) {
    prize.websites = prizesWebsites;
  }
  req.body = prize;
  return next();
};

export const storePrize = async (req, res, next) => {
  const { identifiers, websites, categories, structures, ...rest } = req.body;
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
    if (categories?.length) {
      await categories.forEach(async (category) => {
        await relationshipsRepository.create({ ...category, resourceId });
      });
    }
    if (structures?.length) {
      await structures.forEach(async (structure) => {
        await relationshipsRepository.create({ ...structure, resourceId });
      });
    }
    await session.endSession();
  });
  return next();
};

export const createPrizeResponse = async (req, res, next) => {
  const resource = await repository.get(req.body.id, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};

export async function canIDelete(req, res, next) {
  const resource = await repository.get(req.params.id, { useQuery: readQuery });
  if ((resource?.parents || []).length > 0) throw new UnauthorizedError();
  return next();
}
