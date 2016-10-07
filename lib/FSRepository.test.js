const Repo = require('./FSRepository');
const path = require('path');
const serializers = require('./Serializers');
const { INISerializer } = serializers;
const expect = require('expect');
const fs = require('fs'); 

describe('Filesystem Repository', () => {
  const iniSerializer = new INISerializer();
  let repo;

  before(done => {
    repo = new Repo('./data.json');
    repo.clear(() => done());
  });

  after(() => {
    setTimeout(() => {
      fs.unlinkSync(path.join(__dirname, './data.json'));    
    }, 50);
  });

  it('should deal with relative paths', () => {
    let repo = new Repo('./data.json');
    expect(path.dirname(repo.path)).toEqual(__dirname);
  });

  it('should deal with more relative paths', () => {
    let repo = new Repo('../data.json');
    expect(path.dirname(repo.path)).toEqual(path.join(__dirname, '..'));
  });
  
  it('should deal with absolute paths', () => {
    let repo = new Repo('/Users/admin/Desktop/data.json');
    expect(path.dirname(repo.path)).toEqual('/Users/admin/Desktop');
  });

  it('should be able to act as a JSON database', (done) => {
    let genericTests = require('./GenericTests')(repo);
    genericTests.checkInterface();
    genericTests.implementation();
    done();
  });

  it('should be able to use a different serializer', done => {
    repo.clear(() =>{
      repo.setStrategy(iniSerializer);
      done();
    });
  });

  it('should be able to act as a INI database', () => {
    let genericTests = require('./GenericTests')(repo);
    genericTests.checkInterface();
    genericTests.implementation();
  });

});
