import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  templateUrl: './serviceitems.component.html',
  styleUrls: ['./serviceitems.component.scss']
})
export class ServiceitemsComponent implements OnInit {
  AddForm!: FormGroup;
  EditForm!:FormGroup;
 // public servicesList: any;
  public selectedImage: any;
  public selectedImageConverted: any;
  public imagePreview: any;
  public cols: any;
  public itemsDetails: any;
  public serviceFormShow: boolean = false;
  public servicesList: any[] = []
  serviceDic:any={};
  selectedServiceItemId:any;
  selectedServiceId:any;
  editForm:boolean=false
  constructor(private fb: FormBuilder, private firestore: Firestore) {

  }

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      services: ['', Validators.required],
      image: [''],
      itemName: ['', Validators.required],
      priceItem: [0.00],
      imageSource: []
    });
    this.EditForm = this.fb.group({
      ServiceItemEdit: ['', Validators.required],
    });
    this.cols = [
      { header: 'Image', field: "photo", type: "profilePic" },
      { header: 'Service', field: "serviceName", type: "text" },
      { header: 'Service Items', field: "serviceItems", type: "text" },
      { header: 'Action', field: "Action", type: "action" },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.itemsDetails = [
   
    ];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getServices()
        this.getAllServicesItems()
      
    }, 3500); }
  async onSubmit() {
    try {
      let formdata = this.AddForm.value;
      var serviceName = this.servicesList.filter((x:any)=>x.id===formdata['services']);
      var isRoomService=false;
      if(serviceName.length>0 ){
        if(serviceName[0].name.toLowerCase()==="room services")
        isRoomService=true;
      }
   
            // Payload
            let payLoad = {
              id: '',
              name: formdata['itemName'],
              price: formdata['priceItem']?formdata['priceItem']:0.00,
              createdAt: new Date().getTime(),
              isDeleted: false,
              photo: "",
              isRoomService:isRoomService
            }
             
        let serviceid = formdata['services']
      if(formdata['imageSource']){
        var storage = getStorage();
            let storageRef = ref(
          storage,
          "hotels/" + User.hotel + "/"+serviceid+"/" + new Date().getTime() + "png"
        );
        let snapshot = await uploadString(storageRef, this.selectedImageConverted, "data_url");
        let resp = await getDownloadURL(storageRef);
        console.log("Setting Photo In Payload")     
        payLoad['photo']=resp
      }
        // Hotel id
        let hotelId = User.hotel;
  
        // selected service id
 
        // Service Ref
        let serviceDocRef = doc(
          this.firestore,
          'hotels/' + hotelId + '/services/' + serviceid
        );
        // Service Items Collection
        let serviceItems = collection(serviceDocRef, 'items');
        // Adding Data
        let addedDocId: any;
        console.log("Creating DOC")  
        await addDoc(serviceItems, payLoad).then(resp => {
          addedDocId = resp.id;
        });
  

        var docRef = doc(
          this.firestore,
          'hotels/' + hotelId + '/services/' + serviceid + '/items/' + addedDocId
        );
        await updateDoc(docRef, {
          id: addedDocId
        });
  
        Swal.fire({
          title:"Success",
          text:"Service Item created successfully",
          icon:"success",
        
        })
        console.log()
        this.serviceFormShow=false
        this.imagePreview=""
        this.AddForm.reset()
        this.getAllServicesItems()
    }
    catch (err: any) {
      console.log(err)
      Swal.fire({
        title: 'Alert',
        text: 'Ops..Error occurred',
        icon: 'warning'
      });
    }

  }

  async onEditSubmit(){
        Loader.isLoading=true
      try{
        let hotelid = User.hotel;
        let serviceItemId = this.selectedServiceItemId
        let serviceId = this.selectedServiceId
        let formValue = this.EditForm.value
        let ref = doc(
          this.firestore,
          'hotels/' + hotelid + '/services/' + serviceId+ "/items/"+serviceItemId 
        );
        
       
        let payload = {
          name: formValue['ServiceItemEdit']
        }
        await updateDoc(ref, payload).then((resp)=>{
          Swal.fire({
            title: "Success",
            text: "Service Item updated successfully",
            icon: "success"
          })
          this.getAllServicesItems()
          this.editForm=false
          Loader.isLoading=false
        })

      }
      catch(err:any){
        Loader.isLoading=false
        console.log(err)
        Swal.fire({
          title: "Alert",
          text: "Something is not right",
          icon: "error"
        }) 
      }
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
      this.selectedImageConverted=ImgagePath;
      this.AddForm.patchValue({
        imageSource: ImgagePath
      });
    };
    // reader.readAsDataURL(this.selectedImage);
  }
  showForm() {
    this.serviceFormShow = !this.serviceFormShow;

  }



  async getAllServicesItems(){
    Loader.isLoading=true
    let hotelRef = doc(this.firestore, "hotels", User.hotel)

    let services = collection(hotelRef, "services")

    let servicedata = await getDocs(services)


    this.itemsDetails=[]
    for(let service of servicedata.docs){

        var sd = service.data()
        let serviceDocRef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/services/' + sd['id']
        );
        let serviceItemsRef = collection(serviceDocRef, 'items');
        let serviceitems = await getDocs(serviceItemsRef)
    
        for (let serviceitem of serviceitems.docs){
            let d = serviceitem.data()
            if(d['isDeleted']==false){
              var spayload={
                id: sd['id'],
                serviceItemId:'',
                serviceName:sd['name'],
                serviceItems: '',
                photo: ''
              }
           
              // console.log(d['name'])
              spayload['serviceItems']=d['name']
              // console.log("payload",spayload)
              // console.log("data", this.itemsDetails)
              spayload['photo']= d['photo']
              spayload['serviceItemId']=d['id']
               this.itemsDetails.push(spayload)
            }
            
        }

        
    }
    Loader.isLoading=false

  }

  async getServices() {
    Loader.isLoading = true
    let hotelRef = doc(this.firestore, "hotels", User.hotel)
    let servicesrRef = collection(hotelRef, 'services');
    let services = await getDocs(servicesrRef);
    this.servicesList = []
    services.docs.map((item) => {
      let d = item.data()
      this.serviceDic[d['id']]=d;
      this.servicesList.push(d)
    })
    this.AddForm.patchValue({
      services: ''
    })
    this.AddForm.reset()
    Loader.isLoading = false
  }


  delete(event:any){
    Swal.fire({
      title: 'Notice',
      text: 'Do you really want to remove this item?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (Resp: any) => {
      if (Resp.value) {
        Loader.isLoading = true;
        let serviceDocRef = doc(
          this.firestore,
          'hotels/' + User.hotel + '/services/' + event['id'] + "/items/"+ event['serviceItemId']
        );

        await updateDoc(serviceDocRef, {
          isDeleted: true
        }).then(() => {
          Swal.fire({
            title: "Success",
            text: "Item removed successfully",
            icon: "success"
          })
          this.getAllServicesItems();

        }).catch((err: any) => {

          Loader.isLoading = false;
        });

      }
    });
  }

  async edit(event:any){
    this.EditForm.patchValue({
      ServiceItemEdit: event.serviceItems
    })
    this.selectedServiceItemId = event.serviceItemId
    this.selectedServiceId = event.id;
      this.editForm=true
  }


}
