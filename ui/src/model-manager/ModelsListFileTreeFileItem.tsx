import { useState } from "react";
import Flex from "@/components/ui/Flex";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { formatSize } from "./fileTreeUtils";
import { FileNode } from "./types";
import { fetchApi } from "@/utils/utils";

export default function ModelsListFileTreeFileItem({
  file,
  onDeleted,
}: {
  file: FileNode;
  onDeleted: () => void;
}) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  return (
    <Flex className="justify-between flex-wrap items-center py-1 hover:bg-gray-800">
      <div>
        <div>{file.name}</div>
        <p className="text-gray-400">{formatSize(Number(file.sizeB ?? 0))}</p>
      </div>

      <div className="relative flex flex-col items-end">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuVisible(!isMenuVisible);
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
                fetchApi(`/nc_manager/delete_file`, {
                  method: "POST",
                  body: JSON.stringify({ path: file.abs_path }),
                }).then(() => {
                  onDeleted();
                });
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Flex>
  );
}
