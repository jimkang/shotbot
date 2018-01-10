/* global process */

var waterfall = require('async-waterfall');
// var callNextTick = require('call-next-tick');
var Twit = require('twit');
var Webimage = require('webimage');
var fs = require('fs');

var configPath;

if (process.env.CONFIG) {
  configPath = './' + process.env.CONFIG;
} else {
  configPath = './config';
}

var config = require(configPath);

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = process.argv[2].toLowerCase() == '--dry';
}

var webimage;
var twit = new Twit(config.twitter);

waterfall([Webimage, getShot, shutDownWebimage, postTweet], wrapUp);

function getShot(webImageInst, done) {
  webimage = webImageInst;
  webimage.getImage(
    {
      url: config.shot.url,
      screenshotOpts: {
        clip: {
          x: 0,
          y: 0,
          width: 640,
          height: 640
        }
      },
      viewportOpts: {
        width: 640,
        height: 640,
        deviceScaleFactor: 1
      },
      supersampleOpts: {
        desiredBufferType: 'jpeg',
        resizeMode: 'bezier'
      }
    },
    done
  );
}

function shutDownWebimage(buffer, done) {
  webimage.shutDown(passBuffer);

  function passBuffer(error) {
    done(error, buffer);
  }
}

function postTweet(buffer, done) {
  if (dryRun) {
    let filePath =
      'scratch/' +
      config.shot.alt +
      '-' +
      new Date().toISOString().replace(/:/g, '-') +
      '.jpg';

    console.log('Writing out', filePath);
    fs.writeFileSync(filePath, buffer);
    process.exit();
  } else {
  }
}

function wrapUp(error, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
  } else if (!dryRun) {
    console.log('Tweeted:', data.text);
  }
}
