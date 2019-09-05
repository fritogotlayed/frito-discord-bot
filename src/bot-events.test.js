const chai = require('chai');
const sinon = require('sinon');

const botEvents = require('./bot-events');

describe('botEvents', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('wireEvents', () => {
    it('Should subscribe to all known events.', () => {
      // Arrange
      const onStub = sandbox.stub();
      const clientFake = {
        on: onStub,
      };

      // Act
      botEvents.wireEvents(clientFake);

      // Assert
      const allCalls = onStub.getCalls();
      const events = [];
      chai.expect(allCalls.length).to.be.equal(3);
      allCalls.map((e) => events.push(e.args[0]));
      chai.expect(events).to.be.eql(['ready', 'message', 'disconnect']);
    });
  });

  describe('events', () => {
    let fakeClient;
    let fakeLogger;

    function buildFakeEvent(content) {
      return {
        content,
        channel: {
          send: sandbox.stub(),
        },
      };
    }

    beforeEach(() => {
      fakeClient = {
        username: 'testUsername',
        id: 'some-id',
        events: {},
        on: function on(name, handler) {
          this.events[name] = handler;
        },
        fireEvent: function fireEvent(name, ...args) {
          this.events[name](...args);
        },
        login: sandbox.stub(),
      };
      fakeLogger = {
        debug: sandbox.stub(),
        info: sandbox.stub(),
        silly: sandbox.stub(),
        verbose: sandbox.stub(),
        warn: sandbox.stub(),
      };
    });

    describe('ready', () => {
      it('logs when the event is fired', () => {
        // Arrange
        botEvents.wireEvents(fakeClient, fakeLogger);

        // Act
        fakeClient.fireEvent('ready');

        // Assert
        const infoStub = fakeLogger.info;
        const debugStub = fakeLogger.debug;
        chai.expect(infoStub.callCount).to.be.equal(2);
        chai.expect(debugStub.callCount).to.be.equal(1);

        chai.expect(infoStub.getCalls()[0].args).to.be.eql(['Connected']);
        chai.expect(infoStub.getCalls()[1].args).to.be.eql([`Logged in as: ${fakeClient.username}`]);
        chai.expect(debugStub.getCalls()[0].args).to.be.eql([`${fakeClient.username} - (${fakeClient.id})`]);
      });
    });

    describe('message', () => {
      it('ignores messages not starting with !', () => {
        // Arrange
        const testEvent = buildFakeEvent('this is a test message');
        botEvents.wireEvents(fakeClient, fakeLogger);

        // Act
        fakeClient.fireEvent('message', testEvent);

        // Assert
        chai.expect(testEvent.channel.send.callCount).to.be.equal(0);
      });

      it('logs message when no configured handler for messages starting with !', () => {
        // Arrange
        const testEvent = buildFakeEvent('!notMapped bacon');
        botEvents.wireEvents(fakeClient, fakeLogger);

        // Act
        fakeClient.fireEvent('message', testEvent);

        // Assert
        chai.expect(testEvent.channel.send.callCount).to.be.equal(0);
        chai.expect(fakeLogger.warn.callCount).to.be.equal(1);
        chai.expect(fakeLogger.warn.getCalls()[0].args).to.be.eql([`Unknown command: ${testEvent.content}`]);
      });

      it('calls configured handler for messages starting with !', () => {
        // Arrange
        const testEvent = buildFakeEvent('!echo arg1 arg2 arg3');
        botEvents.wireEvents(fakeClient, fakeLogger);

        // Act
        fakeClient.fireEvent('message', testEvent);

        // Assert
        chai.expect(testEvent.channel.send.callCount).to.be.equal(1);
        chai.expect(testEvent.channel.send.getCalls()[0].args).to.be.eql(['arg1 arg2 arg3']);
      });
    });

    describe('disconnect', () => {
      it('logs and reconnects', () => {
        // Arrange
        botEvents.wireEvents(fakeClient, fakeLogger);

        // Act
        fakeClient.fireEvent('disconnect');

        // Assert
        const warnStub = fakeLogger.warn;
        const loginStub = fakeClient.login;
        chai.expect(warnStub.callCount).to.be.equal(1);
        chai.expect(loginStub.callCount).to.be.equal(1);

        chai.expect(warnStub.getCalls()[0].args).to.be.eql(['Bot disconnected.  Reconnecting...']);
      });
    });
  });
});
