export interface IKorevelRunnable {
  registerRunner(runner: IKorevelRunner): void;
  run(): Promise<void>;
}

export interface IKorevelRunner {
  run(): Promise<void>;
}
