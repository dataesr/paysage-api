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
  const id = url?.match(/\d{3,10}/)?.[0];
  const publicationDate = index.date
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  const lastCrawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    id: `${sourceName}-${id}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    lastCrawlDate,
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
  const url = alert.link;
  const id = index?.date?.match(/\d{3,10}/)?.[0];
  const parsedPublicationDate = index?.date
    ?.match(/\d{2}\/\d{2}\/\d{2,4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  const publicationDate = (parsedPublicationDate?.split('-')?.[2]?.length !== 4)
    ? `${parsedPublicationDate[0]}-${parsedPublicationDate[1]}-20${parsedPublicationDate[2]}`
    : parsedPublicationDate?.replaceAll('/', '-');
  const lastCrawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    id: `${sourceName}-${id}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    lastCrawlDate,
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
  const id = alert.link?.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/)?.[0];
  const publicationDate = index.auteur
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  const lastCrawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    id: `${sourceName}-${id}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    lastCrawlDate,
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
  const id = alert.link?.match(/https:\/\/www\.letudiant\.fr\/educpros\/actualite\/([A-Za-z0-9-_]+).html/)?.[1];
  const publicationDate = index?.auteur
    ?.match(/\d{2}.\d{2}.\d{4}/)
    ?.[0]
    ?.replaceAll('.', '-');
  const lastCrawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    id: `${sourceName}-${id}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    publicationDate,
    lastCrawlDate,
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
  const id = alert.link?.match(/https:\/\/www\.letudiant\.fr\/educpros\/personnalites\/([A-Za-z0-9-_]+).html/)?.[1];
  const lastCrawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    id: `${sourceName}-${id}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    lastCrawlDate,
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
  const id = alert.link?.match(/https:\/\/www\.a-dgs\.fr\/[A-Za-z0-9-_/]+\/([A-Za-z0-9-_]+).html/)?.[1];
  const lastCrawlDate = alert.crawlDate
    ?.match(/\d{2}\/\d{2}\/\d{4}/)
    ?.[0]
    ?.replaceAll('/', '-');
  return {
    id: `${sourceName}-${id}`,
    url,
    sourceName,
    title: index?.titre,
    summary: index?.intro,
    lastCrawlDate,
    text: index?.texte,
  };
};
