import { Component, HostListener, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { PaymentManagementServiceService } from 'src/app/services/payment-management/payment-management-service.service';

@Component({
  selector: 'app-modal-payment-approve',
  templateUrl: './modal-payment-approve.component.html',
  styleUrls: ['./modal-payment-approve.component.scss']
})
export class ModalPaymentApproveComponent implements OnInit {


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
  detailedPayment: any;
  UserInfo: any;
  constructor(public modalRef: BsModalRef,
    private PaymentManagement: PaymentManagementServiceService,
  ) { }

  ngOnInit(): void {
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

  accept() {
    this.onClose.next({ Status: true, Data: 'Accepted' });
    this.modalRef.hide();
  }


  Dispute() {
    this.onClose.next({ Status: true, Data: 'Disputed' });
    this.modalRef.hide();
  }


}
