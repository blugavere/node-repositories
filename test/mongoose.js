'use strict';

const Repo = require('../lib').MongooseRepository;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Assertions = require('./assertions');

const modelName = 'cats';

const schema = new mongoose.Schema({
  name: {
    type: String
  }
});

if (!mongoose.modelSchemas[modelName]) {
  mongoose.model(modelName, schema);
}

/**
 * NODE_ENV=test mocha --require babel-register test/mongoose.js --watch
 */

describe('Mongoose Repository', () => {
  let repo;
  before(done => {
    repo = new Repo(mongoose, modelName);
    const db = mongoose.connection;
    db.once('open', function () {
      done();
    });

    mongoose.connection.close(() => {
      mongoose.connect('mongodb://localhost/test');
    });
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
