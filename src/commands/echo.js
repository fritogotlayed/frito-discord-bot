function help(args) {
  args.event.channel.send('Echo\'s the input back to the channel.');
}

function handler(args) {
  args.event.channel.send(args.message);
}

module.exports = {
  help,
  handler,
};
