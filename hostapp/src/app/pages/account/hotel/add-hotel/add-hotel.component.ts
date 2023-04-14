import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadString
} from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { Loader } from 'src/app/helpers/loader';
import Swal from 'sweetalert2';
import { deleteObject } from '@firebase/storage';
@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss']
})
export class AddHotelComponent implements OnInit {
  _showpass = false;
  apple = faApple;
  showPass() {
    this._showpass = true;
  }
  hidePass() {
    this._showpass = false;
  }
  AddForm!: FormGroup;
  @ViewChild('calendar')
  calendar: any;
  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private title: Title,
    public afAuth: Auth,
    private auth: AuthService
  ) {}
  public facilityList: any;
  public bookingStatusList: any;
  public selectedImage: any;
  public imagePreview: any;
  imageSrcs: string[] = [];
  profilePicPriview: any;
  selectedProfilePic: any;
  currentdate = new Date();
  ngOnInit(): void {
    this.title.setTitle('Create Hotel');
    this.AddForm = this.fb.group({
      HotelName: ['', Validators.required],
      // HotelTitle: ['', Validators.required],
      HotelAddress: ['', Validators.required],
      Description: ['', Validators.required],
      PriceGuest: [100, Validators.required],
      PriceRoom: [100, Validators.required],
      vat: [0, Validators.required],
      // Facilities: ['', Validators.required],
      Image: [null],
      username: ['', Validators.required],
      profile_pic: [''],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.facilityList = [
      { name: 'Free Wifi', code: 'FW' },
      { name: 'Breakfast', code: 'BF' },
      { name: 'Single Bed', code: 'SB' },
      { name: 'Double Bed', code: 'DB' }
    ];
    this.bookingStatusList = [
      { name: 'Confirmed', code: 'CF' },
      { name: 'In Progress', code: 'IP' }
    ];
  }

  async submit() {
    if (this.AddForm.valid) {
      Loader.isLoading = true;
      var timeStamp = new Date().getTime();
      var hotelRef = collection(this.firestore, 'hotels');

      var formData = this.AddForm.value;

      var hotelPayload = {
        createdAt: timeStamp,
        description: formData['Description'],
        location: formData['HotelAddress'],
        name: formData['HotelName'],
        photos: [],
        id: '',
        photo: '',
        pricePerGuest: formData['PriceGuest'],
        pricePerRoom: formData['PriceRoom'],
        rating: 5,
        vat: formData['vat']
      };
      var hotelId: any = 0;
      await addDoc(hotelRef, hotelPayload).then(resp => {
        hotelId = resp.id;
      });

      var serviceRef = collection(
        this.firestore,
        'hotels/' + hotelId + '/services'
      );
      var servicePayload = {
        id: '',
        name: 'House Keeping',
        description: 'kuch bhi'
      };
      var serviceId: any = 0;
      await addDoc(serviceRef, servicePayload).then(resp => {
        serviceId = resp.id;
      });
      var serviceDocRef = doc(
        this.firestore,
        'hotels/' + hotelId + '/services/' + serviceId
      );
      await updateDoc(serviceDocRef, {
        id: serviceId
      });

      servicePayload = {
        id: '',
        name: 'Front Office',
        description: 'kuch bhi'
      };

      await addDoc(serviceRef, servicePayload).then(resp => {
        serviceId = resp.id;
      });
      serviceDocRef = doc(
        this.firestore,
        'hotels/' + hotelId + '/services/' + serviceId
      );
      await updateDoc(serviceDocRef, {
        id: serviceId
      });
      servicePayload = {
        id: '',
        name: 'Room Service',
        description: 'kuch bhi'
      };

      await addDoc(serviceRef, servicePayload).then(resp => {
        serviceId = resp.id;
      });

      serviceDocRef = doc(
        this.firestore,
        'hotels/' + hotelId + '/services/' + serviceId
      );
      await updateDoc(serviceDocRef, {
        id: serviceId
      });
      servicePayload = {
        id: '',
        name: 'Maintenance',
        description: 'kuch bhi'
      };

      await addDoc(serviceRef, servicePayload).then(resp => {
        serviceId = resp.id;
      });
      serviceDocRef = doc(
        this.firestore,
        'hotels/' + hotelId + '/services/' + serviceId
      );
      await updateDoc(serviceDocRef, {
        id: serviceId
      });
      var storage = getStorage();
      var photos: any = [];
      this.imageSrcs.forEach(async (item: any) => {
        var storageRef = ref(
          storage,
          'hotels/' + hotelId + '/' + new Date().getTime() + '.png'
        );
        await uploadString(storageRef, item, 'data_url')
          .then(snapshot => {
            // console.log('Uploaded a data_url string!',snapshot);
            getDownloadURL(storageRef).then((resp: any) => {
              photos.push(resp);
              console.log(photos);
            });
          })
          .catch((err: any) => {
            Loader.isLoading = false;
            console.log(err);
          });
      });

      // Find all the prefixes and items.

      setTimeout(async () => {
        //  await listAll(listRef).then((resp: any) => {
        //    var photos = resp.items;
        //  })
        Loader.isLoading = true;
        var photo = '';
        if (photos.length > 0) {
          photo = photos[0];
        }

        var hotelDocref = doc(this.firestore, 'hotels/' + hotelId);
        await updateDoc(hotelDocref, {
          id: hotelId,
          photo: photo,
          photos: photos
        });

        console.log(formData);
        createUserWithEmailAndPassword(
          this.afAuth,
          formData['email'],
          formData['password']
        )
          .then(async (resp: any) => {
            const adminRef = collection(this.firestore, 'administrators');
            var storageRef = ref(
              storage,
              'users/' + resp.user.uid + '/' + new Date().getTime() + '.png'
            );
            var url = '';
            if (formData['Image']) {
              await uploadString(storageRef, formData['Image'], 'data_url')
                .then(snapshot => {
                  // console.log('Uploaded a data_url string!',snapshot);
                  getDownloadURL(storageRef).then((resp: any) => {
                    url = resp;
                  });
                })
                .catch((err: any) => {
                  Loader.isLoading = false;
                  console.log(err);
                });
            }
            setTimeout(async () => {
              Loader.isLoading = true;
              var user = {
                id: resp.user.uid,
                email: formData['email'],
                isActive: true,
                name: formData['username'],
                serviceId: '',
                hotelId: hotelId,
                imageUrl: url,
                roleId: 'NAER11fuLRi6jloPEJTo'
              };
              await addDoc(adminRef, user)
                .then((res: any) => {
                  Swal.fire(
                    'Congratulations',
                    'Hotel Created Successfully',
                    'success'
                  );
                  // this.router.navigateByUrl("/trainers");
                })
                .catch((err: any) => {
                  Loader.isLoading = false;
                  const hotelDeleteIns = doc(this.firestore, 'hotels', hotelId);
                  deleteDoc(hotelDeleteIns)
                    .then(() => {
                      console.log('success');
                    })
                    .catch((err: any) => {
                      console.log(err);
                    });
                  var storage = getStorage();
                  const storageRefDel = ref(storage, 'hotels/' + hotelId);

                  listAll(storageRefDel)
                    .then((list: any) => {
                      list.items.forEach((fileRef: any) => {
                        deleteObject(fileRef)
                          .then(() => {
                            console.log('success');
                          })
                          .catch((err: any) => {
                            console.log(err);
                          });
                      });
                    })
                    .catch((err: any) => {
                      console.log(err);
                    });
                });
            }, 1000);
          })
          .catch((err: any) => {
            console.log(err);
          });
      }, 2500);
      Loader.isLoading = false;
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
        this.imageSrcs.push(imageSrc);
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
        this.imageSrcs.splice(index, 1);
      }
    });
  }
  openCalendar(event: any) {
    // this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
    // event.stopPropagation();
  }
  onProfilePicSelected(event: any) {
    if (event.target.files) {
    }
    this.selectedProfilePic = event.target.files[0];
    let file = event.target.files[0];
    // console.log(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profilePicPriview = reader.result as string;
      let ImagePath = reader.result as string;
      this.AddForm.patchValue({
        Image: ImagePath
      });
    };
    // reader.readAsDataURL(this.selectedImage);
  }
  removeProfilePic() {
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
        this.AddForm.patchValue({
          Image: null
        });
      }
    });
  }
  //   deleteImg(hotelId: any) {
  //     var storage = getStorage();
  //     const storageRefDel = ref(storage, 'hotels/' + hotelId);

  //     listAll(storageRefDel)
  //       .then((list: any) => {
  //         list.items.forEach((fileRef: any) => {
  //           deleteObject(fileRef)
  //             .then(() => {
  //               console.log('success');
  //             })
  //             .catch((err: any) => {
  //               console.log(err);
  //             });
  //         });
  //       })
  //       .catch((err: any) => {
  //         console.log(err);
  //       });
  //   }
}
function Collection(firestore: Firestore, arg1: string) {
  throw new Error('Function not implemented.');
}
