import React, { useState } from "react";
import Flex from "@/components/ui/Flex";
import {
  IconChevronDown,
  IconChevronRight,
  IconFolder,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export type FileNode = {
  name: string;
  size?: string;
  children?: FileNode[];
};

export default function ModelsListFileTree({ tree }: { tree: FileNode[] }) {
  return (
    <div style={{ fontSize: "1rem" }}>
      {tree.map((file) => (
        <div key={file.name}>
          {file.children == null ? (
            <Flex className="justify-between flex-wrap items-center py-2">
              <div>{file.name}</div>
              <p className="text-gray-400">{file.size}</p>
            </Flex>
          ) : (
            <FolderNode node={file} />
          )}
        </div>
      ))}
    </div>
  );
}

function FolderNode({ node }: { node: FileNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div>
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
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
        >
          <Button size="sm" variant="outline">
            <IconDotsVertical size={18} />
          </Button>
        </div>
      </Flex>
      {isExpanded && node.children && (
        <div className="pl-5">
          <ModelsListFileTree tree={node.children} />
        </div>
      )}
      {isMenuVisible && (
        <div
          className="relative"
          onMouseLeave={() => {
            setIsMenuVisible(false);
          }}
        >
          <div className="absolute right-0 bg-white border border-gray-200 shadow-lg rounded-md py-2">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => alert("Upload File clicked")}
            >
              Upload File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
