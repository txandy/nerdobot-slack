var Nerdobot = require("./src/nerdobot");
var Config = require('./config');

// Plugins
var Tits = require('./plugins/tits');
var Github = require('./plugins/github');

var bot = new Nerdobot(Config);
bot.addPlugin(new Tits());
bot.addPlugin(new Github());

bot.run();