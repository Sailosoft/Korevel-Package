import { IKorevelLogger, KorevelLogger } from "../../logger/index.ts";
import {
  IKorevelRunnable,
  IKorevelRunner,
} from "./korevel-runnable.interface.ts";

export class KorevelRunnable implements IKorevelRunnable {
  logger: IKorevelLogger = new KorevelLogger({ instance: this });
  private runners: IKorevelRunner[] = [];

  constructor() {}

  registerRunner(runner: IKorevelRunner): void {
    this.runners.push(runner);
  }

  async run() {
    this.logger.log("Running runners...");
    await Promise.all(this.runners.map((runner) => runner.run()));
    this.logger.log("Runners finished!");
  }
}
