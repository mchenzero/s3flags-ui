import { Component } from "@angular/core";
import { NavigationService } from "./common/services/navigation.service";

@Component({
  selector: "app-root",
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private navigationService: NavigationService) {}
}
