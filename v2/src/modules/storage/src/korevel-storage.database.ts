import { korevelDexie } from "../../dependencies/index.ts";
import {
  IKorevelStorageDatabaseOption,
  IKorevelStorageDb,
  IKorevelStorageFile,
  IKorevelStorageImage,
} from "./korevel-storage.interface.ts";
// option: IKorevelStorageDatabaseOption
export class KorevelStorageDatabase {
  db: IKorevelStorageDb;
  constructor() {
    this.db = new korevelDexie(
      `_storage.default`,
    ) as unknown as IKorevelStorageDb;

    this.db.version(1).stores({
      files: "++id, guid, name, parentId, isDir, path",
      images: "++id",
    });
  }

  async addImage(image: Base64URLString) {
    return await this.db.images.add({ image });
  }

  async addFile(file: IKorevelStorageFile) {
    return await this.db.files.add(file);
  }

  async hasChildren(file: IKorevelStorageFile): Promise<boolean> {
    return (await this.db.files.where("parentId").equals(file.id).count()) > 0;
  }

  async deleteImage(file: IKorevelStorageFile) {
    if (file.imageId === undefined) return;
    return await this.db.images.delete(file.imageId);
  }

  async deleteFile(file: IKorevelStorageFile) {
    if (file.id === undefined) return;
    return await this.db.files.delete(file.id);
  }

  async clear() {
    this.db.files.clear();
    this.db.images.clear();
  }

  async getFile(id: number) {
    const file = await this.db.files.get(id);
    if (!file) throw new Error(`File not found: ${id}`);
    return file;
  }

  async getImage(id: number) {
    const image = await this.db.images.get(id);
    if (!image) throw new Error(`Image not found: ${id}`);
    return image;
  }
}
