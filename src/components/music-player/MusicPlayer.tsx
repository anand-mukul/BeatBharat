import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Track } from "@/types/Music";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { AdditionalControls } from "./AdditionalControls";
import { TrackInfo } from "./TrackInfo";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useStreamingToken } from "@/hooks/useStreamingToken";
import { ChevronDown, ChevronUp, Expand, SquareX } from "lucide-react";

interface MusicPlayerProps {
  currentTrack: Track | null;
  playlist: Track[];
  onTrackChange: (track: Track | null) => void;
  onLike?: (trackId: string) => void;
  onDislike?: (trackId: string) => void;
  onShare?: (trackId: string) => void;
  autoPlay?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  playlist,
  onTrackChange,
  onLike,
  onDislike,
  onShare,
  autoPlay = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { streamUrl, isLoading } = useStreamingToken(currentTrack?._id);
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffled,
    isBuffering,
    loadedChunks,
    togglePlay,
    toggleMute,
    handleNext,
    handlePrevious,
    handleVolumeChange,
    handleSeek,
    toggleLoop,
    toggleShuffle,
  } = useAudioPlayer(streamUrl, playlist, onTrackChange, autoPlay);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    console.log('Current state:', {
      streamUrl,
      isPlaying,
      isBuffering,
      currentTrack: currentTrack?._id
    });
  }, [streamUrl, isPlaying, isBuffering, currentTrack]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-black text-white p-4 z-50 ${
          isExpanded ? "h-screen" : "h-24"
        }`}
      >
        <div
          className={`flex ${
            isExpanded
              ? "flex-col items-center"
              : "items-center justify-between"
          }`}
        >
          <TrackInfo track={currentTrack} isExpanded={isExpanded} />
          <PlayerControls
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            togglePlay={togglePlay}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            loadedChunks={loadedChunks}
            onSeek={handleSeek}
            isExpanded={isExpanded}
          />
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            toggleMute={toggleMute}
            handleVolumeChange={handleVolumeChange}
          />
          <AdditionalControls
            isLooping={isLooping}
            isShuffled={isShuffled}
            toggleLoop={toggleLoop}
            toggleShuffle={toggleShuffle}
            onLike={onLike}
            onDislike={onDislike}
            onShare={onShare}
            trackId={currentTrack?._id}
          />
          <button
            onClick={toggleExpand}
            className="ml-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? <SquareX /> : <Expand />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
