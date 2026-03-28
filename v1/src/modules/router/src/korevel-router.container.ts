import { IKorevelContainer } from "../../container/index.ts";
import { korevelLodash } from "../../dependencies/index.ts";
import { KorevelHttpController } from "../../route/src/korevel-route.interface.ts";
import {
  IKorevelRouterContainer,
  IKorevelRouterStore,
} from "./korevel-router.interface.ts";

export default class KorevelRouterContainer implements IKorevelRouterContainer {
  constructor(
    private korevelContainer: IKorevelContainer,
    private routerStore: IKorevelRouterStore,
  ) {}

  registerToContainer(): void {
    const allRoutes = this.routerStore.getAll();

    // Using a Set of the actual Class constructors is
    // more reliable than checking string names.
    const uniqueControllers = new Set<KorevelHttpController>();

    allRoutes.forEach((route) => {
      uniqueControllers.add(route.controller);
    });

    // Now register each unique class
    uniqueControllers.forEach((controller) => {
      // const name = korevelLodash.camelCase(controller.name);

      // Safety check: Does the container already know this name?
      // if (!this.korevelContainer.has(name)) {
      //   this.korevelContainer.registerClass(name, controller);
      // }

      this.korevelContainer.registerClass(controller.name, controller);
    });
  }
}
