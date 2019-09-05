const chai = require('chai');
const sinon = require('sinon');

const index = require('./index');

describe('commands', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  describe('index', () => {
    it('Should load all available modules', () => {
      // Assert
      const keys = Object.keys(index);
      chai.expect(keys).to.be.eql(['echo', 'roll']);
      for (let i = 0; i < keys.length; i += 1) {
        chai.expect(typeof index[keys[i]]).to.be.equal('function');
      }
    });
  });
});
