// Only typing library will use
export interface IRawRelatedVideo {
  endScreenVideoRenderer: {
    videoId?: string;
    title: {
      simpleText: string;
    };
    lengthInSeconds?: number;
  };
}

export interface IYoutubeInitialData {
  playerOverlays?: {
    playerOverlayRenderer?: {
      endScreen?: {
        watchNextEndScreenRenderer?: {
          results?: IRawRelatedVideo[];
        };
      };
    };
  };
}
