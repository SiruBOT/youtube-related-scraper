import { IRelatedVideo } from "./types/IRelatedVideo";
import { RoutePlanner } from "./RoutePlanner";
import { ILoggerLike } from "./types/ILoggerLike";
import { YoutubeParser } from "./YoutubeParser";
import { YOUTUBE_URL_WATCH } from "./Constant";
import fetch, { type RequestInit } from "node-fetch";
import { AbortController } from "abort-controller";
import http from "node:http";
import https from "node:https";

const DEFAULT_TIMEOUT = 10000 as const;
export interface ScraperOptions {
  log?: ILoggerLike;
  timeout?: number;
}

export class Scraper {
  private log?: ILoggerLike;
  private timeout: number;
  constructor(options?: ScraperOptions) {
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    this.log = options?.log;
  }
  /**
   * Scrape related videos from provided video id
   * @param identifier
   */
  public async scrape(
    identifier: string,
    routePlanner?: RoutePlanner
  ): Promise<IRelatedVideo[] | null> {
    this.log?.debug(
      `Scrape related video of ${identifier} ${
        routePlanner ? "with RoutePlanner" : ""
      } (Timeout: ${this.timeout})`
    );
    if (!identifier) throw new Error("Youtube video identifier not provided.");
    const abortController: AbortController = new AbortController();
    const fetchOptions: RequestInit = {
      signal: abortController.signal,
    };
    const timeout: NodeJS.Timeout = setTimeout(() => {
      abortController.abort();
    }, this.timeout);
    // With RoutePlanner
    if (routePlanner) {
      const idealIp: string = routePlanner.getIdealIp();
      this.log?.debug(`Bind ip address ${idealIp} to http Agent`);
      const agentOptions: http.AgentOptions | https.AgentOptions = {
        localAddress: idealIp,
      };
      fetchOptions.agent = (_parsedURL: URL) => {
        if (_parsedURL.protocol == "http:") {
          return new http.Agent(agentOptions);
        } else {
          return new https.Agent(agentOptions);
        }
      };
    }
    // Fetch
    try {
      const resp = await fetch(YOUTUBE_URL_WATCH + identifier, fetchOptions);
      if (!resp.ok) throw new Error(`HTTP Request failed (${resp.statusText})`);
      const text: string = await resp.text();
      return YoutubeParser.parse(text, identifier);
    } catch (error) {
      // Timeout Error
      if ((error as Error).name === "AbortError") {
        throw new Error(`Timeout exceeded ${this.timeout}`);
      } else {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
