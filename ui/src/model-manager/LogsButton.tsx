import { Button } from "@/components/ui/button";
import { IconScript } from "@tabler/icons-react";
import LogsDrawer from "./LogsDrawer";
import { useState } from "react";

export default function LogsButton() {
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  return (
    <>
      <Button
        className={`ml-2`}
        size={"sm"}
        onClick={() => setShowLogsDrawer(true)}
      >
        <IconScript className="h-4 w-4" />
        <span className="ml-1">Logs</span>
      </Button>
      {showLogsDrawer && (
        <LogsDrawer onClose={() => setShowLogsDrawer(false)} />
      )}
    </>
  );
}
