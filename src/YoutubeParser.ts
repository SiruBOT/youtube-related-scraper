import { ERR_YTINITIALDATA_FAILED } from "./Constant";
import { DATA_REGEX } from "./Constant";
import {
  IYoutubeInitialData,
  IRawRelatedVideo,
} from "./types/IYoutubeInitialData";
import { IRelatedVideo } from "./types/IRelatedVideo";

export class YoutubeParser {
  /**
   * Extract ytInitialData from youtube video html
   * @param {String} rawHtml
   * @returns {Object}
   */
  private static ytInitialData(rawHtml: string): IYoutubeInitialData {
    try {
      const matchedData: RegExpMatchArray | null = rawHtml.match(DATA_REGEX);
      if (!matchedData || !matchedData[1])
        throw new Error(
          "[" + ERR_YTINITIALDATA_FAILED + "] Failed to get matched data"
        );
      return JSON.parse(matchedData[1]);
    } catch (e) {
      throw new Error("Failed to parse data json from data.");
    }
  }

  /**
   * Extract ytInitialData from youtube video html
   * @param {String} rawHtml
   * @returns {Object}
   */
  public static parse(
    rawHtml: string,
    basedVideoId: string
  ): IRelatedVideo[] | null {
    const extracted: IYoutubeInitialData = YoutubeParser.ytInitialData(rawHtml);
    const rawResults: IRawRelatedVideo[] | undefined =
      extracted?.playerOverlays?.playerOverlayRenderer?.endScreen
        ?.watchNextEndScreenRenderer?.results;
    if (!rawResults) return null;
    else {
      const results: IRelatedVideo[] = [];
      for (const { endScreenVideoRenderer } of rawResults) {
        if (endScreenVideoRenderer?.videoId) {
          results.push({
            videoId: endScreenVideoRenderer.videoId ?? "",
            title: endScreenVideoRenderer.title.simpleText,
            basedVideoId,
            duration: endScreenVideoRenderer.lengthInSeconds,
          });
        }
      }
      return results.length > 0 ? results : null;
    }
  }
}
