import {
  IKorevelStorageFile,
  IKorevelStorageFileTree,
} from "./korevel-storage.interface.ts";

export class KorevelStorageUtil {
  generateGuid() {
    return crypto.randomUUID();
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  downloadBase64(base64: string, fileName: string) {
    const a = document.createElement("a");
    a.href = base64;
    a.download = fileName;
    a.click();
  }

  /**
   * Correctly calculates the new path string for files or directories
   */
  calculateNewPath(file: IKorevelStorageFile, newName: string): string {
    // Remove trailing slash if exists for consistent logic
    const base = file.path.replace(new RegExp(`${file.name}/?$`), "");
    const cleanBase = base.endsWith("/") ? base : `${base}/`;

    return file.isDir ? `${cleanBase}${newName}/` : `${cleanBase}${newName}`;
  }

  /**
   * Improved sorting: Folders first, then Alphanumeric (Natural Sort)
   */
  sort(files: IKorevelStorageFile[]) {
    return files.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }
  getOldSegments(file: IKorevelStorageFile, name: string) {
    const oldSegments = file.path.split("/");

    oldSegments[oldSegments.length - (file.isDir ? 2 : 1)] = name;

    const newPath = oldSegments.join("/");

    return newPath;
  }

  sortNodes(nodes: IKorevelStorageFileTree[]) {
    nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    for (const node of nodes) {
      if (node.children?.length) this.sortNodes(node.children);
    }

    return nodes;
  }
}
