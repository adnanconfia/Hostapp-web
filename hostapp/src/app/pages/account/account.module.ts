import { SidebarComponent } from './../../components/sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule, RoutingComps } from './account-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account.component';
import { SidebarModule } from 'primeng/sidebar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    AccountComponent,
    RoutingComps,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    AccountRoutingModule,
    SidebarModule
  ]
})
export class AccountModule { }
