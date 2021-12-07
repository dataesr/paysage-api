import categoryServices from '../services/categories.service';

export default {
  create: async (req, res) => {
    const category = await categoryServices.create(req.body);
    res.status(201).json(category);
  },

  read: async (req, res) => {
    const category = await categoryServices.read(req.params.categoryId);
    res.status(200).json(category);
  },

  update: async (req, res) => {
    const category = await categoryServices.update(req.params.categoryId, req.body);
    res.status(200).json(category);
  },

  delete: async (req, res) => {
    const { categoryId } = req.params;
    await categoryServices.delete(categoryId);
    res.status(204).end();
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await categoryServices.list(filters, options);
    res.status(200).json({ data, totalCount });
  },

};
