# Creating and Running Artisan Commands in Korevel

This guide walks you through creating a custom CLI command with arguments and options, registering it, and executing it directly from your browser's developer tools.

---

## 1. Create Your Command Class
Every command must implement the `IKorevelArtisanCommand` interface. Use the `signature` property to define how your command expects to receive data.

* **Arguments:** Defined as `{name}`.
* **Options:** Defined as `{--name}`.

```typescript
import { IKorevelArtisanCommand, IKorevelArtisanCommandInput } from "./path-to-interfaces";

export class GreetCommand implements IKorevelArtisanCommand {
  // Define the signature: greet {name} {--shout}
  public signature = "greet {name} {--shout}";
  public description = "Greets a user with an optional shout effect";

  async handle(input: IKorevelArtisanCommandInput): Promise<void> {
    const name = input.arguments.name;
    const shouldShout = input.options.shout;

    let message = `Hello, ${name}!`;

    if (shouldShout === "true" || shouldShout === "") {
      message = message.toUpperCase();
    }

    console.log(`%c[Artisan] ${message}`, "color: #00ff00; font-weight: bold;");
  }
}
```

---

## 2. Register the Command
To make the command available, you must register it with the `KorevelArtisan` service. This is typically done within a **Provider** or during your application's bootstrap phase.

```typescript
// Inside a Provider boot method or your app init
const artisan = container.resolve<IKorevelArtisan>("artisan");

artisan.registerCommand("greet", GreetCommand);
```

---

## 3. Running Commands via Browser Console
The `KorevelArtisanProvider` automatically attaches the artisan service to the global `window` object. This allows you to trigger backend-style logic from the frontend console.

### Open DevTools
1. Right-click anywhere on your app and select **Inspect**.
2. Click the **Console** tab.

### Execute the Command
Type the following into the console and press **Enter**:

```javascript
// Pattern: window.korevel.artisan.run("commandName argument --option=value")

// Basic usage
await window.korevel.artisan.run("greet John");

// Usage with options
await window.korevel.artisan.run("greet John --shout=true");
```

---

## 💡 Key Implementation Details

### How Signature Parsing Works
Based on your current `parseSignature` implementation:

* **Arguments:** The parser takes the `inputParts` and shifts them sequentially into the keys defined in your signature.
* **Options:** Options must be passed using the `=` syntax (e.g., `--key=value`).
    * If `--key=something` is found, the value is `"something"`.
    * If the option is missing, the value defaults to `false`.

### Command Lifetime
Commands are registered as `TRANSIENT` in the container. This means a **new instance** of the command class is created every time you run it, ensuring a clean state for every execution.