# InMem-Repository 
[![NPM version][npm-image]][npm-url]
![NPM Downloads][downloads-url]

## Installation 

```sh
$ npm install --save @repositories/inmem
```

## Usage

```js

'use strict'

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

## License

MIT © [Ben Lugavere](http://benlugavere.com/)

[npm-image]: https://img.shields.io/npm/v/@repositories/inmem.svg
[npm-url]: https://npmjs.org/package/@repositories/inmem
[downloads-url]: https://img.shields.io/npm/dm/@repositories/inmem.svg?style=flat