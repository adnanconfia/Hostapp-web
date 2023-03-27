import { UsersComponent } from './users/users.component';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: AccountComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "exact"
  },{
        path: "dashboard",
        component: DashboardComponent
  },{
        path: "users",
        component: UsersComponent
  }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
export const RoutingComps=[
  DashboardComponent,
  UsersComponent
]