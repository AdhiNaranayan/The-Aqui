import { Component, HostListener, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-business-delete',
  templateUrl: './modal-business-delete.component.html',
  styleUrls: ['./modal-business-delete.component.scss']
})
export class ModalBusinessDeleteComponent implements OnInit {

  @HostListener('window:keydown.esc', ['$event'])
  onEsc(event: any): void {
    if (event.keyCode === 27) {
      this.Cancel();
      event.preventDefault();
    }
  }

  onClose: Subject<any>;

  Icon = '';
  ColorCode = 'red';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public modalRef: BsModalRef,) { }

  ngOnInit() {
    this.onClose = new Subject();
  }
  Cancel() {
    this.onClose.next({ Status: false });
    this.modalRef.hide();
  }
  // Proceed() {
  //   this.onClose.next({ Status: true });
  //   this.ModalRef.hide();
  // }

  Delete() {
    this.onClose.next({ Status: true });
    this.modalRef.hide();
  }

}
