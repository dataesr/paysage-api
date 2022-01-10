import service from '../services';

export async function create(req, res) {
  const data = req.body;
  const { id: structureId } = await service.structure.create(data);
  const response = await service.structure.getById(structureId);
  res.status(201).json(response);
}

export async function getById(req, res) {
  const { structureId } = req.params;
  const response = await service.structure.getById(structureId);
  res.status(200).json(response);
}
