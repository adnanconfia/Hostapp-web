import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/helpers/user';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Loader } from 'src/app/helpers/loader';
import { getDownloadURL, getStorage, ref, uploadString } from '@angular/fire/storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {
  AddForm!: FormGroup;

  imageSrcs: string[] = [];
  photos: string[] = []
  facilityList: any;
  roomTypeList: any[] = [];
  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.facilityList = [
      { name: 'Free Wifi', code: 'FW' },
      { name: 'Breakfast', code: 'BF' },
      { name: 'Single Bed', code: 'SB' },
      { name: 'Double Bed', code: 'DB' }
    ];

  }

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      Image: ['', Validators.required],
      RoomNumber: ['', Validators.required],
      RoomType: ['', Validators.required],
      // Facilities: ['', Validators.required],
      Price: [20, Validators.required],
      
      isSingle: [false, Validators.required],
      imageSrcs: this.imageSrcs,
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getRoomTypes();
    }, 3500);
  }

  async getRoomTypes() {
    Loader.isLoading = true
    let hotelId = User.hotel;
    var hotelRef = doc(this.firestore, "hotels", hotelId)
    var roomTypesRef = collection(hotelRef, "roomTypes")
    let data = await getDocs(roomTypesRef);
    data.forEach((doc) => {
      var data = doc.data()
      if (data['isDeleted'] == false) {
        this.roomTypeList.push(data)
      }
    })
    Loader.isLoading = false


  }

  async onSubmit() {
    try {
      Loader.isLoading = true
      let data = this.AddForm.value;
      let payLoad: any = {
        id: "",
        number: data['RoomNumber'],
        typeId: data['RoomType'],
        // facilities: "",
        price: data['Price'],
        isDeleted: false,
        isActive: true,
        createdAt: new Date().getTime(),
        photos: [],
        photo:"",
        isSingle:data['isSingle']
      }
      var storage = getStorage();
      this.photos = []
     
      // this.imageSrcs.forEach( (item:any)=>{
      //    let storageRef = ref(storage,
      //     'hotels/'+User.hotel+"/"+new Date().getTime()+'png')
      //      uploadString(storageRef,item,'data_url').then(
      //      async snapshot=>{
      //       console.log("Creating download Link and pusing to photos array")
      //       await getDownloadURL(storageRef).then((resp:any)=>{
      //           this.photos.push(resp)

      //       })



      //      }
      //     ).catch((err)=>{console.log(err)});
      // })


     




      console.log("ROoom creation forwared")
      let hotelRef = doc(this.firestore, "hotels", User.hotel)
      let roomsRef = collection(hotelRef, "rooms")
      let roomdocid: any = 0
      await addDoc(roomsRef, payLoad).then(resp => {
        roomdocid = resp.id;
      });

      for (let item of this.imageSrcs) {
        let storageRef = ref(
          storage,
          "hotels/" + User.hotel + "/"+roomdocid+"/" + new Date().getTime() + "png"
        );
        let snapshot = await uploadString(storageRef, item, "data_url");
        console.log("Creating download Link and pushing to photos array");
        let resp = await getDownloadURL(storageRef);
        this.photos.push(resp);
      }
      let addroomref = doc(
        this.firestore,
        'hotels/' + User.hotel + '/rooms/' + roomdocid
      );
      setTimeout(async () => {
        var photo="";
        if(this.photos.length>0){
          photo=this.photos[0]
        }
        await updateDoc(addroomref, {
          id: roomdocid,
          photos:this.photos,
          photo:photo
        });
      }, 1500);
      this.AddForm.reset();
      this.imageSrcs = []

      Swal.fire({
        title: "Success",
        text: "Room created successfully",
        icon: "success",

      })




    }
    catch (err: any) {
      console.log(err)

    }

    Loader.isLoading = false


  }
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
  replaceImage(index: any, event: any) {
    // const fileInput = document.createElement('input');
    // fileInput.type = 'file';
    // fileInput.accept = 'image/*';
    // // this.selectedImage = event.target.files[0];
    // let file = event.target.files[0];
    // const reader = new FileReader();

    // reader.onload = () => {
    //   const imageSrc: string = reader.result as string;
    //   this.imageSrcs[index] = imageSrc;
    // };
    // reader.readAsDataURL(file);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      // let filelist: any = this.AddForm.controls['Image'];
      console.log(this.AddForm.controls['Image']);
      // filelist[index] = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageSrc: string = reader.result as string;
        this.imageSrcs[index] = imageSrc;
      };
      reader.readAsDataURL(file);
    });
    fileInput.click();
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
