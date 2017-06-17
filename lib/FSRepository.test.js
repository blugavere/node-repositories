
'use strict';

const Repo = require('./FSRepository');
const path = require('path');
const serializers = require('./Serializers');

const INISerializer = serializers.INISerializer;

const expect = require('expect');
const fs = require('fs');
const assertions = require('../test/assertions');

describe('Filesystem Repository', () => {
  const iniSerializer = new INISerializer();
  let repo;
  const client = {
    name: 'foo'
  };
  const bag = {
    client
  };
  before(done => {
    repo = new Repo('./data.json');
    repo.clear(() => done());
  });

  after(done => {
    setTimeout(() => {
      fs.unlinkSync(path.join(__dirname, './data.json'));
      done();
    }, 50);
  });

  it('should deal with relative paths', () => {
    let repo = new Repo('./data.json');
    expect(path.dirname(repo.path)).toEqual(__dirname);
  });

  it('should deal with more relative paths', () => {
    let repo = new Repo('../data.json');
    expect(path.dirname(repo.path)).toEqual(path.join(__dirname, '..'));
  });

  it('should deal with absolute paths', () => {
    let repo = new Repo('/Users/admin/Desktop/data.json');
    expect(path.dirname(repo.path)).toEqual('/Users/admin/Desktop');
  });

  describe('generic assertions', () => {
    assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });

  it('should be able to use a different serializer', done => {
    repo.clear(() => {
      repo.setStrategy(iniSerializer);
      done();
    });
  });

  it('should be able to act as a INI database', () => {
    describe('generic assertions', () => {
      assertions.assertions.forEach(x => {
        it(x.assertion, done => {
          x.method(repo, bag)(done);
        });
      });
    });
  });

});
