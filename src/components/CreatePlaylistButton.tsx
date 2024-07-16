"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/authContext";
import { usePlaylistContext } from "@/contexts/playlistContext";
import { toast } from "sonner";

const playlistSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false).optional(),
});

export function CreatePlaylistButton() {
  const form = useForm<z.infer<typeof playlistSchema>>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
    },
  });

  const { user } = useAuth();
  const { addPlaylist } = usePlaylistContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreatePlaylist = async (data: z.infer<typeof playlistSchema>) => {
    try {
      await addPlaylist(
        data.name,
        data.description || "",
        data.isPublic || false
      );
      form.reset();
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handling is now done in the context
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          if (!user) {
            toast.warning("You must be logged in to create a playlist");
          } else {
            setIsCreateDialogOpen(true);
          }
        }}
      >
        <PlusCircledIcon className="mr-2 h-4 w-4" />
        Create Playlist
      </Button>

      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={() => setIsCreateDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreatePlaylist)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Make playlist public</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Playlist</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
