import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  cols: any;
  bookingList: any;
  constructor(private fb: FormBuilder,private firestore: Firestore,private router:Router) {}

  ngOnInit(): void {
    
    this.cols = [
      { header: 'Booking Id',field:"id",type:"text" },
      { header: 'User Name',field:"firstName",type:"text" },
      // { header: 'Hotel Title',field:"HotelTitle",type:"text" },
      { header: 'Check In',field:"checkInDate",type:"date" },
      { header: 'Check Out',field: "checkOutDate",type:"date" },
      { header: 'Booking',field:"statusName",type:"text" },
      { header: 'Actions',field:"Actions",type:'action' }
    ];
    this.bookingList = [
      // {
      //   BookingId: '12345',
      //   UserName: 'JohnDoe',
      //   HotelTitle: 'Sareena Hotel',
      //   CheckIn: 'Mar 15, 2023',
      //   CheckOut: 'Mar 18,2023',
      //   BookingStatus: 2
      // },
      // {
      //   BookingId: '12345',
      //   UserName: 'JohnDoe',
      //   HotelTitle: 'Sareena Hotel',
      //   CheckIn: 'Mar 15, 2023',
      //   CheckOut: 'Mar 18,2023',
      //   BookingStatus: 1
      // },
      // {
      //   BookingId: '12345',
      //   UserName: 'JohnDoe',
      //   HotelTitle: 'Sareena Hotel',
      //   CheckIn: 'Mar 15, 2023',
      //   CheckOut: 'Mar 18,2023',
      //   BookingStatus: 1
      // }
    ];
  }
  ngAfterViewInit() {
    setTimeout(() => {
        this.getBookings()
      
    }, 3500);
  }



  update(event:any){
      this.router.navigateByUrl("/account/booking/editbooking?id="+event.id);
  }
  async getBookings(){
    let userHotel = User.hotel;
    let bookingRef = collection(this.firestore, "bookings")
    let q = query(bookingRef, where ("hotelId","==", userHotel), where("isDeleted","==",false))
    let snap = await getDocs(q);

    snap.docs.forEach((item)=>{
      let data = item.data()
      let bookingStatus = data['status']
      if(bookingStatus == 1){
        data['statusName']="Pending"
      }
      else if(bookingStatus ==2){
        data['statusName']="Alloted"
      }
      else if(bookingStatus==3){
        data['statusName']="In Reviewed"
      }
      else if(bookingStatus==4){
        data['statusName']="Completed"
      }
      this.bookingList.push(data)
    })

    


  }

  create(){
    this.router.navigateByUrl("/account/booking/addbooking");
  }
  view(event:any){
    this.router.navigateByUrl("/account/booking/detailbooking?id="+event.id);
  }
  async delete(event:any){
    Loader.isLoading=true
    Swal.fire({
      title: 'Notice',
      text: 'Do you really want to remove this booking?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (Resp: any) => {
      if (Resp.value) {
        Loader.isLoading = true;
        let booking = doc(this.firestore, "bookings/"+event.id)
        await updateDoc(booking, {
          isDeleted: true
        }).then(() => {
          Swal.fire({
            title: "Success",
            text: "Booking removed successfully",
            icon: "success"
          })
          this.bookingList=[]
          this.getBookings();
          Loader.isLoading=false

        }).catch((err: any) => {

          Loader.isLoading = false;
        });

      }
    });
    

    Loader.isLoading=false
  }
}
