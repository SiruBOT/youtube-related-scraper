const Parser = require('../src/Parser')
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const expect = chai.expect

describe('Parser', () => {
  it('Parse valid html', (done) => {
    const parsed = Parser.parse(fs.readFileSync(path.join(__dirname, './youtube-html.html')).toString())
    expectVideoObject(parsed)
    done()
  })

  it('Parse not valid youtube html', (done) => {
    try {
      Parser.parse(fs.readFileSync(path.join(__dirname, './wrong-html.html')).toString())
      done(new Error('It expect throws error'))
    } catch {
      done()
    }
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

module.exports.expectVideoObject = expectVideoObject
