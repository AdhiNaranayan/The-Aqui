import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-invoice',
  templateUrl: './modal-invoice.component.html',
  styleUrls: ['./modal-invoice.component.css']
})
export class ModalInvoiceComponent implements OnInit {

  onClose: Subject<any>;
  Type: string;
  InvoiceInfo: any;
  constructor( public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }


}
