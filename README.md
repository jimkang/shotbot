shotbot
=============

Multi-tenant app for bots that post screenshots of web pages.

Installation
------------

Clone this repo.

To add a bot, create a `<bot name>-config.js` file that contains GitHub info (for posting to a [static web archive](http://jimkang.com/weblog/articles/platform-free-bots/)) and [Twitter API keys](https://gist.github.com/jimkang/34d16247b40097d8cace) and properties it should use under `/configs`. Example:

    module.exports = {
      postingTargets: ['archive', 'twitter'],
      github: {
        gitRepoOwner: 'jimkang',
        gitToken: '<Your GitHub token>',
        repo: 'hills-archive'
      },
      twitter: {
        consumer_key: 'asdfkljqwerjasdfalpsdfjas',
        consumer_secret: 'asdfasdjfbkjqwhbefubvskjhfbgasdjfhgaksjdhfgaksdxvc',
        access_token: '9999999999-zxcvkljhpoiuqwerkjhmnb,mnzxcvasdklfhwer',
        access_token_secret: 'opoijkljsadfbzxcnvkmokwertlknfgmoskdfgossodrh'
      }
    };

`postingTargets` should be all of the targets that you want your posts to go to. Currently supported options: 'archive' and 'twitter'.

Next, create a `<bot name>-behavior.js` under `/behaviors`. Example:

    module.exports = {
      webimageOpts: {
        url: 'http://jimkang.com/hills',
        screenshotOpts: {
          clip: {
            x: 0,
            y: 0,
            width: 1280,
            height: 720
          }
        },
        viewportOpts: {
          width: 1280,
          height: 720,
          deviceScaleFactor: 1
        },
        supersampleOpts: {
          desiredBufferType: 'png',
          resizeMode: 'bezier'
        }
      },
      archive: {
        name: 'Quiet Hills',
        idPrefix: 'hill',
        footerHTML: `<footer>Want more hills? <a href="http://jimkang.com/hills">Go get you some.</a>
      <script type="text/javascript">
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-49491163-1', 'jimkang.com');
      ga('send', 'pageview');
    </script>`,
        maxEntriesPerPage: 20
      },
      getAltText() {
        return 'A hill.';
      },
      getCaption() {
        return '';
      }
    };


Usage
-----

    BOT=<bot name> node post-shot.js

You can also pass a `--dry` switch to make it just print whatever it would have posted without actually posting it.

Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2018 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
