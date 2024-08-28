import { useState } from "react";
import { Button } from "@/components/ui/button";
import Flex from "@/components/ui/Flex";
import ModelManagerDrawer from "./ModelManagerDrawer";
import RestartButton from "@/restart/RestartButton";
import LogsButton from "./LogsButton";

export default function ModelManagerTopbar({
  className,
}: {
  className?: string;
}) {
  const [showModelDrawer, setShowModelDrawer] = useState(false);
  return (
    <Flex className={className + " items-center"}>
      {showModelDrawer && (
        <ModelManagerDrawer onClose={() => setShowModelDrawer(false)} />
      )}
      <Button
        className={`ml-2`}
        size={"sm"}
        onClick={() => setShowModelDrawer(true)}
      >
        Models
      </Button>
      <LogsButton />
      <RestartButton className="ml-2" />
    </Flex>
  );
}
