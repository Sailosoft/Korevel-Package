import Korevel from "../korevel.ts";
import { KorevelLogLevel } from '../modules/logger/index.ts';
import { KorevelSocket } from "../modules/socket/index.ts";
import { KorevelDevelopProvider } from "./develop.ts";
console.log("Starting Application");

const korevel = new Korevel();

korevel
  .build((builder) => {
    builder.setBaseUrl("http://localhost:3000");
    builder.setProviders([new KorevelDevelopProvider()]);
    builder.setLogLevel(KorevelLogLevel.ERROR);
    // builder.setEnvironmentUrl("http://localhost:3000");
    // builder.setDatabase("test");
  })
  .start()
  .then(() => {
    console.log("Application Started");
    // const app = korevel.getContainer().resolve<IKorevel>("app");
    // const router = app
    //   .getContainer()
    //   .resolve<IKorevelRouterStore>("routerStore");
    // console.log("korevel", app);
    // console.log("router", router);
    fetch("http://localhost:3000/api/hello", {
      headers: {
        "X-API-KEY": "test-api-key",
      },
    }).then((response) => {
      console.log(response);
    });

    const socket = new KorevelSocket("chat", "client");
    socket.on("message", (data) => {
      console.log("[Web] Received message: ", data);
    });
    console.log("Message Send");

    socket.emit("message", "Hello from client");
  })
  .catch((error) => {
    console.log("Application Failed");
    console.error(error);
  });
