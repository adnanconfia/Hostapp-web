import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Firestore, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { take } from 'rxjs';
import { Loader } from 'src/app/helpers/loader';
import { User } from 'src/app/helpers/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user=User;
  date = new Date();
  notifications:any[]=[]
  constructor(private auth:AuthService,private afMessaging: AngularFireMessaging,private firestore: Firestore ) { }
  
  ngOnInit(): void {
    setInterval(()=>{
      this.date=new Date();
    }, 1000)

          // this.afMessaging.messages
          // .pipe(take(1))
          // .subscribe((message:any) => {
          //   // Handle received message
          //   console.log(message)
          //   let noti = {
          //     serviceId:message.data.serviceId,
          //     title:message.data.title,
          //     description:message.data.description,
          //     receiverId:message.data.receiverId,
          //     senderId:message.data.sendId,
          //     type:message.data.type
            
          //  }
           
          //  this.notifications.push(noti)
          // });

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getData()

    }, 3500);
  }
  async getData(){
    Loader.isLoading=true;
    this.notifications=[]
    let notifications = collection(this.firestore, "notification")
    console.log(User)
    let roleId = doc (this.firestore, "roles/"+User.roleId)
    let snap = await getDoc(roleId)
    let _snap:any = snap.data()
    let _roleId = _snap['name']
    if(_roleId == "Manager"){
      let q = query(notifications, where("serviceId", "==", User.serviceId))
      let data = await getDocs(q)
      data.docs.forEach(async (item)=>{
        let d = item.data()
        let requesterId = d['senderId']
        console.log(requesterId)
        let userName = doc(this.firestore, "users/",requesterId)
        let snap:any = await getDoc(userName)
        let _snap = snap.data()
        d['username']=_snap['name']
        
        this.notifications.push(d)
      })
    }
 
    Loader.isLoading=false
  }
  logout(){
    this.auth.logout();
  }

  async onNotificationClick(event:any){
    let notidoc = doc(this.firestore, "notification/"+ event.id)
    await updateDoc(notidoc, {isRead:true});
    this.getData()
  }

}
