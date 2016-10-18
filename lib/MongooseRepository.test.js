const Repo = require('./MongooseRepository');
const mongoose = require('mongoose');

export const modelName = 'cats';
export const schema = new mongoose.Schema({
  name: { type: String }
});

if (!mongoose.modelSchemas[modelName]) {
  mongoose.model(modelName, schema);
}

let repo = new Repo(mongoose, modelName);
let genericTests = require('./GenericTests')(repo);

setTimeout(() => {

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

    describe('generic repository tests', () => {

      describe('interface', () => {
        genericTests.checkInterface();
      });

      describe('implementation', () => {
        genericTests.implementation();
      });

    });
  });

  //run();
}, 3000);
