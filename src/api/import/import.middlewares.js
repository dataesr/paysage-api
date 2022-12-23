/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { parse } from 'csv-parse/sync';

import catalog from '../commons/catalog';
import { BadRequestError } from '../commons/http-errors';
import controllers from '../commons/middlewares/crud.middlewares';
import readQuery from '../commons/queries/structures.query';
import { structuresRepository as repository } from '../commons/repositories';

const CSV_DELIMITER = ';';
const statusMapping = {
  O: 'active',
  F: 'inactive',
  P: 'forthcoming',
};

const chunkArray = (array, chunkSize) => array.reduce((resultArray, item, index) => {
  const chunkIndex = Math.floor(index / chunkSize);
  if (!resultArray[chunkIndex]) {
    // eslint-disable-next-line no-param-reassign
    resultArray[chunkIndex] = [];
  }
  resultArray[chunkIndex].push(item);
  return resultArray;
}, []);

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseOptions = {
  delimiter: CSV_DELIMITER,
  trim: true,
  columns: true,
};

export async function bulkImportStructures(req, res, next) {
  const data = parse(req.files[0].buffer, parseOptions);
  const structures = [];
  const structureIds = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    const structure = {
      acronymEn: item['Nom court  en anglais :'],
      acronymFr: item['Sigle en français'],
      acronymLocal: item['Nom court officiel dans la langue originale'],
      closureDate: item['Date de fermeture {2020-07-02}'],
      creationDate: item['Date de création {2020-07-02}'],
      nameEn: item['Nom long en anglais :'],
      officialName: item['Nom officiel dans la langue originale'],
      otherNames: item['Autres dénominations possibles séparées par des ;'].split(';'),
      shortName: item['Nom court en français'],
      structureStatus: statusMapping[item['Statut [O = Ouvert, F = Fermé, P = Potentiel]']],
      usualName: item['Nom usuel en français'],
    };
    req.body = structure;
    const id = await catalog.getUniqueId('structures', 5);
    req.context = { ...req.context, id };
    structureIds.push(id);
    // It fails here because of the res.status of controllers.create
    structures.push(controllers.create(repository, readQuery)(req, res, next));
  }
  try {
    const chunkedData = chunkArray(structures, 100);
    for (let i = 0; i < chunkedData.length; i += 1) {
      await sleep(1000);
      await axios.all(chunkedData[i]).catch((err) => console.error('ERROR STRUCTURES', err?.response?.data));
    }
    console.log(`${structureIds.length} structures added.`);
  } catch (err) {
    console.error('Try catch error', err?.response?.data);
  }
  res.status(200).json({ message: "Merci pour l'envoi" });
  return next();
}

export async function validatePayload(req, res, next) {
  if (!req?.files || !req?.files?.[0] || !req?.files?.[0]?.size || req?.files?.[0]?.size === 0) {
    throw new BadRequestError(
      'Please, send a not empty file',
      [{
        path: '.files[0].size',
        message: 'Empty file',
      }],
    );
  }
  if (req?.files?.[0]?.mimetype !== 'text/csv') {
    throw new BadRequestError(
      'Please, send a CSV file',
      [{
        path: '.files[0].mimetype',
        message: 'Only CSV files are accepted',
      }],
    );
  }
  return next();
}
