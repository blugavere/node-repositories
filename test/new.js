

const Repo = require('../lib/FSRepository');
const Serializer = require('../lib/Serializers/JSONSerializer');
const serializer = new Serializer();
const repo = new Repo(serializer, './data.json');

const obj = { name : 'Delifus' };

repo.add(obj, (err, res) => {
  console.log('result', err, res)
});
//console.log(repo); \