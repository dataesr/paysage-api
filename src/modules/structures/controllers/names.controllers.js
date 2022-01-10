import structuresService from '../services';

async function getById(req, res) {
  const { structureId, nameId } = req.params;
  const name = await structuresService.getStructureNameById(structureId, nameId);
  res.status(200).json(name);
}

async function create(req, res) {
  const data = req.body;
  const { structureId } = req.params;
  const { id: nameId } = await structuresService.addName(structureId, data);
  const structure = await structuresService.getStructureNameById(structureId, nameId);
  res.status(201).json(structure);
}

// export async function listStructureNames(req, res) {
//   const { structureId, nameId } = req.params;
//   const name = await structuresService.getStructureNameById(structureId, nameId);
//   res.status(200).json(name);
// }
