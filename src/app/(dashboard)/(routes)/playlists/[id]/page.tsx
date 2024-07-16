"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Playlist } from '@/types/Music';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PlaylistView } from '@/components/PlaylistView';
import { getPlaylistById, updatePlaylist } from '@/data/playlists';

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const { id } = useParams();

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const fetchedPlaylist = await getPlaylistById(id as string);
      setPlaylist(fetchedPlaylist);
    } catch (error) {
      toast.error('Failed to fetch playlist');
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!playlist) return;
    try {
      const updatedPlaylist = await updatePlaylist(playlist._id, playlist.tracks.map(track => track._id));
      setPlaylist(updatedPlaylist);
      toast.success('Playlist updated successfully');
    } catch (error) {
      toast.error('Failed to update playlist');
    }
  };

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{playlist.name}</h2>
        <Button onClick={handleUpdatePlaylist}>Update Playlist</Button>
      </div>
      <p className="text-muted-foreground">{playlist.description}</p>
      <PlaylistView playlist={playlist.tracks} />
    </div>
  );
}