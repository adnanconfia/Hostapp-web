import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-booking',
  templateUrl: './detail-booking.component.html',
  styleUrls: ['./detail-booking.component.scss']
})
export class DetailBookingComponent implements OnInit {
  cols: any;
  userDetailsList: any;
  constructor() {
    this.cols = [
      { header: 'Ussers Name' },
      { header: 'Email Address' },
      { header: 'Country' },
      { header: 'Postel Code' },
      { header: 'City' },
      { header: 'User Address' },
      { header: 'Phone' },
      { header: 'Actions' }
    ];
    this.userDetailsList = [
      {
        UserName: 'Danish Mahmood',
        Email: 'danishmah204@gmail.com',
        Country: 'Australia',
        PostelCode: 'LL78 178',
        City: 'Sydney',
        UserAddress: 'Dean street 5 ll78 178',
        Phone: '+13155671654'
      }
    ];
  }

  ngOnInit(): void {}
}
