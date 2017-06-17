
'use strict';

const PostgreRepository = require('./PostgreRepository');
const RedisRepository = require('./RedisRepository');
const FSRepository = require('./FSRepository');
const MongoRepository = require('./MongoRepository');
const AJAXRepository = require('./AJAXRepository');

module.exports = {
  AJAXRepository,
  CassandraRepository: require('cassandra-repository'),
  FSRepository,
  MongoRepository,
  MongooseRepository: require('../packages/mongoose-repository'),
  PostgreRepository,
  RedisRepository
};
