import { KorevelStorage } from './index.ts';

export class KorevelStorageService {
  constructor(storage: KorevelStorage) {}

  async upload(formData: FormData) : Promise<{ success: boolean, error?: string }> {

    return { success: true }
  }
}