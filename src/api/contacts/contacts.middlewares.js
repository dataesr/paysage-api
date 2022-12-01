import agenda from '../../jobs';

export const sendContactMessageByEmail = async (req, res, next) => {
  const { body } = req;
  agenda.now('send contact email', body);
  return next();
};
