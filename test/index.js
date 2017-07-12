
'use strict';
const expect = require('expect');
const redis = require('redis');
const repositories = require('../src');
const RedisRepository = repositories.RedisRepository;

describe('repositories', () => {
  const redisRepo = new RedisRepository(redis, 'Cats');
  after(() => {
    redisRepo.disconnect();
  });
  it('should have a redis repo!', done => {
    redisRepo.add({name: 'Fido'}, (err, data) => {
      expect(data.name).toBe('Fido');
      done();
    });
  });
});
