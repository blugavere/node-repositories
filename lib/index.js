const PostgreRepository = require('./PostgreRepository');
const RedisRepository = require('./RedisRepository');
const CassandraRepository = require('./CassandraRepository');
const FSRepository = require('./FSRepository');

module.exports = {
  CassandraRepository,
  FSRepository,
  PostgreRepository,
  RedisRepository
};
