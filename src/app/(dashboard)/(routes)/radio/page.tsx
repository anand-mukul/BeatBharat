import { Metadata } from "next";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PodcastEmptyPlaceholder } from "@/components/podcast-empty-placeholder";
import { StationArtwork } from "@/components/station-artwork";
import { genreStations, topStations } from "@/data/stations";

export const metadata: Metadata = {
  title: "BeatBharat - Radio",
  description: "Listen the Best Radio.",
};

type Props = {};

const RadioPage = (props: Props) => {
  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Tabs defaultValue="top" className="h-full space-y-6">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="top" className="relative">
              Top Stations
            </TabsTrigger>
            <TabsTrigger value="genre">By Genre</TabsTrigger>
          </TabsList>
          <div className="ml-auto mr-4">
            <Button>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Add Station
            </Button>
          </div>
        </div>
        <TabsContent value="top" className="border-none p-0 outline-none">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Top Stations
              </h2>
              <p className="text-sm text-muted-foreground">
                Most popular radio stations right now.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {topStations.map((station) => (
                  <StationArtwork
                    key={station.name}
                    station={station}
                    className="w-[250px]"
                    aspectRatio="square"
                    width={250}
                    height={250}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent
          value="genre"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Stations by Genre
              </h2>
              <p className="text-sm text-muted-foreground">
                Pick a genre and start listening.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {genreStations.map((station) => (
                  <StationArtwork
                    key={station.name}
                    station={station}
                    className="w-[150px]"
                    aspectRatio="square"
                    width={150}
                    height={150}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RadioPage;
