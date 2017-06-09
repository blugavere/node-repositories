
'use strict';

const Repo = require('./MongooseRepository');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Assertions = require('./test/Assertions');
const uuid = require('uuid');

const modelName = uuid.v4();

const schema = new mongoose.Schema({
  name: {
    type: String
  }
});

if (!mongoose.modelSchemas[modelName]) {
  mongoose.model(modelName, schema);
}

const repo = new Repo(mongoose, modelName);

// mocha --require babel-register lib/MongooseRepository.test.js
describe('Mongoose Repository', () => {
  before(done => {
    const db = mongoose.connection;
    mongoose.connect('mongodb://localhost/test');
    db.once('open', function () {
      done();
    });

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
