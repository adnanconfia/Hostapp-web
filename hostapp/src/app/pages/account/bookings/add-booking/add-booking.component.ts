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
  public allRooms:any;
  public bookingStatusList: any;
  public usersList:any;
  hotel:any;
  public selectedImage: any;
  public imagePreview: any;
  currentdate = new Date()
  
  ngOnInit(): void {
    Loader.isLoading=true;
    this.AddForm = this.fb.group({
      user: ['',Validators.required],
      FirstName: [''],
      LastName: [''],
      Email: [''],
      PostelCode: [""],
      UserAddress: [''],
      PhoneNuber: [''],
      City: [''],
      Country: [''],
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
      CheckOut: [this.currentdate, Validators.required],
      
      isPaid: [false, Validators.required]
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
         city: formData['City']?formData['City']:" ",
         country:formData['Country']?formData['Country']:" ",
         email: formData['Email']?formData['Email']:"",
         firstName:formData['FirstName']?formData['FirstName']:" ",
         lastName:formData['LastName']?formData['LastName']:" ",
         zipCode:formData['PostelCode']?formData['PostelCode']:" ",
         address: formData['UserAddress'] ?formData['UserAddress'] :" ",
         number: formData['PhoneNuber']?formData['PhoneNuber']:" ",
         status: parseInt(formData['BookingStatus']),
        
         rooms:formData['Rooms'].map((item:any)=> {return item['id']}),
         isPaid:formData['isPaid'],
         vat:parseInt(this.hotel.vat),
         createdAt: (new Date()).getTime(),
         userId: formData['user'] == "#" ? "": formData['user'],
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
      this.router.navigateByUrl("/account/booking");
    
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
    //let usersq = query(users, where("roleId","==", roleId))
    let userdata = await getDocs(users);
    this.usersList=[]
    this.usersList.push({
      id: "#",
      name:"Empty Booking",
      isDeleted: false,
      isActive:true,
      roleId:roleId
    })
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
    this.allRooms=[]
    roomsdata.docs.map(item=>{
      let data = item.data()
      //this.roomsList.push(data)
      this.allRooms.push(data)
    })
    // let formValues = this.AddForm.value
    // let checkInDate= new Date(formValues['CheckIn']).getTime()
    // let checkOutDate= new Date(formValues['CheckOut']).getTime()
    this.getAvailableRooms()
    //console.log(this.roomsList)
    let hoteldata = await getDoc(hotelDoc)
    this.hotel = hoteldata.data();
    this.AddForm.patchValue({
      HotelName: this.hotel['name'],
      Description: this.hotel['description'],
      HotelAddress:this.hotel['location'],
      Price: this.hotel['pricePerRoom']
    })
    //console.log(hoteldata.data())

    Loader.isLoading=false
  }

  cancel(){
    this.router.navigateByUrl("/account/booking");
  }
  async getAvailableRooms(){
    Loader.isLoading=true
    // all bookings
    let bookings:any=[]
    let bookingRef = collection(this.firestore, "bookings")
    let q = query(bookingRef, where ("hotelId","==", User.hotel), where("isDeleted","==",false))
    let snap = await getDocs(q);
    snap.docs.forEach((item)=>{
      let data = item.data()
      bookings.push(data)
    })
    // selected checkout and checkin
    let formValues = this.AddForm.value
    let checkInDate= new Date(formValues['CheckIn']).setHours(0,0,0,0);
    let checkOutDate= new Date(formValues['CheckOut']).setHours(0,0,0,0);


    let availableRooms = [...this.allRooms]
    let notavailble_rooms=[]
    let count=0
    let bookedRooms:any=[]
    bookings.map((booking:any)=>{
      
        if(checkInDate <= new Date(booking['checkInDate']).setHours(0,0,0,0) && checkOutDate >=new Date(booking['checkInDate']).setHours(0,0,0,0)){
          
          
          availableRooms.map((room:any,index:number)=>{
                  if(booking.rooms.includes(room['id'])){
                      //availableRooms.splice(index,1)
                      bookedRooms.push(room['id'])
                  }
            })

            
        }
    })
    
    //console.log("Booked Rooms: ", bookedRooms)
    availableRooms = availableRooms.filter(room => !bookedRooms.includes(room['id']))
    
    this.roomsList=[...availableRooms]



    //console.log(new Date(checkInDate))
    //  list of bookings in selected dates
    //  let isPresent=false;
    //  this.roomsList=[]
    //  bookings.map((booking:any)=>{
        
    //     if(checkInDate <= new Date(booking['checkInDate']) && checkOutDate >=new Date(booking['checkInDate'])){
    //       console.log(booking)  
    //       this.allRooms.forEach((item:any,index:number)=>{
    //         //console.log(item)
    //             if(!booking.rooms.includes(item['id'])){
    //               //console.log("the room ",  item['name'], "present in booking")
    //               this.roomsList.push(item)
    //               this.allRooms.filter((citem:any)=> item['id']!= item['id'])
    //               //console.log("Data after splice", this.allRooms)
    //             }
                
    //         })
    //       isPresent=true
    //     }
    // })
    // if(!isPresent){this.roomsList=this.allRooms}
    // //console.log("bookings between dates",_bookings)


   
    Loader.isLoading=false
    //console.log(this.allRooms, checkInDate,checkOutDate)
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

  async userSelected(event:any){
      let data = event.value
   
      if(data=="#"){
        this.AddForm.patchValue({

          FirstName: "",
          Email: "",
          PostelCode: "",
          PhoneNuber: "",
          City: "",
          Country:""
        })
      }
      else{
      let userdata = doc(this.firestore, "users/", data)
      let snap = await getDoc(userdata)
      let _data:any = snap.data()
      this.AddForm.patchValue({

        FirstName: _data['name'],
        Email: _data['email'],
        PostelCode: _data['postalCode'],
        PhoneNuber: _data['phoneNumber'],
        City: _data['city'],
        Country: _data['country']
      })
    }

  }

  // showcheckout(){
    
  //   let todayDate= new Date().getTime()
  //   let selectedDate = new Date(this.AddForm.value['CheckOut']).getTime()
  //   if(todayDate < selectedDate ){
  //     console.log("Today date:", todayDate)
  //     console.log("Selected Date:", selectedDate)
  //     console.log("Today is less than selected")
  //   }
  //     if(todayDate > selectedDate){
  //       console.log("Today date:", todayDate)
  //       console.log("Selected Date:", selectedDate)
  //       console.log("Date selected is greater than today")
  //     }
  // }
}
