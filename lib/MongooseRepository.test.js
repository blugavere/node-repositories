
'use strict';

const Repo = require('./MongooseRepository');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Assertions = require('./test/Assertions');

export const modelName = 'cats';
export const schema = new mongoose.Schema({
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

  describe ('Mongoose methods', () => {
    it ('Testing count method', function (done){
        expect(typeof repo.count).toExist();
        expect(typeof repo.count).toBe('function');
        done();
    });
  });
});
