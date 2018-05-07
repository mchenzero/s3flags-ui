import { NgModule } from "@angular/core";
import { AppCommonModule } from "../common/app-common.module";
import { LayoutComponent } from "./layout.component";

@NgModule({
  imports: [
    AppCommonModule
  ],
  declarations: [
    LayoutComponent
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule {}
