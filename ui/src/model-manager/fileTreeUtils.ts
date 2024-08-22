type FileNode = {
  path: string;
  name: string;
  size?: string;
  children?: FileNode[];
};

export const formatSize = (sizeB: number): string => {
  const sizeKB = sizeB / 1024;
  const sizeMB = sizeKB / 1024;
  const sizeGB = sizeMB / 1024;

  if (sizeGB >= 1) {
    return `${sizeGB.toFixed(1)} GB`;
  } else if (sizeMB >= 1) {
    return `${sizeMB.toFixed(1)} MB`;
  } else if (sizeKB >= 1) {
    return `${sizeKB.toFixed(1)} KB`;
  } else {
    return `${sizeB} B`;
  }
};

export const convertToTree = (
  data: Record<string, { sizeB: number; sizeKB?: number }>
): FileNode[] => {
  const root: Record<string, any> = {};

  Object.entries(data).forEach(([path, { sizeB }]) => {
    if (path.endsWith(".path.ckpt")) {
      return;
    }
    const parts = path.split("/");
    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath += (currentPath ? "/" : "") + part;
      if (!currentLevel[part]) {
        currentLevel[part] = { path: currentPath, name: part, children: {} };
      }

      if (index === parts.length - 1) {
        currentLevel[part].size = formatSize(sizeB);
      }

      currentLevel = currentLevel[part].children;
    });
  });

  const convertToArray = (node: Record<string, any>): FileNode[] => {
    return Object.values(node).map((n: any) => ({
      path: n.path,
      name: n.name,
      size: n.size,
      children:
        n.children && Object.keys(n.children).length > 0
          ? convertToArray(n.children)
          : undefined,
    }));
  };

  return convertToArray(root);
};
