import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  public rooms: any;
  public cols: any;
  constructor(private title: Title, private auth: Auth, private firestore: Firestore,private router:Router) { }


  ngOnInit(): void {
    this.cols = [
      { header: 'Room #',field:"number",type:"text" },
      { header: 'Room Picture',field:"profilePic", type:"profilePic" },
     { header: 'Room Type',field:"roomtypename", type:"text"},
    //  { header: 'Bed Type', field:"bedType", type:"text"},
      //{ header: 'Facilities',field:"roomType", type:"text" },
       { header: 'Price',field:"price", type:"text" },
      { header: 'Action',field:"Action", type:"action" },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.rooms = [
      // {
      //   roomNumber: '302',
      //   roomType: 'Family Room',
      //   bedType: 'Double Bed',
      //   facilities: 'Free Wifi, Breakfast, Single Bed, Double..',
      //   price: '$150',
      //   isActive: true
      // },
      // {
      //   roomNumber: '302',
      //   roomType: 'Family Room',
      //   bedType: 'Double Bed',
      //   facilities: 'Free Wifi, Breakfast, Single Bed, Double..',
      //   price: '$150',
      //   isActive: true
      // },
      // {
      //   roomNumber: '302',
      //   roomType: 'Family Room',
      //   bedType: 'Double Bed',
      //   facilities: 'Free Wifi, Breakfast, Single Bed, Double..',
      //   price: '$150',
      //   isActive: true
      // }
    ];
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.getRooms()
      
    }, 3500);
  }
  async getRooms(){
    Loader.isLoading=true
    let hotelId= User.hotel;
    // Room Types
    let roomtypelist:any=[]
    let hotelRef = doc(this.firestore, "hotels/"+hotelId)
    let roomTypeRef = collection(hotelRef, "roomTypes")
    let data = await getDocs(roomTypeRef)
    data.forEach((roomtype)=> roomtypelist.push(roomtype.data()))
    // Rooms
    let roomsRef = collection(hotelRef, "rooms")
    data= await getDocs(roomsRef)

    data.forEach(async (room:any)=>{
        var data= room.data()
        if(data['isDeleted']==false){
        
            // roomtypelist.forEach((roomtype:any)=>{
            //     if(roomtype['id']===data['roomtypeid']){
            //       data['roomtypename']=roomtype['name']
                 
            //     }
            // })
          
            var q = query(roomTypeRef,where("id","==",data['typeId']));
            var qSnap :any= await getDocs(q);
            data['roomtypename']  = qSnap.docs[0].data()['name'];
            if(data['photos'] && data['photos'].length >0)
            {
                data['profilePic']=data['photos'][0]
            }

            this.rooms.push(data)


        }

        
    })



    Loader.isLoading=false
    // let data = await getDocs(roomsRef)
    

    // data.forEach((item)=> {this.rooms.push(item.data());})
    
  }

  create(){
    this.router.navigateByUrl("/account/rooms/addroom");
  }
  view(e:any){
    this.router.navigateByUrl("/account/rooms/viewroom?id="+e.id);
  }
}
