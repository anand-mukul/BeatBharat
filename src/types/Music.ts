export interface Artist {
    _id: string;
    name: string;
    image: string;
  }
  
  export interface Track {
    _id: string;
    title: string;
    artist: Artist;
    album: string;
    duration: number;
    url: string;
  }
  
  export interface PlaylistItem extends Track {
    addedAt: Date;
  }
  
  export interface Playlist {
    _id: string;
    name: string;
    tracks: PlaylistItem[];
  }
  
  export interface StreamingToken {
    token: string;
    expiresAt: Date;
  }