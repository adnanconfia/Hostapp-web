import { Firestore, addDoc, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser, getAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Loader } from 'src/app/helpers/loader';
import { ref, uploadString, getDownloadURL, getStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {
AddForm:any=FormGroup
  constructor(private fb: FormBuilder,private auth:Auth,private firestore:Firestore,) { }
  _showpass = false;
  showPass() {
    this._showpass = true;
  }
  hidePass() {
    this._showpass = false;
  }
  roleId:any;
  hotels:any=[]
  async getData(){
    Loader.isLoading=true;
    var ref = collection(this.firestore, "roles");

    var q = query(ref, where("name", "==", "Admin"));

    var qSnap = await getDocs(q);
    this.roleId = qSnap.docs[0].data()["roleId"]


    ref = collection(this.firestore, "administrators");

    q = query(ref, where("roleId", "==", this.roleId));

    qSnap = await getDocs(q);
    // console.log(qSnap.docs.length);

    var hotelRef = collection(this.firestore, "hotels")
    var hotelIds:any=[];
    qSnap.docs.forEach((doc: any) => {
      hotelIds.push(doc.data().hotelId);
    })
    var _q = query(hotelRef,where("isDeleted","==",false));
    var _qSnap = await getDocs(_q);
    _qSnap.docs.forEach((doc:any)=>{
      if (hotelIds.indexOf(doc.data().id)<0){
        this.hotels.push(doc.data());
      }
      // console.log(doc.data());
    })
    Loader.isLoading=false;
  }
  ngOnInit(): void {
    this.AddForm = this.fb.group({
     
      username: ['', Validators.required],
      profile_pic: [''],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      hotelId: ['', Validators.required]
    });
    this.getData();
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
          this.AddForm.patchValue({
            profile_pic: croppedImage
          });
        };
        // this.previews.push()

        reader.readAsDataURL(files);
      
    }
    
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
          profile_pic: null
        });
      }
    });
  }
  async submit(){
    var id: any = 0
   try{
     if (this.AddForm.invalid) {
       Swal.fire({
         title: "Alert",
         text: "Please fill all fields",
         icon: "warning"
       })

     }
     else {
       Loader.isLoading = true;
       var data = this.AddForm.value
       var payLoad = {
         id: "",
         isActive: true,
         email: data["email"],
         name: data["username"],
         hotelId: data["hotelId"],
         createdAt: (new Date()).getTime(),
         serviceId: "",
         imageUrl: "",
         fcmToken: "",
         roleId:this.roleId,
         isDeleted:false
       }
       var id: any = 0
       var check = false;
       await createUserWithEmailAndPassword(this.auth, data["email"], data["password"]).then((resp) => {

         id = resp.user.uid
         check = true;

       }).catch((err: any) => {
         console.log(err);
         Swal.fire({
           title: "Alert",
           text: "Something is not right" + err,
           icon: "error"
         })
         Loader.isLoading = false;
         check = false;
       })
       if (check) {
         console.log(id);

         payLoad.id = id;

         if (data['profile_pic']){
         var storage = getStorage();

         var storageRef = ref(
           storage,
           'users/' + id + '/' + new Date().getTime() + '.png'
         );
         await uploadString(storageRef, data['profile_pic'], 'data_url')
           .then(snapshot => {
             // console.log('Uploaded a data_url string!',snapshot);
             getDownloadURL(storageRef).then((resp: any) => {
               data['profile_pic'] = resp
             });
           })
           .catch((err: any) => {
             Loader.isLoading = false;
             console.log(err);
           });
         payLoad["imageUrl"] = data['profile_pic'];
          }
          var self=this;
         var userRef = doc(this.firestore, 'administrators/' + id + "/");
         await setDoc(userRef, payLoad).then(resp => {
           Swal.fire({
             title: "Success",
             text: "Admin created successfully",
             icon: "success"
           })
          window.location.href="/account/admins"

          
         }).catch((err: any) => {
           Loader.isLoading = false;
         });
       }
     }
   }catch(err:any){
    Loader.isLoading=false
     console.log(err);
   }
  }
}
