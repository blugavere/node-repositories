
'use strict';

const expect = require('expect');
const Serializer = require('./INISerializer');

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
