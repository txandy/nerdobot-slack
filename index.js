var Nerdobot = require("./src/nerdobot");
var Config = require('./config');

// Plugins
var Tits = require('./plugins/tits');

var bot = new Nerdobot(Config);
bot.addPlugin(new Tits());

bot.run();