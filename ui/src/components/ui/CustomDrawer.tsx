import { createPortal } from "react-dom";

export default function CustomDrawer({
  onClose,
  children,
  className = "",
}: {
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>
      <div
        style={{
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10002,
        }}
        className={`bg-zinc-950 ${className}`}
      >
        {children}
      </div>
    </>,
    document.body // Portal to body
  );
}
