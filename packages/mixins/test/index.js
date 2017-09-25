
'use strict';

require('co-mocha');
const _ = require('lodash');
const sinon = require('sinon');
const expect = require('expect');
const stubs = require('./stubs');
const mixins = require('..');
const baseRepo = stubs.repo;
const factory = stubs.factory;

class Cat {}

describe('test', () => {
    let sandbox;
    let repo;
    let backupRepo;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        repo = Object.assign({}, _.cloneDeep(baseRepo));
        backupRepo = Object.assign({}, baseRepo);
        sandbox.stub(repo);
        sandbox.stub(backupRepo);
        sandbox.stub(factory);

        repo.findOne.returns(Promise.resolve({}));
        factory.reconstitute.returns(Promise.resolve(new Cat()));
    });

    afterEach(() => sandbox.restore());

    it('should findOne', function* () {
        const orig = repo.findOne;
        mixins.domainify(repo, factory);
        const result = yield repo.findOne('foo');
        expect(result instanceof Cat).toBe(true, 'return instance');
        expect(orig.called).toBe(true, 'findOne not called on main');
        expect(backupRepo.findOne.called).toBe(false);
        expect(factory.reconstitute.called).toBe(true);
    });

    it('should add w/ backup', function* () {
        const expectedResult = {_id: 'foo'  };
        const arg = { foo: 'bar' };
        const orig = repo.add;
        repo.add.returns(Promise.resolve(expectedResult));
        backupRepo.add.returns(Promise.resolve(arg));
        mixins.backup(repo, backupRepo);

        const result = yield repo.add(arg);
        expect(result).toEqual(expectedResult);
        expect(orig.called).toBe(true, 'original never called');
        expect(backupRepo.add.calledWith(expectedResult)).toBe(true, 'backup called w wrong args');
        
    });

});

