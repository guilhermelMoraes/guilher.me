export type Cover = {
  size: 'small' | 'medium' | 'large' | 'extralarge';
  /**
   * @description image URL
   */
  '#text': string;
};

export type Track = {
  name: string;
  album: string;
  artist: string;
  url: string;
  lastPlayedAt?: string;
  cover: {
    src: string;
    alt: string;
  };
};

export type TopTrack = {
  name: string;
  rank: string;
  playCount: string;
  url: string;
  artist: string;
  cover: {
    src: string;
    alt: string;
  };
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

export type Stat = {
  label: string;
  value: string;
};
