/*eslint-env node*/
var RSVP = require("rsvp");
var CoreObject = require("core-object");
var Slack = require("slack-notify");

module.exports = CoreObject.extend({
  init: function (data) {
    this._super(data);

    this.slack = Slack(this.webhookURL).extend(this._getSlackOptions());

    this.notify = function (message) {
      return new RSVP.Promise(
        function (resolve, reject) {
          if (this.enabled) {
            this.slack
              .send(message)
              .then(() => {
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            return resolve();
          }
        }.bind(this)
      );
    };
  },

  _getSlackOptions: function () {
    var options = {
      channel: this.channel,
      username: this.username,
    };
    if (this.iconURL) {
      options.icon_url = this.iconURL;
    }
    if (this.iconEmoji) {
      options.icon_emoji = this.iconEmoji;
    }
    return options;
  },
});
