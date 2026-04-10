export type IKorevelSocketRole = "client" | "server";
export interface IKorevelSocket {
  readonly role: IKorevelSocketRole;
  readonly hub: string;
  emit(event: string, payload: any): void;
  on(event: string, callback: (data: any) => void): void;
}