import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.scss']
})
export class EditBookingComponent implements OnInit {
  EditForm!: FormGroup;
  @ViewChild('calendar')
  calendar: any;
  constructor(private fb: FormBuilder, private firestore: Firestore, private router: Router,private route: ActivatedRoute,) { }
  public roomsList: any;
  public allRooms: any;
  public bookingStatusList: any;
  public usersList: any;
  public bookingId:any;
  public selectedImage: any;
  public imagePreview: any;
  currentdate = new Date()
  ngOnInit(): void {

    this.route.queryParams.subscribe((params:any)=>{
      if(params['id']){
        this.bookingId=params['id'];
      }
    })

    this.EditForm = this.fb.group({
      // user: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', Validators.required],
      PostelCode: ['', Validators.required],
      UserAddress: ['', Validators.required],
      PhoneNuber: ['', Validators.required],
      City: ['', Validators.required],
      Country: ['', Validators.required],
      HotelName: [{ value: '', disabled: true }],
      // HotelTitle: ['', Validators.required],
      HotelAddress: [{ value: '', disabled: true }],
      Description: [{ value: '', disabled: true }],
      Price: [{ value: '', disabled: true }],
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
    this.usersList = []
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.getBookingDetails(this.bookingId);
        this.getHotelDetails()
    }, 3000);
  }

  async getBookingDetails(id:any){
      let bookingRef = doc(this.firestore, "bookings/"+id)
      let snap = await getDoc(bookingRef)
      let data:any = snap.data()
      console.log(data)
      this.EditForm.patchValue({
        FirstName: data['firstName'],
        LastName: data['lastName'],
        Email: data['email'],
        PostelCode: data['zipCode'],
        UserAddress: data['address'],
        PhoneNuber: data['number'],
        City: data['city'],
        Country: data['country'],
        CheckIn: new Date(data['checkInDate']),
        CheckOut: new Date(data['checkOutDate']),
        BookingStatus: data['status'],
       
      })
  }
  async getHotelDetails(){
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
    let _hoteldata:any = hoteldata.data();
    this.EditForm.patchValue({
      HotelName: _hoteldata['name'],
      Description: _hoteldata['description'],
      HotelAddress:_hoteldata['location'],
      Price: _hoteldata['pricePerRoom']
    })
    //console.log(hoteldata.data())

    Loader.isLoading=false
  }
  async onSubmit() {
    Loader.isLoading=true
    try{
      let formData = this.EditForm.value
      let payLoad = {
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
      }
      let bookingRef = doc(this.firestore, "bookings/"+this.bookingId)
      await updateDoc(bookingRef, payLoad).then((resp)=>{
        Swal.fire({
          title:"Success",
          text:"Booking updated successfully",
          icon:"success",
        
        })
      })
      this.router.navigateByUrl("/account/booking");

      // let bookingRef = collection(this.firestore, "bookings")
      // let bookingId:any;
      // await addDoc(bookingRef, payLoad).then(resp => {
      //   bookingId = resp.id;
      // });

      // let recentBookingRef= doc(
      //   this.firestore,
      //   'bookings/' + bookingId
      // );
      // await updateDoc(recentBookingRef, {
      //   id: bookingId
      // });


      // for(let item of formData['Rooms']){
      //    let bookingPricesPayload={
      //     id:"",
      //     price: item['price'],
      //     roomId: item['id']
      //    }
      //    let bookingPricesRef =  collection(this.firestore, "bookings/"+bookingId+"/bookingPrices")
      //   let recentAddedItem:any;
      //    await addDoc(bookingPricesRef,bookingPricesPayload).then((resp)=>{
      //       recentAddedItem=resp.id;
      //    });
      //    let snap  = doc(
      //     this.firestore,
      //     'bookings/' + bookingId + '/bookingPrices/' + recentAddedItem
      //   );
      //   await updateDoc(snap, {
      //     id: recentAddedItem
      //   });

      // }
      // Swal.fire({
      //   title:"Success",
      //   text:"Booking created successfully",
      //   icon:"success",
      
      // })
      // this.router.navigateByUrl("/account/booking");
      console.log(payLoad)
    
    }
    catch(err:any){
      console.log(err)
      Loader.isLoading=false
    }
    Loader.isLoading=false
    
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
    // let formValues = this.EditForm.value
    // let checkInDate= new Date(formValues['CheckIn']).getTime()
    // let checkOutDate= new Date(formValues['CheckOut']).getTime()
    this.getAvailableRooms()
    //console.log(this.roomsList)
    let hoteldata = await getDoc(hotelDoc)
    let _hoteldata:any = hoteldata.data();
    this.EditForm.patchValue({
      HotelName: _hoteldata['name'],
      Description: _hoteldata['description'],
      HotelAddress:_hoteldata['location'],
      Price: _hoteldata['pricePerRoom']
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
    let formValues = this.EditForm.value
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
    const price = this.EditForm.controls['Price'].value;
    this.EditForm.controls['Price'].setValue(price + 5);
  }

  decrement() {
    const price = this.EditForm.controls['Price'].value;
    this.EditForm.controls['Price'].setValue(price - 5);
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
      this.EditForm.patchValue({
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
        this.EditForm.patchValue({

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
      this.EditForm.patchValue({

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
  //   let selectedDate = new Date(this.EditForm.value['CheckOut']).getTime()
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
