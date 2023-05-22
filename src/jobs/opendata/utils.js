function getComparableNow() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function formatDateToString(date) { return date.toJSON().replace('T', ' ').split('.')?.[0]; }

export function isFinished(relation) {
  return ((relation.current !== undefined) && !relation.current) || (relation.active === false) || (relation.endDate < getComparableNow());
}

export function addInterim(input, interim) {
  if (!input) return null;
  if (interim) return `${input} par intérim`;
  return input;
}

export function getCivility(gender) {
  switch (gender) {
    case 'Homme':
      return 'Monsieur';
    case 'Femme':
      return 'Madame';
    default:
      return null;
  }
}

export function getCivilityArticle(gender) {
  switch (gender) {
    case 'Homme':
      return 'le ';
    case 'Femme':
      return 'la ';
    default:
      return null;
  }
}
export function getRelationTypeLabel(gender = null) {
  switch (gender) {
    case 'Femme':
      return 'feminineName';
    case 'Homme':
      return 'maleName';
    default:
      return 'name';
  }
}

export function getCivilityAddress(relation, relationType, person) {
  const annuaire = relation.mandatePrecision || relationType?.[getRelationTypeLabel(person.gender)];
  if (!annuaire) return '';
  const interim = relation.mandateTemporary ? ' par interim' : '';
  if (!['Homme', 'Femme'].includes(person.gender)) return `${annuaire}${interim}`;
  let article = getCivilityArticle(person.gender);
  const civility = getCivility(person.gender);
  if (['a', 'e', 'i', 'o', 'u', 'y'].includes(annuaire[0].toLowerCase())) { article = "l'"; }
  return `${civility} ${article}${annuaire}${interim}`;
}
