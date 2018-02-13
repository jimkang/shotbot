/* global process */

var waterfall = require('async-waterfall');
// var callNextTick = require('call-next-tick');
var Twit = require('twit');
var Webimage = require('webimage');
var fs = require('fs');
var callNextTick = require('call-next-tick');
var StaticWebArchiveOnGit = require('static-web-archive-on-git');
var randomId = require('idmaker').randomId;
var queue = require('d3-queue').queue;
var postImage = require('post-image-to-twitter');

var shotRetries = 0;
var shotRetryLimit = 5;

if (process.env.BOT) {
  var configPath = './configs/' + process.env.BOT + '-config';
  var behaviorPath = './behaviors/' + process.env.BOT + '-behavior';
} else {
  console.log('Usage: BOT=botname node post-shot.js [--dry]');
  process.exit();
}

var config = require(configPath);
var behavior = require(behaviorPath);

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = process.argv[2].toLowerCase() == '--dry';
}

var staticWebStream;
if (behavior.postingTargets.indexOf('archive') !== -1) {
  staticWebStream = StaticWebArchiveOnGit({
    config: config.github,
    title: behavior.archive.name,
    footerHTML: behavior.archive.footerHTML,
    maxEntriesPerPage: behavior.maxEntriesPerPage
  });
}

var webimage;

var twit;

if (behavior.postingTargets.indexOf('twitter') !== -1) {
  twit = new Twit(config.twitter);
}

kickOff();

function kickOff() {
  try {
    waterfall([Webimage, getShot, shutDownWebimage, postToTargets], wrapUp);
  } catch (e) {
    retry();
  }
}

function getShot(webImageInst, done) {
  webimage = webImageInst;
  webimage.getImage(behavior.webimageOpts, done);
}

function shutDownWebimage(buffer, done) {
  webimage.shutDown(passBuffer);

  function passBuffer(error) {
    done(error, buffer);
  }
}

function postToTargets(buffer, done) {
  var altText = behavior.getAltText();
  var caption = behavior.getCaption();

  if (dryRun) {
    let filePath =
      'scratch/' +
      altText +
      '-' +
      new Date().toISOString().replace(/:/g, '-') +
      '.png';

    console.log('Writing out', filePath);
    fs.writeFileSync(filePath, buffer);
    callNextTick(done);
  } else {
    var q = queue();
    if (behavior.postingTargets.indexOf('archive') !== -1) {
      q.defer(postToArchive, buffer, altText, caption);
    }
    if (behavior.postingTargets.indexOf('twitter') !== -1) {
      q.defer(postTweet, buffer, altText, caption);
    }
    q.await(done);
  }
}

function postToArchive(buffer, altText, caption, done) {
  var id = behavior.archive.idPrefix + '-' + randomId(8);
  staticWebStream.write({
    id,
    date: new Date().toISOString(),
    mediaFilename: id + '.png',
    altText,
    caption,
    buffer
  });
  staticWebStream.end(done);
}

function postTweet(buffer, altText, caption, done) {
  var postImageOpts = {
    twit,
    base64Image: buffer.toString('base64'),
    altText,
    caption: ''
  };

  postImage(postImageOpts, done);
}

function wrapUp(error, placeholder, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
    retry(error);
  } else if (!dryRun) {
    console.log('Posted to targets!');
  }
}

function retry(e) {
  console.log('Error while trying to get shot:', e);
  if (shotRetries < shotRetryLimit) {
    shotRetries += 1;
    console.log('Retrying. Number of retries so far:', shotRetries);
    callNextTick(kickOff);
  } else {
    console.log('Reached retry limit. Giving up.');
  }
}
