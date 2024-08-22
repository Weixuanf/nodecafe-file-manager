import { useEffect, useState } from "react";
import { api, app } from "../comfyapp";
import { Button } from "@/components/ui/button";
import CustomDrawer from "@/components/ui/CustomDrawer";
import Flex from "@/components/ui/Flex";
import { IconRefresh, IconX } from "@tabler/icons-react";
import { fetchListFiles } from "./ModelManagerApi";
import ModelsListFileTree from "./ModelsListFileTree";
import { FileNode } from "./types";

export default function ModelManagerDrawer({
  onClose,
}: {
  onClose: () => void;
}) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    console.log(api.machine);
    const comfyuiModels = await fetchListFiles("models");
    const extraModels = await fetchListFiles("extra_models");
    setRefreshing(false);
    setModels([comfyuiModels, extraModels].filter((x) => !!x) as FileNode[]);
    setRefreshing(false);
  };

  const [models, setModels] = useState<FileNode[]>(() => {
    onRefresh();
    return [];
  });

  return (
    <>
      <CustomDrawer
        onClose={onClose}
        className="w-full md:!w-[500px] overflow-y-auto"
      >
        <div className="gap-5 p-5">
          <Flex className="justify-between mb-5">
            <Flex className="gap-5 items-center">
              <h2 className="font-medium text-lg">Models</h2>
              <Button size="sm" onClick={onRefresh} isLoading={refreshing}>
                <IconRefresh className="h-4 w-4" />
              </Button>
              {/* <Button onClick={() => setOpenInstallModel(true)}>
                Install Model
              </Button> */}
            </Flex>
            <Button variant={"ghost"} onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          </Flex>
          <ModelsListFileTree tree={models} />
        </div>
      </CustomDrawer>
    </>
  );
}
