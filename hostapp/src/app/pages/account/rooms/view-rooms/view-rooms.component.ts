import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';

@Component({
  selector: 'app-view-rooms',
  templateUrl: './view-rooms.component.html',
  styleUrls: ['./view-rooms.component.scss']
})
export class ViewRoomsComponent implements OnInit {
  roomId:any;
  AddForm!: FormGroup;
  imageSrcs: string[] = [];
  facilityList: any;
  roomTypeList: any;
  room:any;
  roomPhotos:any[]=[]
  constructor(private title: Title, private route: ActivatedRoute, private firestore:Firestore,private auth:Auth,private fb:FormBuilder,private router:Router) {
    this.facilityList = [
      { name: 'Free Wifi', code: 'FW' },
      { name: 'Breakfast', code: 'BF' },
      { name: 'Single Bed', code: 'SB' },
      { name: 'Double Bed', code: 'DB' }
    ];
    this.roomTypeList = [
      { name: 'Luxury', code: 'LX' },
      { name: 'Family Room', code: 'FR' },
      { name: 'Disable Guest', code: 'DG' },
      { name: 'Luxury Marqu', code: 'LM' }
    ];
    this.route.queryParams.subscribe((params:any)=>{
      if(params['id']){
        this.roomId=params['id'];
        //
      }
    })
  }
 
  ngAfterViewInit() {
    setTimeout(() => {
        this.getRoomDetails(this.roomId);
    }, 3000);
  }
  ngOnInit(): void {
    this.AddForm = this.fb.group({
      Image: ['', Validators.required],
      RoomNumber: [{value: '', disabled: true}, Validators.required],
      RoomType: [{value: '', disabled: true}, Validators.required],
      Facilities: [{value: '', disabled: true}, Validators.required],
      Price: [{value: '', disabled: true}, Validators.required]
    });
    this.route
  }

  async getRoomDetails(id:any){
    Loader.isLoading=true
    let hotelRef = doc(this.firestore, 'hotels', User.hotel);
    let roomsRef = collection(hotelRef,'rooms')
    let q = query(roomsRef, where('id','==',this.roomId))
    let _data = await getDocs(q)
    let room = _data.docs[0].data()
    this.room = room
    this.room.photos.map((item:any)=> this.roomPhotos.push(item))

    let roomTypeRef = collection(hotelRef,'roomTypes')
    let roomTypeQ = query(roomTypeRef, where('id','==',this.room.roomtypeid))
    let roomtypedata= await getDocs(roomTypeQ)
    let _roomtypedata = roomtypedata.docs[0].data()
    this.AddForm.patchValue({
      RoomNumber: this.room.roomNumber,
      RoomType: _roomtypedata['name'],
      Price:this.room.price
    });

    Loader.isLoading=false

  }
  onSubmit() {}
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const imageSrc: string = reader.result as string;
        this.imageSrcs.push(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage(index: any) {
    this.imageSrcs.splice(index, 1);
  }
  increment() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price + 5);
  }

  decrement() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price - 5);
  }
}
