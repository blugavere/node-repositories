
'use strict';

const expect = require('expect');
const Serializer = require('./INISerializer');

// ./node_modules/.bin/nyc mocha packages/fs-repository/Serializers/INISerializer.test.js
describe('INI Serializer', () => {
  const serializer = new Serializer();
  const cat = { name: 'Fido' };
  const expected = 'name=Fido\n';

  it('should seralize', () => {
    expect(serializer.serialize(cat)).toBe(expected);
  });

  it('should deseralize', () => {
    expect(serializer.deserialize(expected)).toEqual(cat);
  });
});
