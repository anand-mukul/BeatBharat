"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import { Ghost } from "lucide-react";
import Link from "next/link";
import { usePlaylistContext } from "@/contexts/playlistContext";

export function PlaylistCard() {
  const { playlists, isLoading, removePlaylist } = usePlaylistContext();

  const listItemSkeleton = (
    <li className="col-span-1 divide-y divide-gray-200 dark:divide-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow transition hover:shadow-lg">
      <Skeleton className="h-[133px] w-[384px] rounded-xl" />
    </li>
  );

  if (isLoading) {
    return (
      <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 dark:divide-zinc-800 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, index) => (
          <React.Fragment key={index}>{listItemSkeleton}</React.Fragment>
        ))}
      </ul>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-8 w-8 text-zinc-800 dark:text-zinc-400" />
        <h3 className="font-semibold text-xl">Pretty empty around here</h3>
        <p>Let&apos;s create your first Playlist.</p>
      </div>
    );
  }

  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 dark:divide-zinc-800 md:grid-cols-2 lg:grid-cols-3">
      {playlists
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .map((playlist) => (
          <li
            className="col-span-1 divide-y divide-gray-200 dark:divide-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow transition hover:shadow-lg"
            key={playlist._id}
          >
            <Card className="hover:shadow-md transition-shadow duration-300">
              <Link
                href={`/playlists/${playlist._id}`}
                className="flex flex-col gap-2"
              >
                <CardHeader>
                  <CardTitle className="cursor-pointer">
                    {playlist.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {playlist.description}
                  </p>
                  <p className="text-sm mt-2">
                    {playlist.tracks.length} tracks
                  </p>
                </CardContent>
              </Link>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View</Button>
                <Button
                  variant="destructive"
                  onClick={() => removePlaylist(playlist._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
    </ul>
  );
}
