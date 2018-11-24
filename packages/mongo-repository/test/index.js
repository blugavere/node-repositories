'use strict';

const expect = require('expect');
const MongoClient = require('mongodb').MongoClient;
const MongoRepository = require('../lib');
const assertions = require('./assertions');

/**
 * NODE_ENV=test mocha test/index.js --watch
 */
let connStr = 'mongodb://localhost/test';
if (process.env.NODE_ENV === 'docker') {
  console.log('Using docker configuration!');
  connStr = 'mongodb://mongo:27017/test';
}
const collection = 'clients';

describe('MongoDB Repository', () => {
  let repo;
  let connection;
  before(done => {
    MongoClient.connect(connStr, (err, db) => {
      expect(err).toNotExist();
      connection = db;
      repo = new MongoRepository(connection, collection);
      done();
    });
  });
  after(() => {
    repo.disconnect();
  });
  describe('Object construction', () => {
    it('should only create with the appropriate constructor', () => {
      const createRepoNoParams = () => new MongoRepository();
      const createRepoOneParam = () => new MongoRepository(connection);
      const createRepoGood = () => new MongoRepository(connection, collection);
      expect(createRepoNoParams).toThrow();
      expect(createRepoOneParam).toThrow();
      expect(createRepoGood).toNotThrow();
    });
  });

  describe('generic repository tests', () => {
    const client = {
      name: 'foo'
    };
    const bag = {
      client
    };
    assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });

  });

});
