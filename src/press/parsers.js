import { Parser } from 'xml2js';
import { lowerFirstChar, parseCrawlDate, parseAefDate, } from './processors';

const options = {
  explicitRoot: false,
  normalise: true,
  explicitArray: false,
  ignoreAttrs: true,
  trim: true,
  tagNameProcessors: [lowerFirstChar],
}

export const aefParser = new Parser({
  ...options,  valueProcessors: [parseCrawlDate, parseAefDate],
})
export const newsTankParser = new Parser({
  ...options,  valueProcessors: [parseCrawlDate, parseAefDate],
})
export const figaroParser = new Parser({
  ...options,  valueProcessors: [parseCrawlDate, parseAefDate],
})
export const educProParser = new Parser({
  ...options,  valueProcessors: [parseCrawlDate, parseAefDate],
})
export const adgsParser = new Parser({
  ...options,  valueProcessors: [parseCrawlDate, parseAefDate],
})