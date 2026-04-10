import {
  IKorevelStorageFile,
  IKorevelStorageFileTree,
  KorevelStorageUtil,
} from "./index.ts";

export class KorevelStorageTree {
  constructor(private storageUtils: KorevelStorageUtil) {}
  async getTree(flatList: IKorevelStorageFile[], rootParentId = 0) {
    const map: Map<number, IKorevelStorageFileTree> = new Map();
    const roots = [];

    for (const item of flatList) {
      map.set(item.id!, { ...item, children: [] });
    }

    for (const item of flatList) {
      const node = map.get(item.id!);

      if (node === undefined) continue;

      if (item.parentId === rootParentId) {
        roots.push(node);
      } else {
        const parent = map.get(item.parentId);

        if (parent != undefined) {
          if (parent.children != undefined) {
            parent.children.push(node);
          }
        } else {
          // Orphan
          roots.push(node);
        }
      }
    }

    return this.storageUtils.sortNodes(roots);
  }
}
