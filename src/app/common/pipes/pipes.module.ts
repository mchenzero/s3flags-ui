import { NgModule } from "@angular/core";
import { DeletedPipe } from "./deleted.pipe";

@NgModule({
  declarations: [
    DeletedPipe
  ],
  exports: [
    DeletedPipe
  ]
})
export class PipesModule {}
