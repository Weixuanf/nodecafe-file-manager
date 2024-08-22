import { fetchApi } from "@/utils/utils";
import { FileNode } from "./types";

export async function fetchListFiles(path: string): Promise<FileNode> {
  return await fetchApi("/nc_manager/list_files?path=" + path).then((res) =>
    res.json()
  );
}

export async function uploadFile(file: {
  folder: string;
  url: string;
  name: string;
}): Promise<{
  data?: {
    id: string;
    status: "IN_QUEUE";
  };
  error?: string;
}> {
  return await fetch("/nc_manager/upload_file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}
