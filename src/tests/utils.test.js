const {
  installChromiumIfNeeded,
  getChromiumPath,
} = require('../utils');

describe('NetlifyChromiumPlugin utils', () => {

  describe('installChromiumIfNeeded', () => {

    it('exists and is exported', () => {
      expect(installChromiumIfNeeded).toBeDefined();
      expect(typeof installChromiumIfNeeded).toEqual('function');
    });

  });

  describe('getChromiumPath', () => {

    it('exists and is exported', () => {
      expect(getChromiumPath).toBeDefined();
      expect(typeof getChromiumPath).toEqual('function');
    });

  });

});