import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUser } from "lucide-react";

const UserProfileButton = () => {
  const { user, refreshUser } = useAuth();

  return (
    <>
      {user ? (
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                <CircleUser className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">User</span>
          </Button>
        </Link>
      ) : (
        <Link href="/sign-in">
          <Button variant="ghost" size="icon" className="rounded-full">
            <CircleUser className="h-6 w-6" />
            <span className="sr-only">Sign in</span>
          </Button>
        </Link>
      )}
    </>
  );
};

export default UserProfileButton;
