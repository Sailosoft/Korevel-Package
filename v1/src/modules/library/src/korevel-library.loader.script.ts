import { IKoreveLibraryLoaderScript } from "../index.ts";

export default class KoreveLibraryLoaderScript implements IKoreveLibraryLoaderScript {
  createScriptElementVia(source: string): HTMLScriptElement {
    const script = document.createElement("script");
    script.src = source;
    script.async = false;
    return script;
  }

  async attachScriptElementToDocument(
    scriptElement: HTMLScriptElement,
  ): Promise<HTMLScriptElement> {
    document.head.appendChild(scriptElement);

    return new Promise((resolve, reject) => {
      scriptElement.onload = () => resolve(scriptElement);
      scriptElement.onerror = () =>
        reject(new Error(`Failed to load script ${scriptElement.src}`));
    });
  }

  async loadScript(src: string): Promise<void> {
    const scriptElement = this.createScriptElementVia(src);
    await this.attachScriptElementToDocument(scriptElement);
  }
}
