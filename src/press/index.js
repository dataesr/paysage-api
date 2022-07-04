import Alert from './alert';
import { aefParser } from './parsers';

const KB_CRAWL_URL = 'http://kbc169.kbplatform.com/Exports/Mapper/'
const files = [
    { url: `${KB_CRAWL_URL}DepAEF.xml`, parser: aefParser },
    // { url: `${KB_CRAWL_URL}DepAEF2.xml`, parser: aefParser },
    // { url: `${KB_CRAWL_URL}DepAEF3.xml`, parser: aefParser },
    // { url: `${KB_CRAWL_URL}DepAefArchives.xml`, parser: aefParser },
    // { url: `${KB_CRAWL_URL}DepAefArchives2.xml`, parser: aefParser },
    // { url: `${KB_CRAWL_URL}DepAefArchives3.xml`, parser: aefParser },
]

const fetchAlerts = async (url) => {
    const res = await fetch(url);
    const xml = await res.text();
    return xml;
}

const parseXMLAlerts = async (xml, parser) => {
    let parsedAlert;
    parser.parseString(xml, (err, result) => {
        parsedAlert = result.alert.map((alert) => new Alert(alert));
    });
    return parsedAlert;
}


const alertFetcher = async (files) => {
    const alertPromises = await Promise.all(files.map(async (file) => {
        const { url, parser } = file;
        const xml = await fetchAlerts(url)
        const parsedAlerts = parseXMLAlerts(xml, parser)
        return parsedAlerts;
    }))
    const alerts = []
    alertPromises.forEach((alertGroup) => alertGroup.forEach(alert => alerts.push(alert)))
    console.log(alerts[0]);
    return alerts;
};

alertFetcher(files);