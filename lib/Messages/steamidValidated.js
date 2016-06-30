var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" STEAM USERID validated$/,
  return: function (result) {
    return { type: 'STEAM USERID validated', player: parser.parsePlayer(result[1]) }
  }
};
