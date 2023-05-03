import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';

@Component({
  selector: 'app-detail-booking',
  templateUrl: './detail-booking.component.html',
  styleUrls: ['./detail-booking.component.scss']
})
export class DetailBookingComponent implements OnInit {
  cols: any;
  public hotelData:any;
  public hotelFacilities:string=""
  public bookingDetails:any;
  userDetailsList: any;
  public bookingId:any;
  userId:any;
  constructor(private fb: FormBuilder,private firestore: Firestore,private router:Router,private route:ActivatedRoute) {
    this.cols = [
      { header: 'Users Name', field:"firstName",type:"text" },
      { header: 'Email Address',field:"email",type:"text" },
      { header: 'Country',field:"country",type:"text" },
      { header: 'Postel Code',field:"zipCode",type:"text" },
      { header: 'City', field:"city",type:"text" },
      { header: 'User Address',field:"address",type:"text"  },
      { header: 'Phone',field:"number",type:"text"  },
      { header: 'Actions',fields:"Action",type:"action" }
    ];
    this.userDetailsList = [
      // {
      //   UserName: 'Danish Mahmood',
      //   Email: 'danishmah204@gmail.com',
      //   Country: 'Australia',
      //   PostelCode: 'LL78 178',
      //   City: 'Sydney',
      //   UserAddress: 'Dean street 5 ll78 178',
      //   Phone: '+13155671654'
      // }
    ];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params['id']) {
          this.bookingId=params['id']
      }
    })

  }

ngAfterViewInit() {
    setTimeout( () => {
         this.getHotel()
         this.getBooking(this.bookingId)
    }, 3500);
  }

  async getHotel(){

    Loader.isLoading=true
    let hotel = User.hotel
    let hotelDoc = doc(this.firestore, "hotels",hotel)
    let hotelFacilityDoc=collection(hotelDoc, "facilities")
    let facisnap = await getDocs(hotelFacilityDoc);
    facisnap.docs.forEach((item)=> {let d=item.data(); this.hotelFacilities+=d['name']+","})
    // let rooms = collection(hotelDoc, "rooms")
    let snap = await getDoc(hotelDoc);
    let data = snap.data()
    this.hotelData=data
    console.log(this.hotelData)
    // this.roomsList=[]
    // roomsdata.docs.map(item=>{
    //   let data = item.data()
    //   this.roomsList.push(data)
    // })
    // console.log(this.roomsList)
    // let hoteldata = await getDoc(hotelDoc)
    // let _hoteldata:any = hoteldata.data();
    // this.AddForm.patchValue({
    //   HotelName: _hoteldata['name'],
    //   Description: _hoteldata['description'],
    //   HotelAddress:_hoteldata['location'],
    //   Price: _hoteldata['pricePerRoom']
    // })
    // console.log(hoteldata.data())

    Loader.isLoading=false
  }

  async getBooking(id:any){
    Loader.isLoading=true
    let bookingRef = doc(this.firestore, "bookings/"+this.bookingId)
    let snap:any = await getDoc(bookingRef)
    // User Details 
        // this.userId= snap.data()['user_id']
        // console.log(this.userId)
        // let userDetail = doc(this.firestore, "users/"+this.userId)
        // let s = await getDoc(userDetail);
    let rd = snap.data()

    this.userDetailsList.push(rd)

    Loader.isLoading=false
  }


  
  

}
