import { Component, OnInit } from '@angular/core';
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
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    setInterval(()=>{
      this.date=new Date();
    }, 1000)
  }
  logout(){
    this.auth.logout();
  }

}
