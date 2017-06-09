'use strict';

const Repo = require('./CassandraRepository');
const Cassandra = require('express-cassandra');
const Assertions = require('./test/Assertions');
const expect = require('expect');

const models = Cassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: {
      port: 9042
    },
    keyspace: 'mykeyspace',
    queryOptions: {
      consistency: Cassandra.consistencies.one
    }
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1
    },
    migration: 'safe',
    createKeyspace: true
  }
});

const modelName = 'clients';

const schema = {
  fields: {
    _id: 'text',
    name: 'text'
  },
  key: ['_id']
};

// mocha --require babel-register lib/CassandraRepository.test.js --watch

describe('Cassandra Repository', function () {
  let repo;
  before(function (done) {
    this.timeout(10000);
    models.connect(err => {
      expect(err).toNotExist();
      models.loadSchema(modelName, schema, err => {
        repo = new Repo(models, modelName);
        done(err);
      });
    });
  });
  after(done => {
    models.close(() => {
      done();
    });
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
