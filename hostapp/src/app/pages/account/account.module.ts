import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidebarComponent } from './../../components/sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule, RoutingComps } from './account-routing.module';

import { AccountComponent } from './account.component';
import { SidebarModule } from 'primeng/sidebar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HeaderComponent } from '../../components/header/header.component';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { PaginatorModule } from 'primeng/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';

import { AvatarModule } from 'primeng/avatar';
@NgModule({
  declarations: [
    AccountComponent,
    RoutingComps,
    SidebarComponent,
    HeaderComponent,
    DataGridComponent,
   
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    AvatarModule,
    AccountRoutingModule,
    SidebarModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    TableModule,
    FontAwesomeModule,
    CheckboxModule,
    PaginatorModule,
    MatSlideToggleModule,
    MultiSelectModule,
    
    MatCheckboxModule,
    DropdownModule,
    ImageModule,
    InputNumberModule,
    CalendarModule,


  ]
})
export class AccountModule {}
