import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  AddForm!: FormGroup;
  public servicesList: any;
  public selectedImage: any;
  public selectedImageConverted: any;
  public imagePreview: any;
  public cols: any;
  public itemsDetails: any;
  public serviceFormShow: boolean = false;

  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.servicesList = [
      // { name: 'Towels', code: 'Towels' },
      // { name: 'Pillow', code: 'Pillow' },
      // { name: 'Covers', code: 'Covers' },
      // { name: 'Curtons', code: 'Curtons' },
      // { name: 'Bedsheets', code: 'Bedsheets' }
    ];
  }

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      serviceName: ['', Validators.required],
      serviceDescription: ['', Validators.required],
    });
    this.cols = [
      //{ header: 'Image', field: "profilePic", type: "profilePic" },
      { header: 'Service', field: "name", type: "text" },
      { header: 'Description', field: "description", type: "text" },
      //{ header: 'Service Items', field: "serviceItems", type: "text" },
      { header: 'Action', field: "Action", type: "action" },

      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.itemsDetails = [
      // {
      //   list:
      //     'Towels, Pillow Covers, Curtons, Cusions, Bedsheets, Shoes Pair, Jeans, T-shirts'
      // }
    ];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getServices()

    }, 3500);
  }
  async onSubmit() {
    try {
      let formdata = this.AddForm.value;
      // Payload
      let payLoad = {
        id: '',
        name: formdata['serviceName'],
        description: formdata['serviceDescription'],
        createdAt: new Date().getTime(),
        isDeleted: false,
      }

      // Hotel id
      let hotelId = User.hotel;

      // Service Ref
      let serviceDocRef = collection(
        this.firestore,
        'hotels/' + hotelId + '/services/'
      );

      //     // Adding Data
      let addedDocId: any;

          await addDoc(serviceDocRef, payLoad).then(resp => {
            addedDocId = resp.id;
          });


          var docRef = doc(
            this.firestore,
            'hotels/' + hotelId + '/services/' + addedDocId
          );
          await updateDoc(docRef, {
            id: addedDocId
          });

          Swal.fire({
            title:"Success",
            text:"Service  created successfully",
            icon:"success",

          })
          this.serviceFormShow=false
          this.AddForm.reset()
          this.getServices()
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
        this.selectedImageConverted = ImgagePath;
        this.AddForm.patchValue({
          imageSource: ImgagePath
        });
      };
      // reader.readAsDataURL(this.selectedImage);
    }
    showForm() {
      //this.getServices()
      this.serviceFormShow = !this.serviceFormShow;

    }



  // async getAllServicesItems(){
  //   Loader.isLoading=true
  //   let hotelRef = doc(this.firestore, "hotels", User.hotel)

  //   let services = collection(hotelRef, "services")

  //   let servicedata = await getDocs(services)


  //   this.itemsDetails=[]
  //   for(let service of servicedata.docs){

  //       var sd = service.data()
  //       let serviceDocRef = doc(
  //         this.firestore,
  //         'hotels/' + User.hotel + '/services/' + sd['id']
  //       );
  //       let serviceItemsRef = collection(serviceDocRef, 'items');
  //       let serviceitems = await getDocs(serviceItemsRef)
  //       var spayload={
  //         id: sd['id'],
  //         serviceName:sd['name'],
  //         serviceItems: ''
  //       }
  //       for (let serviceitem of serviceitems.docs){
  //          let d = serviceitem.data()
  //           spayload['serviceItems']+=d['name']+','

  //       }
  //       this.itemsDetails.push(spayload)

  //   }
  //   Loader.isLoading=false

  // }

  async getServices() {
      Loader.isLoading = true
      this.itemsDetails = []
      let hotelRef = doc(this.firestore, "hotels", User.hotel)
      let servicesrRef = collection(hotelRef, 'services');

      let services = await getDocs(servicesrRef);
      this.servicesList = []
      services.docs.map((item) => {
        let d = item.data()
        this.itemsDetails.push(d)
      })

      Loader.isLoading = false
    }


  }
