
'use strict';

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const Repository = require('./AJAXRepository');
const Assertions = require('./test/Assertions');


describe('Ajax Repository', () => {
  const root = 'http://localhost:3000/api/todos';
  const rootId = `${root}/bar`;

  before(() => {
    const orig = {
      _id: 'bar',
      name: 'foo'
    };
    const updated = {
      _id: 'bar',
      name: 'baz'
    };
    mock.onGet(root).replyOnce(200, [orig]);
    mock.onGet(rootId).replyOnce(200, orig);
    mock.onPost(root).reply(201, orig);
    mock.onPut(rootId).reply(200, updated);
    mock.onDelete(rootId).reply(200, updated);
  });

  after(() => {
    mock.reset();
  });

  describe('generic repository tests', () => {
    const repo = new Repository(root);
    const client = {
      name: 'foo'
    };
    const bag = {
      client
    };
    Assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });

});
