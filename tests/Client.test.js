const Client = require('../src/Client')
const { expectVideoObject } = require('./Parser.test')
const URLS = {
  ytURL: 'https://www.youtube.com/watch?v=AufydOsiD6M',
  ytID: 'AufydOsiD6M',
  notYTID: 'asdfasdf',
  notYTURL: 'https://google.com'
}

// Client
describe('Client', () => {
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
})
