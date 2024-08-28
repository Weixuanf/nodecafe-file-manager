import { useState } from "react";
import { Button } from "@/components/ui/button";
import Flex from "@/components/ui/Flex";
import ModelManagerDrawer from "./ModelManagerDrawer";
import { IconScript } from "@tabler/icons-react";
import LogsDrawer from "./LogsDrawer";
import RestartButton from "@/restart/RestartButton";

export default function ModelManagerTopbar({
  className,
}: {
  className?: string;
}) {
  const [showModelDrawer, setShowModelDrawer] = useState(false);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  return (
    <Flex className={className + " items-center"}>
      {showModelDrawer && (
        <ModelManagerDrawer onClose={() => setShowModelDrawer(false)} />
      )}
      {showLogsDrawer && (
        <LogsDrawer onClose={() => setShowLogsDrawer(false)} />
      )}

      <Button
        className={`ml-2`}
        size={"sm"}
        onClick={() => setShowModelDrawer(true)}
      >
        Models
      </Button>
      <Button
        className={`ml-2`}
        size={"sm"}
        onClick={() => setShowLogsDrawer(true)}
      >
        <IconScript className="h-4 w-4" />
        <span className="ml-1">Logs</span>
      </Button>
      <RestartButton className="ml-2" />
    </Flex>
  );
}
