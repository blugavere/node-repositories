# InMem-Repository [![NPM version][npm-image]][npm-url]

## Installation 

```sh
$ npm install --save @repositories/inmem
```

## Usage

```js

'use strict'

const mongoose = require('mongoose');
const InMemRepository = require('@repositories/inmem');

class CatRepository extends InMemRepository {
  constructor(){
    super();
    this.find = this.find.bind(this);
  }
  // custom implementations
  find(query, cb) {
    this.findAll((err, all) => {
      if(err) return cb(err);
      cb(null, _.filter(all, query))
    });
  }
}

// or if you dont need custom functionality

const repo = new InMemRepository();

repo.add({ name: 'Tom' }, (err, doc) => {
  console.log(doc);
});

```

## Getting Started


## License

MIT © [Ben Lugavere](http://benlugavere.com/)


[npm-image]: https://badge.fury.io/js/@repositories/inmem.svg
[npm-url]: https://npmjs.org/package/@repositories/inmem
[travis-image]: https://travis-ci.org/blugavere/@repositories/inmem.svg?branch=master
[travis-url]: https://travis-ci.org/blugavere/@repositories/inmem
[daviddm-image]: https://david-dm.org/blugavere/@repositories/inmem.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/@repositories/inmem
[coveralls-image]: https://coveralls.io/repos/blugavere/@repositories/inmem/badge.svg
[coveralls-url]: https://coveralls.io/r/blugavere/@repositories/inmem
