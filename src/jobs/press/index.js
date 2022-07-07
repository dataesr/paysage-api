import Alert from './alert';
import { fetchXML, parseXML } from './xmls';

const KB_CRAWL_URL = 'http://kbc169.kbplatform.com/Exports/Mapper/';
const FILES = [
  // `${KB_CRAWL_URL}DepAEF.xml`,
  // `${KB_CRAWL_URL}DepAEF2.xml`,
  // `${KB_CRAWL_URL}DepAEF3.xml`,
  // `${KB_CRAWL_URL}DepAefArchives.xml`,
  // `${KB_CRAWL_URL}DepAefArchives2.xml`,
  // `${KB_CRAWL_URL}DepAefArchives3.xml`,
  // `${KB_CRAWL_URL}News_tank.xml`,
  // `${KB_CRAWL_URL}News_tank2.xml`,
  // `${KB_CRAWL_URL}News_tank3.xml`,
  // `${KB_CRAWL_URL}News_tank4.xml`,
  // `${KB_CRAWL_URL}figaro_01.xml`,
  // `${KB_CRAWL_URL}EducPro_00.xml`,
  `${KB_CRAWL_URL}educpros/personnalites.xml`,
  // `${KB_CRAWL_URL}A_DGS.xml`,
];

const getAllPressAlerts = async () => {
  const alertGroups = await Promise
    .all(FILES.map(async (file) => {
      const xml = await fetchXML(file);
      const parsedXML = await parseXML(xml);
      const alerts = parsedXML.alert
        .map((alert) => new Alert(alert))
        .reduce((previous, current) => [...previous, current], []);
      return alerts;
    }));
  return alertGroups.reduce((previous, current) => [...previous, ...current], []);
};

export const processAllAlerts = async () => {
  console.log('Starting job');
  const alerts = await getAllPressAlerts();
  const uniqueAlerts = alerts.reduce((previous, current) => {
    if (previous.indexOf(current.data.id) === -1) return [...previous, current.data.id];
    return previous;
  }, []);
  console.log(uniqueAlerts, alerts.map((a) => a.data.id));
  console.log({ alertsCount: alerts.length, uniqueAlertsCount: uniqueAlerts.length });
  return { alertsCount: alerts.length, uniqueAlertsCount: uniqueAlerts.length };
};

export const processNewAlerts = async () => {
  const alerts = await getAllPressAlerts();
  console.log(alerts[0]);
  return { alertsCount: alerts.length };
};
