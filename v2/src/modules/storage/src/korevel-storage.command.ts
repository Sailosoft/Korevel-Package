import { IKorevelArtisanCommand } from '../../artisan/index.ts';
import { IKorevelLogger } from '../../logger/index.ts';

import { KorevelStorage } from './index.ts';

export class KorevelStorageClearCommand implements IKorevelArtisanCommand {
  signature = 'storage:clear';
  description = 'Clear all files and images from the storage database';

  logger: IKorevelLogger;

  constructor(
    private readonly storage: KorevelStorage,
    logger: IKorevelLogger
  ) {
    this.logger = logger.extend({
      instance: this
    })
  }

  async handle(): Promise<void> {
    try {
      await this.storage.clear();
      this.logger.info('Storage cleared');
    } catch (error) {
      this.logger.error('Failed to clear storage', error);
      throw error;
    }
  }

}