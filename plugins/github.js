var request = require('request');
var Plugin = require('../src/plugin');
var moment = require('moment');
class Github extends Plugin {
    constructor() {
        const settings = {
            name: 'Github',
            description: 'Desc',
            plugin: {
                url: 'https://github.com/txandy/nerdobot-slack'
            }

        };
        super(settings);

        this.settings = settings;

    }

    setMessage(message) {
        if (message.type == 'message') {
            if (message.text) {
                if (message.text.toLowerCase().indexOf('<@' + this.user.id.toLowerCase() + '> github') > -1) {
                    this.emit('fire', message);
                }
            }
        }
    }

    _onFire(message) {

        let currentChannel = this._getChannelById(message.channel);
        this.parent.postMessageToChannel(currentChannel.name, this.settings.plugin.url, {as_user: true, unfurl_links: true,unfurl_media:true});

    }

    run() {
        this.on('fire', this._onFire);
    }

}

module.exports = Github;