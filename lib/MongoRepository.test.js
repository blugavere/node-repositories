'use strict';

const expect = require('expect');
const MongoClient = require('mongodb').MongoClient;
const MongoRepository = require('./MongoRepository');
const Repo = MongoRepository;
const Assertions = require('../test/assertions');

const collection = 'clients';


describe('MongoDB Repository', () => {
  let connection;
  let repo;

  before(done => {
    MongoClient.connect('mongodb://localhost:27017/test', (err, db) => {
      expect(err).toNotExist();
      connection = db;
      repo = new MongoRepository(connection, collection);
      done();
    });
  });

  // Note: cannot close the connection because the generic tests will
  //       be executed after the `after` hook.
  after(() => {
    connection.close();
  });

  describe('Object construction', () => {
    it('should only create with the appropriate constructor', () => {
      let createRepoNoParams = () => new Repo();
      let createRepoOneParam = () => new Repo(connection);
      let createRepoGood = () => new Repo(connection, collection);
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
    Assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });

  });

});
