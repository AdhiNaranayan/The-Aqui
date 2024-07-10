import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { InviteManagementService } from 'src/app/services/invite-management/invite-management.service';

@Component({
  selector: 'app-modal-seller-increase-credit-limit',
  templateUrl: './modal-seller-increase-credit-limit.component.html',
  styleUrls: ['./modal-seller-increase-credit-limit.component.scss']
})
export class ModalSellerIncreaseCreditLimitComponent implements OnInit {

  @HostListener('window:keydown.esc', ['$event'])
  onEsc(event: any): void {
    if (event.keyCode === 27) {
      this.Cancel();
      event.preventDefault();
    }
  }

  onClose: Subject<any>;
  AddCredit: FormGroup;
  UpdateAmountList: any; // Property to hold the passed obj
  SellerBusinessList: any;
  inputvalue: any;
  Icon = '';
  Seller: any;
  Buyer: any;
  ColorCode = 'red';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public modalRef: BsModalRef,
    private Toastr: ToastrService,
    public InviteManagement: InviteManagementService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.AddCredit = new FormGroup({
      AddcreditLimit: new FormControl(),
    })
    // console.log(this.UpdateAmountList, 'from modalllll'); // You can access the passed obj here
  }

  Cancel() {
    this.onClose.next({ Status: false });
    this.modalRef.hide();
  }

  Delete() {
    this.onClose.next({ Status: true });
    this.modalRef.hide();
  }

  amount(event: any) {
    this.inputvalue = event.target.value;
    const InvAmount = Number(this.inputvalue);
    const InvoiceAmountControl = this.AddCredit.get('AddcreditLimit').value
    if (InvAmount < 0) {
      // If the value is negative, set it to 0
      InvoiceAmountControl.setValue(0);
    }
  }

  Submit() {
    var Info = {
      "Seller": this.Seller,
      "Business": this.SellerBusinessList._id,
      "Buyer": this.Buyer,
      "BuyerBusiness": this.UpdateAmountList._id,
      "BuyerCreditLimit": this.AddCredit.get('AddcreditLimit').value
    }
    this.InviteManagement.SellerIncreaseCreditLimit(Info).subscribe(response => {
      if (response) {
        this.Toastr.NewToastrMessage({ Type: 'Success', Message: response.Message });
        this.modalRef.hide();
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Error Occured !' });

      }
    })
  }
}
