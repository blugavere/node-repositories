//const CassandraRepository = require('repositories').CassandraRepository;
const CassandraRepository = require('../lib/CassandraRepository');
const Cassandra = require('express-cassandra');

const cassandra = Cassandra.createClient({
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

export const modelName = 'Cats';
export const schema = {
  fields: {
    _id: 'text',
    name: 'text'
  },
  key: ['_id']
};

let cassandraRepo;
cassandra.connect(() => {
  cassandra.loadSchema(modelName, schema);
  cassandraRepo = new CassandraRepository(cassandra, modelName);
  
  cassandraRepo.add({name:'Fido'}, (err, data) => {
    cassandraRepo.disconnect();
  });
});
