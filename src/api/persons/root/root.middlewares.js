import { client, db } from '../../../services/mongo.service';
import catalog from '../../commons/catalog';
import { BadRequestError, NotFoundError } from '../../commons/http-errors';
import readQuery from '../../commons/queries/persons.query';
import {
  categoriesRepository,
  identifiersRepository,
  personsRepository,
  relationshipsRepository,
  socialmediasRepository,
  weblinksRepository,
} from '../../commons/repositories';

export const validatePersonCreatePayload = async (req, res, next) => {
  const errors = [];
  const { categories: categoryIds } = req.body;
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
  if (errors.length) {
    throw new BadRequestError('Validation failed', errors);
  }
  return next();
};

export const fromPayloadToPerson = async (req, res, next) => {
  const payload = req.body;
  const personId = req?.context?.id;
  const person = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    birthDate: payload.birthDate,
    deathDate: payload.deathDate,
    activity: payload.activity,
    otherNames: payload.otherNames,
    gender: payload.gender,
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: personId,
  };

  const categories = [];
  payload?.categories?.forEach(async (category) => categories.push({
    relatedObjectId: category,
    relationTag: 'personne-categorie',
    createdBy: req.currentUser.id,
    createdAt: new Date(),
    id: await catalog.getUniqueId('relations', 15),
  }));
  const websites = [];
  if (payload.websiteFr) {
    websites.push({
      url: payload.websiteFr,
      type: 'website',
      language: 'fr',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  if (payload.websiteEn) {
    websites.push({
      url: payload.websiteEn,
      type: 'website',
      language: 'en',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('weblinks', 15),
    });
  }
  const identifiers = [];
  if (payload.idref) {
    identifiers.push({
      value: payload.idref,
      type: 'idref',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.researchgate) {
    identifiers.push({
      value: payload.researchgate,
      type: 'researchgate',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.wikidata) {
    identifiers.push({
      value: payload.wikidata,
      type: 'wikidata',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  if (payload.orcid) {
    identifiers.push({
      value: payload.orcid,
      type: 'orcid',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('identifiers', 15),
    });
  }
  const socialMedias = [];
  if (payload.twitter) {
    socialMedias.push({
      value: payload.twitter,
      type: 'Twitter',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('social-medias', 15),
    });
  }
  if (payload.linkedIn) {
    socialMedias.push({
      value: payload.linkedIn,
      type: 'Linkedin',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('social-medias', 15),
    });
  }
  if (payload.researchgate) {
    socialMedias.push({
      value: payload.researchgate,
      type: 'researchgate',
      createdBy: req.currentUser.id,
      createdAt: new Date(),
      id: await catalog.getUniqueId('social-medias', 15),
    });
  }
  if (websites.length) {
    person.websites = websites;
  }
  if (categories.length) {
    person.categories = categories;
  }
  if (socialMedias.length) {
    person.socials = socialMedias;
  }
  if (identifiers.length) {
    person.identifiers = identifiers;
  }
  req.body = person;
  return next();
};

export const storePerson = async (req, res, next) => {
  const {
    identifiers, socials, websites, categories, legalCategory, ...rest
  } = req.body;
  const { id: resourceId } = rest;
  const session = client.startSession();
  await session.withTransaction(async () => {
    await personsRepository.create(rest);
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
    if (categories?.length) {
      await categories.forEach(async (category) => {
        await relationshipsRepository.create({ ...category, resourceId });
      });
    }
    await session.endSession();
  });
  return next();
};

export const createPersonResponse = async (req, res, next) => {
  const resource = await personsRepository.get(req.body.id, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};

export const deletePerson = async (req, res, next) => {
  const { id: resourceId } = req.params;
  const resource = await personsRepository.get(resourceId);
  if (!resource?.id) throw new NotFoundError();
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('identifiers').deleteMany({ resourceId });
    await db.collection('socialmedias').deleteMany({ resourceId });
    await db.collection('weblinks').deleteMany({ resourceId });
    await db.collection('relationships').deleteMany({ $or: [{ resourceId }, { relatedObjectId: resourceId }] });
    await db.collection('relationships').updateMany({ otherAssociatedObjectIds: resourceId }, { $pull: { otherAssociatedObjectIds: resourceId } });
    await db.collection('documents').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('followups').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('officialtexts').updateMany({ relatesTo: resourceId }, { $pull: { relatesTo: resourceId } });
    await db.collection('press').updateMany(
      { $or: [{ relatesTo: resourceId }, { matchedWith: resourceId }] },
      { $pull: { relatesTo: resourceId, matchedWith: resourceId } },
    );
    await db.collection('persons').deleteOne({ id: resourceId });
    await session.endSession();
  });
  res.status(204).json();
  return next();
};
