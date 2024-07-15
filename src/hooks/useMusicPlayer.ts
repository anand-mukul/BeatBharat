import { useState, useEffect, useCallback } from "react";
import { useAudio } from "@/hooks/useAudio";
import { Track } from "@/types/Music";
import { toast } from "sonner";
import axios from "axios";

interface UseMusicPlayerProps {
  currentTrack: Track | null;
  playlist: Track[];
  onTrackChange: (track: Track | null) => void;
  onLike?: (trackId: string) => Promise<void>;
  onDislike?: (trackId: string) => Promise<void>;
  onShare?: (trackId: string) => Promise<void>;
  autoPlay?: boolean;
}

export const useMusicPlayer = ({
  currentTrack,
  playlist,
  onTrackChange,
  onLike,
  onDislike,
  onShare,
  autoPlay = false,
}: UseMusicPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const {
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    loadedChunks,
    togglePlay,
    setVolume,
    toggleMute,
    setIsLooping,
    seekTo,
    playTrack,
  } = useAudio(currentTrack, autoPlay);

  useEffect(() => {
    if (currentTrack) {
      playTrack(currentTrack.url);
    }
  }, [currentTrack, playTrack]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleNext = useCallback(() => {
    const currentIndex = playlist.findIndex(
      (track) => track._id === currentTrack?._id
    );
    const nextIndex = isShuffled
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    onTrackChange(nextTrack);
  }, [playlist, currentTrack, isShuffled, onTrackChange]);

  const handlePrevious = useCallback(() => {
    const currentIndex = playlist.findIndex(
      (track) => track._id === currentTrack?._id
    );
    const prevIndex = isShuffled
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];
    onTrackChange(prevTrack);
  }, [playlist, currentTrack, isShuffled, onTrackChange]);

  const handleSeek = (newTime: number) => {
    seekTo(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const toggleLoop = () => setIsLooping(!isLooping);
  const toggleShuffle = () => setIsShuffled(!isShuffled);

  const handleLike = async () => {
    if (!currentTrack || !onLike) return;
    setIsLiked(true);
    setIsDisliked(false);
    try {
      await onLike(currentTrack._id);
      toast.success("Track liked successfully!");
    } catch (error) {
      console.error("Error liking track:", error);
      toast.error("An error occurred while liking the track");
      setIsLiked(false);
    }
  };

  const handleDislike = async () => {
    if (!currentTrack || !onDislike) return;
    setIsDisliked(true);
    setIsLiked(false);
    try {
      await onDislike(currentTrack._id);
      toast.success("Track disliked successfully!");
    } catch (error) {
      console.error("Error disliking track:", error);
      toast.error("An error occurred while disliking the track");
      setIsDisliked(false);
    }
  };

  const handleShare = async (platform: string) => {
    if (!currentTrack || !onShare) return;
    try {
      await onShare(currentTrack._id);
      const response = await axios.post("/api/music/share", {
        trackId: currentTrack._id,
        platform,
      });
      const shareUrl = response.data.data.shareUrl;
      window.open(shareUrl, "_blank");
      toast.success("Track shared successfully!");
    } catch (error) {
      console.error("Error sharing track:", error);
      toast.error("An error occurred while sharing the track");
    }
  };

  const copyShareLink = async () => {
    if (!currentTrack) return;
    try {
      const response = await axios.post("/api/music/share-link", {
        trackId: currentTrack._id,
      });
      const shareUrl = response.data.data.shareUrl;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error copying share link:", error);
      toast.error("An error occurred while copying the share link");
    }
  };

  return {
    isPlaying,
    isBuffering,
    isExpanded,
    toggleExpand,
    handleNext,
    handlePrevious,
    togglePlay,
    currentTime,
    duration,
    handleSeek,
    volume,
    isMuted,
    handleVolumeChange,
    toggleMute,
    isLooping,
    toggleLoop,
    isShuffled,
    toggleShuffle,
    isLiked,
    handleLike,
    isDisliked,
    handleDislike,
    isShareDialogOpen,
    setIsShareDialogOpen,
    handleShare,
    copyShareLink,
    loadedChunks,
  };
};
