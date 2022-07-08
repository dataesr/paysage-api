/**
 * A parser for AEF alerts.
 * @param {object} alert - The row json alert.
 * @return {object} The parsed json alert
 */
export const parseAef = (alert) => {
  const sourceName = 'AEF';
  const { mapperValuesMailer, mapperValues } = alert;
  const index = mapperValuesMailer?.index || mapperValues?.index;
  const url = alert.link?.match(/https:\/\/www.aefinfo.fr\/depeche\/\d{1,10}/)?.[0];
  const alertId = url?.match(/\d{3,10}/)?.[0];
  const publicationDate = index.date
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  const crawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    alertId: `${sourceName}-${alertId}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    crawlDate,
  };
};

/**
 * A parser for NewsTank alerts.
 * @param {object} alert - The row json alert.
 * @return {object} The parsed json alert
 */
export const parseNewsTank = (alert) => {
  const sourceName = 'NewsTank';
  const { mapperValuesMailer, mapperValues } = alert;
  const index = mapperValuesMailer?.index || mapperValues?.index;
  const url = index.lien;
  const alertId = index?.date?.match(/\d{3,10}/)?.[0];
  const correctPublicationDate = index?.date
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  const wrongPublicationDate = index?.date
    ?.match(/\d{2}\/\d{2}\/\d{2}/)
    ?.[0]
    ?.split('/');
  const publicationDate = correctPublicationDate || `${wrongPublicationDate[0]}-${wrongPublicationDate[1]}-20${wrongPublicationDate[2]}`;
  const crawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    alertId: `${sourceName}-${alertId}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    crawlDate,
  };
};

/**
 * A parser for LeFigaro alerts.
 * @param {object} alert - The row json alert.
 * @return {object} The parsed json alert
 */
export const parseFigaro = (alert) => {
  const sourceName = 'LeFigaro';
  const { mapperValuesMailer, mapperValues } = alert;
  const index = mapperValuesMailer?.index || mapperValues?.index;
  const url = alert.link?.match(/https:\/\/etudiant\.lefigaro\.fr\/article\/[A-Za-z0-9-_]+\//)?.[0];
  const alertId = alert.link?.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/)?.[0];
  const publicationDate = index.auteur
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  const crawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    alertId: `${sourceName}-${alertId}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    crawlDate,
  };
};

/**
 * A parser for EducPro alerts.
 * @param {object} alert - The row json alert.
 * @return {object} The parsed json alert
 */
export const parseEducPro = (alert) => {
  const sourceName = 'EducPro';
  const { mapperValuesMailer, mapperValues } = alert;
  const index = mapperValuesMailer?.index || mapperValues?.index;
  const url = alert.link?.match(/https:\/\/www\.letudiant\.fr\/educpros\/actualite\/([A-Za-z0-9-_]+).html/)?.[0];
  const alertId = alert.link?.match(/https:\/\/www\.letudiant\.fr\/educpros\/actualite\/([A-Za-z0-9-_]+).html/)?.[1];
  const publicationDate = index?.auteur
    ?.match(/\d{2}.\d{2}.\d{4}/)
    ?.[0]
    ?.replaceAll('.', '-');
  const crawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    alertId: `${sourceName}-${alertId}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    crawlDate,
    text: index?.texte,
  };
};

/**
 * A parser for EducProPersonalites alerts.
 * @param {object} alert - The row json alert.
 * @return {object} The parsed json alert
 */
export const parseEducProPersonalites = (alert) => {
  const sourceName = 'EducProPersonalités';
  const { mapperValuesMailer, mapperValues } = alert;
  const index = mapperValuesMailer?.index || mapperValues?.index;
  const url = alert.link?.match(/https:\/\/www\.letudiant\.fr\/educpros\/personnalites\/([A-Za-z0-9-_]+).html/)?.[0];
  const alertId = alert.link?.match(/https:\/\/www\.letudiant\.fr\/educpros\/personnalites\/([A-Za-z0-9-_]+).html/)?.[1];
  const crawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    alertId: `${sourceName}-${alertId}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    crawlDate,
    text: index?.texte,
  };
};

/**
 * A parser for ADGS alerts.
 * @param {object} alert - The row json alert.
 * @return {object} The parsed json alert
 */
export const parseADGS = (alert) => {
  const sourceName = 'A-DGS';
  const { mapperValuesMailer, mapperValues } = alert;
  const index = mapperValuesMailer?.index || mapperValues?.index;
  const url = alert.link?.match(/https:\/\/www\.a-dgs\.fr\/[A-Za-z0-9-_/]+\/([A-Za-z0-9-_]+).html/)?.[0];
  const alertId = alert.link?.match(/https:\/\/www\.a-dgs\.fr\/[A-Za-z0-9-_/]+\/([A-Za-z0-9-_]+).html/)?.[1];
  const crawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    alertId: `${sourceName}-${alertId}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    crawlDate,
    text: index?.texte,
  };
};
