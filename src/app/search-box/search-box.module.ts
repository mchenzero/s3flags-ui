import { NgModule } from "@angular/core";
import { AppCommonModule } from "../common/app-common.module";
import { SearchBoxComponent } from "./search-box.component";
import { SearchPipe } from "./search.pipe";

@NgModule({
  imports: [
    AppCommonModule
  ],
  declarations: [
    SearchBoxComponent,
    SearchPipe
  ],
  exports: [
    SearchBoxComponent,
    SearchPipe
  ]
})
export class SearchBoxModule {}
