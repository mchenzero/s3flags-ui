import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BootstrapModalModule } from "ngx-bootstrap-modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { AppCommonModule } from "./common/app-common.module";
import { CreateModule } from "./create/create.module";
import { LayoutModule } from "./layout/layout.module";
import { UpdateModule } from "./update/update.module";

@NgModule({
  imports: [
    AppCommonModule,
    CreateModule,
    LayoutModule,
    RouterModule.forRoot(routes),
    PopoverModule.forRoot(),
    UpdateModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
