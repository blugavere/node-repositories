const PostgreRepository = require('./PostgreRepository');
const RedisRepository = require('./RedisRepository');
const CassandraRepository = require('./CassandraRepository');
const FSRepository = require('./FSRepository');
const MongoRepository = require('./MongoRepository');
const AJAXRepository = require('./AJAXRepository');

module.exports = {
  AJAXRepository,
  CassandraRepository,
  FSRepository,
  MongoRepository,
  PostgreRepository,
  RedisRepository
};
