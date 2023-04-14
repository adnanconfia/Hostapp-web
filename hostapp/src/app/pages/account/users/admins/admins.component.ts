import { Firestore, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Title } from '@angular/platform-browser';
import { Loader } from 'src/app/helpers/loader';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  constructor(private title: Title, private auth: Auth, private firestore: Firestore,private router:Router) { }
  data: any = [];
  columns: any = [];
  async getData() {
    Loader.isLoading = true;
    this.data=[];
    var ref = collection(this.firestore, "roles");

    var q = query(ref, where("name", "==", "Admin"));

    var qSnap = await getDocs(q);
    var roleId = qSnap.docs[0].data()["roleId"]
  

    ref = collection(this.firestore, "administrators");

    q = query(ref, where("roleId", "==", roleId), where("isDeleted", "==", false));

    qSnap = await getDocs(q);
    await qSnap.forEach(async (doc) => {
      var data = doc.data();
      data["role"] = "Admin";
      
      var _date = new Date(data['createdAt'])
      data['createdAt'] = _date
      this.data.push(data);
    })
    this.data.sort((a: any, b: any) => {
      return b.createdAt - a.createdAt
    })
    this.data.forEach(async (data: any) => {
      if (data["hotelId"]) {
        if (data["hotelId"] != "") {
          var hotelRef = collection(this.firestore, "hotels")
          var _q = query(hotelRef, where("id", "==", data["hotelId"]));
          var _qSnap = await getDocs(_q);
          data["hotelName"] = _qSnap.docs[0].data()["name"];
      
        }
      }
    });
   
    Loader.isLoading = false;
  }
  ngOnInit(): void {
    this.title.setTitle("Admins");
    this.getData();
    this.columns = [
      { field: 'name', header: 'Name', type: "text" },
      { field: 'email', header: 'Email', type: "text" },
      { field: 'role', header: 'Role', type: "text" },
      { field: 'hotelName', header: 'Hotel Name', type: "text" },
      { field: 'imageUrl', header: 'Avatar', type: "profilePic" },
      { field: 'createdAt', header: 'Creation Date', type: "date" },
      { field: 'isActive', header: 'Status', type: "status" },
      { field: 'action', header: 'Action', type: "action" },
    ]
  }
  create(){
    this.router.navigateByUrl("/account/admins/create");
  }
  delete(e: any) {
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
          this.getData();

        }).catch((err: any) => {

          Loader.isLoading = false;
        });

      }
    });
  }

}
