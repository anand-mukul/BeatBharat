"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CircleUser,
  Search,
  Menu,
  ArrowLeft,
  Music4,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import UserProfileButton from "./UserProfileButton";

export function Navbar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setIsOpen(false);
    }
  };

  const handleDesktopSearchClose = () => {
    setIsSearchExpanded(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="border-b border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {!isSearchExpanded && (
            <>
              <div className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Music4 className="h-6 w-6" />
                  <span className="text-lg">BeatBharat</span>
                </Link>
              </div>

              <div className="hidden md:block flex-1 max-w-xl mx-auto">
                <SearchBar
                  isExpanded={true}
                  onClose={handleDesktopSearchClose}
                />
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
                </Button>

                <UserProfileButton />
              </div>

              <div className="md:hidden flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={toggleSearch}>
                  <Search className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </>
          )}

          {isSearchExpanded && (
            <div className="flex items-center w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="mr-2"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <SearchBar isExpanded={isSearchExpanded} onClose={toggleSearch} />
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isOpen && !isSearchExpanded && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </Button>
              <Link href={"/profile"}>
                <Button variant="ghost" className="w-full justify-start">
                  <CircleUser className="h-5 w-5 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
