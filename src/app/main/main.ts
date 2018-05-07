/* tslint:disable:ordered-imports */
import "core-js";
import "zone.js/dist/zone";
/* tslint:enable:ordered-imports */

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "../app.module";

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
