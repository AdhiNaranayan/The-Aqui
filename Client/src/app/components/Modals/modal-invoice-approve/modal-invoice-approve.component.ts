import { Component, HostListener, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { InvoiceManagementService } from 'src/app/services/invoice-management/invoice-management.service';

@Component({
  selector: 'app-modal-invoice-approve',
  templateUrl: './modal-invoice-approve.component.html',
  styleUrls: ['./modal-invoice-approve.component.scss']
})
export class ModalInvoiceApproveComponent implements OnInit {
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
  detailedInvoice: any;
  UserInfo: any;
  constructor(public modalRef: BsModalRef,
    private InvoiceManagement: InvoiceManagementService,
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    // console.log(this.detailedInvoice, '234234234234');
    // console.log(this.UserInfo, 'UserInfoUserInfo');

  }

  Cancel() {
    this.onClose.next({ Status: false });
    this.modalRef.hide();
  }

  Accept() {
    this.onClose.next({ Status: true, Data: 'Accepted' });
    this.modalRef.hide();

  }

  Dispute() {

    this.onClose.next({ Status: true, Data: 'Disputed' });
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
