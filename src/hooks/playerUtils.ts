import { Track } from "@/types/Music";

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const getRandomTrack = (
  playlist: Track[],
  currentTrackId: string
): Track => {
  const filteredPlaylist = playlist.filter(
    (track) => track._id !== currentTrackId
  );
  const randomIndex = Math.floor(Math.random() * filteredPlaylist.length);
  return filteredPlaylist[randomIndex];
};

export const getNextTrack = (
  playlist: Track[],
  currentTrackId: string,
  isShuffled: boolean
): Track => {
  if (isShuffled) {
    return getRandomTrack(playlist, currentTrackId);
  }
  const currentIndex = playlist.findIndex(
    (track) => track._id === currentTrackId
  );
  return playlist[(currentIndex + 1) % playlist.length];
};

export const getPreviousTrack = (
  playlist: Track[],
  currentTrackId: string,
  isShuffled: boolean
): Track => {
  if (isShuffled) {
    return getRandomTrack(playlist, currentTrackId);
  }
  const currentIndex = playlist.findIndex(
    (track) => track._id === currentTrackId
  );
  return playlist[(currentIndex - 1 + playlist.length) % playlist.length];
};
