const Repo = require('./MongooseRepository');
const mongoose = require('mongoose');

export const modelName = 'cats';
export const schema = new mongoose.Schema({
  name: { type: String }
});

describe('Mongoose Repository', () => {
  let repo;
  let genericTests;
  before(done => {
    if (!mongoose.modelSchemas[modelName]) {
        mongoose.model(modelName, schema);
    }
    repo = new Repo(mongoose, modelName);
    mongoose.connection.close(() => {
      mongoose.connect('mongodb://localhost/test');
      repo.clear(() => {
      done();
      });
    });
  });

  it('should be a repository', done => {
    genericTests = require('./GenericTests')(repo);
    genericTests.checkInterface();
    genericTests.implementation();
    done();
  });

});
