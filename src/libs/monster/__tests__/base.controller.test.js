import jest from 'jest-mock';

import BaseController from '../controllers/base.controller';
import { BadRequestError, NotFoundError } from '../../http-errors';

let args;
let baseController;
let baseMongoRepository;

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('constructor', () => {
  it('should have undefined catalog, repository and storeContext by default', () => {
    baseController = new BaseController({});
    expect(baseController._catalog).toBeUndefined();
    expect(baseController._repository).not.toBeUndefined();
    expect(baseController._storeContext).toBeUndefined();
  });
});

describe('read method', () => {
  beforeAll(() => {
    baseMongoRepository = {
      get: () => ({}),
      read: () => ({}),
    };
    baseController = new BaseController(baseMongoRepository);
  });

  beforeEach(() => {
    args = [
      { params: { id: 42 } },
      mockResponse(),
      () => ({}),
    ];
  });

  it('should throw a NotFoundError if the resource does not exist', () => {
    const mockedBaseController = new BaseController({ get: () => null });
    const spy = jest.spyOn(mockedBaseController._repository, 'get');
    const read = async () => { await mockedBaseController.read(...args); };
    expect(read).rejects.toThrow(NotFoundError);
    expect(spy).toBeCalledTimes(1);
    spy.mockRestore();
  });

  it('should return the read resource', async () => {
    const spy = jest.spyOn(baseController._repository, 'get');
    const read = await baseController.read(...args);
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
    baseController = new BaseController({ find: () => (findResult) });
    const spy = jest.spyOn(baseController._repository, 'find');
    const list = await baseController.list(...args);
    expect(list).toEqual({});
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ my_query: 'example_query', useQuery: 'readQuery' });
    spy.mockRestore();
  });
});

describe('create method', () => {
  beforeAll(() => {
    baseMongoRepository = {
      create: () => ({}),
      get: () => ({}),
    };
    baseController = new BaseController(baseMongoRepository);
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
    const create = async () => { await baseController.create(...args); };
    expect(create).rejects.toThrow(BadRequestError);
    expect(create).rejects.toThrow('Payload missing');
  });

  it('should throw a BadRequest error if request body is empty', () => {
    args[0] = { body: '' };
    const create = async () => { await baseController.create(...args); };
    expect(create).rejects.toThrow(BadRequestError);
    expect(create).rejects.toThrow('Payload missing');
  });

  it('should throw a NotFoundError the resource is not in the repository after creation', () => {
    const mockedBaseController = new BaseController({ create: () => {}, get: () => null });
    const create = async () => { await mockedBaseController.create(...args); };
    expect(create).rejects.toThrow(NotFoundError);
  });

  it('should return a newly created document', async () => {
    const spyRepositoryGet = jest.spyOn(baseController._repository, 'get');
    const spyRepositoryCreate = jest.spyOn(baseController._repository, 'create');
    const create = await baseController.create(...args);
    expect(create).toEqual({});
    expect(spyRepositoryGet).toBeCalledTimes(2);
    expect(spyRepositoryCreate).toBeCalledTimes(1);
    spyRepositoryGet.mockRestore();
    spyRepositoryCreate.mockRestore();
  });

  it('should get an id from catalog if no id but existing catalog', async () => {
    args[0].ctx = {};
    const mockedBaseController = new BaseController(baseMongoRepository, { catalog: { getUniqueId: () => 42 } });
    const spy = jest.spyOn(mockedBaseController._catalog, 'getUniqueId');
    await mockedBaseController.create(...args);
    expect(spy).toBeCalled();
    spy.mockRestore();
  });
});

describe('patch method', () => {
  beforeAll(() => {
    baseMongoRepository = {
      get: () => ({}),
      patch: () => ({ ok: true }),
    };
    baseController = new BaseController(baseMongoRepository);
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
    const patch = async () => { await baseController.patch(...args); };
    expect(patch).rejects.toThrow(BadRequestError);
    expect(patch).rejects.toThrow('Payload missing');
  });

  it('should throw a BadRequest error if request body is empty', () => {
    args[0] = { body: '' };
    const patch = async () => { await baseController.patch(...args); };
    expect(patch).rejects.toThrow(BadRequestError);
    expect(patch).rejects.toThrow('Payload missing');
  });

  it('should throw a NotFoundError if req.params.id is not found in repository', () => {
    const mockedBaseController = new BaseController({ get: () => null });
    const patch = async () => { await mockedBaseController.patch(...args); };
    expect(patch).rejects.toThrow(NotFoundError);
  });

  it('should throw a NotFoundError the resource is not in the repository after patch', () => {
    const mockedBaseMongoRepository = {
      get: jest.fn().mockImplementationOnce(() => 42).mockImplementation(() => null),
      patch: () => new Promise((resolve) => { resolve(true); }),
    };
    const mockedBaseController = new BaseController(mockedBaseMongoRepository);
    const patch = async () => { await mockedBaseController.patch(...args); };
    expect(patch).rejects.toThrow(NotFoundError);
  });

  it('should return a patched document', async () => {
    const spyRepositoryGet = jest.spyOn(baseController._repository, 'get');
    const spyRepositoryPatch = jest.spyOn(baseController._repository, 'patch');
    expect(spyRepositoryGet).toBeCalledTimes(0);
    const patch = await baseController.patch(...args);
    expect(patch).toEqual({});
    expect(spyRepositoryGet).toBeCalledTimes(3);
    expect(spyRepositoryPatch).toBeCalledTimes(1);
    spyRepositoryGet.mockRestore();
    spyRepositoryPatch.mockRestore();
  });
});

describe('delete method', () => {
  beforeAll(() => {
    baseMongoRepository = {
      get: () => ({}),
      remove: () => ({ ok: true }),
    };
    baseController = new BaseController(baseMongoRepository);
  });

  beforeEach(() => {
    args = [
      { ctx: {}, params: { id: 42 } },
      mockResponse(),
      () => ({}),
    ];
  });

  it('should throw a NotFoundError if the resource does not exist', () => {
    const mockedBaseController = new BaseController({ get: () => null });
    const remove = async () => { await mockedBaseController.delete(...args); };
    expect(remove).rejects.toThrow(NotFoundError);
  });

  it('should delete the resource', async () => {
    const spyRepositoryGet = jest.spyOn(baseController._repository, 'get');
    const spyRepositoryRemove = jest.spyOn(baseController._repository, 'remove');
    const remove = await baseController.delete(...args);
    expect(remove).toEqual({});
    expect(spyRepositoryGet).toBeCalledTimes(1);
    expect(spyRepositoryRemove).toBeCalledTimes(1);
    spyRepositoryGet.mockRestore();
    spyRepositoryRemove.mockRestore();
  });
});
