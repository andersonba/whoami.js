/*eslint-disable no-var,no-console*/

var Promise = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser')
var useragent = require('useragent');
var cors = require('cors');
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
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.get('/check', function(req, res) {
  res.send('OK');
});

app.post('/api', function(req, res) {
  var output = req.body;
  var params = req.query;

  if (!output) {
    res.status(204).json({ error: 'No payload was sent' });
    return;
  }

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
    return uploadScreenshot
    .then(function() {
      return slackAPI.send({
        text: 'New ticket received',
        channel: process.env.SLACK_CHANNEL,
        username: 'whoami.js',
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
    })
    .then(function(data) {
      res.json({
        success: 1,
        data: data
      });
    })
    .catch(function(err) {
      res.status(500).json({
        error: err.message
      });
    })
  }

  res.status(400).json({
    error: '"to" param is invalid'
  });
});

app.listen(port, function() {
  console.log('whoami.js server listening in port', port);
});
