import agenda from '../../jobs';

export const contact = async (req, res, next) => {
  const { body } = req;
  agenda.now('send contact email', body);
  res.status(201).json({ message: 'Merci de nous avoir contacté.' });
  return next();
};
