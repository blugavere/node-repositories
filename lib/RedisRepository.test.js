const redis = require('redis');
const Repo = require('./RedisRepository');

describe('Redis Repository', () => {
  let repo = new Repo(redis, 'client');
  let genericTests = require('./GenericTests')(repo);
  before(() => {
    repo.clear();
  });
  after(() => {
    repo.disconnect();
  });
  genericTests.checkInterface();
  genericTests.implementation();
});
