const redis = require('redis');
const Repo = require('./RedisRepository');

setTimeout(() => {

  describe('Redis Repository', () => {
    let repo = new Repo(redis, 'client');
    let genericTests = require('./GenericTests')(repo);

    before(() => {
      repo.clear();
    });

    after(() => {
      repo.disconnect();
    });

    describe('interface', () => {
      genericTests.checkInterface();
    });

    describe('implementation', () => {
      genericTests.implementation();
    });

    run();
  });

}, 5000);
