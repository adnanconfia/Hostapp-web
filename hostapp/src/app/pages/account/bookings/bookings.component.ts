import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  cols: any;
  bookingList: any;
  constructor() {}

  ngOnInit(): void {
    this.cols = [
      { header: 'Booking Id' },
      { header: 'User Name' },
      { header: 'Hotel Title' },
      { header: 'Check In' },
      { header: 'Check Out' },
      { header: 'Booking' },
      { header: 'Actions' }
    ];
    this.bookingList = [
      {
        BookingId: '12345',
        UserName: 'JohnDoe',
        HotelTitle: 'Sareena Hotel',
        CheckIn: 'Mar 15, 2023',
        CheckOut: 'Mar 18,2023',
        BookingStatus: 2
      },
      {
        BookingId: '12345',
        UserName: 'JohnDoe',
        HotelTitle: 'Sareena Hotel',
        CheckIn: 'Mar 15, 2023',
        CheckOut: 'Mar 18,2023',
        BookingStatus: 1
      },
      {
        BookingId: '12345',
        UserName: 'JohnDoe',
        HotelTitle: 'Sareena Hotel',
        CheckIn: 'Mar 15, 2023',
        CheckOut: 'Mar 18,2023',
        BookingStatus: 1
      }
    ];
  }
}
