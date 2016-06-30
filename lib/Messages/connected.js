var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" connected, address ["](.+):(.+)["]$/,
  return: function (result) {
    return { type: 'connected', player: parser.parsePlayer(result[1]), ip: result[2], port: parseInt(result[3]) }
  }
};
