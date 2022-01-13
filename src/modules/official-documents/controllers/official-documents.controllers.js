import officialDocumentsServices from '../services/official-documents.service';

export default {
  create: async (req, res) => {
    const officialDocument = await officialDocumentsServices.create(req.body);
    res.status(201).json(officialDocument);
  },

  read: async (req, res) => {
    const officialDocument = await officialDocumentsServices.read(req.params.officialDocumentId);
    res.status(200).json(officialDocument);
  },

  update: async (req, res) => {
    const officialDocument = await officialDocumentsServices.update(req.params.officialDocumentId, req.body);
    res.status(200).json(officialDocument);
  },

  delete: async (req, res) => {
    const { officialDocumentId } = req.params;
    await officialDocumentsServices.delete(officialDocumentId);
    res.status(204).end();
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await officialDocumentsServices.list(filters, options);
    res.status(200).json({ data, totalCount });
  },

};
