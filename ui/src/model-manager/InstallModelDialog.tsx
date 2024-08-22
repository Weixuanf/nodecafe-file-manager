import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { uploadFile } from "./ModelManagerApi";

export function InstallModelDialog({
  onClose,
  path,
}: {
  onClose: () => void;
  path: string;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const onInstall = async () => {
    if (!url) {
      alert("❌ Download URL shouldn't be empty");
      return;
    }
    setLoading(true);
    const res = await uploadFile({
      folder: path,
      name: !!name.length ? name : null,
      url: url,
    });
    setLoading(false);

    if (res.error) {
      alert(`❌ ${res.error}`);
      return;
    }
    onClose();
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        !open && onClose();
      }}
    >
      <DialogContent className="z-[10005]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <p>
          📁<span className="font-mono">{path}/</span>
        </p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-right">File Name</p>
            <Input
              className="col-span-3"
              placeholder="v1-5-pruned-emaonly.safetensors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-right">Download Url</p>
            <Input
              className="col-span-3"
              placeholder="https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={onInstall}
            isLoading={loading}
          >
            Install
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
