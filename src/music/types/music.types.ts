type Cover = {
  src: string;
  alt: string;
}

type TopItem = {
  rank: string;
  playCount: string;
}

type BaseItem = {
  name: string;
  url: string;
  cover: Cover;
}

export type Track = BaseItem & {
  album: string;
  artist: string;
  lastPlayedAt?: string;
};

export type TopTrack = BaseItem & TopItem & {
  artist: string;
};

export type TopAlbum = BaseItem & TopItem & {
  artist: string;
};

export type TopArtist = TopItem & BaseItem;

export type Stat = {
  label: string;
  value: string;
};
