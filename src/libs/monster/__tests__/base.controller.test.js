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
        baseMongoRepository = { create: () => 42, get: () => ({}) };
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
        const mockedBaseMongoRepository = { create: () => 42, get: () => undefined };
        const mockedBaseController = new BaseController(mockedBaseMongoRepository);
        const create = async () => { await mockedBaseController.create(...args) };
        expect(create).rejects.toThrow(ServerError);
    });

    it('should return a newly created document with existing id in context', async () => {
        const create = await baseController.create(...args);
        expect(create).toEqual({});
    });

});
