import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss']
})
export class RoomTypesComponent implements OnInit {
  AddForm!: FormGroup;
  public roomtypes: any;
  public cols: any;
  public showform: boolean = false;
  public bedTypeList: any;
  public roomTypeList: any;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bedTypeList = [
      { name: 'Double Bed', code: 'DB' },
      { name: 'Single Bed', code: 'SB' }
    ];
    this.roomTypeList = [
      { name: 'Luxury', code: 'LX' },
      { name: 'Family Room', code: 'FR' },
      { name: 'Disable Guest', code: 'DG' },
      { name: 'Luxury Marqu', code: 'LM' }
    ];
    this.AddForm = this.fb.group({
      RoomType: [0, Validators.required],
      BedType: [0, Validators.required],
      isAvailable: [true, Validators.required]
    });
    this.cols = [
      { header: 'Room Types' },
      { header: 'Bed Type' },
      { header: 'Is Available' },
      { header: 'Action' },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.roomtypes = [
      {
        roomType: 'Family Room',
        bedType: 'Double Bed',
        isAvailable: false
      },
      {
        roomType: 'Family Room',
        bedType: 'Double Bed',
        isAvailable: true
      },
      {
        roomType: 'Family Room',
        bedType: 'Double Bed',
        isAvailable: true
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
    this.showform = !this.showform;
  }
}
