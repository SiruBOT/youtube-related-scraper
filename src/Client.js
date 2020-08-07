const Parser = require('./Parser')
const got = require('got')
const statusCodes = require('http').STATUS_CODES
const log4js = require('@log4js-node/log4js-api')
const logger = log4js.getLogger(require('./').log4jsName)
const RoutePlanner = require('./RoutePlanner')
const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
class Client {
  /**
   * get related video by youtube id, uri
   * @param {String} url
   * @param {RoutePlanner} routePlanner
   * @returns {Promise} Result Promise
   */
  static async get (url, routePlanner = null) {
    if (!url) throw new Error('No url provided')
    if (routePlanner && !(routePlanner instanceof RoutePlanner)) throw new Error('routePlanner is must be instanceof RoutePlanner')
    const defaultOptions = {
      timeout: 5000,
      retry: 0,
      responseType: 'text',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko' }
    }
    let options = defaultOptions
    if (routePlanner) {
      const { ip, family } = routePlanner.getRandom()
      options = Object.assign(defaultOptions, {
        retry: routePlanner.retry,
        localAddress: ip,
        dnsLookupIpVersion: family,
        hooks: {
          beforeRetry: [
            (options, error) => {
              if (error.response && !(error.response.statusCode >= 200 && error.response.statusCode < 300)) {
                routePlanner.markFailedAddress(options.localAddress, error.response.statusCode)
              } routePlanner.markFailedAddress(options.localAddress, null)
              const { ip, family } = routePlanner.getRandom()
              options.localAddress = ip
              options.dnsLookupIpVersion = family
            }
          ]
        }
      })
    }
    const { body, statusCode } = await got(this.getYTURL(url), options)
    if (!(statusCode >= 200 && statusCode < 300)) throw new Error(`Unexpected Status Code from Server: ${statusCode} - ${statusCodes[statusCode]}`)
    return Parser.parse(body)
  }

  static getYTURL (url) {
    return `https://youtube.com/watch?v=${(url.match(YT_REGEX)) ? RegExp.$1 : url}`
  }
}
module.exports = Client
