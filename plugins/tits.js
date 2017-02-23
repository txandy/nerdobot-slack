var request = require('request');
var Plugin = require('../src/plugin');
var moment = require('moment');
class Tits extends Plugin {
    constructor() {
        const settings = {
            name: 'Tits',
            description: 'Desc',
            plugin: {
                url: 'https://www.reddit.com/r/legalteens+nipples+gonewild+nsfw+nsfw_gif+tits+realgirls/.json?'
            }

        };
        super(settings);

        this.settings = settings;

        this.cache = null;
        this.cacheTime = null;
    }

    setMessage(message) {
        if (message.type == 'message') {
            if (message.text) {
                if (message.text.toLowerCase().indexOf('<@' + this.user.id.toLowerCase() + '> tits') > -1) {
                    this.emit('fire', message);
                }
            }
        }
    }

    _onFire(message) {

        let currentChannel = this._getChannelById(message.channel);

        if (this.cache == null || (this.cacheTime == null || moment({}).isAfter(this.cacheTime,'minute') )) {
            this.getTits().then((data) => {
                this.parent.postMessageToChannel(currentChannel.name, data, {as_user: true, unfurl_links: false,unfurl_media:false});
            });
        } else {
            let data = this._getElementFromBody(this.cache);

            this.parent.postMessageToChannel(currentChannel.name, data, {as_user: true, unfurl_links: false,unfurl_media:false});
        }
    }

    run() {
        this.on('fire', this._onFire);
    }

    getTits() {
        let self = this;
        return new Promise((accept, reject) => {
            let options = {
                uri: this.settings.plugin.url,
                method: 'GET',
                json: true
            };

            return request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }

                if (response.statusCode != 200) {
                    reject(response.statusCode);
                }

                if (!body) {
                    reject("No response");
                }

                self.cache = body.data.children;
                self.cacheTime = moment({}).add('5','m');

                let link = self._getElementFromBody(self.cache);

                accept(link);
            });
        });

    }

    _getElementFromBody(body) {
        let num = Math.floor(Math.random() * body.length);
        return body[num].data.url;
    }


}

module.exports = Tits;