import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faApple } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss']
})
export class AddHotelComponent implements OnInit {
  _showpass = false;
  apple = faApple;
  showPass() {
    this._showpass = true;
  }
  hidePass() {
    this._showpass = false;
  }
  AddForm!: FormGroup;
  @ViewChild('calendar')
  calendar: any;
  constructor(private fb: FormBuilder) {}
  public facilityList: any;
  public bookingStatusList: any;
  public selectedImage: any;
  public imagePreview: any;
  imageSrcs: string[] = [];
  profilePicPriview:any;
  selectedProfilePic:any;
  currentdate = new Date();
  ngOnInit(): void {
    this.AddForm = this.fb.group({
      HotelName: ['', Validators.required],
      HotelTitle: ['', Validators.required],
      HotelAddress: ['', Validators.required],
      Description: ['', Validators.required],
      PriceGuest: [100, Validators.required],
      PriceRoom: [100, Validators.required],
      // Facilities: ['', Validators.required],
      Image: ['', Validators.required],
      username: ['', Validators.required],
      profile_pic: [''],
      email: ['', Validators.required],
      password: ['', Validators.required]
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
    const price = this.AddForm.controls['PriceRoom'].value;
    this.AddForm.controls['PriceRoom'].setValue(price + 5);
  }

  decrement() {
    const price = this.AddForm.controls['PriceRoom'].value;
    this.AddForm.controls['PriceRoom'].setValue(price - 5);
  }
  increment1() {
    const price = this.AddForm.controls['PriceGuest'].value;
    this.AddForm.controls['PriceGuest'].setValue(price + 5);
  }

  decrement1() {
    const price = this.AddForm.controls['PriceGuest'].value;
    this.AddForm.controls['PriceGuest'].setValue(price - 5);
  }
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const imageSrc: string = reader.result as string;
        this.imageSrcs.push(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage(index: any) {
    this.imageSrcs.splice(index, 1);
  }
  openCalendar(event: any) {
    // this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
    // event.stopPropagation();
  }
  onProfilePicSelected(event: any) {
    if (event.target.files) {
    }
    this.selectedProfilePic = event.target.files[0];
    let file = event.target.files[0];
    // console.log(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profilePicPriview = reader.result as string;
      let ImgagePath = reader.result as string;
      this.AddForm.patchValue({
        imageSource: ImgagePath
      });
    };
    // reader.readAsDataURL(this.selectedImage);
  }
}
