import Flex from "@/components/ui/Flex";
import {
  IconChevronDown,
  IconChevronRight,
  IconFolder,
} from "@tabler/icons-react";
import { useState } from "react";

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
            <Flex className="justify-between flex-wrap items-center">
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div>
        <Flex
          className="items-center gap-1 cursor-pointer"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <IconChevronDown size={18} />
          ) : (
            <IconChevronRight size={18} />
          )}
          <IconFolder size={18} />
          <p>{node.name}</p>
        </Flex>
        {isExpanded && node.children && (
          <div className="pl-5">
            <ModelsListFileTree tree={node.children} />
          </div>
        )}
      </div>
    </div>
  );
}
