import { client, db } from '../../services/mongo.service';

const dataset = 'fr-esr-annelis-paysage-email-generiques';

export default async function exportFrEsrAnnelisPaysageMails() {

  const emails = await db.collection('emailtypes').find({ $and: [{ annelisId: { $ne: null } }, { annelisId: { $ne: "" } }] }).toArray();
  const emailMap = new Map(emails.map(email => [email.id, email]));

  const data = await db.collection('emails').find([
    { emailTypeId: { $in: emails.map(email => email.id) } },
  ]).toArray();

  const json = data.map((elem) => {
    const row = {
      dataset,
      eta_id_paysage: elem.resourceId,
      paysage_email_type_id: elem.emailTypeId,
      annelis_email_type_id: emailMap.get(elem.emailTypeId)?.annelisId || '',
      annelis_email_type: emailMap.get(elem.emailTypeId)?.usualName || '',
      annelis_email: elem.email
    };
    return row;
  });
  const session = client.startSession();
  await session.withTransaction(async () => {
    await db.collection('opendata').deleteMany({ dataset });
    await db.collection('opendata').insertMany(json);
    await session.endSession();
  });

  return { status: 'success', location: `/opendata/${dataset}` };
}
