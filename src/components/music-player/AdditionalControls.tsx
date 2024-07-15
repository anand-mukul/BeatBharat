import React from "react";
import { Repeat, Shuffle, Heart, ThumbsDown, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdditionalControlsProps {
  isLooping: boolean;
  isShuffled: boolean;
  isLiked: boolean;
  isDisliked: boolean;
  onToggleLoop: () => void;
  onToggleShuffle: () => void;
  onLike: () => void;
  onDislike: () => void;
  onShare: () => void;
}

const AdditionalControls: React.FC<AdditionalControlsProps> = ({
  isLooping,
  isShuffled,
  isLiked,
  isDisliked,
  onToggleLoop,
  onToggleShuffle,
  onLike,
  onDislike,
  onShare,
}) => {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleLoop}
        className={isLooping ? "text-green-500" : ""}
      >
        <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleShuffle}
        className={isShuffled ? "text-green-500" : ""}
      >
        <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLike}
        className={isLiked ? "text-red-500" : ""}
      >
        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDislike}
        className={isDisliked ? "text-blue-500" : ""}
      >
        <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onShare}>
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    </div>
  );
};

export default AdditionalControls;
