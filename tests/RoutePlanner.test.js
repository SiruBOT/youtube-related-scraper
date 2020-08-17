const Client = require('../src/Client')
const RoutePlanner = require('../src/RoutePlanner')
const { expectVideoObject } = require('./Parser.test')
const URLS = {
  ytURL: 'https://www.youtube.com/watch?v=AufydOsiD6M'
}
describe('RoutePlanner', () => {
  let planner
  describe('Type Check', () => {
    it('IPBlocks not valid ip cidr', (done) => {
      try {
        planner = new RoutePlanner(['hello this is not valid'], [], 1)
        done(new Error('Instance not throw "Invalid CIDR subnet"'))
      } catch (e) {
        if (e.message.includes('invalid CIDR subnet')) return done()
        done(e)
      }
    })
  })
  describe('Get Random Cidr', () => {
    it('IPv6', (done) => {
      planner = new RoutePlanner(['2001:470:fd9a::/128'], [], 1)
      planner.getRandom()
      done()
    })
    it('IPv4', (done) => {
      planner = new RoutePlanner(['192.168.0.1/32'], [], 1)
      planner.getRandom()
      done()
    })
  })
  describe('Using RoutePlanner With Client', () => {
    const ip = require('ip')
    it(`CIDR Range: ${ip.address('public')}/32`, (done) => {
      planner = new RoutePlanner([ip.address('public') + '/32'], [], 1)
      Client.get(URLS.ytURL, planner)
        .then(res => {
          expectVideoObject(res)
          done()
        }).catch(done)
    })
  })
})
