'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');
var _ = require('lodash');

class NerdoBot extends Bot {

    constructor(settings) {
        super(settings);

        this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'nerdobot.db');

        this.user = null;
        this.db = null;

        this.plugins = [];
    }

    run() {
        this.on('start', this._onStart);
        this.on('message', this._onMessage);
        this.on('userSet', this._loadPlugins);

    }

    _loadPlugins() {
        // Load plugins
        this.plugins.map((plugin) => {
            console.log("Loading plugin -> " + plugin.name);
            plugin.setUser(this.user);
            plugin.setDatabase(this.db);
            plugin.setChannels(this.channels);
            plugin.setParent(this);
            plugin.run();
            console.log("Loaded plugin -> " + plugin.name);
        });
    }

    addPlugin(plugin) {
        this.plugins.push(plugin);
    }

    _onStart() {
        this._loadBotUser();
        this._connectDb();
        this._firstRunCheck();
    }

    _onMessage(message) {
        this.plugins.map((plugin) => {
            plugin.setMessage(message);
        })
    }

    _connectDb() {
        if (!fs.existsSync(this.dbPath)) {
            console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
            process.exit(1);
        }

        this.db = new SQLite.Database(this.dbPath);
    }

    _loadBotUser() {
        this.users.map((user) => {
            if (user.name == this.name) {
                this.user = user;
                this.emit('userSet');
                return true;
            }
        });
    }

    _firstRunCheck() {
        var self = this;

        // Create table if no exist
        self.db.run("CREATE TABLE if not exists info (val TEXT, name TEXT)");

        self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
            if (err) {
                return console.error('DATABASE ERROR:', err);
            }

            var currentTime = (new Date()).toJSON();

            // this is a first run
            if (!record) {
                self._welcomeMessage();
                return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
            }

            // updates with new last running time
            self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
        });
    }

    _welcomeMessage() {
        this.postMessageToUser('txandy', 'Hi im here ' + this.name);
        /*this.postMessageToChannel(this.channels[0].name, 'Hi guys, roundhouse-kick anyone?' +
         '\n I can tell jokes, but very honest ones. Just say `Chuck Norris` or `' + this.name + '` to invoke me!',
         {as_user: true});*/
    }

    _getChannelById(channelId) {
        return this.channels.filter(function (item) {
            return item.id === channelId;
        })[0];
    };

}

module.exports = NerdoBot;