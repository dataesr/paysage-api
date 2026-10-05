export const MANDATE_STATES = {
  active: 'Actif',
  future: 'Futur',
  past: 'Passé',
};

export default function getMandateState(relation, now = new Date()) {
  const startDate = new Date(relation.startDate);
  const endDate = new Date(relation.endDate);
  let state;
  if (!relation.startDate && !relation.endDate) state = MANDATE_STATES.active;
  if (relation.startDate && startDate > now) state = MANDATE_STATES.future;
  if (relation.startDate && startDate <= now) state = MANDATE_STATES.active;
  if (relation.endDate && endDate < now) state = MANDATE_STATES.past;
  if (relation.active === false) state = MANDATE_STATES.past;
  return state;
}
