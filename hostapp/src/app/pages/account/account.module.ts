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
import { RadioButtonModule } from 'primeng/radiobutton';
import { AvatarModule } from 'primeng/avatar';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { BedtypesComponent } from './bedtypes/bedtypes.component';
import { ServiceitemsComponent } from './serviceitems/serviceitems.component';
import { TasksComponent } from './tasks/tasks.component';
import { DialogModule } from 'primeng/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { EditBookingComponent } from './bookings/edit-booking/edit-booking.component';
import { TagModule } from 'primeng/tag';
@NgModule({
  declarations: [
    AccountComponent,
    RoutingComps,
    SidebarComponent,
    HeaderComponent,
    DataGridComponent,
    EditUserComponent,
    FacilitiesComponent,
    BedtypesComponent,
    ServiceitemsComponent,
    TasksComponent,
    EditBookingComponent,
   
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    AvatarModule,
    AccountRoutingModule,
    TagModule,
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
    RadioButtonModule,
    DialogModule,
    QRCodeModule

  ]
})
export class AccountModule {}
