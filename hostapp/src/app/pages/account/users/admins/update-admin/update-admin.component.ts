import { Auth, getAuth } from '@angular/fire/auth';

import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import { environment } from 'src/environments/environment';
import { initializeApp } from '@angular/fire/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadString } from '@angular/fire/storage';

@Component({
  selector: 'app-update-admin',
  templateUrl: './update-admin.component.html',
  styleUrls: ['./update-admin.component.scss']
})
export class UpdateAdminComponent implements OnInit {

  AddForm: any = FormGroup
  hotels: any = []
  data:any;
  constructor(private title: Title, private route: ActivatedRoute, private firestore:Firestore,private auth:Auth,private fb:FormBuilder,private router:Router) { }
  profilePic:any={id:"",src:""};
  newImage:any;
  async getData(id:any){
    Loader.isLoading=true;
    var _ref = collection(this.firestore, "administrators");

    var q = query(_ref, where("id", "==", id));

    var qSnap = await getDocs(q);
    this.data = qSnap.docs[0].data();
    _ref = collection(this.firestore, "administrators");

    q = query(_ref, where("roleId", "==", this.data.roleId));

    qSnap = await getDocs(q);
    // console.log(qSnap.docs.length);
  
    var hotel_ref = collection(this.firestore, "hotels")
    var hotelIds: any = [];
    qSnap.docs.forEach((doc: any) => {
      hotelIds.push(doc.data().hotelId);
    })
    var _q = query(hotel_ref, where("isDeleted", "==", false));
    var _qSnap = await getDocs(_q);
    _qSnap.docs.forEach((doc: any) => {
      if (hotelIds.indexOf(doc.data().id) < 0 || doc.data().id==this.data.hotelId) {
        this.hotels.push(doc.data());
      }
      
      // console.log(doc.data());
    })

    const storage = getStorage();

    // Create a _reference under which you want to list
    const list_ref = ref(storage, 'users/'+this.data.id);

    // Find all the p_refixes and items.
    var urlRef:any;
    await listAll(list_ref)
      .then((res) => {
        urlRef = res.items[0]
      //  console.log(res.items[0]);
      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error)
      });
    if(urlRef){
    getDownloadURL(urlRef)
      .then((url) => {
        this.profilePic.src=url;
        this.profilePic.id=urlRef
        // Insert url into an <img> tag to "download"
      })
      .catch((error) => {
        console.log(error)
      });
    }
    this.AddForm.patchValue({
      profile_pic: this.data.imageUrl,
      username:this.data.name,
      email:this.data.email,
      hotelId:this.data.hotelId
    });
    Loader.isLoading=false;
   

  }
  async ngOnInit() {
    this.title.setTitle("Update Admin");
    await this.route.queryParams.subscribe((params: any) => {
      // Defaults to 0 if no query param provided.
      this.AddForm = this.fb.group({

        username: ["", Validators.required],
        profile_pic: [""],
        email: [{ value: "", disabled: true }, [Validators.required]],
        hotelId: ["", Validators.required]
      });
    
      if (params['id']) {
        this.getData(params['id']);
      }
    });
  }
  async submit(){
    if (this.AddForm.invalid) {
      Swal.fire({
        title: "Alert",
        text: "Please fill all fields",
        icon: "warning"
      })

    }
    else {
   var data= this.AddForm.value;
   Loader.isLoading=true;
      if(this.newImage){
        var storage = getStorage();
        var storageRef = ref(
          storage,
          'users/' + this.data.id + '/' + new Date().getTime() + '.png'
        );
        var imgUrl :any;
        await uploadString(storageRef, this.newImage, 'data_url')
          .then(snapshot => {
            // console.log('Uploaded a data_url string!',snapshot);
            getDownloadURL(storageRef).then(async (resp: any) => {
              imgUrl = resp
              var serviceDocRef = doc(
                this.firestore,
                'administrators/' + this.data.id
              );
              await updateDoc(serviceDocRef, {
                hotelId: data["hotelId"],
                name: data["username"],
                imageUrl: imgUrl

              }).then((resp: any) => {
                Swal.fire({
                  title: "Success",
                  text: "Admin updated successfully",
                  icon: "success"
                })

                Loader.isLoading = false;
                this.router.navigateByUrl("/account/admins");
              }).catch((err: any) => {
                Swal.fire({
                  title: "Alert",
                  text: "Something is not right",
                  icon: "error"
                })

                Loader.isLoading = false;
              });
            });
          })
          .catch((err: any) => {
            Loader.isLoading = false;
            console.log(err);
          });
     
      }else{
      var serviceDocRef = doc(
        this.firestore,
        'administrators/' + this.data.id 
      );
      await updateDoc(serviceDocRef, {
        hotelId:data["hotelId"],
        name: data["username"],
       
        
      }).then((resp: any) => {
        Swal.fire({
          title: "Success",
          text: "Admin updated successfully",
          icon: "success"
        })

        Loader.isLoading = false;
        this.router.navigateByUrl("/account/admins")
      }).catch((err: any) => {
        Swal.fire({
          title: "Alert",
          text: "Something is not right",
          icon: "error"
        })

        Loader.isLoading = false;
      });
    }
    }
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
        this.newImage=croppedImage;
      };
      // this.previews.push()

      reader.readAsDataURL(files);

    }

    // reader.readAsDataURL(this.selectedImage);
  }
  removeProfilePic(e:any) {
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
        if(e!=0){
        var storage = getStorage();
        deleteObject(e).then(async () => {
          this.profilePic.src = null;
          this.profilePic.id = null;
          this.newImage = null;
          var serviceDocRef = doc(
            this.firestore,
            'administrators/' + this.data.id
          );
          await updateDoc(serviceDocRef, {
            imageUrl: ""

          });
          this.getData(this.data.id);
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
      }else{
          this.profilePic.src = null;
          this.profilePic.id = null;
          this.newImage = null;
      }
      }
    });
  }
}
