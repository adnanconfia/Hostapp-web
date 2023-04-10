import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public showAddUserForm: boolean = false;
  AddForm!: FormGroup;
  cols: any = [];
  constructor(private fb: FormBuilder) {}
  public users: any;
  ngOnInit(): void {
    this.AddForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      CompanyName: ['', Validators.required],
      Email: ['', [Validators.email, Validators.required]],
      UserRole: ['', Validators.required]
    });
    this.cols = [
      { header: 'User Name' },
      { header: 'Role' },
      { header: 'Eamil' },
      { header: 'Is Active' },
      { header: 'Picture' },
      { header: 'Action' },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.users = [
      {
        UserName: 'JohnDoe',
        Email: 'john.doe@example.com',
        Role: 'Worker',
        isActive: true
      },
      {
        UserName: 'JaneSmith',
        Email: 'jane.smith@example.com',
        Role: 'Worker',
        isActive: false
      },
      {
        UserName: 'BobJohnson',
        Email: 'bob.johnson@example.com',
        Role: 'Worker',
        isActive: true
      },
      {
        UserName: 'SaraLee',
        Email: 'sara.lee@example.com',
        Role: 'Worker',
        isActive: true
      }
    ];
  }
  onSubmit() {
    if (this.AddForm.valid) {
      // var data = this.AddForm.value;
      // // loader.isLoading = true;
      // this.conactService.ContactPost(data).subscribe(
      //   (resp: any) => {
      //     Swal.fire(
      //       'Success',
      //       'Thanks for contacting us we will contact you soon.',
      //       'success'
      //     );
      //     this.AddForm.reset();
      //     // this.isAgree = false;
      //     loader.isLoading = false;
      //   },
      //   error => {
      //     Swal.fire('Error', 'Some thing is not right', 'error');
      //     // this.isAgree = false;
      //     loader.isLoading = false;
      //   }
      // );
    } else {
      this.AddForm.markAllAsTouched();
    }
  }
  showForm() {
    this.showAddUserForm = !this.showAddUserForm;
  }
}
