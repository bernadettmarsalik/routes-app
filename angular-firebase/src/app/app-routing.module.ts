import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { FormComponent } from "./components/form/form.component";
import { RoutesComponent } from "./components/routes/routes.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "save-route", component: FormComponent },
  { path: "routes", component: RoutesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
