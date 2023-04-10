import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit {
  AddForm!: FormGroup;
  @ViewChild('calendar')
  calendar: any;
  constructor(private fb: FormBuilder) {}
  public facilityList: any;
  public bookingStatusList: any;
  public selectedImage: any;
  public imagePreview: any;
  currentdate = new Date();
  ngOnInit(): void {
    this.AddForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', Validators.required],
      PostelCode: ['', Validators.required],
      UserAddress: ['', Validators.required],
      City: ['', Validators.required],
      Country: ['', Validators.required],
      HotelName: ['', Validators.required],
      HotelTitle: ['', Validators.required],
      HotelAddress: ['', Validators.required],
      Description: ['', Validators.required],
      Price: [100, Validators.required],
      Facilities: ['', Validators.required],
      BookingStatus: ['', Validators.required],
      Image: ['', Validators.required],
      imageSource: [],
      CheckIn: [this.currentdate, Validators.required],
      CheckOut: [this.currentdate, Validators.required]
    });
    this.facilityList = [
      { name: 'Free Wifi', code: 'FW' },
      { name: 'Breakfast', code: 'BF' },
      { name: 'Single Bed', code: 'SB' },
      { name: 'Double Bed', code: 'DB' }
    ];
    this.bookingStatusList = [
      { name: 'Confirmed', code: 'CF' },
      { name: 'In Progress', code: 'IP' }
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
  increment() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price + 5);
  }

  decrement() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price - 5);
  }
  onFileSelected(event: any) {
    if (event.target.files) {
    }
    this.selectedImage = event.target.files[0];
    let file = event.target.files[0];
    // console.log(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      let ImgagePath = reader.result as string;
      this.AddForm.patchValue({
        imageSource: ImgagePath
      });
    };
    // reader.readAsDataURL(this.selectedImage);
  }
  openCalendar(event: any) {
    // this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
    // event.stopPropagation();
  }
}
