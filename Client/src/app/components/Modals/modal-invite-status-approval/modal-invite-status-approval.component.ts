import { Component, OnInit } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { InviteManagementService } from 'src/app/services/invite-management/invite-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';

export interface Business { _id: string; BusinessName: string; }
export interface BuyerBusiness { _id: string; BusinessName: string; }
export interface BuyerBranch { _id: string; BranchName: string; }
export interface SellerAndBuyerBusiness { _id: string; BusinessName: string; }
export interface Branch { _id: string; BranchName: string; }
export interface SellerAndBuyerBranch { _id: string; BranchName: string; }
@Component({
  selector: 'app-modal-invite-status-approval',
  templateUrl: './modal-invite-status-approval.component.html',
  styleUrls: ['./modal-invite-status-approval.component.scss']
})
export class ModalInviteStatusApprovalComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  InviteForm: FormGroup;
  Type: string;
  InviteInfo: any;
  modalReference: BsModalRef;
  onClose: Subject<any>;
  Uploading = false;
  UserInfo: any;
  BusinessList: Business[] = [];
  LastSelectedBusiness = null;
  FilterBusiness: Observable<Business[]>;
  FilterBranch: Observable<Branch[]>;
  BranchList: Branch[] = [];
  LastSelectedBranch = null;
  BuyerBusinessList: BuyerBusiness[] = [];
  FilterBuyerBusiness: Observable<BuyerBusiness[]>;
  LastSelectedBuyerBusiness = null;
  BuyerBranchList: BuyerBranch[] = [];
  FilterBuyerBranch: Observable<BuyerBranch[]>;
  LastSelectedBuyerBranch = null;
  CreditTypes: any[] = [{ Name: 'Cheque', Key: 'Cheque' },
  { Name: 'Online', Key: 'Online' },
  { Name: 'Cash', Key: 'Cash' }];
  PaymentCycles: any[] = [{ Name: 7, Key: 7 },
  { Name: 15, Key: 15 },
  { Name: 30, Key: 30 }];
  InvitedCategory: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  SellerAndBuyerBusiness: SellerAndBuyerBusiness[] = [];
  FilterSellerAndBusinessList: Observable<SellerAndBuyerBusiness[]>;
  SellerAndBuyerBranch: SellerAndBuyerBranch[] = [];
  FilterSellerAndBuyerBranchList: Observable<SellerAndBuyerBranch[]>;
  LastSellerAndBuyerBusiness = null;
  LastSellerAndBuyerBranch = null;
  constructor(public ModalService: BsModalService,
    public InviteService: InviteManagementService,
    public modalRef: BsModalRef,
    private Toastr: ToastrService,
    public LoginService: LoginManageService,
    private DataPassingService: CategoryDataPassingService,
    private router: Router,
    public modalRefView: BsModalRef) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Seller') {
          }
        }
      })
    );
  }

  ngOnInit(): void {
    this.onClose = new Subject();
    if (this.Type === 'BuyerInviteAccept' && this.CustomerCategory === 'Buyer') {
      if (this.InviteInfo?.InviteProcess === 'Completed') {
        this.InviteService.SellerAndBuyerBusinessList({
          InviteTo: this.InviteInfo.BuyerInfo._id,
          CustomerCategory: 'Seller',
          InviteFrom: this.InviteInfo.SellerInfo._id,
          Business: this.InviteInfo.BusinessInfo._id,
          // Branch: this.InviteInfo.BranchInfo._id,
        }).subscribe(Response => {
          if (Response.Status && Response.Status === true) {
            this.SellerAndBuyerBusiness = Response.Response;
          }
        });
        // this.SellerAndBuyerBranch = [this.InviteInfo.BuyerBranchInfo];


        this.InviteForm = new FormGroup({
          Invite_Status: new FormControl('Accept'),
          InviteId: new FormControl(this.InviteInfo._id, Validators.required),
          CustomerId: new FormControl(this.UserInfo.User, Validators.required),
          BuyerBusiness: new FormControl({ value: this.InviteInfo.BuyerBusinessInfo?._id, disabled: true }, Validators.required),
          // BuyerBranch: new FormControl({ value: this.InviteInfo.BuyerBranchInfo?._id, disabled: true }, Validators.required),
        });
      } else {
        this.InviteService.SellerAndBuyerBusinessList({
          InviteTo: this.InviteInfo.BuyerInfo._id,
          CustomerCategory: 'Seller',
          InviteFrom: this.InviteInfo.SellerInfo._id,
          Business: this.InviteInfo.BusinessInfo._id,
          // Branch: this.InviteInfo.BranchInfo._id,
        }).subscribe(Response => {
          if (Response.Status && Response.Status === true) {
            this.SellerAndBuyerBusiness = Response.Response;
          }
        });
        this.InviteForm = new FormGroup({
          Invite_Status: new FormControl('Accept'),
          InviteId: new FormControl(this.InviteInfo._id, Validators.required),
          CustomerId: new FormControl(this.UserInfo.User, Validators.required),
          BuyerBusiness: new FormControl('', Validators.required)
          // BuyerBranch: new FormControl('', Validators.required),
        });

      }

    } else if (this.Type === 'SellerInviteAccept' && this.CustomerCategory === 'Seller') {

      if (this.InviteInfo?.InviteProcess === 'Completed') {
        this.InviteService.SellerAndBuyerBusinessList({
          InviteTo: this.InviteInfo.SellerInfo._id,
          CustomerCategory: 'Buyer',
          InviteFrom: this.InviteInfo.BuyerInfo._id,
          Business: this.InviteInfo.BuyerBusinessInfo._id,
          // Branch: this.InviteInfo.BuyerBranchInfo._id,
        }).subscribe(Response => {
          if (Response.Status && Response.Status === true) {
            this.SellerAndBuyerBusiness = Response.Response;

          }
        });
        // this.BranchList = [this.InviteInfo?.BranchInfo];
        this.InviteForm = new FormGroup({
          InviteId: new FormControl(this.InviteInfo._id),
          Invite_Status: new FormControl('Accept'),
          CustomerId: new FormControl({ value: this.UserInfo.User, disabled: true }),
          Business: new FormControl({ value: this.InviteInfo?.BusinessInfo?._id, disabled: true }),
          // Branch: new FormControl({ value: this.InviteInfo?.BranchInfo?._id, disabled: true }),
          BuyerCreditLimit: new FormControl(this.InviteInfo?.BuyerCreditLimit, Validators.required),
          BuyerPaymentCycle: new FormControl(this.InviteInfo?.BuyerPaymentCycle, Validators.required),
          BuyerPaymentType: new FormControl(this.InviteInfo?.BuyerPaymentType, Validators.required),
        });
      } else {
        this.InviteForm = new FormGroup({
          InviteId: new FormControl(this.InviteInfo._id),
          Invite_Status: new FormControl('Accept'),
          CustomerId: new FormControl(this.UserInfo.User),
          Business: new FormControl('', Validators.required),
          // Branch: new FormControl('', Validators.required),
          BuyerCreditLimit: new FormControl(this.InviteInfo?.BuyerCreditLimit, Validators.required),
          BuyerPaymentCycle: new FormControl(this.InviteInfo?.BuyerPaymentCycle, Validators.required),
          BuyerPaymentType: new FormControl(this.InviteInfo?.BuyerPaymentType, Validators.required),
        });

        this.InviteService.SellerAndBuyerBusinessList({
          InviteTo: this.InviteInfo.SellerInfo._id,
          CustomerCategory: 'Buyer',
          InviteFrom: this.InviteInfo.BuyerInfo._id,
          Business: this.InviteInfo.BuyerBusinessInfo._id,
          // Branch: this.InviteInfo.BuyerBranchInfo._id,
        }).subscribe(Response => {
          if (Response.Status && Response.Status === true) {
            this.SellerAndBuyerBusiness = Response.Response;
          }
        });
      }
    }
  }


  BusinessChanges(Event) {
    if (this.InviteForm.controls.Business.status === 'VALID') {
      this.InviteService.SellerAndBuyerBusinessList({
        InviteTo: this.InviteInfo?.SellerInfo?._id,
        CustomerCategory: 'Buyer',
        InviteFrom: this.InviteInfo?.BuyerInfo?._id,
        Business: this.InviteInfo?.BuyerBusinessInfo?._id,
        // Branch: this.InviteInfo?.BuyerBranchInfo?._id,
        BusinessTo: Event
      }).subscribe(Response => {
        if (Response.Status && Response.Status === true) {
          this.BranchList = Response.Response;
        }
      });
    } else {
      this.BranchList = [];
      this.InviteForm.controls.Business.setValue('Empty');
    }
  }

  BuyerBusinessChanges(Event) {
    if (this.InviteForm.controls.BuyerBusiness.status === 'VALID') {
      this.InviteService.SellerAndBuyerBusinessList({
        InviteTo: this.InviteInfo?.BuyerInfo?._id,
        CustomerCategory: 'Seller',
        InviteFrom: this.InviteInfo?.SellerInfo?._id,
        Business: this.InviteInfo?.BusinessInfo?._id,
        // Branch: this.InviteInfo?.BranchInfo?._id,
        BusinessTo: Event
      }).subscribe(Response => {
        if (Response.Status && Response.Status === true) {
          this.SellerAndBuyerBranch = Response.Response;
        }
      });
    } else {
      this.SellerAndBuyerBranch = [];
      this.InviteForm.controls.BuyerBusiness.setValue('Empty');
    }
  }

  SellerInvite_StatusUpdate() {

    if (this.InviteForm.valid) {
      const Info = this.InviteForm.getRawValue();
      this.InviteService.SellerInvite_StatusUpdate(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invite Successfully Updated' });
          this.onClose.next({ Status: true, Response: response.Response });
          this.modalRef.hide();
        } else {
          if (response.Message === undefined || response.Message === '' || response.Message === null) {
            response.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
        }
      });
    } else {
      Object.keys(this.InviteForm.controls).map(obj => {
        const FControl = this.InviteForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  BuyerInvite_StatusUpdate() {

    if (this.InviteForm.valid) {
      const Info = this.InviteForm.getRawValue();
      this.InviteService.BuyerInvite_StatusUpdate(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invite Successfully Updated' });
          this.onClose.next({ Status: true, Response: response.Response });
          this.modalRef.hide();
        } else {
          if (response.Message === undefined || response.Message === '' || response.Message === null) {
            response.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
        }
      });
    } else {
      Object.keys(this.InviteForm.controls).map(obj => {
        const FControl = this.InviteForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.InviteForm.get(KeyName) as FormControl;
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
}
