import { Loader } from './../helpers/loader';


import { environment } from './../../environments/environment';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd, RoutesRecognized } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, shareReplay, filter, pairwise, finalize, map } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { User } from '../helpers/user';

@Injectable()
export class AuthService {

 
  isBrowser:boolean;
  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) platformId: Object, public afAuth: Auth, private firestore: Firestore) {
    this.isBrowser = isPlatformBrowser(platformId)
   }

  private setSession(authResult:any) {
   if(this.isBrowser && authResult.data.status==0){
    const token = authResult.res.token;

    // if (authResult['isDelete'] == true || authResult['isActive'] == false || authResult['isVerified'] == false) {
    //   this.logout();
    // } else {






    }
  // }
  }

  get token() {
    if(this.isBrowser){return localStorage.getItem('token');}
    return null;
  }

  login(Email: any, password: any) {
   if(this.isBrowser){ 
 
     signInWithEmailAndPassword(this.afAuth, Email,password).then(value => {
      console.log(value.user);
       console.log(value.user?.uid)
       this.router.navigateByUrl('/account/dashboard')

     }).catch(err => {
       Swal.fire('alert', 'Something went wrong: ' + err.message, 'error');
 
       Loader.isLoading= false;
     });
   
}
return null;
  }

  //   signup(username: string, email: string, password1: string, password2: string) {
  //     // TODO: implement signup
  //   }

  logout() {
  signOut(this.afAuth).then((resp:any)=>{
    console.log(resp,"signout");
    User.isLoggedin=false;
    this.router.navigateByUrl("/login");
  },(err:any)=>{
    console.log(err)
  })

  }



  async checkToken() {
//  if(this.isBrowser){
    var check = true;

    authState(this.afAuth).subscribe(async (_user: any) => {
      if (_user) {
        console.log(_user.uid)
        var _collection = collection(this.firestore, "users");

        await collectionData(_collection).subscribe((resp: any) => {
       
          resp = resp.filter((x: any) => x.id == _user.uid);
          User.email = resp[0].email
          User.name = resp[0].name
          User.id = resp[0].id
          User.isLoggedin = true;
          check=true;
          // user.Email = resp[0].email;
          // user.FirstName = resp[0].firstName;
          // user.Id = _user.uid;
          Loader.isLoading = false;
          console.log(User);
        },(err: any) => {
          console.log(err);
          check = false;
          Loader.isLoading = false;
        });


    
      } else {
        check = false;
        Loader.isLoading = false;

      }
    },(err:any)=>{
      console.log(err);
      check = false;
      Loader.isLoading = false;
    })

    Loader.isLoading = true;

    Loader.isLoading = false;

    
    return check;
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
  isBrowser:boolean
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute,@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId)
   }


  is_valid = true;

  async canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    await this.authService.checkToken().then(success => {

      this.is_valid = success

    }).catch(error => {
      this.authService.logout();

      this.router.navigate(['login']);

    })


    // if(this.isBrowser) {
      if (this.is_valid ) {

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

