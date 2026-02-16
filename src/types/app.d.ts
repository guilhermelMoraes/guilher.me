type Cover = {
  size: 'small' | 'medium' | 'large' | 'extralarge';
  /**
   * @description image URL
   */
  '#text': string;
};

type Track = {
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

type Album = {
  artist: {
    name: string;
  };
  url: string;
  playcount: string;
  '@attr': {
    rank: string;
  };
  name: string;
  image: LastFMImage[];
};