export interface IKorevelDepGun {
  get(key: string): IKorevelDepGun;
  put(data: any, callback?: (ack: any) => void): IKorevelDepGun;
  on(callback: (data: any, key: string) => void): IKorevelDepGun;
  once(callback: (data: any, key: string) => void): IKorevelDepGun;
  map(): IKorevelDepGun;
  set(data: any): IKorevelDepGun;
}

export type IKorevelDepGunConstructor = (
  options?: string[] | any,
) => IKorevelDepGun;
