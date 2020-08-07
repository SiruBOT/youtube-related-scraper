const randomIP = require('random-ip')
const ip = require('ip')
class RoutePlanner {
  /**
   * @description RoutePlanner
   * @typedef {Array<String>} CIDRBlocks
   * @typedef {Number} Retry
   * @param {CIDRBlocks} ipBlocks
   * @param {Array<String>} excludeIps Array of exclude Ips
   * @param {Retry} retry -1 = Default Value, 0 = Infinity
   */
  constructor (ipBlocks, excludeIps = [], retry) {
    if (!Array.isArray(ipBlocks)) throw new Error('ipBlocks must be type Array')
    if (ipBlocks.length < 0) throw new Error('RoutePlanner must have at least one ipBlocks')
    if (!Array.isArray(excludeIps)) throw new Error('excludeIps must be type Array')
    if (typeof retry !== 'number') throw new Error('RoutePlanner Retry Count is must be number')
    if (typeof retry < -1) throw new Error('RoutePlanner Retry Count Can\'t Fewer -1')
    this.usedCount = new Map()
    this.failedAddresses = new Map()
    this.ipBlocks = ipBlocks.map((ip) => this.getInformation(ip))
    this.excludeIps = excludeIps.filter(this.validateIp)
    this.retry = retry === 0 ? Infinity : retry === -1 ? 2 : retry
  }

  validateIp (address) {
    if (ip.isV4Format(address) || ip.isV6Format(address)) return true
    throw new Error(`validateIp - Ip Address ${address} not valid`)
  }

  unmarkFailedAddress (address) {
    if (!this.failedAddresses.get(address)) return false
    return this.failedAddresses.delete(address)
  }

  markFailedAddress (address, statusCode) {
    this.failedAddresses.set(address, {
      statusCode,
      failedAt: new Date().getTime()
    })
    return true
  }

  getInformation (ipBlock) {
    if (ip.cidr(ipBlock)) {
      const cidrSubnet = ip.cidrSubnet(ipBlock)
      const cidr = ip.cidr(ipBlock)
      this.usedCount.set(cidr, 0)
      return {
        broadcastAddress: cidr,
        subnetMasks: cidrSubnet.subnetMaskLength,
        containes: cidrSubnet.contains,
        size: cidrSubnet.length
      }
    }
  }

  getRandom () {
    const sorted = this.ipBlocks.sort(el => this.sort(el.broadcastAddress))
    const randomResult = randomIP(sorted[0].broadcastAddress, sorted[0].subnetMasks)
    this.usedCount.set(sorted[0].broadcastAddress, this.usedCount.get(sorted[0].broadcastAddress) + 1)
    if (this.failedAddresses.size >= 1 && this.failedAddresses.size === this.ipBlocks.map(el => el.size).reduce((pre, cur) => pre + cur)) throw new Error('No IPs available')
    if (this.excludeIps.includes(randomResult) || this.failedAddresses.get(randomResult)) return this.getRandom()
    return { ip: randomResult, family: ip.isV4Format(randomResult) ? 'ipv4' : 'ipv6' }
  }

  sort (a, b) {
    const countA = this.usedCount.get(a)
    const countB = this.usedCount.get(b)
    if (countA > countB) return -1
    if (countA < countB) return 1
    return 0
  }
}
module.exports = RoutePlanner
