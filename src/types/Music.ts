export interface Artist {
  _id: string;
  name: string;
  image: string;
}

export interface Track {
  _id: string;
  title: string;
  artist: Artist;
  duration: number;
  url: string;
  album?: string;
  genre?: string[];
  releaseDate?: string;
  plays?: number;
  type: "track";
}

export interface Playlist {
  _id: string;
  name: string;
  tracks: Track[];
  creator: string;
  isPublic: boolean;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  likedTracks: string[];
  playlists: string[];
}

export interface ShareResponse {
  shareUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}