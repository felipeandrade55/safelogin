import React from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { CredentialChange } from "@/types/history";

interface CredentialDiffViewerProps {
  change: CredentialChange;
}

export const CredentialDiffViewer = ({ change }: CredentialDiffViewerProps) => {
  const generateDiffContent = () => {
    const oldContent: Record<string, any> = {};
    const newContent: Record<string, any> = {};

    change.changedFields.forEach((field) => {
      oldContent[field.field] = field.oldValue;
      newContent[field.field] = field.newValue;
    });

    return {
      old: JSON.stringify(oldContent, null, 2),
      new: JSON.stringify(newContent, null, 2),
    };
  };

  const { old, new: newContent } = generateDiffContent();

  return (
    <div className="mt-4 rounded-lg border bg-background">
      <ReactDiffViewer
        oldValue={old}
        newValue={newContent}
        splitView={true}
        useDarkTheme={document.documentElement.classList.contains("dark")}
        styles={{
          variables: {
            dark: {
              diffViewerBackground: "#1a1b1e",
              diffViewerColor: "#FFF",
              addedBackground: "#044B53",
              addedColor: "#FFF",
              removedBackground: "#632F34",
              removedColor: "#FFF",
              wordAddedBackground: "#055d67",
              wordRemovedBackground: "#7d383f",
            },
            light: {
              diffViewerBackground: "#F8F9FA",
              diffViewerColor: "#212529",
              addedBackground: "#E6FFED",
              addedColor: "#24292E",
              removedBackground: "#FFE6E6",
              removedColor: "#24292E",
              wordAddedBackground: "#acf2bd",
              wordRemovedBackground: "#fdb8c0",
            },
          },
        }}
      />
    </div>
  );
};