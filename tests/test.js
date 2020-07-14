const Client = require('../src/Client')
const chai = require('chai')
const expect = chai.expect
const URLS = {
  ytURL: 'https://www.youtube.com/watch?v=AufydOsiD6M',
  ytID: 'AufydOsiD6M',
  notYTID: 'asdfasdf',
  notYTURL: 'https://google.com'
}

describe('Youtube Related Scraper', () => {
  it('URL is not valid youtube url', (done) => {
    Client.get(URLS.notYTURL)
      .then(() => {
        done(new Error('It should throws error'))
      })
      .catch(() => done())
  })
  it('URL is not valid youtube id', (done) => {
    Client.get(URLS.notYTID)
      .then(() => {
        done(new Error('It should throws error'))
      })
      .catch(() => done())
  })
  it('URL is valid youtube url', (done) => {
    Client.get(URLS.ytURL)
      .then((result) => {
        expectVideoObject(result)
        done()
      })
      .catch((e) => done(e))
  })
  it('URL is valid youtube id', (done) => {
    Client.get(URLS.ytID)
      .then((result) => {
        expectVideoObject(result)
        done()
      })
      .catch((e) => done(e))
  })
})

function expectVideoObject (result) {
  expect(result).to.be.an('array').that.is.not.empty
  result.map(el => {
    expect(el).to.have.a.property('videoId')
    expect(el).to.have.a.property('title')
    expect(el).to.have.a.property('duration')
    expect(el).to.have.a.property('uri')
  })
}
