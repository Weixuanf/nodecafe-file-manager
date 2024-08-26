import CustomPanel from "@/components/ui/CustomPanel";
import { useEffect, useState } from "react";

export default function LogsDrawer({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState("");
  useEffect(() => {
    fetch("/nc_manager/get_logs")
      .then((response) => response.text())
      .then((text) => {
        setLogs(text);
      });
  }, []);

  return (
    <CustomPanel onClose={onClose} className="overflow-y-auto">
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {logs}
      </pre>
    </CustomPanel>
  );
}
