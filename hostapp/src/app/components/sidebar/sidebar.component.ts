import { User as u } from './../../helpers/user';
import { Router } from '@angular/router';
import { Auth, User, signOut } from '@angular/fire/auth';
import { Loader } from './../../helpers/loader';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  urlComplete;
  constructor(private authService: AuthService, private router: Router, private afAuth: Auth) { 
    var path = (window.location.pathname.split("/"))

    this.urlComplete = path;
  }
  user=u;
  ngOnInit(): void {
  }
  logout(){
    Loader.isLoading=true;
    signOut(this.afAuth).then((resp: any) => {

      this.router.navigateByUrl("login")
      u.isLoggedin = false;
    });
  }
}
