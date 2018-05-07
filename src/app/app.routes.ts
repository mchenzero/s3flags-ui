import { Routes } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LayoutComponent } from "./layout/layout.component";
import { UpdateComponent } from "./update/update.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: DashboardComponent
      },
      {
        path: "new",
        component: CreateComponent
      },
      {
        path: "edit/:name",
        component: UpdateComponent
      },
      {
        path: "**",
        redirectTo: ""
      }
    ]
  }
];
