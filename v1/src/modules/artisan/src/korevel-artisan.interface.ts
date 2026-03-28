export type IKorevelArtisanCommandInput = {
  arguments: Record<string, string | string[] | undefined>;
  options: Record<string, string | boolean | undefined>;
};

export interface IKorevelArtisanCommand {
  signature: string;
  description?: string;
  handle(input: IKorevelArtisanCommandInput): Promise<void> | void;
}

export interface IKorevelArtisan {
  registerCommand(cliName: string, commandClass: any): void;
  run(commandLine: string): Promise<void>;
}
