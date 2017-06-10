
'use strict';

const redis = require('redis');
const Repo = require('./RedisRepository');
const Assertions = require('../test/assertions');

describe('Redis Repository', () => {
  let repo = new Repo(redis, 'client');

  before(() => {
    repo.clear();
  });

  after(() => {
    repo.disconnect();
  });

  describe('generic assertions', () => {
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
