const Repo = require('./RedisRepository');

describe('Redis Repository', () => {
  let repo = new Repo('client');
  let genericTests = require('./GenericTests')(repo);
  before(() => {
    repo.clear();
  });
  genericTests.checkInterface();
  genericTests.implementation();
});
