import { api } from "@/comfyapp";

export const fetchApi = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  return api.fetchApi(url, options);
};
