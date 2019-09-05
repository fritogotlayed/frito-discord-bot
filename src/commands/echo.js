module.exports = function echo(args) {
  args.event.channel.send(args.message);
};
