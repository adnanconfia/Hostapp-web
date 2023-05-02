import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit {
  AddForm!: FormGroup;
  @ViewChild('calendar')
  calendar: any;
  constructor(private fb: FormBuilder,private firestore: Firestore,private router:Router) {}
  public roomsList: any;
  public bookingStatusList: any;
  public usersList:any;
  public selectedImage: any;
  public imagePreview: any;
  currentdate = new Date();
  ngOnInit(): void {
    this.AddForm = this.fb.group({
      user: ['',Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', Validators.required],
      PostelCode: ['', Validators.required],
      UserAddress: ['', Validators.required],
      PhoneNuber: ['', Validators.required],
      City: ['', Validators.required],
      Country: ['', Validators.required],
      HotelName: [{value:'',disabled: true}],
      // HotelTitle: ['', Validators.required],
      HotelAddress: [{value:'',disabled: true}],
      Description: [{value:'',disabled: true}],
      Price: [{value:'',disabled: true}],
      Rooms: ['', Validators.required],
      BookingStatus: ['', Validators.required],
      // Image: ['', Validators.required],
      imageSource: [],
      CheckIn: [this.currentdate, Validators.required],
      CheckOut: [this.currentdate, Validators.required]
    });
    this.roomsList = [
      // { name: 'Free Wifi', code: 'FW' },
      // { name: 'Breakfast', code: 'BF' },
      // { name: 'Single Bed', code: 'SB' },
      // { name: 'Double Bed', code: 'DB' }
    ];
    this.bookingStatusList = [
      { name: 'Pending', code: '1' },
      { name: 'Allotted', code: '2' },
      { name: 'In Reviewed', code: '3' },
      { name: 'Completed', code: '4' }
    ];
    this.usersList=[]
  }
  async onSubmit() {
    Loader.isLoading=true
    try{
      let formData = this.AddForm.value
      let payLoad = {
         id: "",
         checkInDate: new Date(formData['CheckIn']).getTime(),
         checkOutDate: new Date(formData['CheckOut']).getTime(),
         city: formData['City'],
         country:formData['Country'],
         email: formData['Email'],
         firstName:formData['FirstName'],
         lastName:formData['LastName'],
         zipCode:formData['PostelCode'],
         address: formData['UserAddress'] ,
         number: formData['PhoneNuber'],
         status: formData['BookingStatus'],
         rooms:formData['Rooms'].map((item:any)=> {return item['id']}),
         isPaid:false,
         vat:"",
         createdAt: (new Date()).getTime(),
         user_id: formData['user'],
         hotelId: User.hotel,
         isDeleted: false
      }
      let bookingRef = collection(this.firestore, "bookings")
      let bookingId:any;
      await addDoc(bookingRef, payLoad).then(resp => {
        bookingId = resp.id;
      });

      let recentBookingRef= doc(
        this.firestore,
        'bookings/' + bookingId
      );
      await updateDoc(recentBookingRef, {
        id: bookingId
      });


      for(let item of formData['Rooms']){
         let bookingPricesPayload={
          id:"",
          price: item['price'],
          roomId: item['id']
         }
         let bookingPricesRef =  collection(this.firestore, "bookings/"+bookingId+"/bookingPrices")
        let recentAddedItem:any;
         await addDoc(bookingPricesRef,bookingPricesPayload).then((resp)=>{
            recentAddedItem=resp.id;
         });
         let snap  = doc(
          this.firestore,
          'bookings/' + bookingId + '/bookingPrices/' + recentAddedItem
        );
        await updateDoc(snap, {
          id: recentAddedItem
        });

      }
      Swal.fire({
        title:"Success",
        text:"Booking created successfully",
        icon:"success",
      
      })
    
    }
    catch(err:any){
      console.log(err)
      Loader.isLoading=false
    }
    Loader.isLoading=false
    
  }


  ngAfterViewInit() {
    setTimeout(() => {
        this.getHotel()
        this.getUsers()
      
    }, 3500);
  }


  async getUsers(){
    Loader.isLoading=true
    // Roles
    let rolesRef = collection(this.firestore, "roles")
    let q = query(rolesRef, where("name","==","User"))
    var qSnap = await getDocs(q);
    var roleId = qSnap.docs[0].data()["roleId"]
    
    let users = collection(this.firestore, "users")
    let usersq = query(users, where("roleId","==", roleId))
    let userdata = await getDocs(usersq);
    this.usersList=[]
    userdata.docs.map(item=>{
      let data = item.data()
      this.usersList.push(data)
    })
    Loader.isLoading=false
  }
  async getHotel(){
    Loader.isLoading=true
    let hotel = User.hotel
    let hotelDoc = doc(this.firestore, "hotels",hotel)
    let rooms = collection(hotelDoc, "rooms")
    let roomsdata = await getDocs(rooms);
    this.roomsList=[]
    roomsdata.docs.map(item=>{
      let data = item.data()
      this.roomsList.push(data)
    })
    console.log(this.roomsList)
    let hoteldata = await getDoc(hotelDoc)
    let _hoteldata:any = hoteldata.data();
    this.AddForm.patchValue({
      HotelName: _hoteldata['name'],
      Description: _hoteldata['description'],
      HotelAddress:_hoteldata['location'],
      Price: _hoteldata['pricePerRoom']
    })
    console.log(hoteldata.data())

    Loader.isLoading=false
  }
  increment() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price + 5);
  }

  decrement() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price - 5);
  }
  onFileSelected(event: any) {
    if (event.target.files) {
    }
    this.selectedImage = event.target.files[0];
    let file = event.target.files[0];
    // console.log(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      let ImgagePath = reader.result as string;
      this.AddForm.patchValue({
        imageSource: ImgagePath
      });
    };
    // reader.readAsDataURL(this.selectedImage);
  }
  openCalendar(event: any) {
    // this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
    // event.stopPropagation();
  }

  userSelected(event:any){
      let data = event.value
      
      this.AddForm.patchValue({

        FirstName: data['name'],
        Email: data['email'],
        PostelCode: data['postalCode'],
        PhoneNuber: data['phoneNumber'],
        City: data['city'],
        Country: data['country']
      })

  }
}
