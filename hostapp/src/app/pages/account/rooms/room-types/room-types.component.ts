import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/helpers/user';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss']
})
export class RoomTypesComponent implements OnInit {
  AddForm!: FormGroup;
  EditForm!:FormGroup;
  public roomtypes: any;
  public cols: any;
  public showform: boolean = false;
  public showeditform:boolean=false;
  public bedTypeList: any[]=[];
  public roomTypeList: any;
  public roomtypeeditid:any;
  constructor(private fb:FormBuilder,private title: Title, private auth: Auth, private firestore: Firestore,private router:Router) { }


  ngOnInit(): void {
    // this.bedTypeList = [
    //   { name: 'Double Bed', code: 'DB' },
    //   { name: 'Single Bed', code: 'SB' }
    // ];
    this.roomTypeList = [
      
    ];
    this.AddForm = this.fb.group({
      RoomType: ['', Validators.required],
      BedType: ['', Validators.required],
      isAvailable: [true, Validators.required]
    });
    this.EditForm= this.fb.group({
      RoomTypeEdit: ['asas', Validators.required],
      BedTypeEdit: ['', Validators.required],
      isAvailableEdit: [true, Validators.required]
    })
    this.cols = [
      { header: 'Room Types',field: 'name', type:'text' },
      { header: 'Bed Type',field: 'bedtype', type:'text' },
      { header: 'Is Active', field:"isActive", type:"status" },
      { header: 'Action',field: 'Action', type:'action' },

      //{ showchekbox: true },
     // { showtablecheckbox: true }
    ];
    // this.roomtypes = [
    //   {
    //     roomType: 'Family Room',
    //     bedType: 'Double Bed',
    //     isAvailable: false
    //   },
    //   {
    //     roomType: 'Family Room',
    //     bedType: 'Double Bed',
    //     isAvailable: true
    //   },
    //   {
    //     roomType: 'Family Room',
    //     bedType: 'Double Bed',
    //     isAvailable: true
    //   }
    // ];
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.getRoomTypes();
      
    }, 3500);
  }

  async getRoomTypes(){
    Loader.isLoading=true
    let hotelId= User.hotel;
    this.roomTypeList=[]
    this.bedTypeList=[]
    //let bedTypeList: any[]=[]
    var hotelRef = doc(this.firestore, "hotels",hotelId)
    var roomTypesRef = collection(hotelRef, "roomTypes")
    var bedTypesRef = collection(hotelRef, "bedtypes")
    let data = await getDocs(bedTypesRef)
    data.forEach((doc)=>{let i=doc.data(); if(i['isDeleted']==false){this.bedTypeList.push(i)}})
    data = await getDocs(roomTypesRef);
    data.forEach((doc)=>{
      var data = doc.data()
      if(data['isDeleted']==false){
            this.bedTypeList.map((item)=>{if(item['id']==data['bedtypeid']){data['bedtype']=item['name']}})
            this.roomTypeList.push(data)
      }
    })
    Loader.isLoading=false

  }
  async onSubmit() {
    Loader.isLoading=true
    try{
      if (this.AddForm.valid) {
        var data = this.AddForm.value;
        var payload = {
          id:"",
          name: data['RoomType'],
          createdAt: (new Date()).getTime(),
          isDeleted: false,
          isActive: data['isAvailable'],
          bedTypeId: data['BedType']
        }
  
        var hotelRef = doc(this.firestore, "hotels",User.hotel)     
        var roomTypesRef = collection(hotelRef, "roomTypes")
        let roomtypedocid:any=0;
        await addDoc(roomTypesRef, payload).then(resp => {
          roomtypedocid=resp.id;
        });
        let addedRoomTypeRef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/roomTypes/' + roomtypedocid
        );
        await updateDoc(addedRoomTypeRef, {
          id: roomtypedocid
        });
        Loader.isLoading=false
          this.getRoomTypes()
   
      } else {
        Swal.fire({
          title: "Alert",
          text: "Please fill all fields",
          icon: "warning"
        })
        Loader.isLoading=false
        this.AddForm.markAllAsTouched();
      }
    }
    catch(err:any){
      console.log(err)
      Loader.isLoading = false;
    }

    this.AddForm.reset()

    Loader.isLoading=false;
    this.showform=false
    
  }
  showForm() {
    this.showform = !this.showform;
  }
  delete(event:any){
    Swal.fire({
      title: 'Notice',
      text: 'Do you really want to remove this room type?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (Resp: any) => {
      if (Resp.value) {
        Loader.isLoading = true;
        let roomtyperef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/roomTypes/' + event.id
        );
        await updateDoc(roomtyperef, {
          isDeleted: true
        }).then(() => {
          Swal.fire({
            title: "Success",
            text: "RoomType removed successfully",
            icon: "success"
          })
          this.getRoomTypes();
          Loader.isLoading = false;
        }).catch((err: any) => {

          Loader.isLoading = false;
        });

      }
    });
  }
  async showEditForm(event:any){
    console.log(event)
    //Loader.isLoading=true
    // this.showeditform=true;
    // let roomTypeRef = doc(
    //   this.firestore,
    //   'hotels/' + User.hotel + '/roomTypes/' + event.id
    // );
    // let q = await getDoc(roomTypeRef);
    // let roomtypeinfo:any = q.data()
    // this.roomtypeeditid=roomtypeinfo['id']
    // this.EditForm.patchValue({
    //   RoomTypeEdit:roomtypeinfo['name'],
    //   BedTypeEdit: roomtypeinfo['bedtypeid']
    // })
    this.roomtypeeditid=event['id']
        this.EditForm.patchValue({
      RoomTypeEdit:event['name'],
      BedTypeEdit: event['bedtypeid'],
      isAvailableEdit: event['isActive']
    })
    
     this.showeditform=true;
  }

 async onEditSubmit(){

    try{
      if(this.EditForm.invalid){
        Swal.fire({
          title: "Alert",
          text: "Please fill all fields",
          icon: "warning"
        })
      }
      else{
        Loader.isLoading = true;
        let data = this.EditForm.value;
        var payLoad = {
          name: data["RoomTypeEdit"],
          bedtypeid: data["BedTypeEdit"],
          isActive: data['isAvailableEdit']
        }
        let roomtyperef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/roomTypes/' + this.roomtypeeditid
        );
        await updateDoc(roomtyperef,payLoad).then((resp)=>{
          Swal.fire({
            title: "Success",
            text: "Facility updated successfully",
            icon: "success"
          })
          this.getRoomTypes()
          this.showeditform=false
          Loader.isLoading=false
        }).catch((err:any)=>{
          console.log(err)
          Swal.fire({
            title: "Alert",
            text: "Something is not right",
            icon: "error"
          }) 
        })
        Loader.isLoading=false
      }
    }
    catch(err:any){
      console.log(err)
      Swal.fire({
        title: "Alert",
        text: "Something is not right",
        icon: "error"
      }) 
    }
    Loader.isLoading=false
  }
}
