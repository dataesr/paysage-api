import jest from 'jest-mock';
import mongodb from 'mongodb';

import BaseController from '../controllers/base.controller';
import { BadRequestError, NotFoundError, ServerError } from '../../http-errors';

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
    it('should have undefined catalog, eventStore and storeContext by default', () => {
        baseController = new BaseController({});
        expect(baseController._catalogue).toBeUndefined();
        expect(baseController._eventStore).toBeUndefined();
        expect(baseController._repository).not.toBeUndefined();
        expect(baseController._storeContext).toBeUndefined();
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
        const create = async () => { await baseController.create(...args) };
        expect(create).rejects.toThrow(BadRequestError);
        expect(create).rejects.toThrow('Payload missing');
    });
    
    it('should throw a BadRequest error if request body is empty', () => {
        args[0] = { body: '' };
        const create = async () => { await baseController.create(...args) };
        expect(create).rejects.toThrow(BadRequestError);
        expect(create).rejects.toThrow('Payload missing');
    });

    it('should throw a ServerError the resource is not in the repository after creation', () => {
        const mockedBaseController = new BaseController({ create: () => {}, get: () => null });
        const create = async () => { await mockedBaseController.create(...args) };
        expect(create).rejects.toThrow(ServerError);
    });

    it('should return a newly created document without adding event in the store', async () => {
        const spyRepositoryGet = jest.spyOn(baseController._repository, 'get');
        const spyRepositoryCreate = jest.spyOn(baseController._repository, 'create');
        const create = await baseController.create(...args);
        expect(create).toEqual({});
        expect(spyRepositoryGet).toBeCalledTimes(1);
        expect(spyRepositoryCreate).toBeCalledTimes(1);
        expect(baseController._eventStore).toBeUndefined();
        spyRepositoryGet.mockRestore();
        spyRepositoryCreate.mockRestore();
    });

    it('should create a new document and add event in the store', async () => {
        const mockedBaseController = new BaseController(baseMongoRepository, { eventStore: { create: () => {} } });
        const spyRepositoryGet = jest.spyOn(mockedBaseController._repository, 'get');
        const spyRepositoryCreate = jest.spyOn(baseController._repository, 'create');
        const spyEventStoreCreate = jest.spyOn(mockedBaseController._eventStore, 'create');
        const create = await mockedBaseController.create(...args);
        expect(create).toEqual({});
        expect(spyRepositoryGet).toBeCalledTimes(2);
        expect(spyRepositoryCreate).toBeCalledTimes(1);
        expect(spyEventStoreCreate).toBeCalledTimes(1);
        expect(spyEventStoreCreate).toBeCalledWith(expect.objectContaining({ action: 'create', id: 42 }));
        spyRepositoryGet.mockRestore();
        spyRepositoryCreate.mockRestore();
        spyEventStoreCreate.mockRestore();
    });

    it('should get id from mongo if no id in context and no catalog', async () => {
        args[0].ctx = {};
        const spy = jest.spyOn(mongodb, 'ObjectId').mockImplementation(() => 42);
        await baseController.create(...args);
        expect(spy).toBeCalled();
        spy.mockRestore();
    });

    it('should get an id from catalog if no id but existing catalog', async () => {
        args[0].ctx = {};
        const mockedBaseController = new BaseController(baseMongoRepository, { catalogue: { getUniqueId: () => 42 } });
        const spy = jest.spyOn(mockedBaseController._catalogue, 'getUniqueId');
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
        const patch = async () => { await baseController.patch(...args) };
        expect(patch).rejects.toThrow(BadRequestError);
        expect(patch).rejects.toThrow('Payload missing');
    });
    
    it('should throw a BadRequest error if request body is empty', () => {
        args[0] = { body: '' };
        const patch = async () => { await baseController.patch(...args) };
        expect(patch).rejects.toThrow(BadRequestError);
        expect(patch).rejects.toThrow('Payload missing');
    });

    it('should throw a NotFoundError if req.params.id is not found in repository', () => {
        const mockedBaseController = new BaseController({ get: () => null });
        const patch = async () => { await mockedBaseController.patch(...args) };
        expect(patch).rejects.toThrow(NotFoundError);
    });

    it('should throw a ServerError the resource is not in the repository after patch', () => {
        const mockedBaseMongoRepository = {
            get: jest.fn().mockImplementationOnce(() => 42).mockImplementation(() => null),
            patch: () => new Promise(resolve => { ok: true })
        };
        const mockedBaseController = new BaseController(mockedBaseMongoRepository);
        const patch = async () => { await mockedBaseController.patch(...args) };
        expect(patch).rejects.toThrow(ServerError);
    });

    it('should return a patched document without adding event in the store', async () => {
        const spyRepositoryGet = jest.spyOn(baseController._repository, 'get');
        const spyRepositoryPatch = jest.spyOn(baseController._repository, 'patch');
        const patch = await baseController.patch(...args);
        expect(patch).toEqual({});
        expect(spyRepositoryGet).toBeCalledTimes(2);
        expect(spyRepositoryPatch).toBeCalledTimes(1);
        expect(baseController._eventStore).toBeUndefined();
        spyRepositoryGet.mockRestore();
        spyRepositoryPatch.mockRestore();
    });

    it('should patch a document and add event in the store', async () =>  {
        const mockedBaseController = new BaseController(baseMongoRepository, { eventStore: { create: () => {} } });
        const spyRepositoryGet = jest.spyOn(mockedBaseController._repository, 'get');
        const spyRepositoryPatch = jest.spyOn(mockedBaseController._repository, 'patch');
        const spyEventStoreCreate = jest.spyOn(mockedBaseController._eventStore, 'create');
        const patch = await mockedBaseController.patch(...args);
        expect(patch).toEqual({});
        expect(spyRepositoryGet).toBeCalledTimes(3);
        expect(spyRepositoryPatch).toBeCalledTimes(1);
        expect(spyEventStoreCreate).toBeCalledTimes(1);
        expect(spyEventStoreCreate).toBeCalledWith(expect.objectContaining({ action: 'patch', id: 42 }));
        spyRepositoryGet.mockRestore();
        spyRepositoryPatch.mockRestore();
        spyEventStoreCreate.mockRestore();
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
        const remove = async () => { await mockedBaseController.delete(...args) };
        expect(remove).rejects.toThrow(NotFoundError);
    });

    it('should delete the resource without adding event in the store', async () => {
        const spyRepositoryGet = jest.spyOn(baseController._repository, 'get');
        const spyRepositoryRemove = jest.spyOn(baseController._repository, 'remove');
        const remove = await baseController.delete(...args);
        expect(remove).toEqual({});
        expect(spyRepositoryGet).toBeCalledTimes(1);
        expect(spyRepositoryRemove).toBeCalledTimes(1);
        expect(baseController._eventStore).toBeUndefined();
        spyRepositoryGet.mockRestore();
        spyRepositoryRemove.mockRestore();
    });

    it('should delete the resource and add event in the store', async () => {
        const mockedBaseController = new BaseController(baseMongoRepository, { eventStore: { create: () => {} } });
        const spyRepositoryGet = jest.spyOn(mockedBaseController._repository, 'get');
        const spyRepositoryRemove = jest.spyOn(mockedBaseController._repository, 'remove');
        const spyEventStoreCreate = jest.spyOn(mockedBaseController._eventStore, 'create');
        const remove = await mockedBaseController.delete(...args);
        expect(remove).toEqual({});
        expect(spyRepositoryGet).toBeCalledTimes(1);
        expect(spyRepositoryRemove).toBeCalledTimes(1);
        expect(spyEventStoreCreate).toBeCalledTimes(1);
        expect(spyEventStoreCreate).toBeCalledWith(expect.objectContaining({ action: 'delete', id: 42 }));
        spyRepositoryGet.mockRestore();
        spyRepositoryRemove.mockRestore();
        spyEventStoreCreate.mockRestore();
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
        const read = async () => { await mockedBaseController.read(...args) };
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
        const findResult = { data: ['my_data'], totalCount: 12 }
        baseController = new BaseController({ find: () => (findResult) });
        const spy = jest.spyOn(baseController._repository, 'find');
        const list = await baseController.list(...args)
        expect(list).toEqual({});
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith({ my_query: 'example_query', useQuery: 'readQuery' });
        spy.mockRestore();
    })
});

describe('events method', () => {
    it('should filter event from catalog', async () => {
        args = [
            { query: { filters: { my_filter: 'filter_example' }, other: 'other_value' }, params: { id: 42 } },
            mockResponse(),
            () => ({}),
        ];
        baseController = new BaseController({}, { eventStore: { find: () => ({}) } });
        const spy = jest.spyOn(baseController._eventStore, 'find');
        const events = await baseController.events(...args);
        expect(events).toEqual({});
        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith({ filters: { id: 42, my_filter: 'filter_example' }, other: 'other_value', useQuery: 'readQuery' });
        spy.mockRestore();
    })
});
