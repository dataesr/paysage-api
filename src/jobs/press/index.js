import { Parser } from 'xml2js';
import Alert from './alert';

const KB_CRAWL_URL = 'http://kbc169.kbplatform.com/Exports/Mapper/';
const FILES = [
  `${KB_CRAWL_URL}DepAEF.xml`,
//   `${KB_CRAWL_URL}DepAEF2.xml`,
//   `${KB_CRAWL_URL}DepAEF3.xml`,
//   `${KB_CRAWL_URL}DepAefArchives.xml`,
//   `${KB_CRAWL_URL}DepAefArchives2.xml`,
//   `${KB_CRAWL_URL}DepAefArchives3.xml`,
];

const lowerFirstChar = (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}`;

const options = {
  explicitRoot: false,
  normalise: true,
  explicitArray: false,
  ignoreAttrs: true,
  trim: true,
  tagNameProcessors: [lowerFirstChar],
};

export const parser = new Parser({ ...options });

const fetchAlerts = async (url) => {
  const res = await fetch(url);
  const xml = await res.text();
  return xml;
};

const parseXMLAlerts = async (xml) => {
  let parsedAlert;
  parser.parseString(xml, (err, result) => {
    parsedAlert = result.alert.map((alert) => new Alert(alert));
  });
  return parsedAlert;
};

const alertFetcher = async (files) => {
  const alertPromises = await Promise.all(files.map(async (file) => {
    const xml = await fetchAlerts(file);
    const parsedAlerts = parseXMLAlerts(xml);
    return parsedAlerts;
  }));
  const alerts = [];
  alertPromises.forEach((alertGroup) => alertGroup.forEach((alert) => alerts.push(alert)));
  //   console.log(alerts[0]);
  return alerts;
};

alertFetcher(FILES);
