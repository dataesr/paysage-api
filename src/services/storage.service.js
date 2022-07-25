import pkgcloud from 'pkgcloud';
import { Duplex } from 'stream';
import config from '../config';

const { credentials, container } = config.objectStorage;
export const client = pkgcloud.storage.createClient(credentials);

export default {
  put: (buffer, remote, options) => new Promise((resolve, reject) => {
    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    const writeStream = client.upload({ container, remote, ...options });
    stream.pipe(writeStream);
    writeStream.on('error', (err) => reject(err));
    writeStream.on('success', () => resolve());
  }),

  download: (remote) => new Promise((resolve) => {
    const file = client
      .download({ container, remote })
      .on('response', (response) => {
        delete response.headers['accept-ranges'];
        delete response.headers['x-timestamp'];
        delete response.headers['x-trans-id'];
        delete response.headers['x-openstack-request-id'];
        delete response.headers.date;
        delete response.headers.connection;
        delete response.headers['x-iplb-request-id'];
        delete response.headers['x-iplb-instance'];
      });
    resolve(file);
  }),

  delete: (remote) => new Promise((resolve, reject) => {
    client.removeFile(container, remote, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  }),
};
