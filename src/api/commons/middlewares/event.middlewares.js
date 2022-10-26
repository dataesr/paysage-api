import config from '../../../config';
import { eventsRepository } from '../repositories';
import esClient from '../../../services/elastic.service';

const { index } = config.elastic;

const getDescriptionByType = (type, resource) => {
  const texts = [];
  texts.push(resource?.name);
  if (type === 'structures') {
    // Structures : Nom usuel + sigle ou nom court - Catégorie principale - Localisation - date de création
    texts.push(resource?.acronym);
    texts.push(resource?.locality?.join(' '));
    texts.push(resource?.creationDate);
  } else if (type === 'persons') {
    // Personnes : Prénom, nom - dernier mandat renseigné ou activité récupérée de wikidata - structure associée au mandat
  } else if (type === 'categories' || type === 'terms') {
    // Catégories & termes : Nom usuel
  } else if (type === 'official-texts') {
    // Textes officiels : Libellé du texte officiel - structures associées
  } else if (type === 'projects') {
    // Projet : Nom usuel + sigle ou nom court du projet - Catégorie principale - Localisation - Date de début
    texts.push(resource?.acronym);
    texts.push(resource?.startDate);
  }
  return texts.filter((item) => ![null, ''].includes(item)).join(' - ');
};

export function saveInElastic(repository, useQuery, resourceName) {
  return async (req, res, next) => {
    const { body, params } = req || {};
    const id = params?.resourceId || params?.id || body?.id || req.context.id || undefined;
    await esClient.deleteByQuery({
      index,
      body: { query: { bool: { must: [{ match: { id } }, { term: { type: resourceName } }] } } },
      refresh: true,
      conflicts: 'proceed',
    });
    const resource = await repository.get(id, { useQuery, keepDeleted: true });
    let fields = [];
    for (let i = 0; i < resource?.toindex?.length || 0; i += 1) {
      fields = fields.concat(Object.values(resource.toindex[i]).flat().filter((n) => n));
    }
    fields = [...new Set(fields)];
    const action = {
      search: fields.join(' '),
      type: resourceName,
      id,
      acronym: resource?.acronym,
      isDeleted: resource?.isDeleted || false,
      name: resource?.name,
      description: getDescriptionByType(resourceName, resource),
    };
    if (resourceName === 'structures') {
      action.creationDate = resource?.creationDate;
      action.locality = resource?.locality?.[0];
    }
    const actions = [{
      index: { _index: index },
    }, action];
    await esClient.bulk({ refresh: true, body: actions });
    return next();
  };
}

export function saveInStore(collection) {
  return async (req, res, next) => {
    const { context, event, path } = req;
    if (event) {
      const { user } = context || {};
      const nextState = event?.nextState || {};
      const previousState = event?.previousState || {};
      const eventToStore = { ...event, ...{ actor: user, collection, nextState, previousState, resource: path } };
      eventsRepository.create(eventToStore);
    }
    return next();
  };
}
