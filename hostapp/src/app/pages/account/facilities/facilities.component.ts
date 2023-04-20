
import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {
  FacilityInfoData:any;
  showAddFacility:boolean=false
  showEditFacility:boolean=false
  AddFacilityForm!:FormGroup;
  EditFacilityForm!:FormGroup;
  facilitiesList:any[]=[]
  public facilities: any;
  public cols: any;
  constructor( private fb: FormBuilder,private firestore: Firestore) { }

  ngOnInit(): void {
    this.AddFacilityForm = this.fb.group({
      facility: ['', Validators.required],
    });
    this.EditFacilityForm = this.fb.group({
      facility_edit: ['hbhbh', Validators.required],
    });
    this.cols = [
      { header: 'Facility',field: 'name', type:'text' },
      { header: 'Action',field: 'Action', type:'action' },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.facilities = [
      {
        name: 'Free Hand wash',
      }
    ];
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
        this.getHotelFacilities();
    }, 3500);
  }


  async onSubmit() {
    var id: any = 0;
    try {
      if (this.AddFacilityForm.invalid) {
        Swal.fire({
          title: "Alert",
          text: "Please fill all fields",
          icon: "warning"
        })
      }
      else {
        Loader.isLoading = true;
        var data = this.AddFacilityForm.value;
        var payLoad = {
          id: "",
          name: data['facility'],
          createdAt: (new Date()).getTime(),
          isDeleted: false
        }
        console.log(payLoad)
        Loader.isLoading = true;
        let hotelRef = doc(this.firestore, "hotels",User.hotel)
        const  facilityRef= collection(hotelRef, 'facilities');
        let facilityDocId:any=0;
        await addDoc(facilityRef, payLoad).then(resp => {
          facilityDocId=resp.id;
        });
        let addedFacilityRef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/facilities/' + facilityDocId
        );
        await updateDoc(addedFacilityRef, {
          id: facilityDocId
        });
        
        this.showAddFacility=false
        this.AddFacilityForm.get('facility')?.setValue('')
        this.getHotelFacilities()
     
      }
    }
    catch (err: any) {
      console.log(err)
      Loader.isLoading = false;
    }

    Loader.isLoading=false;

  }

  
  async getHotelFacilities(){
    Loader.isLoading=true
    this.facilitiesList=[]
    let hotelId = User.hotel;
    const hotelRef = doc(this.firestore, 'hotels', hotelId);
    let facilities = collection(hotelRef, "facilities")
    const data = await getDocs(facilities);
    data.forEach((doc) => {
      var data = doc.data()
      if(data['isDeleted']==false){
        this.facilitiesList.push(data)
      }
      
    })
    Loader.isLoading=false
  }

  createFacility(){
    this.showAddFacility=true;
  }

  delete(event:any){
    //alert(e.id)
    Swal.fire({
      title: 'Notice',
      text: 'Do you really want to remove this facility?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (Resp: any) => {
      if (Resp.value) {
        Loader.isLoading = true;
        let facilityRef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/facilities/' + event.id
        );
        await updateDoc(facilityRef, {
          isDeleted: true
        }).then(() => {
          Swal.fire({
            title: "Success",
            text: "Facility removed successfully",
            icon: "success"
          })
          this.getHotelFacilities();

        }).catch((err: any) => {

          Loader.isLoading = false;
        });

      }
    });
  }


  async ShowEditFacilityForm(event:any){
    Loader.isLoading=true
    this.showEditFacility=true;
    let facilityRef = doc(
      this.firestore,
      'hotels/' + User.hotel + '/facilities/' + event.id
    );
    let q = await getDoc(facilityRef);
    this.FacilityInfoData=q.data()
    let facilityInfo:any = q.data()
    this.EditFacilityForm.get('facility_edit')?.setValue(facilityInfo['name'])
    Loader.isLoading=false


  }
  async onEditSubmit(){
    var id: any = 0;
    try {
      if (this.EditFacilityForm.invalid) {
        Swal.fire({
          title: "Alert",
          text: "Please fill all fields",
          icon: "warning"
        })
      }
      else {
        Loader.isLoading = true;
        var data = this.EditFacilityForm.value;
        var payLoad = {
          name: data["facility_edit"],
        }
        let facilityRef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/facilities/' + this.FacilityInfoData.id
        );
        await updateDoc(facilityRef,payLoad).then((resp: any) => {
          Swal.fire({
            title: "Success",
            text: "Facility updated successfully",
            icon: "success"
          })
          this.getHotelFacilities()
          this.showEditFacility=false
          Loader.isLoading = false;
        }).catch((err: any) => {
          Swal.fire({
            title: "Alert",
            text: "Something is not right",
            icon: "error"
          }) 
        });

        Loader.isLoading=false
       
      }
    }
    catch (err: any) {
      Loader.isLoading = false;
    }
  }


}
