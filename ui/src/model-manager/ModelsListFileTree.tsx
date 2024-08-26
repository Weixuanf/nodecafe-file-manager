import { useState } from "react";
import Flex from "@/components/ui/Flex";
import {
  IconChevronDown,
  IconChevronRight,
  IconFolder,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { InstallModelDialog } from "./InstallModelDialog";
import { FileNode } from "./types";
import { formatSize } from "./fileTreeUtils";

export default function ModelsListFileTree({
  tree,
  onRefresh,
}: {
  tree: FileNode[];
  onRefresh: () => void;
}) {
  return (
    <div style={{ fontSize: "1rem" }}>
      {tree.map((file) => (
        <div key={file.name}>
          {file.children == null ? (
            <Flex className="justify-between flex-wrap items-center py-2">
              <div>{file.name}</div>

              <p className="text-gray-400">
                {formatSize(Number(file.sizeB ?? 0))}
              </p>
            </Flex>
          ) : (
            <FolderItem node={file} onRefresh={onRefresh} />
          )}
        </div>
      ))}
    </div>
  );
}

function FolderItem({
  node,
  onRefresh,
}: {
  node: FileNode;
  onRefresh: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [openUploadFile, setOpenUploadFile] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div
      onMouseLeave={() => {
        setIsMenuVisible(false);
      }}
    >
      <Flex
        className="items-center justify-between gap-1 cursor-pointer py-2 text-white"
        onClick={toggleExpand}
      >
        <Flex>
          {isExpanded ? (
            <IconChevronDown size={18} />
          ) : (
            <IconChevronRight size={18} />
          )}
          <IconFolder size={18} />
          <p className="ml-1">{node.name}</p>
        </Flex>
        <div className="relative flex flex-col items-end">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            <IconDotsVertical size={18} />
          </Button>
          {isMenuVisible && (
            <div
              onMouseLeave={() => {
                setIsMenuVisible(false);
              }}
              className="z-[10000] absolute top-full mt-1 right-0 bg-white border border-gray-200 shadow-lg rounded-md py-2 min-w-[120px]"
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUploadFile(true);
                }}
              >
                Upload File
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  const folderName = prompt("Enter folder name");
                  if (folderName) {
                    await fetch(`/nc_manager/create_folder`, {
                      method: "POST",
                      body: JSON.stringify({
                        folder: node.abs_path,
                        name: folderName,
                      }),
                    });
                    onRefresh();
                  }
                }}
              >
                New Folder
              </button>
            </div>
          )}
        </div>
      </Flex>
      {isExpanded && node.children && (
        <div className="pl-5">
          <ModelsListFileTree tree={node.children} onRefresh={onRefresh} />
        </div>
      )}

      {openUploadFile && (
        <InstallModelDialog
          onClose={() => setOpenUploadFile(false)}
          path={node.abs_path}
        />
      )}
    </div>
  );
}
