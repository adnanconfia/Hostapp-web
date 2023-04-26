import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bedtypes',
  templateUrl: './bedtypes.component.html',
  styleUrls: ['./bedtypes.component.scss']
})
export class BedtypesComponent implements OnInit {
  BedTypeInfoData:any;
  showAddBedType:boolean=false;
  showEditBedType:boolean=false;
  AddBedTypeForm!:FormGroup;
  EditBedTypeForm!:FormGroup;
  public cols: any;
  bedtypesList:any[]=[]

  constructor( private fb: FormBuilder,private firestore: Firestore) { }

  ngOnInit(): void {
    this.AddBedTypeForm = this.fb.group({
      bed_type: ['', Validators.required],
    });
    this.EditBedTypeForm = this.fb.group({
      bedtype_edit: ['', Validators.required],
    });
    this.cols = [
      { header: 'Bed Type',field: 'name', type:'text' },
      { header: 'Action',field: 'Action', type:'action' },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.bedtypesList = [
     
    ];
  }

  ngAfterViewInit() {
    setTimeout(() => {
       this.getHotelBedTypes();
    }, 3500);
  }


  async ShowEditBedTypeForm(event: any){
    Loader.isLoading=true
    this.showEditBedType=true;
    let bedTypeRef = doc(
      this.firestore,
      'hotels/' + User.hotel + '/bedtypes/' + event.id
    );
    let q = await getDoc(bedTypeRef);
    this.BedTypeInfoData=q.data()
    //let facilityInfo:any = q.data()
    this.EditBedTypeForm.get('bedtype_edit')?.setValue(this.BedTypeInfoData['name'])
    Loader.isLoading=false
  }

  async getHotelBedTypes(){
    Loader.isLoading=true
    this.bedtypesList=[]
    let hotelId = User.hotel;
    const hotelRef = doc(this.firestore, 'hotels', hotelId);
    let bedtypeRef = collection(hotelRef, "bedtypes")
    const data = await getDocs(bedtypeRef);
    data.forEach((doc) => {
      var data = doc.data()
      if(data['isDeleted']==false){
        this.bedtypesList.push(data)
      }
      
    })
    Loader.isLoading=false
  }

  
  delete(event:any){
        //alert(e.id)
        Swal.fire({
          title: 'Notice',
          text: 'Do you really want to remove this bed type?',
          icon: 'question',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then(async (Resp: any) => {
          if (Resp.value) {
            Loader.isLoading = true;
            let bedtypeRef = doc(
              this.firestore,
              'hotels/' + User.hotel + '/bedtypes/' + event.id
            );
            await updateDoc(bedtypeRef, {
              isDeleted: true
            }).then(() => {
              Swal.fire({
                title: "Success",
                text: "Bed type removed successfully",
                icon: "success"
              })
              this.getHotelBedTypes();
    
            }).catch((err: any) => {
    
              Loader.isLoading = false;
            });
    
          }
        });
  }

  createBedType(){
    this.showAddBedType=true;
  }

  async onSubmit() {
    var id: any = 0;
    try{
        if(this.AddBedTypeForm.invalid){
          Swal.fire({
            title: "Alert",
            text: "Please fill all fields",
            icon: "warning"
          })
        }
        else{
            Loader.isLoading = true;
            var data = this.AddBedTypeForm.value;
            var payload = {
              id:"",
              name:data['bed_type'],
              createdAt:(new Date()).getTime(),
              isDeleted:false
            }
            let hotelRef = doc(this.firestore, "hotels",User.hotel)
            const bedtypeRef= collection(hotelRef, 'bedtypes');
            let bedtypedocid:any=0;
            await addDoc(bedtypeRef,payload).then(resp=>{
              bedtypedocid=resp.id;
            });
            let addedBedTypeRef = doc(this.firestore,
              'hotels/'+User.hotel+'/bedtypes/'+bedtypedocid);
            
            await updateDoc(addedBedTypeRef,{
              id: bedtypedocid
            })

            this.showAddBedType=false
            this.AddBedTypeForm.get('bed_type')?.setValue('');
            this.getHotelBedTypes()
          
        }
    }
    catch(err:any){
      console.log(err)
      Loader.isLoading=false;
    }
    Loader.isLoading=false

  }
 async  onEditSubmit(){
    var id: any = 0;
    try {
      if (this.EditBedTypeForm.invalid) {
        Swal.fire({
          title: "Alert",
          text: "Please fill all fields",
          icon: "warning"
        })
      }
      else {
        Loader.isLoading = true;
        var data = this.EditBedTypeForm.value;
        var payLoad = {
          name: data["bedtype_edit"],
        }
        let facilityRef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/bedtypes/' + this.BedTypeInfoData.id
        );
        await updateDoc(facilityRef,payLoad).then((resp: any) => {
          Swal.fire({
            title: "Success",
            text: "Bed type updated successfully",
            icon: "success"
          })
          this.getHotelBedTypes()
          this.showEditBedType=false
          Loader.isLoading = false;
        }).catch((err: any) => {
          console.log(err)
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
