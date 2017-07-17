'use strict';

require('co-mocha');
const sinon = require('sinon');
const expect = require('expect');
const stubs = require('./test/stubs');
// mocha packages/mixins/domainify.test.js

const baseRepo = stubs.repo;
const factory = stubs.factory;

class Cat {}

const domainify = require('./domainify');

const factoryResult = new Cat();
factoryResult.name = 'foo';

const repoFindAllResult = [factoryResult];
const repoFindOneResult = factoryResult;

describe('domainify', () => {
    let sandbox;
    let repo;

    before(() => {
         sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        sandbox.stub(baseRepo);
        sandbox.stub(factory);
        baseRepo.findAll.returns(Promise.resolve(repoFindAllResult));
        baseRepo.findOne.returns(Promise.resolve(repoFindOneResult));
        factory.reconstitute.returns(Promise.resolve(factoryResult));
        repo = domainify(baseRepo, factory);
    });

    afterEach(() => sandbox.restore());

    const cases = [
        { methodName: 'findAll', expectedResult: repoFindAllResult},
        { methodName: 'findOne', expectedResult: repoFindOneResult}
    ];

    cases.forEach(testCase => {
        it(`should ${testCase.methodName}`, function*() {
            const results = yield repo[testCase.methodName]();
            expect(factory.reconstitute.called).toBe(true, 'recon not called');
            expect(results).toEqual(testCase.expectedResult);
        });
    });


    it('should findOneDetailed - wrapper for custom objects', function*() {
        const repo = domainify(baseRepo, factory);
        repo.findOneDetailed = () => {};
        sandbox.stub(repo, 'findOneDetailed').returns(Promise.resolve(repoFindOneResult));
        const orig = repo.findOneDetailed;
        repo.wrap('findOneDetailed');

        const results = yield repo.findOneDetailed('foo');
        expect(results).toEqual(factoryResult);
        expect(results instanceof Cat).toBe(true);
        expect(factory.reconstitute.called).toBe(true);
        expect(orig.calledWith('foo')).toBe(true);
    });

});
