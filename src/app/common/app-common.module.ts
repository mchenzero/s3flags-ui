import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { BootstrapModalModule } from "ngx-bootstrap-modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TagInputModule } from "ngx-chips";
import { NgPipesModule } from "ngx-pipes";
import { PipesModule } from "./pipes/pipes.module";
import { FlagService } from "./services/flag.service";
import { NavigationService } from "./services/navigation.service";
import { UserService } from "./services/user.service";

@NgModule({
  imports: [
    BootstrapModalModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgPipesModule,
    PipesModule,
    PopoverModule,
    RouterModule,
    TagInputModule
  ],
  exports: [
    BootstrapModalModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgPipesModule,
    PipesModule,
    PopoverModule,
    RouterModule,
    TagInputModule
  ],
  providers: [
    FlagService,
    NavigationService,
    UserService
  ]
})
export class AppCommonModule {}
