
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Loader } from 'src/app/helpers/loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {
  data:any=[];
  columns:any=[];
  constructor(private title:Title,private firestore:Firestore,private router:Router) { }
  async getData(){
    Loader.isLoading=true;
    this.data = [];
    var hotelRef = collection(this.firestore, "hotels")
    var q = query(hotelRef,where("isDeleted","==",false));
    // var q = query(hotelRef);
    var qSnap = await getDocs(q);
    qSnap.docs.forEach(async (doc: any) => {
     var d = doc.data();
     var _date = new Date(d['createdAt'])
     d['createdAt'] = _date
      this.data.push(d);
    })
    this.data.sort((a:any,b:any)=>{
      return b.createdAt - a.createdAt
    })
    // console.log(this.data);
    Loader.isLoading=false;
  }
  ngOnInit(): void {
    this.getData();
    this.title.setTitle("Hotels");
    this.columns = [
      { field: 'name', header: 'Name', type: "text" },
      { field: 'location', header: 'Location', type: "text" },
      { field: 'description', header: 'Description', type: "text" },
      { field: 'pricePerGuest', header: 'Price Per Guest', type: "text" },
      { field: 'pricePerRoom', header: 'Price Per Room', type: "text" },
      { field: 'vat', header: 'VAT', type: "text" },
      { field: 'rating', header: 'Rating', type: "text" },
      { field: 'photo', header: 'Avatar', type: "profilePic" },
      { field: 'createdAt', header: 'Creation Date', type: "date" },
      { field: 'action', header: 'Action', type: "action" },
    ]
  }
  delete(e: any) {
    Swal.fire({
      title: 'Notice',
      text: 'Do you really want to remove this hotel?',
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
          'hotels/' + e.id
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

        var ref = collection(this.firestore, "administrators");

        var q = query(ref, where("hotelId", "==", e.id));

        var qSnap = await getDocs(q);
        await qSnap.forEach(async (_doc) => {
          var data = _doc.data();
          var serviceDocRef = doc(
            this.firestore,
            'administrators/' + data['id']
          );
          await updateDoc(serviceDocRef, {
            hotelId: ""
          }).then(() => {
            

          }).catch((err: any) => {

            Loader.isLoading = false;
          });
        })

      }
    });
  }
  create(){
    this.router.navigateByUrl("/account/hotels/create");
  }
  update(e:any){
    this.router.navigateByUrl("/account/hotels/update?id="+e.id);
  }

}
