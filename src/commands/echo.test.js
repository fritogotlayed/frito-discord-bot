const assert = require('assert');
const sinon = require('sinon');

const echo = require('./echo');

describe('commands', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  describe('echo', () => {
    it('Should emit the exact message to the channel', () => {
      // Arrange
      const sendStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendStub,
        },
      };

      // Act
      const args = {
        event,
        message: 'sample message',
      };
      echo.handler(args);

      // Assert
      assert(event.channel.send.called);
      const callArgs = sendStub.getCall(0).args[0];
      assert.equal(callArgs, 'sample message');
    });
  });

  describe('help', () => {
    it('Should emit the help text to channel', () => {
      // Arrange
      const sendStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendStub,
        },
      };

      // Act
      const args = {
        event,
      };
      echo.help(args);

      // Assert
      assert(event.channel.send.called);
      const callArgs = sendStub.getCall(0).args[0];
      assert.equal(callArgs, 'Echo\'s the input back to the channel.');
    });
  });
});
