module.exports.parseTime = function(line,callback) {
  var result = line.match(/^L (\d\d)\/(\d\d)\/(\d\d\d\d) - (\d\d):(\d\d):(\d\d): /);
  if (!result || result.length == 0) return false;
  return callback(new Date(parseInt(result[3],10), parseInt(result[1],10)-1, parseInt(result[2],10), parseInt(result[4],10), parseInt(result[5],10), parseInt(result[6],10), 0));
};

module.exports.parsePlayer = function(line,callback) {
  var result = line.match(/(.+)<(\d+)><(.+)><(.+)>/);
  if (!result || result.length == 0) return false;
  return callback({ name: result[1], id: parseInt(result[2],10), steamid: result[3], team: result[4] });
};

function parseArgs(args) {
  var result = args.match(/[(]([^"]|\\")+ ["]([^"]|\\")+["][)]/g);
  return result;
}

module.exports.parseLineInfo = function(line,callback) {
//  var line = line.trim();
  /*
  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Team ["](.+)["] triggered ["](.+)["] (.+)\n\u0000$/);
  if (result !== null) {
    var lit = { type: 'teamtrigger', trigger: result[2], team: result[1], args: parseArgs(result[3]) };
    // lit[args][result[2]] = result[3];
    return lit;
  }
  */

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: World triggered ["](.+)["] (.+)\n\u0000$/);
  if (result !== null) {
    var lit = { type: 'worldtrigger', trigger: result[1], args: parseArgs(result[2]) };
    // lit[args][result[2]] = result[3];
    return callback(lit);
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: World triggered ["](.+)["]\n\u0000$/);
  if (result !== null) {
    return callback({ type: 'worldtrigger', trigger: result[1] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: rcon from ["](.+)[:](\d+)["][:] command ["](.+)["]\n\u0000$/);
  if (result !== null) {
    return callback({ type: 'rcon', address: result[1], port: parseInt(result[2],10), command: result[3] });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" picked up item ["](.+)["]\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'picked up', player: player, item: result[2] });
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" changed role to ["](.+)["]\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'changed role', player: player , role: result[2] });  
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" connected, address ["](.+):(d+)["]\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'connected', player: player , ip: result[2], port: parseInt(result[3]) });  
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" STEAM USERID validated\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'STEAM USERID validated', player: player });  
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" joined team ["](.+)["]\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'joined team', player: player, team: result[2] });  
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" entered the game\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'entered the game', player: player });  
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" spawned as ["](.+)["]\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
     return callback({ type: 'spawned', player: player, role: result[2] });
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" say ["](.+)["]\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'say', player: player, text: result[2] });
    });
  }

  var result = line.match(/^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" say_team ["](.+)["]\n\u0000$/);
  if (result !== null) {
    module.exports.parsePlayer(result[1], function(player) {
      return callback({ type: 'say_team', player: player, text: result[2] });
    });
  }

};


