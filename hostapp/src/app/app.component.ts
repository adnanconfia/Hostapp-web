import { Component, OnInit } from '@angular/core';
import { Loader } from './helpers/loader';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hostapp';
  loader=Loader
  constructor(private router:Router){

  }
  ngOnInit(){
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {

        Loader.isLoading = false;
      }

    });
  }
}
