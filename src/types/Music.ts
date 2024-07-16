export interface Artist {
  _id?: string;
  name?: string;
  image?: string;
}

export interface Album {
  _id?: string;
  title: string;
  artist?: Artist;
  tracks?: Track[];
  releaseDate?: string;
  genre?: string[];
  coverArt?: string;
}

export interface Track {
  _id: string;
  title: string;
  artist: Artist;
  duration: number;
  url: string;
  album?: Album;
  genre?: string[];
  releaseDate?: string;
  plays?: number;
  type: "track";
}

export interface Playlist {
  description: string;
  _id: string;
  name: string;
  tracks: Track[];
  creator: string;
  isPublic: boolean;
  updatedAt: string;
  createdAt: string;
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
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  albums: Album[];
  data: T;
  page: number;
  limit: number;
  total: number;
}
