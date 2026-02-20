export type Cover = {
  size: 'small' | 'medium' | 'large' | 'extralarge';
  /**
   * @description image URL
   */
  '#text': string;
};

export type Track = {
  '@attr': { nowplaying?: boolean };
  name: string;
  url: string;
  artist: {
    /**
     * @description name of the artist
     */
    '#text': string;
  };
  image: Cover[];
  album: {
    /**
     * @description name of the album
     */
    '#text': string;
  };
  date?: {
    uts: string;
    '#text': string;
  };
};

export type TopTrack = {
  name: string;
  image: Cover[];
  artist: {
    name: string;
  };
  playcount: string;
  '@attr': {
    rank: string;
  };
  duration: string;
  url: string;
};

export type Album = {
  artist: {
    name: string;
  };
  url: string;
  playcount: string;
  '@attr': {
    rank: string;
  };
  name: string;
  image: Cover[];
};

export type Artist = {
  name: string;
  image: Cover[];
  url: string;
  playcount: string;
  '@attr': {
    rank: string;
  };
};
