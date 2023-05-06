import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, increment, query, updateDoc, where } from '@angular/fire/firestore';
import { getStorage, ref, uploadString, getDownloadURL, listAll, deleteObject } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from 'rxjs';
import { Loader } from 'src/app/helpers/loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-hotel',
  templateUrl: './update-hotel.component.html',
  styleUrls: ['./update-hotel.component.scss']
})
export class UpdateHotelComponent implements OnInit {
  AddForm:any= FormGroup;
  constructor(private title: Title, private fb: FormBuilder, private firestore:Firestore,private route:ActivatedRoute,private router:Router) {
   
   }
  imageSrcs:any=[]
  data:any;
  async getData(id:any){
    Loader.isLoading=true;
    var _ref = collection(this.firestore, "hotels");

    var q = query(_ref, where("id", "==", id));

    var qSnap = await getDocs(q);
    this.data = qSnap.docs[0].data();

    const storage = getStorage();

    // Create a _reference under which you want to list
    const list_ref = ref(storage, 'hotels/' + this.data.id);

    // Find all the p_refixes and items.
    var urlRef: any;
    await listAll(list_ref)
      .then((res) => {
        res.items.forEach((item:any)=>{
        
            getDownloadURL(item)
              .then((url) => {
                var d = {
                  id:item,
                  src:url,
                  filePath:""
                }
                this.imageSrcs.push(d);
                // Insert url into an <img> tag to "download"
              })
              .catch((error) => {
                console.log(error)
              });
          
        })
        //  console.log(res.items[0]);
      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error)
      });
 
    this.AddForm.patchValue({
      HotelName:this.data['name'],
      HotelAddress:this.data['location'],
      Description:this.data['description'],
      PriceGuest:this.data['pricePerGuest'],
      PriceRoom:this.data['pricePerRoom'],
      vat:this.data['vat'],
    })
    Loader.isLoading=false;
  }
   async ngOnInit() {
    
     await this.route.queryParams.subscribe((params: any) => {
      // Defaults to 0 if no query param provided.
       this.AddForm = this.fb.group({
         HotelName: ['', Validators.required],
         // HotelTitle: ['', Validators.required],
         HotelAddress: ['', Validators.required],
         Description: ['', Validators.required],
         PriceGuest: [100, Validators.required],
         PriceRoom: [100, Validators.required],
         vat: [0, Validators.required],
         // Facilities: ['', Validators.required],


       });
      if (params['id']) {
        this.getData(params['id']);
      }
    });
  }
  async submit() {
    if (this.AddForm.valid) {
      Loader.isLoading = true;
      var timeStamp = new Date().getTime();
      var formData = this.AddForm.value;

    var imgs :any= [];
    var storage = getStorage();
    var imgLen = this.imageSrcs.filter((x:any)=>{
      if (x.id == 0) {
        return x;
      }
    })
    if(imgLen.length>0){
    this.imageSrcs.forEach(async (x:any)=>{
      if(x.id==0){
        var storageRef = ref(
          storage,
          'hotels/' + this.data.id + '/' + new Date().getTime() + '.png'
        );
        await uploadString(storageRef, x.filePath, 'data_url')
          .then(snapshot => {
            // console.log('Uploaded a data_url string!',snapshot);
            getDownloadURL(storageRef).then((resp: any) => {
              imgs.push(resp);
             
            });
          })
          .catch((err: any) => {
            Loader.isLoading = false;
            console.log(err);
          });
      }
    })
     setTimeout(async () => {
      var photo =imgs[0]
      console.log(photo)
       var hotelDocref = doc(this.firestore, 'hotels/' + this.data.id);
       await updateDoc(hotelDocref, {
         id: this.data.id,
         description: formData['Description'],
         location: formData['HotelAddress'],
         name: formData['HotelName'],
         pricePerGuest: formData['PriceGuest'],
         pricePerRoom: formData['PriceRoom'],
         rating: 5,
         vat: formData['vat'],
         photos: imgs,
         photo: photo
       }).then(() => {
         Swal.fire({
           title: "Success",
           text: "Hotel updated successfully",
           icon: "success",

         })
         Loader.isLoading = false;
         this.router.navigateByUrl("/account/hotels");
       }).catch((err: any) => {
         Swal.fire({
           title: 'Alert',
           text: 'Something is not right',
           icon: 'error'
         });
         Loader.isLoading = false;
       });
     }, 1500);
  }else{

      var hotelDocref = doc(this.firestore, 'hotels/' + this.data.id);
      await updateDoc(hotelDocref, {
        id: this.data.id,
        description: formData['Description'],
        location: formData['HotelAddress'],
        name: formData['HotelName'],
        pricePerGuest: formData['PriceGuest'],
        pricePerRoom: formData['PriceRoom'],
        rating: 5,
        vat: formData['vat'],
      }).then(()=>{
        Swal.fire({
          title: "Success",
          text: "Hotel updated successfully",
          icon: "success",

        })
        Loader.isLoading = false;
        this.router.navigateByUrl("/account/hotels");
      }).catch((err: any) => {
        Swal.fire({
          title: 'Alert',
          text: 'Something is not right',
          icon: 'error'
        });
        Loader.isLoading = false;
      });

    }
   

    
    } else {
      Swal.fire({
        title: 'Alert',
        text: 'All fields are required',
        icon: 'warning'
      });
    }
  }
  increment() {
    const price = this.AddForm.controls['PriceRoom'].value;
    this.AddForm.controls['PriceRoom'].setValue(price + 5);
  }

  decrement() {
    const price = this.AddForm.controls['PriceRoom'].value;
    this.AddForm.controls['PriceRoom'].setValue(price - 5);
  }
  increment1() {
    const price = this.AddForm.controls['PriceGuest'].value;
    this.AddForm.controls['PriceGuest'].setValue(price + 5);
  }

  decrement1() {
    const price = this.AddForm.controls['PriceGuest'].value;
    this.AddForm.controls['PriceGuest'].setValue(price - 5);
  }
  vatIncrement() {
    const price = this.AddForm.controls['vat'].value;
    this.AddForm.controls['vat'].setValue(price + 5);
  }

  varDecrement() {
    const price = this.AddForm.controls['vat'].value;
    this.AddForm.controls['vat'].setValue(price - 5);
  }
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const imageSrc: string = reader.result as string;
        var d={
          id:0,
          src:"",
          filePath:imageSrc
        }
        this.imageSrcs.push(d);
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage(index: any) {
    Swal.fire({
      title: 'Notice',
      text: 'Do you really want to remove this item?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((Resp: any) => {
      if (Resp.value) {
        if(this.imageSrcs[index].id==0){
        this.imageSrcs.splice(index, 1);
        }
        else{
          deleteObject(this.imageSrcs[index].id).then(async () => {
            this.imageSrcs.splice(index, 1);
            var serviceDocRef = doc(
              this.firestore,
              'hotels/' + this.data.id
            );
            var imgs = this.imageSrcs.filter((x:any)=>{
              if(x.id!=0){
                return x.src;
              }
            })
            await updateDoc(serviceDocRef, {
              photos: imgs.filter((x:any)=>x.src)

            });
            this.getData(this.data.id);
          }).catch((error) => {
            // Uh-oh, an error occurred!
          });
        }
      }
    });
  }
}
