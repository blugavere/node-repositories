const expect = require('expect');
const MongoClient = require('mongodb').MongoClient;

const MongoRepository = require('./MongoRepository');
const Repo = MongoRepository;


export const collection = 'clients';

describe('MongoDB Repository', () => {
  let connection;
  let repo;
  let genericTests;

  before(done => {
    MongoClient.connect('mongodb://admin:admin@localhost:27017/travis', (err, db) => {
      if (err) {
        return done(err);
      }

      connection = db;

      repo = new MongoRepository(connection, collection);

      genericTests = require('./GenericTests')(repo);

      repo.clear();

      done();
    });
  });

  // Note: cannot close the connection because the generic tests will
  //       be executed after the `after` hook.
  // after(() => {
  //   connection.close();
  // });

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

  it('Generic Repository', () => {
    genericTests.checkInterface();
    genericTests.implementation();
  });
});
