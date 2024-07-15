export interface RecentlyPlayedItem {
    item: string; 
    itemType: 'RadioStation' | 'Track';
    playedAt: Date;
  }
  
  export interface Preferences {
    genres: string[];
    language: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar?: string;
    bio?: string;
    dob?: Date;
    language?: string;
    timezone?: string;
    gender?: string;
    urls?: { value: string }[];
    oauth: boolean;
    isVerified: boolean;
    refreshToken?: string;
    favoriteStations: string[];
    favoriteTracks: string[]; 
    favoriteAlbums: string[]; 
    playlists: string[]; 
    recentlyPlayed: RecentlyPlayedItem[];
    preferences: Preferences;
    createdAt: Date;
    updatedAt: Date;
  }
  