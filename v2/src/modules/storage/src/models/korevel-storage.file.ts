import { IKorevelStorageFile } from "../korevel-storage.interface.ts";

export class KorevelStorageFile implements IKorevelStorageFile {
  id!: number;
  guid!: string;
  name!: string;
  path!: string;
  isDir!: boolean;
  parentId!: number;
  imageId?: number;
  createdAt!: number;
  updatedAt!: number;

  constructor(data: Omit<IKorevelStorageFile, "id">) {
    Object.assign(this, data);
  }

  static createDir({
    name,
    path,
    parentId = 0,
  }: {
    name: string;
    path: string;
    parentId?: number;
  }): IKorevelStorageFile {
    const completePath = KorevelStorageFile.generatePath(path, name);

    return new KorevelStorageFile({
      guid: crypto.randomUUID(),
      name,
      parentId,
      path: completePath,
      isDir: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  static createFile({
    name,
    imageId,
    parentId,
    path,
    mimeType,
    size,
  }: {
    name: string;
    imageId: number;
    path: string;
    parentId?: number;
    mimeType: string;
    size: number;
  }) {
    path = KorevelStorageFile.generatePath(path, name);
    return new KorevelStorageFile({
      guid: crypto.randomUUID(),
      name,
      path,
      parentId: parentId ?? 0,
      isDir: false,
      imageId,
      mimeType,
      size,
      createdAt: 0,
      updatedAt: 0,
    });
  }

  static generatePath(path: string, name: string) {
    return path.endsWith("/") ? `${path}${name}` : `${path}/${name}`;
  }
}
