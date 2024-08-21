import { fetchApi } from "@/utils/utils";

export async function fetchListFiles(path: string): Promise<Record<
  string,
  {
    sizeB: number;
    sizeKB: number;
  }
> | null> {
  return await fetchApi("/nc_manager/list_files?path=" + path).then((res) =>
    res.json()
  );
}

export async function installModels(model: {
  name: string;
  folder: string;
  url: string;
}): Promise<{
  data?: {
    id: string;
    status: "IN_QUEUE";
  };
  error?: string;
}> {
  return await fetch("/api/machine/installMachineModels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deps: {
        [model.name]: {
          folder: model.folder,
          url: model.url,
        },
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}
