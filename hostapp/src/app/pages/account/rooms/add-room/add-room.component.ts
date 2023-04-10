import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {
  AddForm!: FormGroup;

  imageSrcs: string[] = [];
  facilityList: any;
  roomTypeList: any;
  constructor(private fb: FormBuilder) {
    this.facilityList = [
      { name: 'Free Wifi', code: 'FW' },
      { name: 'Breakfast', code: 'BF' },
      { name: 'Single Bed', code: 'SB' },
      { name: 'Double Bed', code: 'DB' }
    ];
    this.roomTypeList = [
      { name: 'Luxury', code: 'LX' },
      { name: 'Family Room', code: 'FR' },
      { name: 'Disable Guest', code: 'DG' },
      { name: 'Luxury Marqu', code: 'LM' }
    ];
  }

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      Image:['',Validators.required],
      RoomNumber: ['', Validators.required],
      RoomType: [0, Validators.required],
      Facilities: ['', Validators.required],
      Price:[20,Validators.required]
    });
  }
  onSubmit() {}
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
  increment() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price + 5);
  }

  decrement() {
    const price = this.AddForm.controls['Price'].value;
    this.AddForm.controls['Price'].setValue(price - 5);
  }
}
