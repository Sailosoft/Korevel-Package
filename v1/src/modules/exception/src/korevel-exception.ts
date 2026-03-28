import { IKorevelLogger } from "../../logger/index.ts";

/**
 * Base abstract class for all Korevel-specific exceptions.
 * Provides integrated logging and metadata support for debugging.
 */
export default abstract class KorevelException extends Error {
  public readonly timestamp: string;
  public readonly context?: Record<string, unknown>;

  /**
   * @param message - Human-readable error message.
   * @param context - Optional object containing state data for debugging.
   */
  constructor(message: string, context?: Record<string, unknown>) {
    super(message);

    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Dispatches the error to the Korevel Logger.
   * @param logger - An instance of the KorevelLogger.
   * @param extraData - Optional additional objects to log alongside the error.
   */
  public capture(logger: IKorevelLogger, ...extraData: unknown[]): void {
    try {
      const logPayload = {
        name: this.name,
        timestamp: this.timestamp,
        stack: this.stack,
        context: this.context,
        ...extraData,
      };

      logger.logOption(
        {
          message: `[EXCEPTION] ${this.message}`,
          scopeTag: this.name,
          scopeTagColor: "#e74c3c", // Default red for errors
        },
        this.context,
        this.stack,
        ...logPayload,
      );
    } catch (loggerError) {
      // Fallback if the logger itself fails
      console.error("Korevel Critical: Logger failed to capture exception.", {
        originalError: this.message,
        loggerError,
      });
    }
  }
}
