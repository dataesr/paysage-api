import { BadRequestError } from '../../commons/http-errors';
import catalog from '../../commons/catalog';
import readQuery from '../../commons/queries/structures.query';
import {
  categoriesRepository,
  identifiersRepository,
  officialtextsRepository,
  structuresRepository,
} from '../../commons/repositories';
import { client } from '../../../services/mongo.service';

export const validateStructureCreatePayload = async (req, res, next) => {
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
  const { categories: categoryIds, parents: parentIds } = req.body;
  if (parentIds) {
    const { data: structuresData } = await structuresRepository.find({ filters: { id: { $in: parentIds } } });
    const savedParents = structuresData.reduce((arr, parent) => [...arr, parent.id], []);
    const notFoundParent = parentIds.filter((x) => savedParents.indexOf(x) === -1);
    if (notFoundParent.length) {
      notFoundParent.forEach((parent, i) => (errors.push({
        path: `.body.parents[${i}]`,
        message: `parent '${parent}' does not exist`,
      })));
    }
  }
  if (categoryIds) {
    const { data: categoriesData } = await categoriesRepository.find({ filters: { id: { $in: categoryIds } } });
    const savedCategories = categoriesData.reduce((arr, parent) => [...arr, parent.id], []);
    const notFoundCategories = categoryIds.filter((x) => savedCategories.indexOf(x) === -1);
    if (notFoundCategories.length) {
      notFoundCategories.forEach((category, i) => (errors.push({
        path: `.body.categories[${i}]`,
        message: `category '${category}' does not exist`,
      })));
    }
  }
  if (errors.length) {
    throw new BadRequestError('Validation failed', errors);
  }
  return next();
};

export const fromPayloadToStructure = async (req, res, next) => {
  const payload = req.body;
  const structure = {
    structureStatus: payload.structureStatus,
    creationDate: payload.creationDate,
    closureDate: payload.closureDate,
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: await catalog.getUniqueId('structures', 5),
  };
  const structureName = {
    officialName: payload.officialName,
    usualName: payload.usualName,
    shortName: payload.shortName,
    brandName: payload.brandName,
    nameEn: payload.nameEn,
    acronymFr: payload.acronymFr,
    acronymEn: payload.acronymEn,
    acronymLocal: payload.acronymLocal,
    otherNames: payload.otherNames,
    article: payload.article,
  };
  if (Object.values(structureName).filter((value) => value).length) {
    structureName.createdBy = req.currentUser.id;
    structureName.createdAt = new Date();
    structureName.id = await catalog.getUniqueId('names', 15);
    structure.names = [structureName];
  }
  const structureLocalisation = {
    cityId: payload.cityId,
    distributionStatement: payload.distributionStatement,
    address: payload.address,
    postOfficeBoxNumber: payload.postOfficeBoxNumber,
    postalCode: payload.postalCode,
    locality: payload.locality,
    place: payload.place,
    country: payload.country,
    telephone: payload.telephone,
    coordinates: payload.coordinates,
  };
  if (Object.values(structureLocalisation).filter((value) => value).length) {
    structureLocalisation.createdBy = req.currentUser.id;
    structureLocalisation.createdAt = new Date();
    structureLocalisation.id = await catalog.getUniqueId('localisations', 15);
    structure.localisations = [structureLocalisation];
  }
  const structureWebsites = [];
  if (payload.websiteFr) {
    structureWebsites.push({
      url: payload.websiteFr,
      type: 'website',
      language: 'fr',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  if (payload.websiteEn) {
    structureWebsites.push({
      url: payload.websiteEn,
      type: 'website',
      language: 'en',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  const structureParents = [];
  const structureIdentifiers = [];
  if (payload.idref) {
    structureIdentifiers.push({
      value: payload.idref,
      type: 'idRef',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  if (payload.wikidata) {
    structureIdentifiers.push({
      value: payload.wikidata,
      type: 'Wikidata',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  if (payload.uai) {
    structureIdentifiers.push({
      value: payload.uai,
      type: 'UAI',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.siret) {
    structureIdentifiers.push({
      value: payload.siret,
      type: 'Siret',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.rnsr) {
    structureIdentifiers.push({
      value: payload.rnsr,
      type: 'Répertoire National des Sructures de Recherche (RNSR)',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.ed) {
    structureIdentifiers.push({
      value: payload.ed,
      type: "Numéro d'ED",
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.ror) {
    structureIdentifiers.push({
      value: payload.ror,
      type: 'ROR',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  const structureSocialMedias = [];
  if (payload.twitter) {
    structureSocialMedias.push({
      value: payload.twitter,
      type: 'twitter',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('social-medias', 15),
    });
  }
  if (payload.linkedIn) {
    structureSocialMedias.push({
      value: payload.linkedIn,
      type: 'linkedIn',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('social-medias', 15),
    });
  }
  const structureCategories = [];
  if (structureWebsites.length) {
    structure.websites = structureWebsites;
  }
  if (structureSocialMedias.length) {
    structure.socials = structureSocialMedias;
  }
  if (structureIdentifiers.length) {
    structure.identifiers = structureIdentifiers;
  }
  if (structureCategories.length) {
    structure.categories = structureCategories;
  }
  if (structureParents.length) {
    structure.parents = structureParents;
  }
  req.body = structure;
  return next();
};

export const storeStructure = async (req, res, next) => {
  const { identifiers, ...rest } = req.body;
  const { id: resourceId } = rest;
  const session = client.startSession();
  await session.withTransaction(async () => {
    await structuresRepository.create(rest);
    if (identifiers?.length) {
      await identifiers.forEach(async (identifier) => {
        await identifiersRepository.create({ ...identifier, resourceId });
      });
    }
    await session.endSession();
  });
  return next();
};

export const createStructureResponse = async (req, res, next) => {
  const resource = await structuresRepository.get(req.body.id, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};
