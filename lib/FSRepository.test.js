const Repo = require('./FSRepository');
const path = require('path');

describe('Redis Repository', () => {
  let repo = new Repo('data.json');
  let genericTests = require('./GenericTests')(repo);
  before(() => {
    //repo.clear();
  });
  genericTests.checkInterface();
  genericTests.implementation();
});
