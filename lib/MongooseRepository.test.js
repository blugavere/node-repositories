const Repo = require('./MongooseRepository');
const mongoose = require('mongoose');

export const modelName = 'cats';
export const schema = new mongoose.Schema({
  name: { type: String }
});

describe('Mongoose Repository', () => {
  if (!mongoose.modelSchemas[modelName]) {
    mongoose.model(modelName, schema);
  }
  let repo = new Repo(mongoose, modelName);
  let genericTests;
  
  before(done => {
    var db = mongoose.connection;
    db.once('open', function() {
     done();
    });
    
    mongoose.connection.close(() => {
      mongoose.connect('mongodb://localhost/test');
    });
  });

  describe('Generic Repository', () => {
    genericTests = require('./GenericTests')(repo);
    genericTests.checkInterface();
    genericTests.implementation();
  });

});
