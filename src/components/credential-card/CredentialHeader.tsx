import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, FileText, Trash2, RotateCcw } from "lucide-react";
import { FlagSelector } from "../FlagSelector";
import { loadManufacturers } from "@/utils/manufacturerData";

interface CredentialHeaderProps {
  title: string;
  cardType: string;
  manufacturerId?: string;
  files: Array<{ id: string; name: string; }>;
  isTrash?: boolean;
  flags?: string[];
  onFlagChange?: (flags: string[]) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onFileViewerOpen: () => void;
}

const getCardTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'Equipamento': 'bg-blue-500',
    'Servidor': 'bg-green-500',
    'Roteador': 'bg-yellow-500',
    'Switch': 'bg-purple-500',
    'Rádio': 'bg-orange-500',
    'OLT': 'bg-red-500',
    'Site': 'bg-indigo-500',
    'Outros': 'bg-gray-500'
  };
  return colors[type] || colors['Outros'];
};

export const CredentialHeader = ({
  title,
  cardType,
  manufacturerId,
  files,
  isTrash = false,
  flags = [],
  onFlagChange,
  onEdit,
  onDelete,
  onRestore,
  onFileViewerOpen
}: CredentialHeaderProps) => {
  const manufacturer = manufacturerId ? loadManufacturers().find(m => m.id === manufacturerId) : null;

  const handleFlagToggle = (flagId: string) => {
    if (!onFlagChange) return;
    const newFlags = flags.includes(flagId)
      ? flags.filter(f => f !== flagId)
      : [...flags, flagId];
    onFlagChange(newFlags);
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex flex-col gap-1">
        <CardTitle className="text-xl font-bold truncate">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={`${getCardTypeColor(cardType)} text-white`}>
            {cardType}
          </Badge>
          {manufacturer && (
            <Badge variant="outline">
              {manufacturer.name}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!isTrash && onFlagChange && (
          <FlagSelector
            selectedFlags={flags}
            onFlagToggle={handleFlagToggle}
          />
        )}
        {!isTrash && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onFileViewerOpen}
            className="relative"
          >
            <FileText className="h-4 w-4" />
            {files.length > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                {files.length}
              </Badge>
            )}
          </Button>
        )}
        {isTrash ? (
          <Button variant="ghost" size="icon" onClick={onRestore}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </CardHeader>
  );
};