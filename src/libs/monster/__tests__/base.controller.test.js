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

beforeAll(() => {
    baseMongoRepository = {
        create: () => ({}),
        get: () => ({}),
        patch: () => ({ ok: true }),
        remove: () => ({ ok: true }),
    };
    baseController = new BaseController(baseMongoRepository);
});

describe('default constructor', () => {
    it('should have undefined catalog, eventStore and storeContext by default', () => {
        expect(baseController._catalogue).toBeUndefined();
        expect(baseController._eventStore).toBeUndefined();
        expect(baseController._repository).not.toBeUndefined();
        expect(baseController._storeContext).toBeUndefined();
    });
});

describe('create method', () => {
    beforeEach(() => {
        args = [
            { body: 'my_body', ctx: { id: 42 } },
            mockResponse(),
            () => ({})
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
        const mockedBaseController = new BaseController({ create: () => {}, get: () => undefined });
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
    beforeEach(() => {
        args = [
            { body: 'my_body', ctx: {}, params: { id: 42 } },
            mockResponse(),
            () => ({})
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
        const mockedBaseController = new BaseController({ get: () => undefined });
        const patch = async () => { await mockedBaseController.patch(...args) };
        expect(patch).rejects.toThrow(NotFoundError);
    });

    it('should throw a ServerError the resource is not in the repository after patch', () => {
        const mockedBaseMongoRepository = {
            get: jest.fn().mockImplementationOnce(() => 42).mockImplementation(() => undefined),
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
    beforeEach(() => {
        args = [
            { ctx: {}, params: { id: 42 } },
            mockResponse(),
            () => ({})
        ];
    });

    it('should throw a NotFoundError if resource does not exist', () => {
        const mockedBaseController = new BaseController({ get: () => undefined });
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

// describe.todo('read method');
// describe.todo('list method');
// describe.todo('events method');
