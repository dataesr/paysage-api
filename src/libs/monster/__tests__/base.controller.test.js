import jest from 'jest-mock';

import BaseController from '../controllers/base.controller';
import { BadRequestError, ServerError } from '../../http-errors';

let args;
let baseController;
let baseMongoRepository; 

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};  
  

describe('create method', () => {
    beforeAll(() => {
        baseMongoRepository = { create: () => {}, get: () => ({}) };
        baseController = new BaseController(baseMongoRepository);
    });

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

    it('should return a ServerError the resource is not in the repository after creation', () => {
        const mockedBaseMongoRepository = { create: () => {}, get: () => undefined };
        const mockedBaseController = new BaseController(mockedBaseMongoRepository);
        const create = async () => { await mockedBaseController.create(...args) };
        expect(create).rejects.toThrow(ServerError);
    });

    it('should return a newly created document with existing id in context', async () => {
        const create = await baseController.create(...args);
        expect(create).toEqual({});
    });

    it('should NOT create a new event in the repository store', async () => {
        const spyRepositoryGet = jest.spyOn(baseController._repository, 'get');
        await baseController.create(...args);
        expect(baseController._eventStore).toBeUndefined();
        expect(spyRepositoryGet).toBeCalledTimes(1);
        spyRepositoryGet.mockRestore();
    });

    it('should create a new event in the repository store', async () => {
        const mockedEventStore = { create: () => {} };
        const mockedBaseController = new BaseController(baseMongoRepository, { eventStore: mockedEventStore });
        const spyEventStoreCreation = jest.spyOn(mockedBaseController._eventStore, 'create');
        const spyRepositoryGet = jest.spyOn(mockedBaseController._repository, 'get');
        await mockedBaseController.create(...args);

        expect(spyEventStoreCreation).toBeCalled();
        expect(spyRepositoryGet).toBeCalledTimes(2);

        spyEventStoreCreation.mockRestore();
        spyRepositoryGet.mockRestore();
    });
});
