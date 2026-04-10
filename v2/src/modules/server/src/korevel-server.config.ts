import { IKorevelServerConfig } from "../index.ts";

export class KorevelServerConfig implements IKorevelServerConfig {
  private timing: number = 1000;
  private namespace: string = "api";
  private baseUrl: string = "http://localhost:3000";
  private passthroughUrl: string[] = ["/**.vue", "/**.js", "/**.css"];

  setTiming(timing: number): void {
    this.timing = timing;
  }

  setNamespace(namespace: string): void {
    this.namespace = namespace;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  getTiming(): number {
    return this.timing;
  }

  getNamespace(): string {
    return this.namespace;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setPassthroughUrl(passthroughUrl: string[]): void {
    this.passthroughUrl = passthroughUrl;
  }

  getPassthroughUrl(): string[] {
    return this.passthroughUrl;
  }
}
