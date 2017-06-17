
'use strict';

const PostgreRepository = require('./PostgreRepository');
const RedisRepository = require('./RedisRepository');
const FSRepository = require('./FSRepository');
const AJAXRepository = require('./AJAXRepository');

module.exports = {
  AJAXRepository,
  CassandraRepository: require('cassandra-repository'),
  FSRepository,
  MongoRepository: require('mongodb-repository'),
  MongooseRepository: require('mongoose-repository'),
  PostgreRepository,
  RedisRepository
};
