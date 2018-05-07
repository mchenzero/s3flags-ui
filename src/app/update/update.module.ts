import { NgModule } from "@angular/core";
import { AppCommonModule } from "../common/app-common.module";
import { UpdateComponent } from "./update.component";

@NgModule({
  imports: [
    AppCommonModule
  ],
  declarations: [
    UpdateComponent
  ],
  exports: [
    UpdateComponent
  ]
})
export class UpdateModule {}
