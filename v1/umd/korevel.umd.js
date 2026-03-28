const _lixkoreLibrary = [
  "https://cdn.jsdelivr.net/npm/systemjs/dist/system.js",
  "https://cdn.jsdelivr.net/npm/systemjs-babel@0.3.2/dist/systemjs-babel.min.js",
  // "https://unpkg.com/dexie@3/dist/dexie.js",
  // "https://unpkg.com/uuid@8/dist/umd/uuid.min.js",
  // "https://unpkg.com/miragejs/dist/mirage-umd.js",
  // "https://code.jquery.com/qunit/qunit-2.24.1.js",
  // "http://chancejs.com/chance.min.js",
  // "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js",
  // "https://cdnjs.cloudflare.com/ajax/libs/validate.js/0.13.1/validate.min.js",
  // "https://unpkg.com/awilix@12.0.5/lib/awilix.umd.js",
  // "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
];

(function () {
  const log = (tag, msg) => {
    console.log(
      `%c[${tag}]: %c${msg}`,
      "color: grey; font-weight: bold;", // Style for [Tag]
      "color: grey; font-weight: normal;" // Style for Message
    );
  };
  class ScriptManager {
    /**
     *
     * @param {string} source
     * @returns {HTMLElement}
     */
    createScriptElementViaSource(source) {
      const script = document.createElement('script');
      script.src = source;
      script.async = false;
      return script;
    }

    /**
     *
     * @param {HTMLElement} scriptElement
     * @returns {Promise}
     */
    async attachScriptElementToDocument(scriptElement) {
      document.head.appendChild(scriptElement);

      return new Promise((resolve, reject) => {
        scriptElement.onload = () => {
          log("Loader", `${scriptElement.src} loaded successfully.`)
          resolve(scriptElement);
        };

        scriptElement.onerror = () => {
          reject(new Error(`Failed to load script ${scriptElement.src}`));
        };
      });
    }

    /**
     *
     * @param {string} src
     */
    async loadScript(src) {
      const script = this.createScriptElementViaSource(src);
      await this.attachScriptElementToDocument(script);
    }
  }

  class ScriptLoader {
    scriptManager = new ScriptManager();

    /**
     * @param {Array<string>} sources
     */
    loadScripts(sources) {
      const loader = this;
      const promises = sources.map(async (source) => {
        await loader.scriptManager.loadScript(source);
      });

      return Promise.all(promises);
    }
  }

  class Builder {
    _entryPoint = "";

    /**
     *
     * @param {string} entryPoint
     */
    setEntryPoint(entryPoint) {
      this._entryPoint = entryPoint;
    }

    /**
     *
     * @returns {string}
     */
    getEntryPoint() {
      return this._entryPoint;
    }
  }

  class Bootstrap {
    scriptLoader = new ScriptLoader();

    /**
     *
     * @param {Array<string>} sources
     */
    async loadCoreDependencies(sources) {
      log("Bootstrap", "Loading core dependencies...");
      await this.scriptLoader.loadScripts(sources);
      log("Bootstrap", "Core dependencies loaded.");
    }
  }

  class EntryPointManager {
    /**
     * @returns {boolean}
     */
    checkIfSystemIsLoaded() {
      if (window.System === undefined) {
        log("EntryPointManager", "System is not loaded. Loading...");
        return false;
      }

      return true;
    }
    /**
     *
     * @param {string} entryPoint
     */
    async loadEntryPoint(entryPoint) {
      if (this.checkIfSystemIsLoaded() === false) {
        throw new Error("System is not loaded. Please load it first.");
      }

      log("EntryPointManager", `Loading entry point: ${entryPoint}`);
      await window.System.import(entryPoint);
      log("EntryPointManager", `${entryPoint} loaded successfully.`);
    }
  }


  /**
   * 
   * @param {string} path 
   * @returns 
   */
  const korevel = (path) => {
    const builder = new Builder();
    const bootstrap = new Bootstrap();
    const entryPointManager = new EntryPointManager();

    const entrypoint = path;
    // builderFn(builder);

    return {
      async start() {
        // const entryPoint = builder.getEntryPoint();

        /**
         * Load dependency via UMD
         */
        await bootstrap.loadCoreDependencies(_lixkoreLibrary);

        /**
         * Load entry point
         */
        await entryPointManager.loadEntryPoint(entrypoint);
      }
    }
  }

  log("Korevel", "KorevelUMD is loaded!")
  console.log(window)
  window.korevel = korevel;
})();