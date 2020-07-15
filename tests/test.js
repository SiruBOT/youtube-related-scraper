const Client = require('../src/Client')
const Parser = require('../src/Parser')
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const URLS = {
  ytURL: 'https://www.youtube.com/watch?v=AufydOsiD6M',
  ytID: 'AufydOsiD6M',
  notYTID: 'asdfasdf',
  notYTURL: 'https://google.com'
}

// Parser
describe('Youtube Related Scraper - Parser', () => {
  it('Parse valid html', (done) => {
    const parsed = Parser.parse(fs.readFileSync(path.join(__dirname, './youtube-html.html')).toString())
    expectVideoObject(parsed)
    done()
  })

  it('Parse not valid html', (done) => {
    try {
      Parser.parse(fs.readFileSync(path.join(__dirname, './wrong-html.html')).toString())
      done(new Error('It expect throws error, but works well'))
    } catch {
      done()
    }
  })
})

// Client
describe('Youtube Related Scraper - Client', () => {
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

function expectVideoObject (result) {
  expect(result).to.be.an('array').that.is.not.empty
  result.map(el => {
    expect(el).to.have.a.property('videoId')
    expect(el).to.have.a.property('title')
    expect(el).to.have.a.property('duration')
    expect(el).to.have.a.property('uri')
  })
}
