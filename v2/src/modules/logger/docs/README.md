# Korevel Logger

Version: 1.1

## Implementation

```typescript
export class KorevelService {
	logger: IKorevelLogger;
	constructor(logger: IKorevelLogger) {
		this.logger = logger.extend({
			instance: this
		})
	}
}
```

## Log Level

```typescript
export enum KorevelLogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}
```

### Set Log Level

```typescript
const korevel = new Korevel();
korevel.build((builder) => {
  builder.setLogLevel(KorevelLogLevel.DEBUG);
})
```

## Functions

```typescript
export interface IKorevelLogger {
  /**
   * Spawns a new logger instance inheriting settings from the current one.
   */
  extend(options: Partial<IKorevelLoggerModel>): IKorevelLogger;

  /**
   * Standard log output without a specific level priority.
   */
  log(message: string, ...messageBody: any[]): void;

  /**
   * Log with full configuration overrides.
   */
  logOption(option: IKorevelLoggerLogOption, ...messageBody: any[]): void;

  /**
   * Log a debug-level message.
   */
  debug(message: string, ...messageBody: any[]): void;

  /**
   * Log an info-level message.
   */
  info(message: string, ...messageBody: any[]): void;

  /**
   * Log a warning-level message.
   */
  warn(message: string, ...messageBody: any[]): void;

  /**
   * Log an error-level message.
   */
  error(message: string, ...messageBody: any[]): void;
  /**
   *
   */
  getLogLevel(): KorevelLogLevel;
}
```
