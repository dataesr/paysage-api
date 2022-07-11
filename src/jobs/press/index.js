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
 * Processes all provided urls to save new alerts in database.
 * @param {array} urls - An array of urls to fetch xml data.
 * @return {object} An array of Alert objects.
 */
export const processPressAlerts = async () => {
  const processPressAlertFile = async (url) => {
    const xml = await fetchXML(url);
    const parsedXML = await parseXML(xml);
    const alerts = parsedXML.alert
      .map(async (alert) => new Alert(alert).save());
    return alerts;
  };
  const alertGroups = await Promise.all(
    FILES.map(async (url) => processPressAlertFile(url)),
  );
  return alertGroups.reduce((previous, current) => [...previous, ...current], []);
};
