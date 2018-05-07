import { NgModule } from "@angular/core";
import { AppCommonModule } from "../common/app-common.module";
import { CreateComponent } from "./create.component";

@NgModule({
  imports: [
    AppCommonModule
  ],
  declarations: [
    CreateComponent
  ],
  exports: [
    CreateComponent
  ]
})
export class CreateModule {}
