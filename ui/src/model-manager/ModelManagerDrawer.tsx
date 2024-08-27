import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomDrawer from "@/components/ui/CustomDrawer";
import Flex from "@/components/ui/Flex";
import { IconX } from "@tabler/icons-react";
import ModelsListTab from "./ModelsListTab";
import CustomNodesTab from "./CustomNodesTab";

export default function ModelManagerDrawer({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState<"models" | "custom_nodes">(
    "models"
  );
  const primaryColor = "#B2A5FF";

  return (
    <>
      <CustomDrawer
        onClose={onClose}
        className="w-full md:!w-[500px] overflow-y-auto"
      >
        <div className="gap-5 p-5">
          <Flex className="justify-between mb-5">
            <Flex className="gap-5 items-center">
              <h2
                onClick={() => {
                  setSelectedTab("models");
                }}
                className="font-medium text-lg cursor-pointer"
                style={{
                  color: selectedTab === "models" ? primaryColor : "inherit",
                  borderBottom:
                    selectedTab === "models"
                      ? `2px solid ${primaryColor}`
                      : "none",
                }}
              >
                Models
              </h2>
              <h2
                onClick={() => {
                  setSelectedTab("custom_nodes");
                }}
                style={{
                  color:
                    selectedTab === "custom_nodes" ? primaryColor : "inherit",
                  borderBottom:
                    selectedTab === "custom_nodes"
                      ? `2px solid ${primaryColor}`
                      : "none",
                }}
                className="font-medium text-lg cursor-pointer"
              >
                Custom Nodes
              </h2>
            </Flex>
            <Button variant={"ghost"} onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          </Flex>
          {selectedTab === "models" && <ModelsListTab />}
          {selectedTab === "custom_nodes" && <CustomNodesTab />}
        </div>
      </CustomDrawer>
    </>
  );
}
