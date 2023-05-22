import { db } from '../../services/mongo.service';

function getDateFilter() {
  const date = new Date();
  date.setMonth(date.getMonth() - 12);
  return date.toISOString().slice(0, 7);
}

export default async function deletePassedGouvernancePersonnalInformation() {
  const dateFilter = getDateFilter();
  return db.collection('relationships')
    .updateMany(
      { $and: [{ endDate: { $ne: '' } }, { endDate: { $lt: dateFilter } }] },
      { $unset: { personalEmail: '', mandatePhonenumber: '' } },
    );
}
