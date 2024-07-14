import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Repeat, Shuffle, Heart, ThumbsDown, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

interface AdditionalControlsProps {
  isLooping: boolean;
  isShuffled: boolean;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  onLike?: (trackId: string) => void;
  onDislike?: (trackId: string) => void;
  onShare?: (trackId: string) => void;
  trackId?: string;
}

export const AdditionalControls: React.FC<AdditionalControlsProps> = ({
  isLooping,
  isShuffled,
  toggleLoop,
  toggleShuffle,
  onLike,
  onDislike,
  onShare,
  trackId,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (trackId && onLike) {
      onLike(trackId);
    }
  };

  const handleDislike = () => {
    if (trackId && onDislike) {
      onDislike(trackId);
    }
  };

  const handleShare = async (platform: string) => {
    if (!trackId) return;

    try {
      const response = await axios.post("/api/music/share", {
        trackId,
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
    if (!trackId) return;

    try {
      const response = await axios.post("/api/music/share-link", {
        trackId,
      });

      const shareUrl = response.data.data.shareUrl;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error copying share link:", error);
      toast.error("An error occurred while copying the share link");
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLoop}
        className={isLooping ? "text-green-500" : ""}
      >
        <Repeat />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleShuffle}
        className={isShuffled ? "text-green-500" : ""}
      >
        <Shuffle />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLike}
        className={isLiked ? "text-red-500" : ""}
      >
        <Heart />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDislike}>
        <ThumbsDown />
      </Button>
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this track</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {["Facebook", "Twitter", "Instagram", "WhatsApp"].map((platform) => (
              <Button
                key={platform}
                onClick={() => handleShare(platform.toLowerCase())}
                className="w-full"
              >
                {platform}
              </Button>
            ))}
          </div>
          <Button onClick={copyShareLink} className="w-full mt-2">
            Copy Link
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};