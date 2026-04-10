import { IKorevel, IKorevelProvider } from '../../core/index.ts';
import { KorevelStorage, KorevelStorageDatabase, KorevelStorageTree, KorevelStorageUtil } from './index.ts';

export class KorevelStorageProvider implements IKorevelProvider{
  register(app: IKorevel): void | Promise<void> {
    const con = app.getContainer();

    con.registerClass("storage", KorevelStorage);
    con.registerClass("storageTree", KorevelStorageTree);
    con.registerClass("storageUtils", KorevelStorageUtil);
    con.registerClass("storageDb", KorevelStorageDatabase);
  }
  boot(app: IKorevel): void | Promise<void> {
  }

}