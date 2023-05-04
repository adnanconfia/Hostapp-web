import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit {
  public users: any;
  _selectedColumns: any = [];
  trash = faTrashCan;
  editIcon = faPenToSquare;
  first = 0;

  @Output() deletetEmitter: EventEmitter<any>;
  @Output() rowClickEmitter: EventEmitter<any>;
  @Output() CreateEmitter: EventEmitter<any>;
  @Output() Update: EventEmitter<any>;
  @Output() showRoomTypeFormEmitter: EventEmitter<any>;
  @Output() showServicesFormEmitter: EventEmitter<any>;
  @Output() viewEmitter: EventEmitter<any>;
  @Output() detailEmitter:EventEmitter<any>;
  @Input() cols: any;
  @Input() respFiles: any;
  @Input() edit: any = false;
  @Input() hover: any = false;
  @Input() addRoombtn: any = false;
  @Input() addUserbtn: any = false;
  @Input() roomTypebtn: any = false;
  @Input() addBookingbtn: any = false;
  @Input() servicesAddbtn: any = false;
  @Input() showViewBtn:any = false;
  @Input() showDetailsBtn:any=false

  @Input() showDeleteBtn:any=true
  @Input() showEditBtn:any=true
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  constructor(
    private cdr:ChangeDetectorRef
  ) {
    this.deletetEmitter = new EventEmitter();
    this.rowClickEmitter = new EventEmitter();
    this.CreateEmitter = new EventEmitter();
    this.showRoomTypeFormEmitter = new EventEmitter();
    this.showServicesFormEmitter = new EventEmitter();
    this.Update = new EventEmitter();
    this.viewEmitter = new EventEmitter();
    this.detailEmitter= new EventEmitter();
  }
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col: any) => val.includes(col));
  }
  // ngAfterViewChecked(){
  //   this.cdr.detectChanges();
  //   console.log(this.respFiles,"resp");
  // }
  ngOnInit(): void {
    this._selectedColumns = this.cols;
  }

  delete(data: any) {
    this.deletetEmitter.emit(data);
  }
  rowClick(data: any) {
    this.rowClickEmitter.emit(data);
  }

  onPageChange(event: any) {
    this.first = event.first;
  }
  showForm() {
    this.CreateEmitter.emit();
  }
  create(){
    this.CreateEmitter.emit();
  }
  showRoomTypeForm() {
    this.showRoomTypeFormEmitter.emit();
  }
  shwoServiceForm() {
    this.showServicesFormEmitter.emit();
  }
  update(data:any){
    this.Update.emit(data);
  }

  view(data:any){
    this.viewEmitter.emit(data);
  }

  detail(data:any){
    this.detailEmitter.emit(data)
  }


}
