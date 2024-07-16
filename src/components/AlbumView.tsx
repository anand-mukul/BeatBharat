"use client";

import React from "react";
import { Album, Track } from "@/types/Music";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";
import MusicPlayer from "./music-player/MusicPlayer";
import { fetchAlbumById } from "@/data/server";
import { generateUniqueKey } from "@/lib/utils";
import { toast } from "sonner";

const AlbumView: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const [album, setAlbum] = React.useState<Album | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = React.useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchAlbumById(id)
        .then(setAlbum)
        .catch((err: Error) => {
          setError(
            err.message || "Failed to fetch album data. Please try again later."
          );
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = (track: Track) => {
    if (currentTrack?._id === track._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleTrackChange = (track: Track | null) => {
    setCurrentTrack(track);
    setIsPlaying(track !== null);
  };

  const renderAlbumDetails = () => (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
      {album?.coverArt ? (
        <Image
          src={album.coverArt}
          alt={album.title}
          width={250}
          height={250}
          className="object-cover rounded-lg shadow-lg"
        />
      ) : (
        <div className="w-[250px] h-[250px] rounded-lg bg-gray-200 dark:bg-zinc-900" />
      )}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold mb-2">
          {album?.title || (
            <span className="bg-gray-200 dark:bg-zinc-900 h-8 w-48 inline-block" />
          )}
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          {album?.artist?.name || (
            <span className="bg-gray-200 dark:bg-zinc-900 h-6 w-32 inline-block" />
          )}
        </p>
        {album?.releaseDate && (
          <p className="text-sm text-muted-foreground mb-1">
            Released: {new Date(album.releaseDate).toLocaleDateString()}
          </p>
        )}
        {album?.genre && album.genre.length > 0 && (
          <p className="text-sm text-muted-foreground mb-1">
            Genre: {album.genre.join(", ")}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {album?.tracks?.length || 0} tracks ·{" "}
          {formatDuration(
            (album?.tracks || []).reduce(
              (acc, track) => acc + track.duration,
              0
            )
          )}
        </p>
      </div>
    </div>
  );

  const renderTracks = () => (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-muted-foreground border-b">
            <th className="pb-2 pl-2">#</th>
            <th className="pb-2">Title</th>
            <th className="pb-2">Duration</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {album?.tracks?.map((track: Track, index: number) => (
            <tr key={generateUniqueKey()} className="hover:bg-secondary">
              <td className="py-3 pl-2">{index + 1}</td>
              <td className="py-3">{track.title}</td>
              <td className="py-3">{formatDuration(track.duration)}</td>
              <td className="py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlayPause(track)}
                >
                  {isPlaying && currentTrack?._id === track._id ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {renderAlbumDetails()}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-full h-12 bg-gray-200 dark:bg-zinc-900"
              />
            ))}
          </div>
        ) : album?.tracks && album.tracks.length > 0 ? (
          renderTracks()
        ) : (
          <p className="text-center text-muted-foreground">
            No tracks available for this album.
          </p>
        )}
      </div>
      {album && (
        <MusicPlayer
          currentTrack={currentTrack}
          playlist={album.tracks || []}
          onTrackChange={handleTrackChange}
          autoPlay={false}
        />
      )}
    </>
  );
};

export default AlbumView;
