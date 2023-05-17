import { db } from '../../services/mongo.service';

export default async function askForEmailRevalidation() {
  return db.collection('users')
    .updateMany({ role: { $ne: 'admin' } }, { $set: { isOtpRequired: true } });
}
