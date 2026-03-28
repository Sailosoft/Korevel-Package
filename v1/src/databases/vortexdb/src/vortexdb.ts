import { IKorevel } from "../../../modules/core/index.ts";

export class VortexDB {
  constructor(app: IKorevel) {
    const library = app.getLibrary();
    library.dexie;
  }
}
