import { Check, Filter, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { loadFlags } from "@/utils/flagsData";

interface FilterBarProps {
  selectedTypes: string[];
  selectedFlags: string[];
  onTypeToggle: (type: string) => void;
  onFlagToggle: (flagId: string) => void;
  availableTypes: string[];
}

export function FilterBar({ 
  selectedTypes, 
  selectedFlags,
  onTypeToggle, 
  onFlagToggle,
  availableTypes 
}: FilterBarProps) {
  const flags = loadFlags();
  const totalFilters = selectedTypes.length + selectedFlags.length;

  return (
    <div className="flex items-center gap-2">
      {selectedTypes.map((type) => (
        <Badge
          key={type}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {type}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onTypeToggle(type)}
          />
        </Badge>
      ))}
      
      {selectedFlags.map((flagId) => {
        const flag = flags.find(f => f.id === flagId);
        if (!flag) return null;
        
        return (
          <Badge
            key={flagId}
            className={`${flag.color} flex items-center gap-1`}
          >
            {flag.name}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => onFlagToggle(flagId)}
            />
          </Badge>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {totalFilters > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalFilters}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Tipo de Credencial</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {availableTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => onTypeToggle(type)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Flags
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {flags.map((flag) => (
              <DropdownMenuCheckboxItem
                key={flag.id}
                checked={selectedFlags.includes(flag.id)}
                onCheckedChange={() => onFlagToggle(flag.id)}
              >
                <Badge className={`${flag.color} mr-2`}>
                  {flag.name}
                </Badge>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}