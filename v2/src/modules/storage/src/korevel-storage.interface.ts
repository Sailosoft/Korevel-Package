import {
  IKorevelDepDexieDb,
  IKorevelDepDexieTable,
} from "../../dependencies/dexie/dexie.def.ts";

export interface IKorevelStorageDatabaseOption {
  name: string;
}

export interface IKorevelStorageFile {
  id?: number;
  guid: string;
  name: string;
  path: string;
  isDir: boolean;
  parentId: number;
  imageId?: number;
  mimeType?: string;
  size?: number;
  createdAt: number;
  updatedAt: number;
}

export interface IKorevelStorageFileTree extends IKorevelStorageFile {
  children?: IKorevelStorageFileTree[];
}

export interface IKorevelStorageImage {
  id?: number;
  image: string; // base 64 image
}

export interface IKorevelStorageGetListParam {
  parentId?: number;
  dirOnly?: boolean;
  filesOnly?: boolean;
}

export interface IKorevelStorageDb extends IKorevelDepDexieDb {
  files: IKorevelDepDexieTable<IKorevelStorageFile, number>;
  images: IKorevelDepDexieTable<IKorevelStorageImage, number>;
}
