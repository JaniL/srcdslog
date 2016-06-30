var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: rcon from ["](.+)[:](\d+)["][:] command ["](.+)["]$/,
  return: function (result) {
    return {type: 'rcon', address: result[1], port: parseInt(result[2], 10), command: result[3]}
  }
};
