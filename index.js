/*global module*/

var Twit = require('twit');

module.exports = function(jarvis, module) {

	var twit = new Twit({
		consumer_key: module.config.consumer_key,
		consumer_secret: module.config.consumer_secret,
		access_token: module.config.access_token,
		access_token_secret: module.config.access_token_secret
	});

	var expandURLs = module.config.expandURLs || true;

	module.addAction(module.createTrigger({
		name: 'get-tweet',
		match: /https?:\/\/(?:mobile\.)?twitter\.com\/.*?\/status\/([0-9]+)/i,
		func: function(message, statusID) {
			twit.get('statuses/show/' + statusID, function(err, reply) {
				if (err) {
					return;
				}

				var text = reply.text;
				if (expandURLs) {
					reply.entities.urls.forEach(function(url) {
						text = text.replace(url.url, url.expanded_url, 'g');
					});
				}

				jarvis.reply(message, '@' + reply.user.screen_name + ': ' + text);
			});
		}
	}));

};
