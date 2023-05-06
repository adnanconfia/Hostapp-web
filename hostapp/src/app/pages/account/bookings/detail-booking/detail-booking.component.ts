import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import html2canvas from 'html2canvas';
import  jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-detail-booking',
  templateUrl: './detail-booking.component.html',
  styleUrls: ['./detail-booking.component.scss']
})
export class DetailBookingComponent implements OnInit {
  @ViewChild('qrcodeEl', { static: false }) qrcodeEl!: ElementRef;
  cols: any;
  public hotelData:any;
  public hotelFacilities:string=""
  public bookingDetails:any;
  userDetailsList: any;
  public bookingId:any;
  public qrCodeUrl:any;
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
    Loader.isLoading=true;
    this.route.queryParams.subscribe((params: any) => {
      if (params['id']) {
          this.bookingId=params['id']
          this.qrCodeUrl = `https://hostappe1c06.page.link/?link=https://hostappe1c06.page.link/?BOOKINGID=${this.bookingId}&apn=com.example.hostapp`
      }
    })

  }

ngAfterViewInit() {
    setTimeout( () => {
         this.getHotel()
         this.getBooking(this.bookingId)
    }, 3500);
  }
  daysBetween(d1:any, d2:any)
  {
    var ndays;
    var tv1 = d1.valueOf();  // msec since 1970
    var tv2 = d2.valueOf();
  
    ndays = (tv2 - tv1) / 1000 / 86400;
    ndays = Math.round(ndays - 0.5);
    return ndays;
  }
  datediff(first:any, second:any) {        
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
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
  isPaid:any=false;
  totalPrice:any=0;
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
    this.bookingDetails = rd;
    var roomIds =rd.rooms
    this.bookingDetails.rooms=[];
    let hotelDoc = doc(this.firestore, "hotels",User.hotel)
    let rooms = collection(hotelDoc, "rooms")
    let roomsdata = await getDocs(rooms);
    roomsdata.docs.forEach((item:any)=>{
      let data = item.data()
      //this.roomsList.push(data)
      if(roomIds.indexOf(data['id'])>-1)
      {this.bookingDetails.rooms.push(data)}
    })
    var date1 =new Date(formatDate( new Date(this.bookingDetails.checkOutDate),'MM/dd/yyyy','en-US'));
    var date2 = new Date(formatDate( new Date(this.bookingDetails.checkInDate),'MM/dd/yyyy','en-US'));
      
    // To calculate the time difference of two dates
    var Difference_In_Time = date1.getTime() - date2.getTime();
      
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      
    //To display the final no. of days (result)
    this.bookingDetails['days']=Difference_In_Days
    let bookingPriceRef = collection(this.firestore, "bookings/"+this.bookingId+"/bookingPrices")
    let bokkingSnap:any = await getDocs(bookingPriceRef)
    bokkingSnap.docs.forEach((resp:any)=>{
    var  d =  resp.data()
    console.log(d);
    var data =   this.bookingDetails.rooms.filter((x:any)=>{
        x.id==d['roomId']
      })
      data['price']=d['price']
      this.totalPrice+=(parseFloat(d['price']) * Difference_In_Days)
    })
    var vat = (parseFloat(this.bookingDetails.vat)/100) * this.totalPrice;
    this.totalPrice = vat+this.totalPrice;
    console.log(this.bookingDetails.rooms);
    this.isPaid=rd.isPaid;
    this.userDetailsList.push(rd)

    Loader.isLoading=false
  }
  create(){
    this.router.navigateByUrl("/account/booking/addbooking")
  }
  update(event:any){
    this.router.navigateByUrl("/account/booking/editbooking?id="+event.id);
}
  downloadQR(){
    const qrCodeElement:any = document.getElementById('bookingQrCode');
    html2canvas(qrCodeElement,{scale: 3}).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf:any = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      Swal.fire({
        title: "Success",
        text: "Qr code downloaded",
        icon: "success"
      })
      pdf.save('qr-code.pdf');
    });
  }


  
  

}
