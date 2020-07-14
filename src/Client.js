const Parser = require('./Parser')
const fetch = require('node-fetch')
const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
class Client {
  /**
   * get related video by youtube id, uri
   * @param {String} url
   * @returns {Promise} Result Promise
   */
  static get (url) {
    return new Promise((resolve, reject) => {
      if (!url) throw new Error('No url provided')
      fetch(this.getYTURL(url), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko' } })
        .then((res) => res.text())
        .then(text => resolve(Parser.parse(text)))
        .catch(reject)
    })
  }

  static getYTURL (url) {
    return `https://youtu.be/${(url.match(YT_REGEX)) ? RegExp.$1 : url}`
  }
}

module.exports = Client
