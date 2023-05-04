import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  AddForm!: FormGroup;
  public requests: any;
  public cols: any;
  public visible:any=false
  public countries:any;
  public selectedCountry: any;
  public requestedItems:any="asdads"
  public workerList:any;
  currentViewingRequest:any;
  constructor(private title: Title, private auth: Auth, private firestore: Firestore,private router:Router,private fb: FormBuilder) { }


  ngOnInit(): void {
    this.cols = [
      { header: 'Booking ID',field:"bookingId",type:"text" },
      { header: 'Customer',field:"name", type:"text"},
    //  { header: 'Requested Items',field:"roomtypename", type:"text"},
      { header: 'Room #',field:"rooms", type:"text"},
      { header: 'Status',field:"statusName", type:"text"},
      {header:"Actions", field: "actions",type:"action"}
    ];
    this.requests = [
        // {
        //   roomNumber: '302',
        //   roomType: 'Family Room',
        // }
    ]

  
  this.workerList=[
    // {
    //   id:"1",
    //   name:"HouseKeeping"
    // }
  ]
  this.AddForm = this.fb.group({
    WorkerList: ['', Validators.required],

  });
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.getRequests()
      
    }, 3500);
  }



  showDialog(){
    this.visible=true
  }
  async getRequests(){
    Loader.isLoading=true
    let userServiceId=User.serviceId;
    console.log("User service id: ", userServiceId)
    console.log("User hotel id: ", User.hotel)
    let requestRef = collection(this.firestore, "requests")
    let q = query(requestRef, where('hotelId','==',User.hotel),where('serviceId','==', userServiceId))
    let snapShot= await getDocs(q)
    this.requests=[]
    snapShot.docs.forEach(async element => {
      let d=element.data()
      
      // User Details
      let userid = d['requesterId']
      let userRef = doc(this.firestore, "users/"+userid)
      let snap:any = await getDoc(userRef)
      let _data:any = await snap.data()
      d['name']= _data['name']
      let status = d['status']
      if(status==0){
          d['statusName']="Pending"
      }
      else if(status==1){
        d['statusName']="Allotted"
      }
      else if(status==2){
        d['statusName']="Reviewed"
      }
      else if(status==3){
        d['statusName']="Completed"
      }
      // Room #'s

      // let rooms=""
      // for(let room of d['rooms']){
      //   let roomRef = doc(this.firestore, "hotels/"+User.hotel+"/rooms/"+room)
      //   let snap = await getDoc(roomRef)
      //   let data:any=snap.data()
      //   rooms= rooms+ data['roomNumber']+","
      // }
      d['rooms']=''

      

      this.requests.push(d)
    });

    Loader.isLoading=false

  }

 async  detail(event:any){
  Loader.isLoading=true
    this.visible=true
    this.workerList=[]
    console.log(event)
    let requestedItems = event.items
    this.requestedItems=""
    for(let item of requestedItems){

     let itemRef=  doc(this.firestore, "hotels/"+User.hotel+"/services/"+event.serviceId+"/items/"+item)

     let snap:any = await getDoc(itemRef)
     let data = snap.data()
        this.requestedItems+=data['name']+","
    }

    // Get Worker Role
    let roleRef= collection(this.firestore, "roles")
    let rq = query(roleRef, where("name", "==", "Worker"))
    let rsnap= await getDocs(rq)
    let workerRoleId = rsnap.docs[0].data()['roleId']
    let workers = collection(this.firestore, "administrators")
    let q = query(workers, where("hotelId","==",User.hotel), where('serviceId','==',User.serviceId), where('roleId',"==",workerRoleId))
    let snap = await getDocs(q)
    snap.docs.forEach(item=> {
      let d = item.data()
      this.workerList.push(d)
    })

    this.currentViewingRequest={'request': event } 
    Loader.isLoading=false
  }

  async onSubmit(){
    try{
      let formData = this.AddForm.value
      if(this.AddForm.valid){
        let workerid = formData.WorkerList['id']
        let payload = {
          "assignedTo": workerid,
          "status":1,
          "isAssigned": true
        }
      let reqRef = doc(this.firestore, "requests/"+this.currentViewingRequest.request['id'])
     // let data = await getDoc(reqRef)
      await updateDoc(reqRef, payload).then(resp=>{
        Swal.fire({
          title: "Success",
          text: "Worker Assigned to Request",
          icon: "success"
        })
      })
      // Chat Object
      let chatRef = collection(this.firestore, "chats")
      let chatPayload={
        id:"",
        workerId: workerid,
        guestId: this.currentViewingRequest.request['requesterId'],
        bookingId:this.currentViewingRequest.request['bookingId'],
        isActive:true,
        isAssigned:true,
      }
      await addDoc(chatRef,chatPayload);

      }
      else{
        Swal.fire({
          title: "Alert",
          text: "Please fill all fields",
          icon: "warning"
        })
      }
    }
    catch(err:any){
      console.log(err)

    }
  
  }
}

interface City {
  name: string,
  code: string
}

