import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-customer-block',
  templateUrl: './modal-customer-block.component.html',
  styleUrls: ['./modal-customer-block.component.css']
})
export class ModalCustomerBlockComponent implements OnInit {

  onClose: Subject<any>;

  Icon = '';
  ColorCode = '';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public ModalRef: BsModalRef) { }

  ngOnInit() {
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
