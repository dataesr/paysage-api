import { identifiersRepository } from '../../commons/repositories';

export const validateStructureIdentifierCreatePayload = async (req, res, next) => {
  const { type, value } = req.body;
  const { resourceId } = req.params;
  const check = await identifiersRepository.findOne({ resourceId, type, value });
  return check ? res.status(204).json() : next();
};
