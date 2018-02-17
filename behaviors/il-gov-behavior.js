module.exports = {
  postingTargets: ['twitter'],
  webimageOpts: {
    url: 'http://jimkang.com/il-gov-widget-host/',
    screenshotOpts: {
      clip: {
        x: 0,
        y: 0,
        width: 450,
        height: 400
      }
    },
    viewportOpts: {
      width: 450,
      height: 400,
      deviceScaleFactor: 1
    },
    supersampleOpts: {
      desiredBufferType: 'png',
      resizeMode: 'bezier'
    }
  },
  getAltText() {
    return "Illinois governor's race data.";
  },
  getCaption() {
    return '';
  }
};
