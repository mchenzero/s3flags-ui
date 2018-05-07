import { NgModule } from "@angular/core";
import { AppCommonModule } from "../common/app-common.module";
import { SearchBoxModule } from "../search-box/search-box.module";
import { DashboardComponent } from "./dashboard.component";

@NgModule({
  imports: [
    AppCommonModule,
    SearchBoxModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {}
