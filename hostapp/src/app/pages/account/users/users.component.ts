import {
  Firestore,
  addDoc,
  collectionData,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  setDoc,
  getDoc
} from '@angular/fire/firestore';
import { Loader } from './../../../helpers/loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/helpers/user';
import { getAll } from '@angular/fire/remote-config';
import Swal from 'sweetalert2';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { getDownloadURL, getStorage, ref, uploadString } from '@angular/fire/storage';
import { type } from 'os';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public showAddUserForm: boolean = false;
  AddUserForm!: FormGroup;
  UpdateForm!: FormGroup;
  cols: any = [];
  public users: any;
  public roleIdManager: any;
  public roleIdWorker: any;
  public roleIdAdmin: any;
  services: any = []

  constructor(private fb: FormBuilder, private firestore: Firestore, private auth: Auth, private router: Router) { }
  ngOnInit(): void {
    this.AddUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      userrole: ['', Validators.required],
      serviceId: ['', Validators.required],
      profile_pic: [''],
      password: ['', Validators.required]
    });
    this.cols = [
      { header: 'User Name', field: 'name', type: 'text' },
      { header: 'Role', field: 'role', type: 'text' },
      { header: 'Email', field: 'email', type: 'text' },
      { header: 'Is Active', field: 'isActive', type: "status" },
      { header: 'Picture', field: 'imageUrl', type: "profilePic" },
      { header: 'Action', field: 'Action', type: "action" }
    ];
    this.users = [
      // {
      //   UserName: 'JohnDoe',
      //   Email: 'john.doe@example.com',
      //   Role: 'Worker',
      //   isActive: true
      // },
      // {
      //   UserName: 'JaneSmith',
      //   Email: 'jane.smith@example.com',
      //   Role: 'Worker',
      //   isActive: false
      // },
      // {
      //   UserName: 'BobJohnson',
      //   Email: 'bob.johnson@example.com',
      //   Role: 'Worker',
      //   isActive: true
      // },
      // {
      //   UserName: 'SaraLee',
      //   Email: 'sara.lee@example.com',
      //   Role: 'Worker',
      //   isActive: true
      // }
    ];

  }



  async selectedRole(role: string, event: any) {
    Loader.isLoading=true
    //---- Fetching Services ---- //
    let servicesList:any[]=[]
        // Hotel ID
        let hotelId = User.hotel;
        const hotelRef = doc(this.firestore, 'hotels', hotelId);
        // Getting subcollection of hotel
        const subCollectionRef = collection(hotelRef, 'services');
        const subcollectionDocs = await getDocs(subCollectionRef);
        // List of services
        subcollectionDocs.forEach((doc) => {
          var data = doc.data()
          servicesList.push(data)
        })
    // --- End fetching services ----//
    // Fetching Users 
    let userRef = collection(this.firestore, "administrators");
    let q = query(userRef, where("hotelId", "==", User.hotel))
    let data = await getDocs(q);
    let userList: any[] = []
    data.docs.map((item) => {
      var curr = item.data()
      userList.push(curr);
    })

    if (role === "Manager") {
      let SelectedRoleId = this.roleIdManager;
      let CurrentUserHotelId = User.hotel;
      // Users with Manager Role
      let newlist = userList.filter((item) => item.roleId === SelectedRoleId)
      // Checking if their exist a manager against each service
      const filteredServices = servicesList.filter((service) => {
        return !userList.some((user) => user.serviceId === service.id && user.roleId===this.roleIdManager);
      });
      this.services=[]
      filteredServices.map((item)=>{
        this.services.push(item)
      })
      this.AddUserForm.get('serviceId')?.setValue('')
      // console.log("Value is : ",  this.AddUserForm.get('serviceId')?.value)
      

      // let userRef = collection(this.firestore, "administrators")
      // let Qry = query(userRef, where("hotelId", "==", CurrentUserHotelId), where("roleId", "==", SelectedRoleId), where("isDeleted", "==", false))
      // let res = await getDocs(Qry);
      // console.log(res.docs.length)

    }
    if (role === "Worker") {
      let SelectedRoleId = this.roleIdWorker;
      let CurrentUserHotelId = User.hotel;
      // Worker Role Filter
      this.services=[]
      servicesList.map((item)=>{
        this.services.push(item)
      })
      this.AddUserForm.get('serviceId')?.setValue('')
      // console.log("Value is : ",  this.AddUserForm.get('serviceId')?.value)


      
      // let userRef = collection(this.firestore, "administrators")
      // let Qry = query(userRef, where("hotelId", "==", CurrentUserHotelId), where("roleId", "==", SelectedRoleId), where("isDeleted", "==", false))
      // let res = await getDocs(Qry);
      // console.log(res.docs.length)


    }
    Loader.isLoading=false
  }

  async getAllUsers() {
    Loader.isLoading = true;
    // Getting Roles
    var ref = collection(this.firestore, "roles");
    var roles = await getDocs(ref);
    let rolesList: any[] = []
    roles.forEach((doc) => {
      var data = doc.data()
      rolesList.push(data)
    })
    console.log(rolesList)
    // Getting data from Administrator table
    const userIns = collection(this.firestore, 'administrators');

    var q = query(userIns, where("isDeleted", "==", false), where("hotelId", "==", User.hotel));
    let qSnap = await getDocs(q);
    let userList: any = []
    qSnap.forEach((doc) => {
      var data = doc.data()
      data['role'] = rolesList.find((r) => r.roleId === data['roleId']).name;
      if (data['role'] === "Worker" || data['role'] === "Manager") { userList.push(data) }
    })

    this.users = userList
    Loader.isLoading = false;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getDataRoleId();
      this.getAllUsers();
    }, 3500);
  }
  async onSubmit() {

    var id: any = 0;
    try {
      if (this.AddUserForm.invalid) {
        Swal.fire({
          title: "Alert",
          text: "Please fill all fields",
          icon: "warning"
        })
      }
      else {
        Loader.isLoading = true;
        var data = this.AddUserForm.value;
        var payLoad = {
          id: "",
          isActive: true,
          email: data["email"],
          name: data["username"],
          hotelId: User.hotel,
          createdAt: (new Date()).getTime(),
          serviceId: data['serviceId'],
          imageUrl: "",
          fcmToken: "",
          roleId: data['userrole'] == 1 ? this.roleIdManager : this.roleIdWorker,
          isDeleted: false
        }
        Loader.isLoading = true;
        let check = false;
        // Creating User Account
        await createUserWithEmailAndPassword(this.auth, data['email'], data['password']).then((resp) => {
          id = resp.user.uid
          check = true
        }).catch((err: any) => {
          console.log(err)
          Swal.fire({
            title: "Alert",
            text: "Something is not right" + err,
            icon: "error"
          })
          Loader.isLoading = false;
          check = false;
        })
        if (check) {
          payLoad.id = id

          // Uploading Picture
          if (data['profile_pic']) {
            var storage = getStorage()
            var storageRef = ref(storage,
              'users/' + id + '/' + new Date().getTime() + '.png');
            await uploadString(storageRef, data['profile_pic'], 'data_url')
              .then(snapshot => {
                getDownloadURL(storageRef).then((resp: any) => {
                  data['profile_pic'] = resp
                });
              })
              .catch((err: any) => {
                Loader.isLoading = false;
                console.log(err);
              })
            payLoad['imageUrl'] = data['profile_pic']
          }
          var userRef = doc(this.firestore, 'administrators/' + id + "/");
          await setDoc(userRef, payLoad).then((resp) => {
            Swal.fire({
              title: "Success",
              text: "User created successfully",
              icon: "success"
            })
            Loader.isLoading = false
            this.showAddUserForm = false
            this.getAllUsers()
          }).catch((err: any) => {
            Loader.isLoading = false;
          });
        }
      }
    }
    catch (err: any) {
      Loader.isLoading = false;
    }
    // if (this.AddUserForm.valid) {
    //   var data = this.AddUserForm.value;
    //   console.log(data);
    //   let dataform: any = {};
    //    let name =
    //     this.AddUserForm.controls['firstname'].value +
    //     this.AddUserForm.controls['lastname'].value;
    //     dataform.name = name;
    //     dataform.email = this.AddUserForm.controls['email'].value;
    //     if (this.AddUserForm.controls['userrole'].value == 1) {
    //       dataform.roleId = this.roleIdManager;
    //     }
    //     if (this.AddUserForm.controls['userrole'].value == 2) {
    //       dataform.roleId = this.roleIdWorker;
    //     }
    //     dataform.serviceId = this.AddUserForm.controls['serviceId'].value
    //     dataform.isActive=true;
    //     dataform.hotelId=User.hotel;
    //     dataform.fcmToken="";
    //     dataform.imageUrl=""
    //     console.log(dataform)
    //     Loader.isLoading = true;
    //     const collectionInstance = collection(this.firestore, 'administrators');

    //     addDoc(collectionInstance, dataform)
    //     .then(() => {
    //       Loader.isLoading = false;
    //       console.log('Data saved successfully');
    //       this.getAllUsers()
    //     })
    //     .catch(err => {
    //       Loader.isLoading = false;
    //       console.log(err);
    //     });
    // // } else {
    // //   this.AddUserForm.markAllAsTouched();
    // // }
    // }
  }
  async showForm() {
    this.showAddUserForm = !this.showAddUserForm;

    // Clearing dropdown and form
    this.services = []
    this.AddUserForm = this.fb.group({
      username: ['', Validators.required],

      email: ['', [Validators.email, Validators.required]],
      userrole: ['', Validators.required],
      serviceId: ['', Validators.required],
      profile_pic: [''],
      password: ['', Validators.required]
    });
    // Hotel ID
    let hotelId = User.hotel;
    const hotelRef = doc(this.firestore, 'hotels', hotelId);
    // Getting subcollection of hotel
    const subCollectionRef = collection(hotelRef, 'services');
    const subcollectionDocs = await getDocs(subCollectionRef);
    // List of services
    subcollectionDocs.forEach((doc) => {
      var data = doc.data()
      //this.services.push(data)
    })

  }
  getDataRoleId() {
    const collectionInstance = collection(this.firestore, 'roles');
    collectionData(collectionInstance).subscribe(
      (resp: any) => {

        resp.map((role: any) => {
          if (role.name === "Worker") {

            this.roleIdWorker = role.roleId;
          }
          if (role.name === "Manager") {

            this.roleIdManager = role.roleId;
          }
        })
        // console.log(roleIdManager);
      },
      error => {
        console.log(error);
      }
    );
  }
  update(e: any) {
    this.router.navigateByUrl("/account/users/edit?id=" + e.id);
  }

  deleteUser(e: any) {
    //alert(e.id)
    Swal.fire({
      title: 'Notice',
      text: 'Do you really want to remove this user?',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (Resp: any) => {
      if (Resp.value) {
        Loader.isLoading = true;
        var serviceDocRef = doc(
          this.firestore,
          'administrators/' + e.id
        );
        await updateDoc(serviceDocRef, {
          isDeleted: true
        }).then(() => {
          Swal.fire({
            title: "Success",
            text: "User removed successfully",
            icon: "success"
          })
          this.getAllUsers();

        }).catch((err: any) => {

          Loader.isLoading = false;
        });

      }
    });
    // const userDeleteIns = doc(this.firestore, 'users', id);
    // deleteDoc(userDeleteIns)
    //   .then(() => {
    //     console.log('User deleted');
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
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
        this.AddUserForm.patchValue({
          profile_pic: null
        });
      }
    });
  }

  onProfilePicSelected(event: any) {

    // this.selectedProfilePic = event.target.files[0];
    let files = event.target.files[0];
    // console.log(file);
    if (files) {

      const reader = new FileReader();

      reader.onload = (e: any) => {
        var croppedImage = e.target.result;
        // console.log(croppedImage);
        this.AddUserForm.patchValue({
          profile_pic: croppedImage
        });
      };
      // this.previews.push()

      reader.readAsDataURL(files);

    }

    // reader.readAsDataURL(this.selectedImage);
  }

}
