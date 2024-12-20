import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarUrl?: string | null;
  fullName: string;
}

export function UserAvatar({ avatarUrl, fullName }: UserAvatarProps) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatarUrl || undefined} />
      <AvatarFallback>{fullName?.charAt(0) || "?"}</AvatarFallback>
    </Avatar>
  );
}