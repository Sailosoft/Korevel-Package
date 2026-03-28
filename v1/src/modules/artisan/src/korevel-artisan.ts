import { IKorevelContainer } from "../../container/index.ts";
import {
  IKorevelArtisan,
  IKorevelArtisanCommand,
  IKorevelArtisanCommandInput,
} from "./korevel-artisan.interface.ts";

export class KorevelArtisan implements IKorevelArtisan {
  private commandManifest: Map<string, string> = new Map();

  constructor(private korevelContainer: IKorevelContainer) {}

  registerCommand(cliName: string, commandClass: any): void {
    const containerAlias = `artisan.command.${cliName}`;
    this.korevelContainer.registerClass(containerAlias, commandClass, {
      lifetime: "TRANSIENT",
    });
    this.commandManifest.set(cliName, containerAlias);
  }

  async run(commandLine: string): Promise<void> {
    const parts = commandLine.trim().split(/\s+/);
    const cliName = parts.shift();

    if (!cliName || !this.commandManifest.has(cliName)) {
      console.error(
        `%c[Artisan] Command "${cliName}" not found.`,
        "color: red; font-weight: bold;",
      );
      return;
    }

    const alias = this.commandManifest.get(cliName)!;
    const command =
      this.korevelContainer.resolve<IKorevelArtisanCommand>(alias);

    const input = this.parseSignature(command.signature, parts);
    return await command.handle(input);
  }

  private parseSignature(
    signature: string,
    inputParts: string[],
  ): IKorevelArtisanCommandInput {
    const result: IKorevelArtisanCommandInput = { arguments: {}, options: {} };
    const sigParts = signature.split(/\s+/).slice(1);

    sigParts.forEach((part) => {
      const clean = part.replace(/[{}]/g, "");
      if (clean.startsWith("--")) {
        const key = clean.replace("--", "");
        const found = inputParts.find((p) => p.startsWith(`--${key}=`));
        result.options[key] = found ? found.split("=")[1] : false;
      } else {
        result.arguments[clean] = inputParts.shift();
      }
    });

    return result;
  }

  getAllCommands() {
    return this.commandManifest
      .values()
      .map((e) => {
        const value = this.korevelContainer.resolve<IKorevelArtisanCommand>(e);
        return {
          signature: value.signature,
          description: value.description,
        };
      })
      .toArray();
  }
}
