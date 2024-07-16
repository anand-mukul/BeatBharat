import React from "react";
import { Track } from "@/types/Music";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PlaylistViewProps {
  playlist: Track[];
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist }) => {
  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playlist.map((track, index) => (
            <TableRow key={track._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{track.title}</TableCell>
              <TableCell>{track.artist.name}</TableCell>
              <TableCell>{track.album?.title}</TableCell>
              <TableCell className="text-right">{formatDuration(track.duration)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};