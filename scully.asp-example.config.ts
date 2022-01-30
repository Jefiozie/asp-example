import { ScullyConfig } from "@scullyio/scully";
import { prismaPlugin } from "./scully/plugins/plugin";
/** this loads the default render plugin, remove when switching to something else. */
import "@scullyio/scully-plugin-puppeteer";

export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "asp-example",
  outDir: "./dist/static",
  routes: {
    "/blog/:slug": {
      type: prismaPlugin,
    },
  },
};
