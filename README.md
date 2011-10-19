srcdslog
========

Srcdslog is node.js module for parsing srcds's logs, sent by it's logaddress feature.

It's still missing some matching and should be used for one server as it doesn't mention ip and the port in event arguments.

Be warned, this is far from ready.

Usage
-----

    var srcdslog = require('./lib/srcdslog.js');
    var port = 3333;
    
    var instance = new srcdslog.Parser(port);

Srcdslog listens on the UDP port of your choice for the logs from the Source Dedicated Server's.

Some of the log lines aren't identified, but here's few (there's more) of them that you can try:

    instance.on('connected', function(args) {
      console.log(args.player.name + '(' + args.player.steamid + ') connected to the server.');
    });

    instance.on('say', function(args) {
      console.log(args.player.name + '(' + args.player.steamid + ') said: ' + args.text);
    });
