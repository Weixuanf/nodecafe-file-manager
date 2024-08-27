import { Button } from "@/components/ui/button";
import Flex from "@/components/ui/Flex";
import { useEffect, useState } from "react";

export default function CustomNodesTab() {
  const [customNodes, setCustomNodes] = useState<
    {
      name: string;
      path: string;
      git_url: string;
    }[]
  >([]);
  const [installing, setInstalling] = useState<string[]>([]);
  useEffect(() => {
    fetch("/nc_manager/list_custom_nodes")
      .then((res) => res.json())
      .then((data) => {
        setCustomNodes(data);
      });
  }, []);
  return (
    <div>
      {customNodes.map((node) => {
        return (
          <Flex
            key={node.name}
            className="py-2 justify-between hover:bg-gray-800"
          >
            <div>{node.name}</div>
            <Button
              size={"sm"}
              isLoading={installing.includes(node.path)}
              onClick={() => {
                setInstalling([...installing, node.path]);
                fetch("/nc_manager/update_custom_node", {
                  method: "POST",
                  body: JSON.stringify({
                    path: node.path,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }).then(() => {
                  setInstalling(installing.filter((x) => x !== node.path));
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
