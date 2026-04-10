import { IKorevelDepGun } from "../../dependencies/gun/gun.def.ts";
import { korevelGun } from "../../dependencies/index.ts";
import {
  IKorevelSocket,
  IKorevelSocketRole,
} from "./korevel-socket.interface.ts";
export class KorevelSocket<TPayload = any> implements IKorevelSocket {
  // Shared Gun instance across all socket instances in the same window/process
  private static _sharedGun: any = null;
  private db: IKorevelDepGun;
  private connectionTime: number;

  constructor(
    public readonly hub: string,
    public readonly role: IKorevelSocketRole,
  ) {
    // Initialize Gun only once
    if (!KorevelSocket._sharedGun) {
      // Gun([]) creates a local-only instance (no relay server)
      KorevelSocket._sharedGun = korevelGun({
        localStorage: true, // Prevents saving to the browser disk
        radisk: false, // Prevents internal storage indexing
      });
    }

    // Track when THIS specific instance was created
    this.connectionTime = Date.now();

    // Reference the specific hub/channel root
    this.db = KorevelSocket._sharedGun.get("korevel_socket_mock").get(hub);
  }

  /**
   * Emit logic:
   * Client writes to 'client_payload', Server listens to it.
   * Server writes to 'server_payload', Client listens to it.
   */
  emit(event: string, payload: TPayload): void {
    const targetNode =
      this.role === "client" ? "client_payload" : "server_payload";

    this.db
      .get(targetNode)
      .get(event)
      .put({
        data: JSON.stringify(payload),
        timestamp: Date.now(), // Essential for the listener filter
        sender: this.role,
      });
  }

  /**
   * Listen logic:
   * Uses a timestamp filter to ignore messages sent BEFORE this socket "connected".
   */
  on(event: string, callback: (data: TPayload) => void): void {
    const listenNode =
      this.role === "client" ? "server_payload" : "client_payload";

    this.db
      .get(listenNode)
      .get(event)
      .on((raw: any) => {
        // Only process if data exists and is NEWER than our connection time
        if (
          raw &&
          raw.data &&
          raw.timestamp &&
          raw.timestamp > this.connectionTime
        ) {
          try {
            const parsed = JSON.parse(raw.data);
            callback(parsed);
          } catch (e) {
            // Fallback if data isn't JSON
            callback(raw.data);
          }
        }
      });
  }

  /**
   * Wipes the current hub data so the next refresh starts empty.
   */
  clearHub(): void {
    this.db.get("client_payload").put(null);
    this.db.get("server_payload").put(null);
    console.log(`[KorevelSocket] Hub ${this.hub} cleared.`);
  }

  /**
   * Hard Reset: Wipes everything from the browser's LocalStorage
   */
  static forceWipeBrowserStorage(): void {
    localStorage.removeItem("gun/");
    location.reload(); // Reload needed to clear Gun's internal memory cache
  }
}
