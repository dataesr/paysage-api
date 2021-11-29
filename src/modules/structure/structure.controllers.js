import structureServices from './structure.services';
import { BadRequestError } from '../commons/errors';
import CustomError from '../commons/errors/custom.error';

export default {
  getAll: async (req, res, next) => {
    try {
      const structures = await structureServices.find();
      res.status(200).send({ structures });
    } catch (error) {
      next(error);
      throw new CustomError(error.msg);
    }
  },

  deleteAll: async (req, res, next) => {
    try {
      const structures = await structureServices.delete();
      res.status(200).send({ structures });
    } catch (error) {
      next(error);
      throw new CustomError(error.msg);
    }
  },

  addOne: async (req, res, next) => {
    try {
      const structure = await structureServices.save(req.body);
      res.status(200).send({ structure });
    } catch (error) {
      next(error);
      throw new CustomError(error.msg);
    }
  },

  getById: async (req, res, next) => {
    try {
      const structure = await structureServices.findOne(req.params.id);
      res.status(200).send({ structure });
    } catch (error) {
      next(error);
      throw new CustomError(error.msg);
    }
  },

  updateDescription: async (req, res, next) => {
    if (!req.body.descriptionFr) {
      throw new BadRequestError('descriptionFr is missing');
    }
    try {
      const structure = await structureServices.update(req.params.id, { descriptionFr: req.body.descriptionFr });
      res.status(200).send({ structure });
    } catch (error) {
      next(error);
      throw new CustomError(error.msg);
    }
  },

  getDescription: async (req, res, next) => {
    try {
      const structure = await structureServices.findOne(req.params.id, { descriptionFr: 1 });
      res.status(200).send({ structure });
    } catch (error) {
      next(error);
      throw new CustomError(error.msg);
    }
  },

};
