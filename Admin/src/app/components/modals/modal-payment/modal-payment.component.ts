import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerManagementService } from 'src/app/services/customer-management/customer-management.service';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.css']
})
export class ModalPaymentComponent implements OnInit {

  onClose: Subject<any>;
  Type: string;
  PaymentInfo: any;
  PaymentDetails: any;
  constructor(public modalRef: BsModalRef,
              private CustomerService: CustomerManagementService) {
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.CustomerService.PaymentDetails({ PaymentId: this.PaymentInfo._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.PaymentDetails = response.Response;
      }
    });
  }

}
