import { useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { FileNode } from "./types";
import { fetchListFiles } from "./ModelManagerApi";
import ModelsListFileTree from "./ModelsListFileTree";

export default function ModelsListTab() {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
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
    <div style={{ fontSize: "1rem" }}>
      <Button onClick={onRefresh} isLoading={refreshing} variant={"outline"}>
        <IconRefresh className="h-4 w-4" />
      </Button>
      <ModelsListFileTree tree={models} onRefresh={onRefresh} />
    </div>
  );
}
