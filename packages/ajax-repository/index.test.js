'use strict';
require('co-mocha');

const axios = require('axios');
const expect = require('expect');
const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const Repository = require('.');
const testCases = require('../../test/assertions');

// make t ajax

const client = {
  name: 'foo'
};

const bag = {
  client
};

const orig = {
  _id: 'bar',
  name: 'foo'
};

const updated = Object.assign({}, orig, {
  name: 'baz'
});

describe('Ajax Repository', () => {
  const root = 'http://localhost:3000/api/todos';
  const rootId = `${root}/bar`;
  let repo;

  before(() => {
    mock.onGet(root).replyOnce(200, [orig]);
    mock.onGet(rootId).replyOnce(200, orig);
    mock.onPost(root).reply(201, orig);
    mock.onPut(rootId).reply(200, updated);
    mock.onDelete(rootId).reply(200, updated);
    repo = new Repository(root);
  });

  after(() => {
    mock.reset();
  });

  testCases.assertions.forEach(testCase => {
    it(testCase.assertion, done => {
      testCase.method(repo, bag)(done);
    });
  });
  it('should disconnect', function* () {
    yield repo.disconnect();
  });
  it('should implement clear', done => {
    repo.clear((err, res) => {
      expect(res).toBe(true);
      done();
    });
  });

});