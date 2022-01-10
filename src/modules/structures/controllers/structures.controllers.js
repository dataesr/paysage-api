import structuresService from '../services';

export async function createStructure(req, res) {
  const data = req.body;
  const { id } = await structuresService.createStructure(data);
  const structure = await structuresService.getStructureById(id);
  res.status(201).json(structure);
}

export async function getStructureById(req, res) {
  const { structureId } = req.params;
  const structure = await structuresService.getStructureById(structureId);
  res.status(200).json(structure);
}
