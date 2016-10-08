const PostgreRepository = require('./PostgreRepository');
const RedisRepository = require('./RedisRepository');
const CassandraRepository = require('./CassandraRepository');
const FSRepository = require('./FSRepository');
const MongoRepository = require('./MongoRepository');

module.exports = {
  CassandraRepository,
  FSRepository,
  PostgreRepository,
  RedisRepository,
  MongoRepository
};
