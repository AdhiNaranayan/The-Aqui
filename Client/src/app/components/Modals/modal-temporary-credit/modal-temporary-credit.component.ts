import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { InviteManagementService } from 'src/app/services/invite-management/invite-management.service';
import { TemporaryRequestService } from 'src/app/services/temporary-management/temporary-request.service';

@Component({
  selector: 'app-modal-temporary-credit',
  templateUrl: './modal-temporary-credit.component.html',
  styleUrls: ['./modal-temporary-credit.component.scss']
})
export class ModalTemporaryCreditComponent implements OnInit {
  modalReference: BsModalRef;
  onClose: Subject<any>;
  UserInfo: any;
  Type: string;
  inputValue: any;
  UserGroup: FormGroup;
  TemporaryDetails: any;
  BuyerBusinessList: any[] = [];
  BuyerBranchList: any[] = [];
  SellerBusinessList: any[] = [];
  SellerBranchList: any[] = [];
  CreditTypes: any[] = [{ Name: 'Cheque', Key: 'Cheque' },
  { Name: 'Online', Key: 'Online' },
  { Name: 'Cash', Key: 'Cash' }];
  constructor(
    public ModalService: BsModalService,
    public modalRef: BsModalRef,
    public Toastr: ToastrService,
    public LoginService: LoginManageService,
    private TemporaryRequest: TemporaryRequestService,
    private BusinessManage: BusinessManagementService,
    private InviteManagement: InviteManagementService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
  }

  ngOnInit(): void {
    // console.log(this.TemporaryDetails, 'etuiethiwtuire');

    this.onClose = new Subject();
    if (this.Type === 'SellerUpdate') {
      this.UserGroup = new FormGroup({
        Seller: new FormControl(this.UserInfo.User, Validators.required),
        RequestId: new FormControl(this.TemporaryDetails?._id, Validators.required),
        Request_Status: new FormControl(),
        SellerRemarks: new FormControl('', Validators.required),
        ApproveLimit: new FormControl(this.TemporaryDetails?.RequestLimit, Validators.required),
        ApprovedPeriod: new FormControl(this.TemporaryDetails?.RequestPeriod, Validators.required),
        PaymentType: new FormControl(this.TemporaryDetails?.PaymentType, Validators.required),
        BuyerPaymentCycle: new FormControl(this.TemporaryDetails?.BuyerPaymentCycle, Validators.required)
      });
    } else if (this.Type === 'BuyerRequestToTemporary') {
      this.BusinessManage.Business_List({ CustomerId: this.UserInfo.User, CustomerCategory: 'Buyer' }).subscribe(response => {
        this.BuyerBusinessList = response.Response;
      });

      this.UserGroup = new FormGroup({
        Seller: new FormControl(this.TemporaryDetails?._id, Validators.required),
        Business: new FormControl(this.TemporaryDetails?.SellerBusinesName, Validators.required),
        Buyer: new FormControl(this.UserInfo?.User, Validators.required),
        BuyerBusiness: new FormControl(this.TemporaryDetails?.BuyerBusinessName, Validators.required),
        RequestLimit: new FormControl('', Validators.required),
        RequestPeriod: new FormControl('', Validators.required),
        BuyerRemarks: new FormControl(''),
      });
    } else if (this.Type === 'SellerUpdateToBuyerCreditLimit') {
      this.UserGroup = new FormGroup({
        InviteId: new FormControl(this.TemporaryDetails?.InviteId, Validators.required),
        Business: new FormControl(this.TemporaryDetails?.Business, Validators.required),
        Mobile: new FormControl(this.TemporaryDetails?.Mobile, Validators.required),
        BuyerCreditLimit: new FormControl(this.TemporaryDetails?.CreditLimit, Validators.required),
        BuyerPaymentCycle: new FormControl(this.TemporaryDetails?.BuyerPaymentCycle, Validators.required),
        BuyerPaymentType: new FormControl(this.TemporaryDetails?.BuyerPaymentType, Validators.required),
        CustomerId: new FormControl(this.TemporaryDetails?.CustomerId, Validators.required),
        BuyerBusiness: new FormControl(this.TemporaryDetails?.BuyerBusiness, Validators.required),
      });
    }
  }

  RejectUpdate() {
    this.UserGroup.controls.Request_Status.setValue('Reject');
    if (this.UserGroup) {
      const Info = this.UserGroup.value;
      this.TemporaryRequest.CreditRequest_Update(Info).subscribe(response => {
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Temporary Credit Successfully Updated' });
          this.onClose.next({ Status: true, Response: response.Response });
          this.modalRef.hide();
        } else {
          if (response.Message === undefined || response.Message === '' || response.Message === null) {
            response.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
          this.modalRef.hide();
        }
      });
    } else {
      Object.keys(this.UserGroup.controls).map(obj => {
        const FControl = this.UserGroup.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  AcceptUpdate() {
    this.UserGroup.controls.Request_Status.setValue('Accept');
    if (this.UserGroup) {
      const Info = this.UserGroup.value;
      this.TemporaryRequest.CreditRequest_Update(Info).subscribe(response => {
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Temporary Credit Successfully Updated' });
          this.onClose.next({ Status: true, Response: response.Response });
          this.modalRef.hide();
        } else {
          if (response.Message === undefined || response.Message === '' || response.Message === null) {
            response.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
          this.modalRef.hide();
        }
      });
    } else {
      Object.keys(this.UserGroup.controls).map(obj => {
        const FControl = this.UserGroup.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  trackBusinessAmount(event: any) {
    this.inputValue = event.target.value;
    const BusineessAmountControl = this.UserGroup.get('BuyerCreditLimit');
    const BusnsAmount = Number(this.inputValue);

    if (BusnsAmount < 0) {
      // If the value is negative, set it to 0
      BusineessAmountControl.setValue(0);
    }
  }

  trackPaymentCycle(event: any) {
    this.inputValue = event.target.value;
    const BusineessAmountControl = this.UserGroup.get('BuyerPaymentCycle');
    const BusnsAmount = Number(this.inputValue);

    if (BusnsAmount < 0) {
      // If the value is negative, set it to 0
      BusineessAmountControl.setValue(0);
    }
  }

  tracktempAmount(event: any) {
    this.inputValue = event.target.value;
    const BusineessAmountControl = this.UserGroup.get('RequestLimit');
    const BusnsAmount = Number(this.inputValue);

    if (BusnsAmount < 0) {
      // If the value is negative, set it to 0
      BusineessAmountControl.setValue(0);
    }
  }

  tracktempCycleAmount(event: any) {
    this.inputValue = event.target.value;
    const BusineessAmountControl = this.UserGroup.get('RequestPeriod');
    const BusnsAmount = Number(this.inputValue);

    if (BusnsAmount < 0) {
      // If the value is negative, set it to 0
      BusineessAmountControl.setValue(0);
    }
  }
  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.UserGroup.get(KeyName) as FormControl;
    if (FControl.invalid && FControl.touched) {
      const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
      if (ErrorKeys.length > 0) {
        let returnText = '';
        if (ErrorKeys.indexOf('required') > -1) {
          returnText = 'This field is required';
        } else if (ErrorKeys.indexOf('min') > -1) {
          returnText = 'Enter the value should be more than ' + FControl.errors.min.min;
        } else if (ErrorKeys.indexOf('max') > -1) {
          returnText = 'Enter the value should be less than or equal ' + FControl.errors.max.max;
        } else if (ErrorKeys.indexOf('minlength') > -1) {
          returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength + ' Digits/Characters';
        } else if (ErrorKeys.indexOf('maxlength') > -1) {
          returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength + ' Digits/Characters';
        } else if (ErrorKeys.indexOf('AlphaNumericError') > -1) {
          returnText = 'Please Enter Only Alphabets and Numerics!';
        } else if (ErrorKeys.indexOf('AlphaNumericSpaceHyphen') > -1) {
          returnText = 'Please Enter Only Alphabets, Numerics, Space and Hyphen!';
        } else if (ErrorKeys.indexOf('AlphabetsError') > -1) {
          returnText = 'Please Enter Only Alphabets!';
        } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenError') > -1) {
          returnText = 'Please Enter Only Alphabets, Space and Hyphen!';
        } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenDotError') > -1) {
          returnText = 'Please Enter Only Alphabets, Space, Dot and Hyphen!';
        } else if (ErrorKeys.indexOf('email') > -1) {
          returnText = 'Please Enter Valid Email!';
        } else if (ErrorKeys.indexOf('NumericsError') > -1) {
          returnText = 'Please Enter Only Numerics!';
        } else if (ErrorKeys.indexOf('NumericDecimalError') > -1) {
          returnText = 'Please Enter Only Numeric and Decimals!';
        } else if (ErrorKeys.indexOf('MobileNumericError') > -1) {
          returnText = 'Please Enter Only Numeric, Spaces and +!';
        } else {
          returnText = 'Undefined error detected!';
        }
        return returnText;
      } else {
        return '';
      }
    }
  }


  BuyerBusinessChanges(Event) {
    this.BusinessManage.MyBusinessList({ Customer: this.UserInfo.User, CustomerCategory: "Buyer", Business: Event }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.BuyerBranchList = response.Response;
      }
    });
  }

  // BuyerBranchChanges(Event) {
  //   this.TemporaryRequest.SellerAgainstBusinessSimpleList({
  //     Seller: this.UserGroup.controls.Seller.value,
  //     Buyer: this.UserGroup.controls.Buyer.value,
  //     BuyerBusiness: this.UserGroup.controls.BuyerBusiness.value,
  //     BuyerBranch: Event,
  //     CustomerCategory: 'Seller',
  //   }).subscribe(response => {
  //     if (response.Status && response.Status === true) {
  //       this.SellerBusinessList = response.Response;
  //     }
  //   });
  // }

  // SellerBusinessChanges(Event) {
  //   this.TemporaryRequest.SellerAndBusinessAgainstBranchSimpleList({
  //     Seller: this.UserGroup.controls.Seller.value,
  //     Buyer: this.UserGroup.controls.Buyer.value,
  //     BuyerBusiness: this.UserGroup.controls.BuyerBusiness.value,
  //     Business: Event,
  //     BuyerBranch: this.UserGroup.controls.BuyerBranch.value,
  //     CustomerCategory: 'Seller'
  //   }).subscribe(response => {
  //     if (response.Status && response.Status === true) {
  //       this.SellerBranchList = response.Response;
  //     }
  //   });
  // }

  Submit() {
    if (this.UserGroup.valid) {
      const Info = this.UserGroup.value;

      this.TemporaryRequest.TempCreditCreate({

        // Info,
        BuyerBusiness: this.TemporaryDetails?.BuyerBusiness,
        Business: this.TemporaryDetails?.Business,
        Buyer: this.UserInfo?.User,
        Seller: this.TemporaryDetails?._id,
        BuyerRemarks: this.UserGroup.controls.BuyerRemarks.value,
        RequestLimit: this.UserGroup.controls.RequestLimit.value,
        RequestPeriod: this.UserGroup.controls.RequestPeriod.value,
      }).subscribe(response => {
        if (response.Status) {
          if (response.Http_Code === 200) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Temporary Request Successfully Created' });
            this.onClose.next({ Status: true, Response: response.Response });
            this.modalRef.hide();
          } else {
            this.Toastr.NewToastrMessage({ Type: 'Warning', Message: response.Message });
            this.onClose.next({ Status: true, Response: response.Response });
            this.modalRef.hide();
          }
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Warning', Message: response.Message });
          this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
          this.modalRef.hide();
        }
      });
    } else {
      Object.keys(this.UserGroup.controls).map(obj => {
        const FControl = this.UserGroup.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }


  SellerUpdateToBuyerCreditLimit() {
    if (this.UserGroup) {
      const Info = this.UserGroup.value;
      this.InviteManagement.SellerUpdateToBuyerCreditLimit(Info).subscribe(response => {
        if (response.Status) {

          this.Toastr.NewToastrMessage({ Type: 'Success', Message: response.Message });
          this.onClose.next({ Status: true, Response: response.Response });
          this.modalRef.hide();
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Warning', Message: response.Message });
          this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
          this.modalRef.hide();
        }
      });
    } else {
      Object.keys(this.UserGroup.controls).map(obj => {
        const FControl = this.UserGroup.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  SellerUpdateToBuyerCreditLimitCancel() {
    this.modalRef.hide();
  }

}
