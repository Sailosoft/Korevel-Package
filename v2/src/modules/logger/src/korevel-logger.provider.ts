import { IKorevel, IKorevelProvider } from '../../core/index.ts';
import { KorevelLogger, KorevelLogLevel } from '../index.ts';

export class KorevelLoggerProvider implements IKorevelProvider {
  register(app: IKorevel): void | Promise<void> {
    const env = app.getEnvironment();
    const container = app.getContainer();

    const logLevel = env.get<KorevelLogLevel>("LOG_LEVEL");
    const logger = new KorevelLogger({
      level: logLevel,
    });

    container.registerValue("logger", logger);
  }
  boot(app: IKorevel): void | Promise<void> {
  }
}