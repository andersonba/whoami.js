/*eslint-disable no-var,no-console*/

var Promise = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser')
var useragent = require('useragent');
var Slack = require('node-slack');
var cloudinary = require('cloudinary');

// required environment
['SLACK_HOOK_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].map(function(k) {
  if (!process.env[k]) {
    console.log('Please, set "' + k + '" environment variable.');
    process.exit(0);
  }
});

// Configure Slack and Cloudinary
var slackAPI = new Slack(process.env.SLACK_HOOK_URL);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api', function(req, res) {
  var output = req.body;
  var params = req.query;

  if (!output) {
    res.status(204).json({ error: 'No payload was sent' });
    return;
  }

  console.log('New request');

  // detect browser user agent
  var agent = useragent.parse(output.basic.userAgent);

  // upload screenshot to cloudinary
  var uploadScreenshot = new Promise(function(resolve) {
    if (!output.screenshot) { return resolve(); }
    cloudinary.uploader.upload(output.screenshot, function(result) {
      output.screenshot = result.secure_url;
      resolve();
    });
  });

  if (params.to === 'slack') {
    uploadScreenshot
    .then(function() {
      slackAPI.send({
        text: 'New ticket received',
        channel: process.env.SLACK_CHANNEL,
        username: 'whoami.js',
        icon_url: 'http://d23ks75jpqx8rv.cloudfront.net/images/logo/meta.png',
        attachments: [{
          title: 'Payload',
          color: 'good',
          text: '```\n' + JSON.stringify(output) + '\n```',
          mrkdwn_in: ['text'],
          fields: [
            { title: 'Title', value: output.basic.title, short: true },
            { title: 'URL', value: output.basic.url, short: true },
            { title: 'User', value: (output.context.user || {}).pid || 'Anonymous', short: true },
            { title: 'Server', value: output.context.serverId || 'Unknown', short: true },
            { title: 'Browser', value: agent.toAgent(), short: true },
            { title: 'OS', value: agent.os.toString(), short: true },
            { title: 'Device', value: agent.device.toString(), short: true },
            { title: 'Resolution', value: output.basic.resolution, short: true },
            { title: 'Errors', value: output.error.length, short: true },
            { title: 'Console', value: output.console.length, short: true },
            { title: 'Screenshot', value: output.screenshot }
          ]
        }]
      });
    });
  }

  res.json({ success: 1 });
});

// enable test page
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('dist'));
}

app.listen(port, function() {
  console.log('whoami.js server listening in port', port);
});
