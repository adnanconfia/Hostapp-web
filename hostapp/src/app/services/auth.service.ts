import { Loader } from './../helpers/loader';


import { environment } from './../../environments/environment';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd, RoutesRecognized } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, shareReplay, filter, pairwise, finalize, map } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import { Auth, authState, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, collection, collectionData, getDocs, query, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { User } from '../helpers/user';

@Injectable()
export class AuthService {


  isBrowser: boolean;
  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) platformId: Object, public afAuth: Auth, private firestore: Firestore,) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  private setSession(authResult: any) {
    if (this.isBrowser && authResult.data.status == 0) {
      const token = authResult.res.token;

      // if (authResult['isDelete'] == true || authResult['isActive'] == false || authResult['isVerified'] == false) {
      //   this.logout();
      // } else {






    }
    // }
  }

  get token() {
    if (this.isBrowser) { return localStorage.getItem('token'); }
    return null;
  }

  async login(Email: any, password: any,_check:any=false){
    // if (this.isBrowser) {
      Loader.isLoading = true;
      var check = false;
        await signInWithEmailAndPassword(this.afAuth, Email, password).then(async value => {
        // console.log(value.user);
        var id = value.user?.uid
       
        
        var ref = collection(this.firestore, "administrators");
       
        var q = query(ref,where("id","==",id));
       
      var  qSnap = await getDocs(q);
        var roleId = "";
        qSnap.forEach((doc)=>{
         roleId =  doc.data()["roleId"];
         if(doc.data()['isActive']==false){
          Swal.fire({
            text:"Account is inactive",
            icon:"error",
            showConfirmButton:true
          }).then((resp:any)=>{
            // this.logout();
          })
       
         }
        })
      
          var ref = collection(this.firestore, "administrators");
          console.log(ref)
          var q = query(ref, where("id", "==", id));
          console.log(q)
          var qSnap = await getDocs(q);
          var roleId = "";
          qSnap.forEach((doc) => {
            var data = doc.data();
            roleId = data["roleId"];
            User.roleId = roleId;
            User.name = data['name']
            User.email = data['email']
            User.isActive = data['isActive'];

            User.serviceId = data['serviceId'];
            User.imageUrl = data['imageUrl'];

            User.hotel = data['hotelId'];
            //  if( User.isActive==false){
            //   this.logout();
            // }

          })
          ref = collection(this.firestore, "roles");

          q = query(ref, where("roleId", "==", roleId));

          qSnap = await getDocs(q);
          var roleName = "";
          qSnap.forEach((doc) => {
            roleName = doc.data()["name"];
            User.roleName = roleName;
          })
        if(roleName.toLowerCase()!="admin" && roleName.toLowerCase()!="super admin"  && roleName.toLowerCase()!="manager"){
          this.logout();
        }else{
          if(_check==false){
          this.router.navigateByUrl("/account/dashboard");
          localStorage.setItem("email",Email);
          localStorage.setItem("pass",password);
          }
        }
        Loader.isLoading=false
      }).catch(err => {
        Swal.fire('alert', 'Something went wrong: ' + err.message, 'error');
        Loader.isLoading = false;
        this.logout();
       
      });

    // }
  }

  //   signup(username: string, email: string, password1: string, password2: string) {
  //     // TODO: implement signup
  //   }

  async logout() {
   await signOut(this.afAuth).then((resp: any) => {
      console.log(resp, "signout"); 
      User.isLoggedin = false;
      // this.router.navigateByUrl("/login");
      window.location.reload();
    }, (err: any) => {
      console.log(err)
    })

  }



  async checkToken(){
    //  if(this.isBrowser){

    var self= this;

  var check = false;
  // await authState(self.afAuth).subscribe(async (_user: any) => {
    if (localStorage.getItem("email") && localStorage.getItem("pass")){
    this.login(localStorage.getItem("email"), localStorage.getItem("pass"),true);
    }
//  this.afAuth.onAuthStateChanged(async (user:any)=>{
//   if(user){
//     this.login(localStorage.getItem("email"), localStorage.getItem("pass"));
//     var id=user.uid;
//     User.id = id;
 
//   var ref = collection(this.firestore, "administrators");
//   console.log(ref)
//   var q = query(ref,where("id","==",id));
//   console.log(q)
//   var  qSnap = await getDocs(q);
//   var roleId = "";
//   qSnap.forEach((doc)=>{
//     var data =  doc.data();
//    roleId = data["roleId"];
//    User.roleId = roleId;
//    User.name =data['name']
//    User.email =data['email']
//    User.isActive =data['isActive'];
   
//    User.serviceId =data['serviceId'];
//    User.imageUrl =data['imageUrl'];
   
//    User.hotel =data['hotelId'];
//   //  if( User.isActive==false){
//   //   this.logout();
//   // }

//   })
//    ref = collection(this.firestore, "roles");
 
//   q = query(ref,where("roleId","==",roleId));
 
//    qSnap = await getDocs(q);
//   var roleName = "";
//   qSnap.forEach((doc)=>{
//     roleName =  doc.data()["name"];
//     User.roleName=roleName;
//   })

//   // if(roleName.toLowerCase()!="admin" && roleName.toLowerCase()!="super admin"  && roleName.toLowerCase()!="manager" ){
         
//   //   this.logout();
//   // }
  
//   return true;
//   }else{
//     return false;
//   }
//  })
    
// })
  // await authState(self.afAuth).subscribe(async (_user: any) => {
  
  //     if (_user) {
  //     console.log(_user)
     
  //       Promise.resolve(check);

  //     } else {
  //       check = false;
  //       Loader.isLoading = false;

  //     }
  //      console.log(check)
  //      Promise.resolve(check);
  //   }, (err: any) => {
  //     console.log(err);
  //     check = false;
     
  //     Loader.isLoading = false;
  //     console.log(check)
  //     Promise.resolve(check);
  //   })
    // }
  
  }
}

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   isBrowser:boolean;
//   constructor(@Inject(PLATFORM_ID) platformId: Object){
//     this.isBrowser = isPlatformBrowser(platformId)
//   }
//   private logRequestTime(startTime: number, url: string, method: string) {
//     const requestDuration = `${performance.now() - startTime}`;

//   }
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   //  if(this.isBrowser){
//      const token = localStorage.getItem('token');

//     if (token) {
//       const cloned = req.clone({
//         headers: req.headers.set('Authorization', 'Bearer '.concat(token))
//       });

//       const begin = performance.now();

//       return next.handle(cloned).pipe(
//         finalize(() => {
//           this.logRequestTime(begin, req.url, req.method);

//         })
//       )
//     } else {


//       return next.handle(req).pipe(map(event => {
//         if (event instanceof HttpResponse) {

//         }
//         return event;
//     }));
//     }}
//   // }
// }


@Injectable()
export class AuthGuard implements CanActivate {
  isBrowser: boolean
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId)
  }


  is_valid = true;

  async canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    await this.authService.checkToken().then((success:any) => {

      this.is_valid = success

    }).catch(error => {
      this.authService.logout();

      this.router.navigate(['login']);

    })


    // if(this.isBrowser) {
    if (this.is_valid) {

      this.router.events.pipe(
        filter(e => e instanceof RoutesRecognized),
        pairwise(),
      )
        .subscribe((event: any[]) => {
          if (event[0].urlAfterRedirects != '/login' && this.isBrowser) { localStorage.setItem("preUrl", (event[0].urlAfterRedirects)); }
        });


      return true;

    } else {
      this.authService.logout();

      this.router.navigate(['login']);

      return true;
    }
    // }

  }
}

