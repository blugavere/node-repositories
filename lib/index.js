const PostgreRepository = require('./PostgreRepository');
const RedisRepository = require('./RedisRepository');
const CassandraRepository = require('./CassandraRepository');

module.exports = {
  CassandraRepository,
  PostgreRepository,
  RedisRepository
};
