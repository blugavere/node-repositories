//const expect = require('expect');
const Repo = require('./CassandraRepository');
const Cassandra = require('express-cassandra');

const models = Cassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'mykeyspace',
    queryOptions: { consistency: Cassandra.consistencies.one }
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

export const modelName = 'clients';
export const schema = {
  fields: {
    _id: 'text',
    name: 'text'
  },
  key: ['_id']
};

describe('Cassandra Repository', () => {
  let repo;
  let genericTests;

  before((done) => {
    if (!models.instance[modelName]) {
      models.connect(() => {
        models.loadSchema(modelName, schema);
        repo = new Repo(models, modelName);
        genericTests = require('./GenericTests')(repo);
        repo.clear();
        done();
      });
    }
  });

  after(done => {
    models.close(() => {
      done();
    });
  });
  
  it('Generic Repository', () => {
    genericTests.checkInterface();
    genericTests.implementation();
  });
  
});
