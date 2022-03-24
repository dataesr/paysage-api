import storage from 'swift/storage';
import config from './app.config';

const { container } = config.objectStorage;

async function setupAppContainer(ctx) {
  await storage.createContainer(ctx, container);
}

export default setupAppContainer;
