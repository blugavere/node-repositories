const expect = require('expect');
const MongoClient = require('mongodb').MongoClient;
const MongoRepository = require('./MongoRepository');
const Repo = MongoRepository;

export const collection = 'clients';
let connection;
let repo;
let genericTests;

MongoClient.connect('mongodb://localhost:27017/test', (err, db) => {
  if (err) return run(err);
  connection = db;
  repo = new MongoRepository(connection, collection);
  genericTests = require('./GenericTests')(repo);
});

setTimeout(() => {

  describe('MongoDB Repository', () => {


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

    describe('generic repository tests', () => {

      describe('interface', () => {
        genericTests.checkInterface();
      });

      describe('implementation', () => {
        genericTests.implementation();
      });
    });

  });

  //run();
}, 2000);
