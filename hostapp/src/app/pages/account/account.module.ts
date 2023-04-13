import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SidebarComponent } from './../../components/sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule, RoutingComps } from './account-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account.component';
import { SidebarModule } from 'primeng/sidebar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UsersComponent } from './users/users.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { PaginatorModule } from 'primeng/paginator';
import { RoomsComponent } from './rooms/rooms.component';
import { AddRoomComponent } from './rooms/add-room/add-room.component';
import { RoomTypesComponent } from './rooms/room-types/room-types.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ServicesComponent } from './services/services.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { BookingsComponent } from './bookings/bookings.component';
import { AddBookingComponent } from './bookings/add-booking/add-booking.component';
import { CalendarModule } from 'primeng/calendar';
import { DetailBookingComponent } from './bookings/detail-booking/detail-booking.component';
import { ViewRoomsComponent } from './rooms/view-rooms/view-rooms.component';
import { HotelComponent } from './hotel/hotel.component';
import { AddHotelComponent } from './hotel/add-hotel/add-hotel.component';

@NgModule({
  declarations: [
    AccountComponent,
    RoutingComps,
    SidebarComponent,
    HeaderComponent,
    DataGridComponent,
    AddHotelComponent,
   
   
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
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
    CalendarModule
  ]
})
export class AccountModule {}
