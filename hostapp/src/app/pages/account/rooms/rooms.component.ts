import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  public rooms: any;
  public cols: any;
  constructor() {}

  ngOnInit(): void {
    this.cols = [
      { header: 'Room #' },
      { header: 'Room Picture' },
      { header: 'Room Type' },
      { header: 'Bed Type' },
      { header: 'Facilities' },
      { header: 'Price' },
      { header: 'Action' },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.rooms = [
      {
        roomNumber: '302',
        roomType: 'Family Room',
        bedType: 'Double Bed',
        facilities: 'Free Wifi, Breakfast, Single Bed, Double..',
        price: '$150',
        isActive: true
      },
      {
        roomNumber: '302',
        roomType: 'Family Room',
        bedType: 'Double Bed',
        facilities: 'Free Wifi, Breakfast, Single Bed, Double..',
        price: '$150',
        isActive: true
      },
      {
        roomNumber: '302',
        roomType: 'Family Room',
        bedType: 'Double Bed',
        facilities: 'Free Wifi, Breakfast, Single Bed, Double..',
        price: '$150',
        isActive: true
      }
    ];
  }
}
