import CustomPanel from "@/components/ui/CustomPanel";
import { useEffect, useState, useRef } from "react";

export default function LogsDrawer({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState("");
  const logsEndRef = useRef<HTMLDivElement>(null);
  const refreshLog = () => {
    fetch("/nc_manager/get_logs")
      .then((response) => response.text())
      .then((text) => {
        setLogs(text);
      });
  };
  useEffect(() => {
    const timer = setInterval(refreshLog, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [logs]);

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
      <div ref={logsEndRef} />
    </CustomPanel>
  );
}
