import { resources } from "../i18n/index.ts";

declare module "i18next" {
  interface CustomStypeOptions {
    defaultNS: (typeof resources)["de"];
    resources: typeof resources;
  }
}
