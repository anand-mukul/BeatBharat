import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaylistCard } from "@/components/PlaylistCard";
import { CreatePlaylistButton } from "@/components/CreatePlaylistButton";
import { PlaylistProvider } from "@/contexts/playlistContext";

const PlaylistPage = () => {
  return (
    <PlaylistProvider>
      <div className="h-full px-4 py-6 lg:px-8">
        <Tabs defaultValue="music" className="h-full space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="music" className="relative">
                Playlist
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto mr-4">
              <CreatePlaylistButton />
            </div>
          </div>
          <TabsContent value="music" className="border-none p-0 outline-none">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Your Playlists
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enjoy your favourite songs here.
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="relative">
              <PlaylistCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PlaylistProvider>
  );
};

export default PlaylistPage;
