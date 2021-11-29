import usersService from '../services/users.service';
import { NotFoundError } from '../../commons/errors';

export default {
  getUser: async (req, res) => {
    const { id } = req.params;
    const user = await usersService.readById(id);
    if (!user) throw new NotFoundError();
    res.status(200).json(user);
  },

  createUser: async (req, res) => {
    const data = req.body;
    const user = await usersService.create(data);
    res.status(200).json(user);
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    await usersService.deleteById(id);
    res.status(204).json({});
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const user = await usersService.updateById(id, data);
    res.status(200).json(user);
  },

  listUsers: async (req, res) => {
    const { filters, skip, limit, sort } = req.query;
    const user = await usersService.find(filters, null, limit, skip, sort);
    res.status(200).json(user);
  },

};
