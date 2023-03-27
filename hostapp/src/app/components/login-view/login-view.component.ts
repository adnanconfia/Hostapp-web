import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {
  _showpass = false;
  apple=faApple
  showPass() {
    this._showpass = true;
  }
  hidePass() {
    this._showpass = false;
  }
  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl(''),
      password: new FormControl('')
    }
  );
  constructor(private authService:AuthService,private fb:FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", Validators.required],
    })
    this.authService.checkToken().then((resp:any)=>{
      var check =resp;
    
      if (check == true) {
        this.router.navigateByUrl("/account/dashboard");
      }
    });
   
  }
  login(){
    if(this.loginForm.invalid){
      Swal.fire({
        title: "Alert",
        icon: "warning",
        text: "Please fill all the fields"

      });
    }else{
      var email = this.loginForm.get("email")?.value;
      var password = this.loginForm.get("password")?.value;
      this.authService.login(email,password);
    }
  }
}
