const DATA_REGEX = /window\["ytInitialData"\]\s=\s(\{.*\})/
class Parser {
  /**
   * regex match 'ytInitialData' data from youtube html data
   * @param {String} rawData
   */
  static ytInitialData (rawData) {
    try {
      if (typeof rawData !== 'string') throw new Error('rawData type must be a string')
      const matchedData = rawData.match(DATA_REGEX)
      if (!matchedData[1]) throw new Error('Failed to get matched data')
      return JSON.parse(matchedData[1])
    } catch {
      throw new Error('Failed to parse data json from data ' + rawData)
    }
  }

  static parse (rawData) {
    const ytInitialData = this.ytInitialData(rawData)
    const playerOverlayRenderer = ytInitialData.playerOverlays.playerOverlayRenderer
    const { results } = playerOverlayRenderer.endScreen.watchNextEndScreenRenderer
    return results.filter(el => el.endScreenVideoRenderer)
      .map(el => el.endScreenVideoRenderer)
      .filter(el => this.chkVideoObject(el))
      .map(el => this.getVideoObject(el))
  }

  static chkVideoObject (object) {
    try {
      return object.videoId && (object.title && object.title.simpleText) && object.lengthInSeconds
    } catch {
      return false
    }
  }

  static getVideoObject (object) {
    return {
      videoId: object.videoId,
      title: object.title.simpleText,
      duration: object.lengthInSeconds,
      uri: `https://youtu.be/${object.videoId}`
    }
  }
}

module.exports = Parser
