const expect = require('expect');
const repositories = require('../lib');
const RedisRepository = repositories.RedisRepository;

describe('repositories', () => {
  const redisRepo = new RedisRepository('Cats');
  after(() => {
    redisRepo.disconnect();
  });
  it('should have a redis repo!', done => {
    redisRepo.add({name: 'Fido'}, (err, data) => {
      //console.log(data);
      expect(data.name).toBe('Fido');
      done();
    });
  });
});
