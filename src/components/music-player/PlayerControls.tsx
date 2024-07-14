import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, LoaderCircle } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { motion } from "framer-motion";

interface PlayerControlsProps {
  isPlaying: boolean;
  isBuffering: boolean;
  togglePlay: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isBuffering,
  togglePlay,
  handlePrevious,
  handleNext,
}) => (
  <div className="flex items-center">
    <Button variant="ghost" size="icon" onClick={handlePrevious}>
      <SkipBack />
    </Button>
    <Button variant="ghost" size="icon" onClick={togglePlay} className="mx-2">
      {isBuffering ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <LoaderCircle className="w-5 h-5" />
        </motion.div>
      ) : isPlaying ? (
        <Pause />
      ) : (
        <Play />
      )}
    </Button>
    <Button variant="ghost" size="icon" onClick={handleNext}>
      <SkipForward />
    </Button>
  </div>
);