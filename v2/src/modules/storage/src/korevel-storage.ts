import { IKorevelDepDexieDb } from "../../dependencies/dexie/dexie.def.ts";
import { IKorevelLogger } from "../../logger/index.ts";
import {
  IKorevelStorageDb,
  IKorevelStorageFile,
  IKorevelStorageGetListParam,
  KorevelStorageDatabase,
  KorevelStorageFile,
  KorevelStorageTree,
  KorevelStorageUtil,
} from "./index.ts";

export class KorevelStorage {
  db: IKorevelStorageDb;
  logger: IKorevelLogger;
  constructor(
    private readonly storageUtils: KorevelStorageUtil,
    private readonly storageDb: KorevelStorageDatabase,
    private readonly storageTree: KorevelStorageTree,
    logger: IKorevelLogger,
  ) {
    this.db = storageDb.db;
    this.logger = logger.extend({
      instance: this,
    });
  }

  async createFolder(
    folderName: string,
    parentPath?: string,
    parentId?: number,
  ) {
    parentPath = parentPath || "/";

    const dir = KorevelStorageFile.createDir({
      name: folderName,
      path: parentPath,
      parentId,
    });

    const id = await this.storageDb.addFile(dir);

    return { ...dir, id };
  }

  async upload({
    file,
    parentId,
    parentPath,
  }: {
    file: File;
    parentId?: number;
    parentPath?: string;
  }): Promise<IKorevelStorageFile> {
    const base64 = await this.storageUtils.fileToBase64(file);

    return await this.db.transaction("rw", ["files", "images"], async () => {
      const imageId = await this.storageDb.addImage(base64);

      const fileEntry = KorevelStorageFile.createFile({
        name: file.name,
        imageId,
        path: parentPath || "/",
        parentId,
        mimeType: file.type,
        size: file.size,
      });

      const id = await this.storageDb.addFile(fileEntry);

      return { ...fileEntry, id };
    });
  }

  async download(fileId: number) {
    const entry = await this.storageDb.getFile(fileId);

    if (entry.isDir) throw new Error("Cannot download a directory");

    if (!entry.imageId) throw new Error("Cannot find file in a directory");

    const img = await this.storageDb.getImage(entry.imageId);

    this.storageUtils.downloadBase64(img.image, entry.name);

    return entry;
  }

  /**
   * Fetches a list of storage entries.
   * Supports:
   * - Specific folder listing (via parentId)
   * - Global flat listing (if parentId is omitted)
   * - Filtering by type (files only or directories only)
   */
  async list({ parentId, dirOnly, filesOnly }: IKorevelStorageGetListParam) {
    this.logger.debug("list", { parentId, dirOnly, filesOnly });
    // 1. Determine the base collection
    // If parentId is provided, we use the index for speed.
    // If parentId is undefined/null, we grab the entire collection (Flat List).
    let query =
      parentId !== undefined && parentId !== null
        ? this.db.files.where("parentId").equals(parentId)
        : this.db.files.toCollection();

    // 2. Apply dynamic filters
    // We use filter() here to keep the query flexible without needing
    // complex compound indices for every permutation of flags.
    if (dirOnly) {
      query = query.filter((item) => item.isDir === true);
    } else if (filesOnly) {
      query = query.filter((item) => item.isDir === false);
    }

    // 3. Execute query and sort results
    const results = await query.toArray();

    // Return the sorted list using your utility helper
    return this.storageUtils.sort(results);
  }

  async listTree(option: IKorevelStorageGetListParam) {
    const flatList = await this.list(option);
    return this.storageTree.getTree(flatList);
  }

  async delete(id: number) {
    const entry = await this.db.files.get(id);

    if (!entry) throw new Error(`Entry not found: ${id}`);

    if (entry.isDir) {
      const hasChildren = await this.storageDb.hasChildren(entry);
      if (hasChildren) {
        throw new Error("Cannot delete non-empty directory");
      }
    } else if (entry.imageId) {
      await this.storageDb.deleteImage(entry);
    }

    await this.storageDb.deleteFile(entry);
  }

  async rename(id: number, newName: string) {
    return await this.db.transaction("rw", ["files"], async () => {
      const entry = await this.storageDb.getFile(id);
      const oldPath = entry.path;
      const newPath = this.storageUtils.calculateNewPath(entry, newName);

      // 1. Update the item itself
      await this.db.files.update(id, {
        name: newName,
        path: newPath,
        updatedAt: Date.now(),
      });

      // 2. If it's a directory, update all nested descendants' paths
      if (entry.isDir) {
        const descendants = await this.db.files
          .where("path")
          .startsWith(oldPath)
          .toArray();

        for (const child of descendants) {
          // Replace the old parent segment with the new one
          const updatedPath = child.path.replace(oldPath, newPath);
          await this.db.files.update(child.id!, { path: updatedPath });
        }
      }

      return { ...entry, name: newName, path: newPath };
    });
  }

  async deleteRecursive(id: number) {
    return await this.db.transaction("rw", ["files", "images"], async () => {
      const entry = await this.storageDb.getFile(id);

      if (entry.isDir) {
        // Find all files/folders inside this path
        const descendants = await this.db.files
          .where("path")
          .startsWith(entry.path)
          .toArray();

        for (const item of descendants) {
          if (item.imageId) await this.db.images.delete(item.imageId);
          await this.db.files.delete(item.id!);
        }
      }

      if (entry.imageId) await this.db.images.delete(entry.imageId);
      await this.db.files.delete(id);
    });
  }

  async search(query: string) {
    const q = query.toLowerCase();
    return this.db.files
      .toCollection()
      .filter((item) => item.name.toLowerCase().includes(q))
      .toArray();
  }

  async stat(id: number): Promise<IKorevelStorageFile> {
    return this.storageDb.getFile(id);
  }

  async clear() {
    return this.storageDb.clear();
  }

  getFromFormData(formData: FormData) {
    return {
      file: formData.get("file") as File,
      parentId: Number(formData.get("parentId")),
      parentPath: (formData.get("parentPath") as string) ?? "/",
    };
  }
}
