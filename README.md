# youtube-related-scraper

[![Build Status](https://travis-ci.org/SiruBOT/youtube-related-scraper.svg?branch=master)](https://travis-ci.org/SiruBOT/youtube-related-scraper)
[![npm version](https://badge.fury.io/js/%40sirubot%2Fyt-related-scraper.svg)](https://badge.fury.io/js/%40sirubot%2Fyt-related-scraper)

## Example Code

```js
const { Client } = require('@sirubot/yt-related-scraper')
Client.get('https://www.youtube.com/watch?v=AufydOsiD6M')
.then(results => {
    console.log(`Scraped ${results.length} related videos`)
    console.log(results)
})
.catch((e) => {
    console.log('An Error appeared')
    console.log(e.stack)
})
```