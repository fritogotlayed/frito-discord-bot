const chai = require('chai');
const sinon = require('sinon');

const discord = require('discord.js');
const botEvents = require('./bot-events');

const bot = require('./bot');

describe('bot', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('startBot', () => {
    it('Should start discord bot', () => {
      // Arrange
      const loginStub = sandbox.stub();
      sandbox.stub(discord, 'Client').returns({ login: loginStub });
      sandbox.stub(botEvents, 'wireEvents');

      // Act
      bot.startBot();

      // Assert
      chai.expect(loginStub.calledOnce).to.be.equal(true);
    });
  });
});
