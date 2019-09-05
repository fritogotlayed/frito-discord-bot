const assert = require('assert');
const sinon = require('sinon');
const logger = require('winston');

const roll = require('./roll');

describe('commands', () => {
  beforeEach(() => {
    this.sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  describe('roll', () => {
    it('Should emit correctly for single roll', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);

      // Act
      const args = {
        event,
        message: '2d6',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '2d6: 2 + 5 = 7');
    });

    it('Should emit correctly for multiple roll', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);
      randomStub.onCall(2).returns(0.937548);
      randomStub.onCall(3).returns(0.304728);

      // Act
      const args = {
        event,
        message: '2d6 2d10',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '2d6: 2 + 5 = 7\n2d10: 10 + 4 = 14');
    });

    it('Should emit correctly for single roll of 2d0', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);

      // Act
      const args = {
        event,
        message: '2d0',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '2d0: 0 + 0 = 0');
    });

    it('Should emit correctly for single roll of 2d1', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);

      // Act
      const args = {
        event,
        message: '2d1',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '2d1: 1 + 1 = 2');
    });

    it('Should default to 1d6 roll with empty arguments', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);

      // Act
      const args = {
        event,
        message: '',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '1d6: 2 = 2');
    });

    it('Should assume one when number of die not specified', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);

      // Act
      const args = {
        event,
        message: 'd6',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '1d6: 2 = 2');
    });

    it('Should assume 6 when die type not specified', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);

      // Act
      const args = {
        event,
        message: '2d',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '2d6: 2 + 5 = 7');
    });

    it('Should emit correctly when worst scenario specified', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.937548);
      randomStub.onCall(1).returns(0.304728);

      // Act
      const args = {
        event,
        message: 'w2d10',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, 'w[2d10]: 10, 4 ->   worst: 4');
    });

    it('Should emit correctly when best scenario specified', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.937548);
      randomStub.onCall(1).returns(0.304728);

      // Act
      const args = {
        event,
        message: 'b2d10',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, 'b[2d10]: 10, 4 ->   best: 10');
    });

    it('Should emit correctly when modifier is specified', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.937548);
      randomStub.onCall(1).returns(0.304728);

      // Act
      const args = {
        event,
        message: '2d10+2',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, '2d10+2: 10 + 4 = 14  modified: 16');
    });

    it('Should emit correctly when modifier is below 0', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);

      // Act
      const args = {
        event,
        message: 'w2d6-3',
      };
      roll(args);

      // Assert
      assert(sendMessageStub.called);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(callArgs, 'w[2d6]-3: 2, 5 ->   worst: 2  modified: 0');
    });

    it('Should emit error message when an error occurs.', () => {
      // Arrange
      const sendMessageStub = this.sandbox.stub();
      const event = {
        channel: {
          send: sendMessageStub,
        },
      };
      const consoleStub = this.sandbox.stub(logger);
      const randomStub = this.sandbox.stub(Math, 'random');
      randomStub.onCall(0).returns(0.233238);
      randomStub.onCall(1).returns(0.746827);
      randomStub.onCall(2).returns(0.196835);
      randomStub.onCall(3).returns(0.816854);
      randomStub.onCall(4).returns(0.068496);
      randomStub.onCall(5).returns(0.047205);
      randomStub.onCall(6).returns(0.390546);
      randomStub.onCall(7).returns(0.809345);

      // Act
      const args = {
        event,
        message: 12,
      };
      roll(args);

      // Assert
      assert.equal(sendMessageStub.called, true);
      assert.equal(consoleStub.warn.callCount, 2);
      const callArgs = sendMessageStub.getCall(0).args[0];
      assert.equal(
        callArgs.startsWith('I had a problem figuring out what to do. Ask a mod to check the logs with this error ID: '),
        true,
      );
    });
  });
});
