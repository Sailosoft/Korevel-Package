import { IKorevelCoreProviderRegistry, IKorevelProvider } from "../index.ts";

export default class KorevelCoreProviderRegistry implements IKorevelCoreProviderRegistry {
  providers: IKorevelProvider[] = [];
  getProviders(): IKorevelProvider[] {
    return this.providers;
  }
  registerProvider(provider: IKorevelProvider): void {
    this.providers.push(provider);
  }
  registerProviders(providers: IKorevelProvider[]): void {
    this.providers.push(...providers);
  }
}
