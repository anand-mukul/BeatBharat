"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PodcastEmptyPlaceholder } from "@/components/podcast-empty-placeholder";
import { AlbumArtwork } from "@/components/album-artwork";
import { useEffect, useState } from "react";
import { Album } from "@/types/Music";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchAlbums, fetchTopPicks } from "@/data/server";
import { generateUniqueKey } from "@/lib/utils";

const MusicPage = () => {
  const [listenNowAlbums, setListenNowAlbums] = useState<Album[]>([]);
  const [topPicks, setTopPicks] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumsResponse, picks] = await Promise.all([
          fetchAlbums(page),
          fetchTopPicks(),
        ]);

        if (albumsResponse && Array.isArray(albumsResponse.albums)) {
          setListenNowAlbums((prevAlbums) => [
            ...prevAlbums,
            ...albumsResponse.albums,
          ]);
          setHasMore(albumsResponse.albums.length === albumsResponse.limit);
        } else {
          toast.error("Failed to fetch albums data");
          setHasMore(false);
        }

        if (Array.isArray(picks)) {
          setTopPicks(picks);
        } else {
          toast.error("Failed to fetch top picks data");
        }
      } catch (error) {
        toast.error("Failed to fetch music data");
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const handleAlbumClick = (album: Album) => {
    if (album._id) {
      router.push(`/album/${album._id}`);
    } else {
      toast.error("Album ID is undefined");
    }
  };

  const loadMoreAlbums = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading && page === 1) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Tabs defaultValue="music" className="h-full space-y-6">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="music" className="relative">
              Music
            </TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="live" disabled>
              Live
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto mr-4">
            <Button>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Add music
            </Button>
          </div>
        </div>
        <TabsContent value="music" className="border-none p-0 outline-none">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Listen Now
              </h2>
              <p className="text-sm text-muted-foreground">
                Top picks for you. Updated daily.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {listenNowAlbums.map((album: Album) => (
                  <AlbumArtwork
                    key={generateUniqueKey()}
                    album={album}
                    className="w-[250px] cursor-pointer"
                    aspectRatio="portrait"
                    width={250}
                    height={330}
                    onClick={() => handleAlbumClick(album)}
                  />
                ))}
                {hasMore && (
                  <Button variant={"secondary"} onClick={loadMoreAlbums} disabled={isLoading} className="w-[250px] h-[330px]">
                    {isLoading ? <LoadingSpinner /> : "Load More"}
                  </Button>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Made for You
            </h2>
            <p className="text-sm text-muted-foreground">
              Top picks Albums. Updated daily.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {topPicks.map((album, i) => (
                  <AlbumArtwork
                    key={generateUniqueKey()}
                    album={album}
                    className="w-[150px] cursor-pointer"
                    aspectRatio="square"
                    width={150}
                    height={150}
                    onClick={() => handleAlbumClick(album)}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent
          value="podcasts"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                New Episodes
              </h2>
              <p className="text-sm text-muted-foreground">
                Your favorite podcasts. Updated daily.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <PodcastEmptyPlaceholder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicPage;
