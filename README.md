# youtube-related-scraper

[![Build Status](https://travis-ci.org/SiruBOT/youtube-related-scraper.svg?branch=master)](https://travis-ci.org/SiruBOT/youtube-related-scraper)
[![npm version](https://badge.fury.io/js/%40sirubot%2Fyt-related-scraper.svg)](https://badge.fury.io/js/%40sirubot%2Fyt-related-scraper)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6a8ff39161674738806a8b245923c75e)](https://www.codacy.com/gh/SiruBOT/youtube-related-scraper?utm_source=github.com&utm_medium=referral&utm_content=SiruBOT/youtube-related-scraper&utm_campaign=Badge_Grade)   
[![NPM](https://nodei.co/npm/@sirubot/yt-related-scraper.png)](https://nodei.co/npm/@sirubot/yt-related-scraper/)

## Example Code

-   Using Promise

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

-   Using Await/Async

```js
const { Client } = require('@sirubot/yt-related-scraper')
async function getRelated (url) {
    try {
    const results = await Client.get(url)
    console.log(`Scraped ${results.length} related videos`)
    console.log(results)
    } catch (e) {
        console.log('An Error appeared')
        console.log(e.stack)
    }
}
```

-   IP Binding Support (RoutePlanner)

```js
const { Client, RoutePlanner } = require('@sirubot/yt-related-scraper')
const routePlanner = new RoutePlanner(['Your-CIDR-Range/16'], ['exclude-ip'], 1) // ipBlocks, excludedIps, failedRetry, -1 = Default Value, 0 = Infinity
async function getRelated (url) {
    try {
    const results = await Client.get(url, routePlanner)
    console.log(`Scraped ${results.length} related videos`)
    console.log(results)
    } catch (e) {
        console.log('An Error appeared')
        console.log(e.stack)
    }
}
```
