'use strict';

const expect = require('expect');
const Repo = require('../src').MongooseRepository;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const assertions = require('./assertions');

const modelName = 'cats';

const schema = new mongoose.Schema({
  name: {
    type: String
  }
});

// mocha test/mongoose.js
describe('Mongoose Repository', () => {
  let repo;
  before(() => {
    mongoose.connect('mongodb://localhost/test');
    mongoose.model(modelName, schema);
    repo = new Repo(mongoose, modelName);
  });

  after(() => {
    mongoose.connection.close();
  });

  describe('generic assertions', () => {
    const client = {
      name: 'foo'
    };

    const bag = {
      client
    };

    assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });

    it('should have a count func', () => {
      expect(repo.count).toExist();
    });
  });
});
