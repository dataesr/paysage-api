import Context from 'swift/context';
import storage from 'swift/storage';
import config from './app.config';

const { creds, container } = config.objectStorage;

async function setupAppContainer() {
  const ctx = await Context.build(creds);
  await storage.createContainer(ctx, container);
  await storage.toggleMode(ctx, container, '.r:*');
  await storage.updateContainer(ctx, container, { 'X-Container-Meta-Access-Control-Allow-Origin': '*' });
}

export default setupAppContainer;
