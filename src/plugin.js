var EventEmitter = require('events').EventEmitter;

class Plugin extends EventEmitter {
    constructor(settings) {
        super(settings);
        this.name = settings.name;
        this.description = settings.description;
        this.message = '';
        this.channels;
        this.user;
        this.parent;
    }

    setParent(parent)
    {
        this.parent = parent;
    }

    setUser(user) {
        this.user = user;
    }

    setChannels(channels) {
        this.channels = channels;
    }

    setDatabase(db) {
        this.db = db;
    }

    setMessage(message) {}

    _getChannelById(channelId) {
        return this.channels.filter(function (item) {
            return item.id === channelId;
        })[0];
    };
}

module.exports = Plugin;