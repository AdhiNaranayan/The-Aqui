import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-customer-view',
  templateUrl: './modal-customer-view.component.html',
  styleUrls: ['./modal-customer-view.component.css']
})
export class ModalCustomerViewComponent implements OnInit {

  onClose: Subject<any>;
  OwnerInfo: any;
  Type: string;
  CustomerInfo: any;
  BusinessInfo: any;
  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }


}
