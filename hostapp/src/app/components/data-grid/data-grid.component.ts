import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
  @Output() showFormEmitter: EventEmitter<any>;
  @Output() showRoomTypeFormEmitter: EventEmitter<any>;
  @Output() showServicesFormEmitter: EventEmitter<any>;
  @Input() cols: any;
  @Input() respFiles: any;
  @Input() edit: any = false;
  @Input() hover: any = false;
  @Input() addRoombtn: any = false;
  @Input() addUserbtn: any = false;
  @Input() roomTypebtn: any = false;
  @Input() addBookingbtn: any = false;
  @Input() servicesAddbtn: any = false;
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  constructor() {
    this.deletetEmitter = new EventEmitter();
    this.rowClickEmitter = new EventEmitter();
    this.showFormEmitter = new EventEmitter();
    this.showRoomTypeFormEmitter = new EventEmitter();
    this.showServicesFormEmitter = new EventEmitter();
  }
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col: any) => val.includes(col));
  }

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
    this.showFormEmitter.emit();
  }
  showRoomTypeForm() {
    this.showRoomTypeFormEmitter.emit();
  }
  shwoServiceForm() {
    this.showServicesFormEmitter.emit();
  }
}
