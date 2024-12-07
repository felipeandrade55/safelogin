import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterBarProps {
  selectedTypes: string[];
  selectedFlags: string[];
  onTypeToggle: (type: string) => void;
  onFlagToggle: (flag: string) => void;
  availableTypes: string[];
}

export const FilterBar = ({
  selectedTypes,
  selectedFlags,
  onTypeToggle,
  onFlagToggle,
  availableTypes,
}: FilterBarProps) => {
  const flags = [
    { id: "importante", label: "Importante" },
    { id: "producao", label: "Produção" },
    { id: "desenvolvimento", label: "Desenvolvimento" },
    { id: "rede", label: "Rede" },
    { id: "fibra", label: "Fibra" },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="p-2">
            <div className="font-medium mb-2">Tipos</div>
            <div className="space-y-1">
              {availableTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onSelect={(e) => {
                    e.preventDefault();
                    onTypeToggle(type);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => onTypeToggle(type)}
                      className="rounded border-gray-300"
                    />
                    {type}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="font-medium mb-2 mt-4">Tags</div>
            <div className="space-y-1">
              {flags.map((flag) => (
                <DropdownMenuItem
                  key={flag.id}
                  onSelect={(e) => {
                    e.preventDefault();
                    onFlagToggle(flag.id);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFlags.includes(flag.id)}
                      onChange={() => onFlagToggle(flag.id)}
                      className="rounded border-gray-300"
                    />
                    {flag.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onTypeToggle(type)}
            >
              {type} ×
            </Badge>
          ))}
        </div>
      )}

      {selectedFlags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedFlags.map((flagId) => {
            const flag = flags.find((f) => f.id === flagId);
            return (
              <Badge
                key={flagId}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => onFlagToggle(flagId)}
              >
                {flag?.label} ×
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};