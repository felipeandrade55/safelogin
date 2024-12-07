import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, loadFlags } from "@/utils/flagsData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag } from "lucide-react";

interface FlagSelectorProps {
  selectedFlags: string[];
  onFlagToggle: (flagId: string) => void;
}

export function FlagSelector({ selectedFlags, onFlagToggle }: FlagSelectorProps) {
  const [flags] = useState<Flag[]>(loadFlags());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Tag className="h-4 w-4" />
          Flags ({selectedFlags.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-secondary p-1 rounded"
              onClick={() => onFlagToggle(flag.id)}
            >
              <Badge
                className={`${flag.color} text-white ${
                  selectedFlags.includes(flag.id) ? "opacity-100" : "opacity-50"
                }`}
              >
                {flag.name}
              </Badge>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}