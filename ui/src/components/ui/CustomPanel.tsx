import { IconX } from "@tabler/icons-react";
import { createPortal } from "react-dom";
import { useState, useRef } from "react";
import { Button } from "./button";

export default function CustomPanel({
  onClose,
  children,
  className = "",
}: {
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight - (e.clientY - startY); // Adjust height calculation
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return createPortal(
    <>
      <div
        ref={panelRef}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 10002,
          display: "flex",
          flexDirection: "column",
        }}
        className={`bg-zinc-950 ${className}`}
      >
        <div
          style={{
            position: "relative",
            height: "40px", // Adjust height as needed
          }}
        >
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={onClose}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <IconX className="h-5 w-5" />
            <span className="ml-1">Close</span>
          </Button>

          <div
            onMouseDown={handleMouseDown}
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "gray",
              position: "absolute",
              right: 0,
              top: 0,
              cursor: "nwse-resize",
              zIndex: 2,
            }}
          />
        </div>

        <div
          style={{
            overflowY: "auto",
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </>,
    document.body // Portal to body
  );
}
