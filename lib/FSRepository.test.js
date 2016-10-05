const FSRepo = require('./FSRepository');
const path = require('path');
const serializers = require('./Serializers');
const { JSONSerializer, INISerializer } = serializers;

describe('Filesystem Repository', () => {
  const jsonSerializer = new JSONSerializer();
  const iniSerializer = new INISerializer();
  
  let repo = new FSRepo(jsonSerializer, './data.json');
  //console.log(repo);
  //repo.setStrategy(jsonSerializer);
  let genericTests = require('./GenericTests')(repo);
  
  before(() => {
    //repo.clear();
  });
/*
  it('should find all', () => {
    console.log('check', repo.strategy)
    repo.findAll((err, res) => {
      console.log(res);
    });
  });

  it('should find all', () => {
    console.log('check', repo.strategy)
    repo.findAll((err, res) => {
      console.log(res);
    });
  });
*/
  genericTests.checkInterface();
  genericTests.implementation();

  describe('implements strategy pattern w setter injection', () => {
    it('should be able to use a different serializer', () => {
      repo.setStrategy(iniSerializer);
    });
  });

});
