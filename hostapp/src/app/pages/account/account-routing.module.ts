import { DetailBookingComponent } from './bookings/detail-booking/detail-booking.component';
import { BookingsComponent } from './bookings/bookings.component';
import { AddBookingComponent } from './bookings/add-booking/add-booking.component';
import { AddRoomComponent } from './rooms/add-room/add-room.component';
import { RoomsComponent } from './rooms/rooms.component';
import { UsersComponent } from './users/users.component';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomTypesComponent } from './rooms/room-types/room-types.component';
import { ServicesComponent } from './services/services.component';
import { ViewRoomsComponent } from './rooms/view-rooms/view-rooms.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'exact'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'booking',
        component: BookingsComponent
      },
      {
        path: 'booking/addbooking',
        component: AddBookingComponent
      },
      {
        path: 'booking/detailbooking',
        component: DetailBookingComponent
      },
      {
        path: 'rooms',
        component: RoomsComponent
      },
      {
        path: 'rooms/addroom',
        component: AddRoomComponent
      },
      {
        path: 'rooms/viewroom',
        component: ViewRoomsComponent
      },
      {
        path: 'roomtypes',
        component: RoomTypesComponent
      },
      {
        path: 'services',
        component: ServicesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
export const RoutingComps = [DashboardComponent, UsersComponent];
