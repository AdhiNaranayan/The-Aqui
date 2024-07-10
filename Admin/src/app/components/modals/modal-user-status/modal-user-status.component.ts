import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-user-status',
  templateUrl: './modal-user-status.component.html',
  styleUrls: ['./modal-user-status.component.css']
})
export class ModalUserStatusComponent implements OnInit {

  onClose: Subject<any>;

  Icon = '';
  ColorCode = '';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public ModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.onClose = new Subject();

  }
  Cancel() {
    this.onClose.next({Status: false});
    this.ModalRef.hide();
 }
 Proceed() {
    this.onClose.next({Status: true});
    this.ModalRef.hide();

 }

}

