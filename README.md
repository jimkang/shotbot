shotbot
=============

Multi-tenant app for bots that post screenshots of web pages.

Tested with Node 8. Will probably work fine with Node 6 or higher.

Installation
------------

Clone this repo.

If you are running it on OS X, I've found that you can run it by doing an `npm install` and then `BOT=il-gov node post-shot.js` or `make run-il-gov`.

In order to run it on Ubuntu 16, I needed to do the following first:

- Copy the Makefile in this project (or the entire project) to it.
- Run `make install-chromium-deps` on there.
- Alternately you can run the contents of that Make target there:

    apt-get install gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget

Then, you need to create a `config.mk` with the following in it:

    USER = <user that you want to run as on your server>
    SERVER = <server hostname or IP>

You need real values for these if you want to use the `sync` and `pushall` targets in the Makefile to deploy this to a remote server. If you don't care, then they can have empty values.

To add a bot, create a `<bot name>-config.js` file that contains GitHub info (for posting to a [static web archive](http://jimkang.com/weblog/articles/platform-free-bots/)) and [Twitter API keys](https://gist.github.com/jimkang/34d16247b40097d8cace) and properties it should use under `/configs`. Example:

    module.exports = {
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

Next, create a `<bot name>-behavior.js` under `/behaviors`. Example:

    module.exports = {
      postingTargets: ['archive', 'twitter'],      
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

`postingTargets` should be all of the targets that you want your posts to go to. Currently supported options: 'archive' and 'twitter'.

It's important to implement `getAltText` and `getCaption`. You need `getAltText` so that your images will have...alt text. `getCaptions can just return an empty string if you don't want a caption.

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
