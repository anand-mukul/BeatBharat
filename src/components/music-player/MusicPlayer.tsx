import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import PlayerControls from "@/components/music-player/PlayerControls";
import ProgressBar from "@/components/music-player/ProgressBar";
import VolumeControl from "@/components/music-player/VolumeControl";
import AdditionalControls from "@/components/music-player/AdditionalControls";
import ShareDialog from "@/components/music-player/ShareDialog";
import { Track } from "@/types/Music";
import Image from "next/image";

interface MusicPlayerProps {
  currentTrack: Track | null;
  playlist: Track[];
  onTrackChange: (track: Track | null) => void;
  onLike?: (trackId: string) => Promise<void>;
  onDislike?: (trackId: string) => Promise<void>;
  onShare?: (trackId: string) => Promise<void>;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  playlist,
  onTrackChange,
  onLike,
  onDislike,
  onShare,
  autoPlay = false,
}) => {
  const {
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
  } = useMusicPlayer({
    currentTrack,
    playlist,
    onTrackChange,
    onLike,
    onDislike,
    onShare,
    autoPlay,
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-black text-white p-4 z-50 ${
          isExpanded ? "h-screen" : "h-24 sm:h-28"
        }`}
      >
        <div
          className={`flex ${
            isExpanded
              ? "flex-col items-center"
              : "flex-col sm:flex-row items-center justify-between"
          }`}
        >
          {/* Album cover and track info */}
          <div
            className={`flex items-center ${
              isExpanded ? "flex-col mb-8" : "mb-4 sm:mb-0 sm:mr-4"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative ${
                isExpanded ? "w-64 h-64" : "w-16 h-16 sm:w-20 sm:h-20"
              } mr-4`}
            >
              {currentTrack && (
                <Image
                  src={currentTrack.artist.image}
                  alt={`${currentTrack.title} cover`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              )}
            </motion.div>
            <div className={`${isExpanded ? "text-center mt-4" : "text-left"}`}>
              <h3 className="font-bold text-sm sm:text-base">
                {currentTrack?.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                {currentTrack?.artist.name}
              </p>
            </div>
          </div>

          <PlayerControls
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            onPrevious={handlePrevious}
            onPlayPause={togglePlay}
            onNext={handleNext}
          />

          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            loadedChunks={loadedChunks}
            isExpanded={isExpanded}
          />

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
          />

          <AdditionalControls
            isLooping={isLooping}
            isShuffled={isShuffled}
            isLiked={isLiked}
            isDisliked={isDisliked}
            onToggleLoop={toggleLoop}
            onToggleShuffle={toggleShuffle}
            onLike={handleLike}
            onDislike={handleDislike}
            onShare={() => setIsShareDialogOpen(true)}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            className="ml-4"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </motion.div>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={handleShare}
        onCopyLink={copyShareLink}
      />
    </AnimatePresence>
  );
};

export default MusicPlayer;
