import BaseClass = require('../BaseClass');

describe('basic', () => {

  let instanceA: BaseClass = new BaseClass();
  let instanceB: BaseClass = new BaseClass();

  it('"instanceA.hello" should be "world"', () => {
    instanceA._set('hello', 'world');
    expect(instanceA._get('hello')).toEqual('world');
  });

  it('"instanceB.anotherHello" should be the same as "instanceA.hello"', () => {
    instanceA._bindTo('hello', instanceB, 'anotherHello');
    expect(instanceB._get('anotherHello')).toEqual('world');
  });

});
