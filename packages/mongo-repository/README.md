
# MongoDB Repository
[![NPM version][npm-image]][npm-url][![dependencies Status](https://david-dm.org/blugavere/mongodb-repository/status.svg)](https://david-dm.org/blugavere/mongodb-repository) [![Coverage Status](https://coveralls.io/repos/github/blugavere/mongodb-repository/badge.svg?branch=master)](https://coveralls.io/github/blugavere/mongodb-repository?branch=master)[![NPM Downloads](https://img.shields.io/npm/dm/mongodb-repository.svg?style=flat)](https://www.npmjs.com/package/mongodb-repository)[![Build Status](https://travis-ci.org/blugavere/mongodb-repository.svg?branch=master)](https://travis-ci.org/blugavere/mongodb-repository)[![Patreon](https://img.shields.io/badge/patreon-support%20the%20author-blue.svg)](https://www.patreon.com/blugavere)

## Installation 

```sh
$ npm install --save mongodb-repository
```

## Usage

```js

'use strict'

const MongoRepository = require('mongodb-repository');

class CatRepository extends MongoRepository {
  constructor(db, modelName) {
    super(db, modelName);
  }
}

// or if you dont need custom functionality

const repo = new MongoRepository(db, modelName);
```

## Getting Started

```js

'use strict';

const MongoClient = require('mongodb').MongoClient;

// configure a collection name
const collection = 'cats';
const MongoRepository = require('mongodb-repository');

let repo;

// connect to mongodb
MongoClient.connect('mongodb://localhost', (err, db) => {

  // construct a repo
  repo = new MongoRepository(db, collection);

  repo.add({name:'Fido'}, (err, data) => {
    console.log(data);
    repo.disconnect();
  });
}

```


## License

MIT © [Ben Lugavere](http://benlugavere.com/)


[npm-image]: https://badge.fury.io/js/mongodb-repository.svg
[npm-url]: https://npmjs.org/package/mongodb-repository
[travis-image]: https://travis-ci.org/blugavere/mongodb-repository.svg?branch=master
[travis-url]: https://travis-ci.org/blugavere/mongodb-repository
[daviddm-image]: https://david-dm.org/blugavere/mongodb-repository.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/mongodb-repository
[coveralls-image]: https://coveralls.io/repos/blugavere/mongodb-repository/badge.svg
[coveralls-url]: https://coveralls.io/r/blugavere/mongodb-repository
