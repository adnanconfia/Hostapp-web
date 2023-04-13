import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  AddForm!: FormGroup;
  public servicesList: any;
  public selectedImage: any;
  public imagePreview: any;
  public cols: any;
  public itemsDetails: any;
  public serviceFormShow: boolean = false;
  constructor(private fb: FormBuilder) {
    this.servicesList = [
      { name: 'Towels', code: 'Towels' },
      { name: 'Pillow', code: 'Pillow' },
      { name: 'Covers', code: 'Covers' },
      { name: 'Curtons', code: 'Curtons' },
      { name: 'Bedsheets', code: 'Bedsheets' }
    ];
  }

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      services: ['', Validators.required],
      image: [''],
      itemName: ['', Validators.required],
      priceItem: ['', Validators.required],
      imageSource: []
    });
    this.cols = [
      { header: 'Image' },
      { header: 'Listed Items' },
      { header: 'Action' },
      { showchekbox: true },
      { showtablecheckbox: true }
    ];
    this.itemsDetails = [
      {
        list:
          'Towels, Pillow Covers, Curtons, Cusions, Bedsheets, Shoes Pair, Jeans, T-shirts'
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
  showForm() {
    this.serviceFormShow = !this.serviceFormShow;
  }
}
