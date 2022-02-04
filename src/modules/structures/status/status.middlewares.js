import { BadRequestError } from '../../commons/errors';
import structures from '../root/root.resource';

export const validateStatusPayload = async (req, res, next) => {
  const { redirection, status } = req.body;
  if (redirection && status !== 'redirected') {
    throw new BadRequestError(
      'Validation failed',
      [{ path: 'body.status', message: '`status` must be set to `redirected`' }],
    );
  }
  if (status === 'redirected' && !redirection) {
    throw new BadRequestError(
      'Validation failed',
      [{ path: 'body.redirection', message: '`redirection` is missing' }],
    );
  }
  if (redirection && !await structures.repository.exists(redirection)) {
    throw new BadRequestError(
      'Validation failed',
      [{ path: 'body.redirection', message: 'redirection resource does not exists' }],
    );
  }
  if (redirection && !await structures.repository.exists(redirection)) {
    throw new BadRequestError(
      'Validation failed',
      [{ path: 'body.redirection', message: 'redirection resource does not exists' }],
    );
  }
  return next();
};
