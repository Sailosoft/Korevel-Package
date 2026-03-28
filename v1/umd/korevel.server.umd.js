(function () {
  /**
   * @type {Array<{ src: string, type?: string }>}
   */
  const systemBootstrap = [
    { src: "https://cdn.jsdelivr.net/npm/systemjs/dist/system.js" },
    {
      src: "https://cdn.jsdelivr.net/npm/systemjs-babel@0.3.2/dist/systemjs-babel.min.js",
    },
  ];
  /**
   * @type {Array<{ src: string, type?: string }>}
   */
  const bootstrap = [
    { src: "https://unpkg.com/dexie@3/dist/dexie.js" },
    { src: "https://unpkg.com/uuid@8/dist/umd/uuid.min.js" },
    { src: "https://unpkg.com/miragejs/dist/mirage-umd.js" },
    { src: "https://code.jquery.com/qunit/qunit-2.24.1.js" },
    { src: "http://chancejs.com/chance.min.js" },
    { src: "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js" },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js",
    },
    { src: "https://unpkg.com/awilix@12.0.5/lib/awilix.umd.js" },
  ];

  /**
   *
   * @param {{ boot: (builder: korevelBuilder) => Promise<void>, register: (builder: korevelBuilder) => Promise<void> }} appBuilder
   * @returns
   */
  const korevelServer = (appBuilder) => {
    const loader = korevelLoader();
    const builder = korevelBuilder();
    const builderInstance = appBuilder();

    const startApp = async () => {
        await builder.import(builder.getMainAppSrc());
    }

    return {
      async register() {
        try {
          console.info(
            "\x1b[34mKorevel Server:\x1b[0m Loading Bootstrap Scripts..."
          );
          await loader.loadMultipleScripts(systemBootstrap);
          await loader.loadMultipleScripts(bootstrap);
          console.info(
            "\x1b[34mKorevel Server:\x1b[0m Bootstrap Scripts Loaded."
          );
          await builderInstance.register(builder);
        } catch (error) {
          console.error("Error loading scripts:", error);
        }
      },
      async boot() {
        await builderInstance.boot(builder);
        await startApp();
      },
    };
  };

  const korevelBuilder = () => {
    const builder = {
      mainApp: "",
    };
    return {
      setMainApp(src) {
        builder.mainApp = src;
      },
      getMainAppSrc() {
        if (!builder.mainApp) {
          throw new Error("Main app source is not set");
        }
        return builder.mainApp;
      },
      async import(src) {
        await System.import(src);
      },
    };
  };

  const korevelLoader = () => {
    /**
     * script loader
     * @param {{ src: string, type?: string }} src
     */
    const createScript = (src) => {
      const script = document.createElement("script");
      script.src = src.src;
      script.async = false;

      if (src.type) {
        script.type = src.type;
      }

      return script;
    };

    /**
     * attach script element to head
     * @param {HTMLScriptElement} script
     */
    const attachScript = async (script) => {
      document.head.appendChild(script);
      return new Promise((resolve, reject) => {
        script.onload = () => {
          resolve(script);
        };
        script.onerror = () =>
          reject(new Error(`Failed to load script ${script.src}`));
      });
    };

    /**
     * load script from src via systemjs
     * @param {{ src: string, type?: string }} src
     */
    const attachModuleViaSystem = async (src) => {
      await System.import(src.src);
    };

    /**
     * load script from src
     * @param {{ src: string, type?: string }} src
     */
    const loadScript = async (src) => {
      if (src.type === "module") {
        await attachModuleViaSystem(src);
        console.info(`\x1b[36mModule Loaded:\x1b[0m ${src.src}`);
        return script;
      } else {
        
        // console.log('%cServer:', 'color: red;', 'Something went wrong');
        const script = createScript(src);
        await attachScript(script);
      }
      console.info(`\x1b[36mScript Loaded:\x1b[0m ${src.src}`);
    };

    /**
     * load multiple scripts
     * @param {{ src: string }[]} srcs
     */
    const loadMultipleScripts = async (srcs) => {
      const promises = srcs.map((srcFile) => loadScript(srcFile));
      return Promise.all(promises);
    };

    return {
      loadScript,
      loadMultipleScripts,
    };
  };

  window.KorevelServer = korevelServer;
})();
