'use strict';

const expect = require('expect');
const Repositories = require('./');
describe('index', () => {
  [
    'MongoRepository',
    'MongooseRepository',
    'RedisRepository',
    'FSRepository',
    'PostgreRepository',
    'CassandraRepository',
    'AJAXRepository'
  ].forEach(Repository => {
    it(`${Repository} should exist.`, () => {
      expect(Repositories[Repository]).toExist();
    });
  });
});
