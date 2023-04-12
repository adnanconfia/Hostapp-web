import {
  Firestore,
  addDoc,
  collectionData,
  collection,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Loader } from './../../../helpers/loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public showAddUserForm: boolean = false;
  AddUserForm!: FormGroup;
  UpdateForm!: FormGroup;
  cols: any = [];
  public roleIdManager: any;
  public roleIdWorker: any;
  public roleIdAdmin: any;
  constructor(private fb: FormBuilder, private firestore: Firestore) {}
  public users: any;
  ngOnInit(): void {
    this.AddUserForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      userrole: ['', Validators.required]
    });
    this.cols = [
      { header: 'User Name' },
      { header: 'Role' },
      { header: 'Eamil' },
      { header: 'Is Active' },
      { header: 'Picture' },
      { header: 'Action' }
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
    this.getDataRoleId();
    this.getAllUsers();
  }
  onSubmit() {
    if (this.AddUserForm.valid) {
      var data = this.AddUserForm.value;
      console.log(data);
      let dataform: any = {};
      let name =
        this.AddUserForm.controls['firstname'].value +
        this.AddUserForm.controls['lastname'].value;
      dataform.name = name;
      dataform.email = this.AddUserForm.controls['email'].value;
      if (this.AddUserForm.controls['userrole'].value == 1) {
        dataform.roleId = this.roleIdManager;
      }
      if (this.AddUserForm.controls['userrole'].value == 2) {
        dataform.roleId = this.roleIdWorker;
      }
      console.log('name=' + dataform.name);
      Loader.isLoading = true;
      const collectionInstance = collection(this.firestore, 'users');
      addDoc(collectionInstance, dataform)
        .then(() => {
          Loader.isLoading = false;
          console.log('Data saved successfully');
        })
        .catch(err => {
          Loader.isLoading = false;
          console.log(err);
        });
    } else {
      this.AddUserForm.markAllAsTouched();
    }
  }
  showForm() {
    this.showAddUserForm = !this.showAddUserForm;
  }
  getDataRoleId() {
    const collectionInstance = collection(this.firestore, 'roles');
    collectionData(collectionInstance).subscribe(
      (resp: any) => {
        console.log(resp);
        this.roleIdAdmin = resp[0].roleId;
        this.roleIdManager = resp[1].roleId;
        this.roleIdWorker = resp[2].roleId;
        // console.log(roleIdManager);
      },
      error => {
        console.log(error);
      }
    );
  }
  Update(id: any) {
    const updateInstance = doc(this.firestore, 'users', id);
    let name =
      this.UpdateForm.controls['firstname'].value +
      ' ' +
      this.UpdateForm.controls['lastname'].value;
    const update = {};
    updateDoc(updateInstance, update)
      .then(() => {
        console.log('User Updated');
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  getAllUsers() {
    const userIns = collection(this.firestore, 'users');
    collectionData(userIns, { idField: 'id' }).subscribe(
      (resp: any) => {
        console.log(resp,"users");
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  deleteUser(id: any) {
    const userDeleteIns = doc(this.firestore, 'users', id);
    deleteDoc(userDeleteIns)
      .then(() => {
        console.log('User deleted');
      })
      .catch((error: any) => {
        console.log(error);
      });
  }  
}
