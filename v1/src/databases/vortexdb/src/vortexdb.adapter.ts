import { IKorevel } from "../../../modules/core/index.ts";
import { korevelDexie } from "../../../modules/dependencies/index.ts";

class ExampleMap {
  id?: number;
  name?: string;
}

export class VortexDBAdapter extends korevelDexie {
  map() {
    this.table<ExampleMap, number>("example").mapToClass(ExampleMap);
  }
}
