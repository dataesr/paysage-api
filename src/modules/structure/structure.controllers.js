import structureServices from './structure.services';
import { NotFoundError } from '../commons/errors';

export default {
  getAll: async (req, res, next) => {
    try {
      const structures = await structureServices.find();
      res.status(200).send({ structures });
    } catch (error) {
      error.msg = 'failed to retrieve structures';
      next(error);
    }
  },

  add: async (req, res, next) => {
    try {
      const structure = await structureServices.save(req.body);
      res.status(200).send({ message: 'Structure Added', structure });
    } catch (error) {
      error.msg = 'failed to create post';
      next(error);
    }
  },

  updateOne: async (req, res, next) => {
    try {
      const structure = await structureServices.updateOne(req.params.id, req.body);
      res.status(200).send({ message: 'Structure Description updated', structure });
    } catch (error) {
      error.msg = 'failed to create post';
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const structure = await structureServices.findOne(req.params.id);

      if (!structure) throw new NotFoundError();

      res.status(200).send({ structure });
    } catch (error) {
      error.msg = 'failed to retrieve structure';
      next(error);
    }
  },

};
