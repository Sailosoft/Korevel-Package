# Korevel Artisan Service

## Description

This service is similar to Laravel Artisan but for dev console command in JS applications.
Reference Laravel 12 Artisan console.

## Code

```typescript
// korevel-artisan.ts
export class KorevelArtisan {}

// korevel-artisan.interface.ts
export interface IKorevelArtisan {}

export type IKorevelArtisanOption = {
  args: Record<string, any>;
};

// Improve that holds for IKorevelAritnsan command
export interface IKorevelArtisanCommand {
  name: string;
  description?: string;
  signature: string | any; // best to hold and map command
  args?: Record<string, any>;
  handle(options: IKorevelArtisanOption);
}
```

### Provider

```typescript
import { IKorevel, IKorevelProvider } from "../../core/index.ts";";

export class KorevelArtisanProvider implements IKorevelProvider {
  register(app: IKorevel): void {
    app.getContainer().registerClass("artisan", KorevelArtisan, {
      lifetime: "SINGLETON",
    });
  }

  boot(): void {}
}

```

## Usage

### In Dev Console

```
korevel.artisan.run("migrate all --migrations=all")
```

In Command: "migrate {type} {args:migrations}"
