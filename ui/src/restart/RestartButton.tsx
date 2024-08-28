import { Button } from "@/components/ui/button";
import { fetchApi } from "@/utils/utils";
import { useState } from "react";

export default function RestartButton({ className }: { className?: string }) {
  const [isRestarting, setIsRestarting] = useState(false);
  const onRestart = () => {
    const confirmed = confirm("Are you sure you want to restart the server?");
    if (!confirmed) return;
    setIsRestarting(true);
    fetchApi("/manager/reboot");
    // continuously check if the server is running
    const interval = setInterval(() => {
      fetchApi("/").then((res) => {
        if (res.status === 200) {
          setIsRestarting(false);
          clearInterval(interval);
        }
      });
    }, 1000);
  };
  return (
    <Button
      onClick={onRestart}
      isLoading={isRestarting}
      size={"sm"}
      className={className}
    >
      Restart
    </Button>
  );
}
