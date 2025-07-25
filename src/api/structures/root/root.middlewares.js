import { client, db } from '../../../services/mongo.service';
import catalog from '../../commons/catalog';
import { BadRequestError, NotFoundError } from '../../commons/http-errors';
import readQuery from '../../commons/queries/structures.query';
import {
  categoriesRepository,
  identifiersRepository,
  legalcategoriesRepository,
  officialtextsRepository,
  relationshipsRepository,
  structuresRepository as repository,
  socialmediasRepository,
  weblinksRepository,
} from '../../commons/repositories';

export const validateStructureCreatePayload = async (req, res, next) => {
  const errors = [];
  const { categories: categoryIds, closureOfficialTextId, creationOfficialTextId, iso3, legalCategory } = req.body;
  if (creationOfficialTextId) {
    const text = await officialtextsRepository.get(creationOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.creationOfficialTextId', message: `Official text ${creationOfficialTextId} does not exist` }); }
  }
  if (closureOfficialTextId) {
    const text = await officialtextsRepository.get(closureOfficialTextId);
    if (!text?.id) { errors.push({ path: '.body.closureOfficialTextId', message: `Official text ${closureOfficialTextId} does not exist` }); }
  }
  if (legalCategory) {
    const legal = await legalcategoriesRepository.get(legalCategory);
    if (!legal?.id) { errors.push({ path: '.body.legalCategory', message: `Legal category ${creationOfficialTextId} does not exist` }); }
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
  if (iso3) {
    if (!iso3.toString().toUpperCase().match(/^[A-Z]{3}$/)) {
      errors.push({
        path: '.body.iso3',
        message: 'iso3 for structure should be 3 letters in uppercase',
      });
    }
  }
  if (errors.length) {
    throw new BadRequestError('Validation failed', errors);
  }
  return next();
};

export const fromPayloadToStructure = async (req, res, next) => {
  const payload = req.body;
  const structureId = req?.context?.id;
  const structure = {
    structureStatus: payload.structureStatus,
    creationDate: payload.creationDate,
    creationOfficialTextId: payload.creationOfficialTextId,
    closureOfficialTextId: payload.closureOfficialTextId,
    closureDate: payload.closureDate,
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: structureId,
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
    address: payload.address,
    cityId: payload.cityId,
    geometry: (payload?.coordinates?.lat && payload?.coordinates?.lng)
      ? { type: 'Point', coordinates: [payload.coordinates.lng, payload.coordinates.lat] } : null,
    country: payload.country,
    distributionStatement: payload.distributionStatement,
    iso3: payload?.iso3?.toString()?.toUpperCase(),
    locality: payload.locality,
    place: payload.place,
    phonenumber: payload.phonenumber,
    postalCode: payload.postalCode,
    postOfficeBoxNumber: payload.postOfficeBoxNumber,
  };
  if (Object.values(structureLocalisation).filter((value) => value).length) {
    structureLocalisation.createdAt = new Date();
    structureLocalisation.createdBy = req.currentUser.id;
    structureLocalisation.id = await catalog.getUniqueId('localisations', 15);
    structure.localisations = [structureLocalisation];
  }
  const categories = [];
  payload?.categories?.forEach(async (category) => categories.push({
    relatedObjectId: category,
    relationTag: 'structure-categorie',
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: await catalog.getUniqueId('relations', 15),
  }));
  const legalCategory = {
    relatedObjectId: payload.legalCategory,
    relationTag: 'structure-categorie-juridique',
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: await catalog.getUniqueId('relations', 15),
  };
  if (payload.parentId) {
    const parentStructure = {
      relatedObjectId: structureId,
      resourceId: payload.parentId,
      relationTag: 'structure-interne',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('relations', 15),
    };
    structure.parentStructure = parentStructure;
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
  const structureIdentifiers = [];
  if (payload.idref) {
    structureIdentifiers.push({
      value: payload.idref,
      type: 'idref',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.wikidata) {
    structureIdentifiers.push({
      value: payload.wikidata,
      type: 'wikidata',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.uai) {
    structureIdentifiers.push({
      value: payload.uai,
      type: 'uai',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.siret) {
    structureIdentifiers.push({
      value: payload.siret,
      type: 'siret',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.rnsr) {
    structureIdentifiers.push({
      value: payload.rnsr,
      type: 'rnsr',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.ed) {
    structureIdentifiers.push({
      value: payload.ed,
      type: 'ed',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.crunchbase) {
    structureIdentifiers.push({
      value: payload.crunchbase,
      type: 'crunchbase',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.dealroom) {
    structureIdentifiers.push({
      value: payload.dealroom,
      type: 'dealroom',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.ror) {
    structureIdentifiers.push({
      value: payload.ror,
      type: 'ror',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  const structureSocialMedias = [];
  if (payload.twitter) {
    structureSocialMedias.push({
      account: payload.twitter,
      type: 'Twitter',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('social-medias', 15),
    });
  }
  if (payload.linkedIn) {
    structureSocialMedias.push({
      account: payload.linkedIn,
      type: 'Linkedin',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('social-medias', 15),
    });
  }
  if (structureWebsites.length) {
    structure.websites = structureWebsites;
  }
  if (categories.length) {
    structure.categories = categories;
  }
  if (legalCategory?.id && legalCategory?.relatedObjectId) {
    structure.legalCategory = legalCategory;
  }
  if (structureSocialMedias.length) {
    structure.socials = structureSocialMedias;
  }
  if (structureIdentifiers.length) {
    structure.identifiers = structureIdentifiers;
  }
  req.body = structure;
  return next();
};

export const storeStructure = async (req, res, next) => {
  const {
    identifiers, socials, websites, categories, legalCategory, parentStructure, structureId, ...rest
  } = req.body;
  const { id: resourceId } = rest;
  const session = client.startSession();
  await session.withTransaction(async () => {
    await repository.create(rest);
    if (identifiers?.length) {
      await identifiers.forEach(async (identifier) => {
        await identifiersRepository.create({ ...identifier, resourceId });
      });
    }
    if (socials?.length) {
      await socials.forEach(async (social) => {
        await socialmediasRepository.create({ ...social, resourceId });
      });
    }
    if (websites?.length) {
      await websites.forEach(async (website) => {
        await weblinksRepository.create({ ...website, resourceId });
      });
    }
    if (parentStructure) {
      await relationshipsRepository.create({ ...parentStructure, structureId });
    }
    if (categories?.length) {
      await categories.forEach(async (category) => {
        await relationshipsRepository.create({ ...category, resourceId });
      });
    }
    if (legalCategory) {
      await relationshipsRepository.create({ ...legalCategory, resourceId });
    }
    await session.endSession();
  });
  return next();
};

export const createStructureResponse = async (req, res, next) => {
  const resource = await repository.get(req.body.id, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};

export const deleteStructure = async (req, res, next) => {
  const { id: resourceId } = req.params;
  const resource = await repository.get(resourceId);
  if (!resource?.id) throw new NotFoundError();
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('identifiers').deleteMany({ resourceId });
    await db.collection('socialmedias').deleteMany({ resourceId });
    await db.collection('weblinks').deleteMany({ resourceId });
    await db.collection('emails').deleteMany({ resourceId });
    await db.collection('relationships').deleteMany({ $or: [{ resourceId }, { relatedObjectId: resourceId }] });
    await db.collection('relationships').updateMany({ otherAssociatedObjectIds: resourceId }, { $pull: { otherAssociatedObjectIds: resourceId } });
    await db.collection('documents').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('followups').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('officialtexts').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('press').updateMany(
      { $or: [{ relatesTo: resourceId }, { matchedWith: resourceId }] },
      { $pull: { relatesTo: resourceId, matchedWith: resourceId } },
    );
    await db.collection('structures').deleteOne({ id: resourceId });
    await session.endSession();
  });
  res.status(204).json();
  return next();
};
