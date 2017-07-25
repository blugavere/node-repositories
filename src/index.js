
'use strict';

const PostgreRepository = require('./PostgreRepository');
const FSRepository = require('./FSRepository');

module.exports = {
  AJAXRepository: require('@repositories/ajax'),
  CassandraRepository: require('cassandra-repository'),
  InMemRepository: require('@repositories/inmem'),
  FSRepository,
  MongoRepository: require('mongodb-repository'),
  MongooseRepository: require('mongoose-repository'),
  PostgreRepository,
  RedisRepository: require('@repositories/redis')
};
