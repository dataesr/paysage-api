import jest from 'jest-mock';

import NestedController from '../controllers/nested.controller';
import { BadRequestError, NotFoundError } from '../../http-errors';

let args;
let nestedController;
let nestedMongoRepository;

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('constructor', () => {
  it('should have undefined catalog, repository and storeContext by default', () => {
    nestedController = new NestedController({});
    expect(nestedController._catalog).toBeUndefined();
    expect(nestedController._repository).not.toBeUndefined();
    expect(nestedController._storeContext).toBeUndefined();
  });
});

describe('read method', () => {
  beforeAll(() => {
    nestedMongoRepository = {
      checkResource: () => ({}),
      get: () => ({}),
      read: () => ({}),
    };
    nestedController = new NestedController(nestedMongoRepository);
  });

  beforeEach(() => {
    args = [
      { params: { id: 42 } },
      mockResponse(),
      () => ({}),
    ];
  });

  it('should throw a NotFoundError if the resource does not exist', () => {
    const mockedNestedController = new NestedController({ checkResource: () => ({}), get: () => null });
    const read = async () => { await mockedNestedController.read(...args); };
    expect(read).rejects.toThrow(NotFoundError);
  });

  it('should return the read resource', async () => {
    const spy = jest.spyOn(nestedController._repository, 'get');
    const read = await nestedController.read(...args);
    expect(read).toEqual({});
    expect(spy).toBeCalledTimes(1);
    spy.mockRestore();
  });
});

describe('list method', () => {
  it('should return the list of the macthing resources', async () => {
    args = [
      { query: { my_query: 'example_query' } },
      mockResponse(),
      () => ({}),
    ];
    const findResult = { data: ['my_data'], totalCount: 12 };
    nestedController = new NestedController({ checkResource: () => ({}), find: () => (findResult) });
    const spy = jest.spyOn(nestedController._repository, 'find');
    const list = await nestedController.list(...args);
    expect(list).toEqual({});
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ my_query: 'example_query', useQuery: 'readQuery' });
    spy.mockRestore();
  });
});

describe('create method', () => {
  beforeAll(() => {
    nestedMongoRepository = {
      checkResource: () => ({}),
      create: () => ({}),
      get: () => ({}),
    };
    nestedController = new NestedController(nestedMongoRepository);
  });

  beforeEach(() => {
    args = [
      { body: 'my_body', ctx: { id: 42 } },
      mockResponse(),
      () => ({}),
    ];
  });

  it('should throw a BadRequest error if request body is missing', () => {
    args[0] = {};
    const create = async () => { await nestedController.create(...args); };
    expect(create).rejects.toThrow(BadRequestError);
    expect(create).rejects.toThrow('Payload missing');
  });

  it('should throw a BadRequest error if request body is empty', () => {
    args[0] = { body: '' };
    const create = async () => { await nestedController.create(...args); };
    expect(create).rejects.toThrow(BadRequestError);
    expect(create).rejects.toThrow('Payload missing');
  });

  it('should throw a NotFoundError the resource is not in the repository after creation', () => {
    const mockedNestedController = new NestedController({ checkResource: () => ({}), create: () => {}, get: () => null });
    const create = async () => { await mockedNestedController.create(...args); };
    expect(create).rejects.toThrow(NotFoundError);
  });

  it('should return a newly created document', async () => {
    const spyRepositoryGet = jest.spyOn(nestedController._repository, 'get');
    const spyRepositoryCreate = jest.spyOn(nestedController._repository, 'create');
    const create = await nestedController.create(...args);
    expect(create).toEqual({});
    expect(spyRepositoryGet).toBeCalledTimes(2);
    expect(spyRepositoryCreate).toBeCalledTimes(1);
    spyRepositoryGet.mockRestore();
    spyRepositoryCreate.mockRestore();
  });

  it('should get an id from catalog if no id but existing catalog', async () => {
    args[0].ctx = {};
    const mockedNestedController = new NestedController(nestedMongoRepository, { catalog: { getUniqueId: () => 42 } });
    const spy = jest.spyOn(mockedNestedController._catalog, 'getUniqueId');
    await mockedNestedController.create(...args);
    expect(spy).toBeCalled();
    spy.mockRestore();
  });
});

describe('patch method', () => {
  beforeAll(() => {
    nestedMongoRepository = {
      checkResource: () => ({}),
      get: () => ({}),
      patch: () => ({ ok: true }),
    };
    nestedController = new NestedController(nestedMongoRepository);
  });

  beforeEach(() => {
    args = [
      { body: 'my_body', ctx: {}, params: { id: 42 } },
      mockResponse(),
      () => ({}),
    ];
  });

  it('should throw a BadRequest error if request body is missing', () => {
    args[0] = {};
    const patch = async () => { await nestedController.patch(...args); };
    expect(patch).rejects.toThrow(BadRequestError);
    expect(patch).rejects.toThrow('Payload missing');
  });

  it('should throw a BadRequest error if request body is empty', () => {
    args[0] = { body: '' };
    const patch = async () => { await nestedController.patch(...args); };
    expect(patch).rejects.toThrow(BadRequestError);
    expect(patch).rejects.toThrow('Payload missing');
  });

  it('should throw a NotFoundError if req.params.id is not found in repository', () => {
    const mockedNestedController = new NestedController({ checkResource: () => ({}), get: () => null });
    const patch = async () => { await mockedNestedController.patch(...args); };
    expect(patch).rejects.toThrow(NotFoundError);
  });

  it('should throw a NotFoundError the resource is not in the repository after patch', () => {
    const mockedBaseMongoRepository = {
      checkResource: () => ({}),
      get: jest.fn().mockImplementationOnce(() => 42).mockImplementation(() => null),
      patch: () => new Promise((resolve) => { resolve(true); }),
    };
    const mockedNestedController = new NestedController(mockedBaseMongoRepository);
    const patch = async () => { await mockedNestedController.patch(...args); };
    expect(patch).rejects.toThrow(NotFoundError);
  });

  it('should return a patched document', async () => {
    const spyRepositoryGet = jest.spyOn(nestedController._repository, 'get');
    const spyRepositoryPatch = jest.spyOn(nestedController._repository, 'patch');
    const patch = await nestedController.patch(...args);
    expect(patch).toEqual({});
    expect(spyRepositoryGet).toBeCalledTimes(3);
    expect(spyRepositoryPatch).toBeCalledTimes(1);
    spyRepositoryGet.mockRestore();
    spyRepositoryPatch.mockRestore();
  });
});

describe('delete method', () => {
  beforeAll(() => {
    nestedMongoRepository = {
      checkResource: () => ({}),
      get: () => ({}),
      remove: () => ({ ok: true }),
    };
    nestedController = new NestedController(nestedMongoRepository);
  });

  beforeEach(() => {
    args = [
      { ctx: {}, params: { id: 42 } },
      mockResponse(),
      () => ({}),
    ];
  });

  it('should throw a NotFoundError if the resource does not exist', () => {
    const mockedNestedController = new NestedController({ checkResource: () => ({}), get: () => null });
    const remove = async () => { await mockedNestedController.delete(...args); };
    expect(remove).rejects.toThrow(NotFoundError);
  });

  it('should delete the resource', async () => {
    const spyRepositoryGet = jest.spyOn(nestedController._repository, 'get');
    const spyRepositoryRemove = jest.spyOn(nestedController._repository, 'remove');
    const remove = await nestedController.delete(...args);
    expect(remove).toEqual({});
    expect(spyRepositoryGet).toBeCalledTimes(1);
    expect(spyRepositoryRemove).toBeCalledTimes(1);
    spyRepositoryGet.mockRestore();
    spyRepositoryRemove.mockRestore();
  });
});
