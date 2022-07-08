import Alert from './alert';
import { fetchXML, parseXML } from './xmls';

const KB_CRAWL_URL = 'http://kbc169.kbplatform.com/Exports/Mapper/';
const FILES = [
  `${KB_CRAWL_URL}DepAEF.xml`,
  `${KB_CRAWL_URL}DepAEF2.xml`,
  `${KB_CRAWL_URL}DepAEF3.xml`,
  `${KB_CRAWL_URL}DepAefArchives.xml`,
  `${KB_CRAWL_URL}DepAefArchives2.xml`,
  `${KB_CRAWL_URL}DepAefArchives3.xml`,
  `${KB_CRAWL_URL}News_tank.xml`,
  `${KB_CRAWL_URL}News_tank2.xml`,
  `${KB_CRAWL_URL}News_tank3.xml`,
  `${KB_CRAWL_URL}News_tank4.xml`,
  `${KB_CRAWL_URL}figaro_01.xml`,
  `${KB_CRAWL_URL}EducPro_00.xml`,
  `${KB_CRAWL_URL}educpros/personnalites.xml`,
  `${KB_CRAWL_URL}A_DGS.xml`,
];

/**
 * Processes all provided urls to return an array of Alert objects.
 * @param {array} urls - An array of urls to fetch xml data.
 * @return {object} An array of Alert objects.
 */
const getAllPressAlerts = async (urls) => {
  const parser = async (url) => {
    const xml = await fetchXML(url);
    const parsedXML = await parseXML(xml);
    const alerts = parsedXML.alert
      .map((alert) => new Alert(alert))
      .reduce((previous, current) => [...previous, current], []);
    return alerts;
  };
  const alertGroups = await Promise.all(urls.map(async (url) => parser(url)));
  return alertGroups.reduce((previous, current) => [...previous, ...current], []);
};

export const processAllAlerts = async () => {
  const alerts = await getAllPressAlerts(FILES);
  const uniqueAlerts = alerts.reduce((previous, current) => {
    if (previous.indexOf(current.data.alertId) === -1) return [...previous, current.data.alertId];
    // console.log(alerts.filter((alert) => alert.data.alertId === current.data.alertId));
    return previous;
  }, []);
  return { alertsCount: alerts.length, uniqueAlertsCount: uniqueAlerts.length };
};

export const processNewAlerts = async () => {
  const alerts = await getAllPressAlerts();
  return { alertsCount: alerts.length };
};
