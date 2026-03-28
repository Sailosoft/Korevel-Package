import { IKorevel, IKorevelProvider } from "../modules/core/index.ts";
import { korevelNedb } from "../modules/dependencies/index.ts";
import { KorevelHttpRunner } from "../modules/http/index.ts";
import { KorevelLogger } from "../modules/logger/index.ts";
import { IKorevelRouterRegister } from "../modules/router/index.ts";
import { IKorevelRunner } from "../modules/runnable/index.ts";
import { KorevelSocket } from "../modules/socket/index.ts";
import { korevelPromisify } from "../modules/utils/korevel-util.promisify.ts";

export class KorevelDevelopController {
  hello() {
    return "hello";
  }
}

export class KorevelDevelopProvider implements IKorevelProvider {
  logger = new KorevelLogger({ instance: this });
  register(app: IKorevel): void | Promise<void> {
    const container = app.getContainer();
    container.registerClass("defaultRunner", DevelopHttpRunner, {
      lifetime: "SINGLETON",
    });
  }
  boot(app: IKorevel): void | Promise<void> {
    this.logger.log("Booting router");

    const router = app
      .getContainer()
      .resolve<IKorevelRouterRegister>("routerRegister");

    router.get("/hello", KorevelDevelopController, "hello");
    this.logger.log("Router booted");
  }
}
class DevelopHttpRunner extends KorevelHttpRunner implements IKorevelRunner {
  async run(): Promise<void> {
    this.logger.log("DevelopHttpRunner");

    const socket = new KorevelSocket("chat", "server");
    socket.on("message", (data) => {
      this.logger.log("[Server] Received message: ", data);
      socket.emit("message", `Hi From Server`);
      exampleWithAsyncAwait();
    });
    await super.run();
  }
}
async function exampleWithAsyncAwait() {
  // console.log("korevelNedb", korevelNedb());

  console.log("Global", globalThis);
  console.log("window", window);

  console.log("window", (window as any).Nedb);

  const db = new korevelNedb({ filename: "todos", autoload: true });
  // const db = new (window as any).Nedb({ filename: "todos", autoload: true });
  // Insert
  const newTask = await korevelPromisify<any>((cb) =>
    db.insert({ text: "Buy rice", done: false, priority: 2 }, cb),
  );
  console.log("New task:", newTask);

  // Find + sort + limit
  const tasks = await korevelPromisify((cb) =>
    db
      .find({ done: false })
      .sort({ priority: -1 }) // highest priority first
      .limit(5)
      .exec(cb),
  );
  console.log("Pending high-priority tasks:", tasks);

  // Update
  await korevelPromisify((cb) =>
    db.update(
      { _id: newTask._id },
      { $set: { done: true, finishedAt: new Date() } },
      {},
      cb,
    ),
  );
  console.log("Marked as done");
}
