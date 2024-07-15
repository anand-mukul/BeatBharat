import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
  onCopyLink: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  onShare,
  onCopyLink,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this track</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {["Facebook", "Twitter", "Instagram", "WhatsApp"].map((platform) => (
            <Button
              key={platform}
              onClick={() => onShare(platform.toLowerCase())}
              className="w-full text-sm"
            >
              {platform}
            </Button>
          ))}
        </div>
        <Button onClick={onCopyLink} className="w-full mt-2 text-sm">
          Copy Link
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
