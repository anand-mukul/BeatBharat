"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { toast } from "sonner";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <Button onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
