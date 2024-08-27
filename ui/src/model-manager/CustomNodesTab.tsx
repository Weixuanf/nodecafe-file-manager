import { Button } from "@/components/ui/button";
import Flex from "@/components/ui/Flex";
import path from "path";
import { useEffect, useState } from "react";

export default function CustomNodesTab() {
  const [customNodes, setCustomNodes] = useState<
    {
      name: string;
      path: string;
      git_url: string;
    }[]
  >([]);
  useEffect(() => {
    fetch("/nc_manager/list_custom_nodes")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCustomNodes(data);
      });
  }, []);
  return (
    <div>
      {customNodes.map((node) => {
        return (
          <Flex
            key={node.name}
            className="py-2 justify-between hover:bg-gray-600"
          >
            <div>{node.name}</div>
            <Button
              size={"sm"}
              onClick={() => {
                fetch("/nc_manager/update_custom_node", {
                  method: "POST",
                  body: JSON.stringify({
                    path: node.path,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              }}
            >
              Update
            </Button>
          </Flex>
        );
      })}
    </div>
  );
}
