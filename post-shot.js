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

var staticWebStream = StaticWebArchiveOnGit({
  config: config.github,
  title: behavior.archive.name,
  footerHTML: behavior.archive.footerHTML,
  maxEntriesPerPage: behavior.maxEntriesPerPage
});

var webimage;
var twit = new Twit(config.twitter);

waterfall([Webimage, getShot, shutDownWebimage, postToTargets], wrapUp);

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
    q.defer(postToArchive, buffer, altText, caption);
    q.defer(postTweet, buffer, altText, caption);
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
  } else if (!dryRun) {
    console.log('Posted to targets!');
  }
}
