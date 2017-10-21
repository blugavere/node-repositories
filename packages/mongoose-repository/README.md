# Mongoose Repository
[![NPM version][npm-image]][npm-url]
[![dependencies Status][daviddm-image]][daviddm-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM Downloads][downloads-url]][downloads-link]
[![Build Status][travis-image]][travis-url]

## Installation 

```sh
$ npm install --save mongoose-repository
```

## Usage

```js

'use strict'

const mongoose = require('mongoose');
const MongooseRepository = require('mongoose-repository');

class CatRepository extends MongooseRepository {
  constructor(mongoose, modelName) {
    super(mongoose, modelName);
  }
}

// or if you dont need custom functionality

const repo = new MongooseRepository(mongoose, modelName);
```

## Getting Started

```js

'use strict';

const mongoose = require('mongoose');

const modelName = 'cats';

// configure a schema somewhere
const schema = new mongoose.Schema({
  name: { type: String }
});

// register it to mongoose
mongoose.model(modelName, schema);

// connect to mongodb
mongoose.connect('mongodb://localhost');

const MongooseRepository = require('mongoose-repository');
const repo = new MongooseRepository(mongoose, modelName);

// default json format
const cat = { name : 'Fido' };

repo.add(cat, (err, data) => {
  console.log(data);
  repo.disconnect();
});

```


## License

MIT © [Ben Lugavere](http://benlugavere.com/)


[npm-image]: https://badge.fury.io/js/mongoose-repository.svg
[npm-url]: https://npmjs.org/package/mongoose-repository
[travis-image]: https://travis-ci.org/blugavere/mongoose-repository.svg?branch=master
[travis-url]: https://travis-ci.org/blugavere/mongoose-repository
[daviddm-image]: https://david-dm.org/blugavere/mongoose-repository.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/mongoose-repository
[coveralls-image]: https://coveralls.io/repos/blugavere/mongoose-repository/badge.svg
[coveralls-url]: https://coveralls.io/r/blugavere/mongoose-repository
[downloads-url]: https://img.shields.io/npm/dm/mongoose-repository.svg?style=flat
[downloads-link]: https://www.npmjs.com/package/mongoose-repository
