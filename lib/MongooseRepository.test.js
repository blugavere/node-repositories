
'use strict';

const Repo = require('./MongooseRepository');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Assertions = require('./test/Assertions');

const modelName = 'cats';

const schema = new mongoose.Schema({
  name: {
    type: String
  }
});

// mocha --require babel-register lib/MongooseRepository.test.js
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

    Assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });
});
