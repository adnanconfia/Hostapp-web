import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadString } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  data:any;
  EditForm: any= FormGroup
  constructor(private title: Title, private route: ActivatedRoute, private firestore:Firestore,private auth:Auth,private fb:FormBuilder,private router:Router) { }
  profilePic: any={id:"", src:""}
  newImage:any;
  services:any[]=[]
   async ngOnInit(){
    this.title.setTitle("Update User")
   await this.route.queryParams.subscribe(async (params)=>{
      this.EditForm= this.fb.group({
        username:["", Validators.required],
        profile_pic:[""],
        serviceId: ["", Validators.required]
  
      })

      if(params['id']){
      
         await this.getData(params['id'])
         this.EditForm= this.fb.group({
          username:[this.data.name, Validators.required],
          profile_pic:[this.data.imageUrl],
          serviceId: [this.data.serviceId, Validators.required]
          
        })
         
      }
      
    })
  

  //  console.log(this.data)
  }


  async submit(){
    if (this.EditForm.invalid) {
      Swal.fire({
        title: "Alert",
        text: "Please fill all fields",
        icon: "warning"
      })

    }
    else {
   var data= this.EditForm.value;
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
                serviceId: data["serviceId"],
                name: data["username"],
                imageUrl: imgUrl

              }).then((resp: any) => {
                Swal.fire({
                  title: "Success",
                  text: "User updated successfully",
                  icon: "success"
                })

                Loader.isLoading = false;
                this.router.navigateByUrl("/account/users");
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
        serviceId:data["serviceId"],
        name: data["username"],
      }).then((resp: any) => {
        Swal.fire({
          title: "Success",
          text: "User updated successfully",
          icon: "success"
        })

        Loader.isLoading = false;
        this.router.navigateByUrl("/account/users")
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
  async getData(id:any){
    Loader.isLoading=true;
    // Getting and saving data of user.
    var userRef = collection(this.firestore, "administrators")
    var q = query(userRef, where("id","==",id))
    var qsnap = await getDocs(q);
    this.data = qsnap.docs[0].data()
    // Getting services of hotel
    var serviceRef = collection(this.firestore, "hotels/"+this.data.hotelId+"/services")

    getDocs(serviceRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
       // console.log(doc.id, " => ", doc.data());
     
       var obj = {"id":doc.data()['id'], "name":doc.data()['name']}
       this.services.push(obj);
      });
    });

    const storage = getStorage();
    const list_ref = ref(storage, 'users/'+this.data.id);
    var urlRef:any;
    await listAll(list_ref)
      .then((res) => {
        urlRef = res.items[0]
      //  console.log(res.items[0]);
      }).catch((error) => {
        // Uh-oh, an error occurred!
        Loader.isLoading=false;
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
            Loader.isLoading=false;
            console.log(error)
          });
        }
        Loader.isLoading=false;
    // // Getting Hotel Id against user
    // var hotelRef = collection(this.firestore, 'hotels')
    // var q = query(hotelRef, where('id','==',this.data.hotelId))
    // var hotellist=await getDocs(q);
    // hotellist.docs.forEach((doc)=>{
    //  // console.log(doc.data())
    // })
    // Getting services for hotel
    
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
}
