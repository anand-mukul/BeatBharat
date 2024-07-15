import React from "react";
import { Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PlayerControlsProps {
  isPlaying: boolean;
  isBuffering: boolean;
  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isBuffering,
  onPrevious,
  onPlayPause,
  onNext,
}) => {
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon" onClick={onPrevious}>
        <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlayPause}
        className="mx-2"
      >
        {isBuffering ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        ) : isPlaying ? (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </Button>
      <Button variant="ghost" size="icon" onClick={onNext}>
        <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    </div>
  );
};

export default PlayerControls;
