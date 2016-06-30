var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" triggered "([^"]+)" ?(.+)?$/,
  return: function (result) {
    var event = {
      type: 'trigger',
      player: parser.parsePlayer(result[1]),
      trigger: result[2],
      args: parser.parseArgs(result[3])
    };

    switch (event.trigger){
      case 'Dropped_The_Bomb':
        this.emit('bombDropped', {
          player: event.player,
        });
        break;
      case 'Got_The_Bomb':
        this.emit('bombPicked',{
          player: event.player,
        });
        break;
      case 'Planted_The_Bomb':
        this.emit('bombPlanted',{
          player: event.player,
        });
        break;
      case 'Begin_Bomb_Defuse_With_Kit':
        this.emit('bombDefusing',{
          player: event.player,
          kits: true,
        });
        break;
      default:break;
    }

    return event
  }
};
