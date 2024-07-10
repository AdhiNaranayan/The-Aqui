import { Component, HostListener, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-calendar-view',
  templateUrl: './modal-calendar-view.component.html',
  styleUrls: ['./modal-calendar-view.component.scss']
})
export class ModalCalendarViewComponent implements OnInit {


  @HostListener('window:keydown.esc', ['$event'])
  onEsc(event: any): void {
    if (event.keyCode === 27) {
      this.Cancel();
      event.preventDefault();
    }
  }
  // Define a variable to hold the data
  modalData: any;
  CalendarAmounts: any;
  onClose: Subject<any>;

  Icon = '';
  ColorCode = 'red';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public modalRef: BsModalRef,
    public modal: ModalOptions
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.CalendarAmounts = this.modal.initialState['data'];
    console.log(this.CalendarAmounts);

  }
  Cancel() {
    this.onClose.next({ Status: false });
    this.modalRef.hide();
  }

  Delete() {
    this.onClose.next({ Status: true });
    this.modalRef.hide();
  }

}
