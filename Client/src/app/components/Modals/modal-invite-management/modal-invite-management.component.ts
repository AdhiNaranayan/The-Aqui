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
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service'

export interface Business { _id: string; BusinessName: string; }
export interface BuyerBusiness { _id: string; BusinessName: string; }
export interface BuyerBranch { _id: string; BranchName: string; }
export interface SellerAndBuyerBusiness { _id: string; FirstName: string; LastName: string; }
export interface Branch { _id: string; BranchName: string; }
export interface SellerAndBuyerBranch { _id: string; BranchName: string; }
@Component({
  selector: 'app-modal-invite-management',
  templateUrl: './modal-invite-management.component.html',
  styleUrls: ['./modal-invite-management.component.scss']
})

export class ModalInviteManagementComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  InviteForm: FormGroup;
  Type: string;
  InviteInfo: any;
  modalReference: BsModalRef;
  onClose: Subject<any>;
  Uploading = false;
  inputValue: any;
  UserInfo: any;
  BusinessList: Business[] = [];
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  LastSelectedBusiness = null;
  FilterBusiness: Observable<Business[]>;
  FilterBranch: Observable<Branch[]>;
  BranchList: any[] = [];
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
  PaymentCycles: any[] = [{ Name: '7', Key: '7' },
  { Name: '15', Key: '15' },
  { Name: '30', Key: '30' }];
  InvitedCategory: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  BuyerBusiness: any;
  CustomerType: any;
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

            this.InviteService.BusinessList({
              "Customer": this.UserInfo.User, "CustomerCategory": this.CustomerCategory,
            }).subscribe(response => {
              this.BusinessList = response.Response;
            });
          } else if (this.CustomerCategory === 'Buyer') {
            this.InviteService.BuyerBusiness_List({ Customer: this.UserInfo.User, Category: this.CustomerCategory }).subscribe(response => {
              this.BuyerBusinessList = response.Response;
              setTimeout(() => {
                this.InviteForm.controls.BuyerBusiness.updateValueAndValidity();
                this.InviteForm.controls.BuyerBusiness.setValue(null);
              }, 500);
            });
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );

  }

  ngOnInit(): void {
    // console.log(this.BranchList,'BranchList list');

    this.onClose = new Subject();
    if (this.Type === 'Create' && this.CustomerCategory === 'Seller') {
      this.InviteForm = new FormGroup({
        Mobile: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(10), Validators.required]),
        // Mobile: new FormControl('', Validators.required),
        ContactName: new FormControl('', Validators.required),
        // Email: new FormControl('', [Validators.required, Validators.email]),
        Email: new FormControl(''),
        Buyer: new FormControl('Empty'),
        BuyerBusiness: new FormControl('Empty'),
        // BuyerBranch: new FormControl('Empty'),
        Seller: new FormControl(this.UserInfo.User, Validators.required),
        Business: new FormControl('', Validators.required),
        // Branch: new FormControl('', Validators.required),
        IfUser: new FormControl(''),
        InviteType: new FormControl('New'),
        InvitedUser: new FormControl(false),
        BuyerCreditLimit: new FormControl('', Validators.required),
        AvailableCreditLimit: new FormControl(''),
        BuyerPaymentType: new FormControl('', Validators.required),
        BuyerPaymentCycle: new FormControl('', Validators.required),
        InvitedBy: new FormControl(this.UserInfo.User, Validators.required),
        InviteCategory: new FormControl('Buyer', Validators.required),
      });
    } else if (this.Type === 'Create' && this.CustomerCategory === 'Buyer') {
      this.InviteForm = new FormGroup({
        Mobile: new FormControl('', Validators.required),
        ContactName: new FormControl('', Validators.required),
        // Email: new FormControl('', [Validators.required, Validators.email]),
        Email: new FormControl(''),
        Buyer: new FormControl(this.UserInfo.User),
        BuyerBusiness: new FormControl('', Validators.required),
        // BuyerBranch: new FormControl('', Validators.required),
        Seller: new FormControl('Empty', Validators.required),
        Business: new FormControl('Empty', Validators.required),
        // Branch: new FormControl('Empty', Validators.required),
        IfUser: new FormControl(''),
        InviteType: new FormControl('New'),
        InvitedUser: new FormControl(false),
        BuyerCreditLimit: new FormControl('', Validators.required),
        BuyerPaymentType: new FormControl('', Validators.required),
        BuyerPaymentCycle: new FormControl('', Validators.required),
        InvitedBy: new FormControl(this.UserInfo.User, Validators.required),
        InviteCategory: new FormControl('Seller', Validators.required),
      });

    } else if (this.Type === 'SellerInviteAccept' && this.CustomerCategory === 'Seller') {
      this.InviteForm = new FormGroup({
        Invite_Status: new FormControl('Accept'),
        InviteId: new FormControl(this.InviteInfo.ContactName, Validators.required),
        CustomerId: new FormControl(this.UserInfo.User, Validators.email),
        Business: new FormControl(this.InviteInfo.Business._id, Validators.required),
        // Branch: new FormControl(this.InviteInfo.BranchInfo._id, Validators.required),
        BuyerCreditLimit: new FormControl(this.InviteInfo.BuyerCreditLimit, Validators.required),
        BuyerPaymentCycle: new FormControl(this.InviteInfo.BuyerPaymentCycle, Validators.required),
        BuyerPaymentType: new FormControl(this.InviteInfo.BuyerPaymentType, Validators.required),
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
          returnText = 'Please Enter Only Numeric!';
        } else {
          returnText = 'Undefined error detected!';
        }
        return returnText;
      } else {
        return '';
      }
    }
  }


  CustomValidation(Condition: any): ValidatorFn {
    if (Condition === 'AlphaNumeric') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphaNumeric.test(control.value)) {
          return { AlphaNumericError: true };
        }
        return null;
      };
    }
    if (Condition === 'AlphaNumericSpaceHyphen') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphaNumericSpaceHyphen.test(control.value)) {
          return { AlphaNumericSpaceHyphenError: true };
        }
        return null;
      };
    }
    if (Condition === 'Alphabets') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.Alphabets.test(control.value)) {
          return { AlphabetsError: true };
        }
        return null;
      };
    }
    if (Condition === 'AlphabetsSpaceHyphen') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphen.test(control.value)) {
          return { AlphabetsSpaceHyphenError: true };
        }
        return null;
      };
    }
    if (Condition === 'AlphabetsSpaceHyphenDot') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphenDot.test(control.value)) {
          return { AlphabetsSpaceHyphenDotError: true };
        }
        return null;
      };
    }
    if (Condition === 'Numerics') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.Numerics.test(control.value)) {
          return { NumericsError: true };
        }
        return null;
      };
    }
    if (Condition === 'NumericDecimal') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.NumericDecimal.test(control.value)) {
          return { NumericDecimalError: true };
        }
        return null;
      };
    }
    // if (Condition === 'MobileNumeric') {
    //   return (control: AbstractControl): { [key: string]: boolean } | null => {
    //     if (control.value !== '' && control.value !== null && !this.MobileNumeric.test(control.value)) {
    //       return { MobileNumericError: true };
    //     }
    //     return null;
    //   };
    // }
    if (Condition === 'MobileNumeric') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const numericPattern = /^[0-9]+$/;
        if (
          control.value !== '' &&
          control.value !== null &&
          (!numericPattern.test(control.value) || control.value.length !== 10)
        ) {
          return { MobileNumericError: true };
        }
        return null;
      };
    }
  }

  trackBusinessAmount(event: any) {
    this.inputValue = event.target.value;
    const BusineessAmountControl = this.InviteForm.get('BuyerCreditLimit');
    const BusnsAmount = Number(this.inputValue);

    if (BusnsAmount < 0) {
      // If the value is negative, set it to 0
      BusineessAmountControl.setValue(0);
    }
  }

  trackPaymentCycle(event: any) {
    this.inputValue = event.target.value;
    const BusineessAmountControl = this.InviteForm.get('BuyerPaymentCycle');
    const BusnsAmount = Number(this.inputValue);

    if (BusnsAmount < 0) {
      // If the value is negative, set it to 0
      BusineessAmountControl.setValue(0);
    }
  }

  SellerSendInvite() {
    if (this.InviteForm) {
      const Info = this.InviteForm.value;
      // this.modalReference = this.ModalService.show(ModalPopupComponent, Object.assign({  }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
      // this.modalReference.content.onClose.subscribe(response => { });
      this.InviteService.Sellersend_Invite(Info).subscribe(response => {

        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invite Successfully Created' });
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
      const Info = this.InviteForm.value;
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


  AutocompleteBlur(key: any) {
    setTimeout(() => {
      const value = this.InviteForm.controls[key].value;
      if (!value || value === null || value === '' || typeof value !== 'object') {
        this.InviteForm.controls[key].setValue(null);
      }
    }, 500);
  }

  MobileChanges(Event: number) {
    console.log(this.InviteForm.controls.Mobile, '222222222222222');

    if (this.InviteForm.controls.Mobile.status !== 'VALID') {
      console.log(Event, 'EventEven11111t');

      this.InviteService.Verify_Mobile({ Mobile: Event, CustomerCategory: 'Buyer' }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.InviteForm.controls.ContactName.setValue(response.Response.ContactName);
          this.InviteForm.controls.Email.setValue(response.Response.Email);
          this.InviteForm.controls.Buyer.setValue(response.Response._id);
          this.InviteForm.controls.InviteType.setValue('Existing');
          this.InviteService.SellerAndBuyerBusinessList({
            InviteTo: this.InviteForm.controls.Buyer.value,
            CustomerCategory: this.CustomerCategory,
            InviteFrom: this.InviteForm.controls.Seller.value,
            Business: this.InviteForm.controls.Business.value,
            // Branch: this.InviteForm.controls.Branch.value,
          }).subscribe(Response => {
            if (Response.Status && Response.Status === true) {
              this.SellerAndBuyerBusiness = Response.Response;

            }
          });
        } else {
          this.SellerAndBuyerBusiness = [];
          this.InviteForm.controls.ContactName.setValue(null);
          this.InviteForm.controls.Email.setValue(null);
          this.InviteForm.controls.Buyer.setValue('Empty');
          this.InviteForm.controls.BuyerBusiness.setValue('Empty');
          // this.InviteForm.controls.BuyerBranch.setValue('Empty');
        }
      });
    }
  }


  MobileBuyerChanges(Event) {
    console.log(this.InviteForm.controls.Mobile, '222222222222222');
    if (this.InviteForm.controls.Mobile.status === 'VALID') {
      console.log(Event, 'buyyyy');

      this.InviteService.Verify_Mobile({ Mobile: Event, CustomerCategory: 'Seller' }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.InviteForm.controls.ContactName.setValue(response.Response.ContactName);
          this.InviteForm.controls.Email.setValue(response.Response.Email);
          this.InviteForm.controls.Seller.setValue(response.Response._id);
          this.InviteForm.controls.InviteType.setValue('Existing');
          this.InviteService.SellerAndBuyerBusinessList({
            InviteTo: this.InviteForm.controls.Seller.value,
            CustomerCategory: this.CustomerCategory,
            InviteFrom: this.InviteForm.controls.Buyer.value,
            Business: this.InviteForm.controls.BuyerBusiness.value,
            // Branch: this.InviteForm.controls.BuyerBranch.value,
          }).subscribe(Response => {
            console.log(Response, 'Res  ponseResponseResponse2131');

            if (Response.Status && Response.Status === true) {
              this.SellerAndBuyerBusiness = Response.Response;
            }
          });
        } else {
          this.SellerAndBuyerBusiness = [];
          this.InviteForm.controls.ContactName.setValue(null);
          this.InviteForm.controls.Email.setValue(null);
          this.InviteForm.controls.Seller.setValue('Empty');
          this.InviteForm.controls.Business.setValue('Empty');
          // this.InviteForm.controls.Branch.setValue('Empty');
        }
      });
    }
  }

  BusinessChanges(Event) {

    if (this.InviteForm.controls.Business.status === 'VALID') {
      this.InviteService.BusinessList({ Customer: this.UserInfo.User, CustomerCategory: this.CustomerCategory, Business: Event }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BranchList = response.Response;
        }
      });
    } else {
      this.InviteForm.controls.Business.setValue('Empty');
    }
  }


  BranchChanges(Event) {
    const AvailableCreditLimitArray = this.BranchList.filter(obj1 => obj1._id === Event);
    if (AvailableCreditLimitArray.length > 0) {
      AvailableCreditLimitArray.map(Obj => {
        this.InviteForm.controls.AvailableCreditLimit.setValue(Obj.AvailableCreditLimit);
      });
    }
  }

  BuyerLoginBusinessChanges(Event) {
    // console.log(this.BuyerBusinessList, 'BuyerBusinessListBuyerBusinessListBuyerBusinessList');

    if (this.InviteForm) {
      this.InviteService.BuyerBranchesOfBusiness_List({ Buyer: this.UserInfo.User, Business: Event }).subscribe(response => {
        console.log(response, 'responseresponse');
        if (response.Status && response.Status === true) {
          this.BuyerBranchList = response.Response;
        }
      });
    } else {
      // this.InviteForm.controls.BuyerBranch.setValue('Empty');
    }
  }

  BuyerBusinessChanges(Event) {
    if (this.InviteForm.controls.BuyerBusiness.status === 'VALID') {
      this.InviteService.SellerAndBuyerBusinessList({
        InviteTo: this.InviteForm.controls.Buyer.value,
        CustomerCategory: this.CustomerCategory,
        InviteFrom: this.InviteForm.controls.Seller.value,
        Business: this.InviteForm.controls.Business.value,
        // Branch: this.InviteForm.controls.Branch.value,
        BusinessTo: Event
      }).subscribe(Response => {
        if (Response.Status && Response.Status === true) {
          this.SellerAndBuyerBranch = Response.Response;
        }
      });
    } else {
      this.SellerAndBuyerBranch = [];
      // this.InviteForm.controls.BuyerBranch.setValue('Empty');
    }
  }

  // SellerBusinessChanges(Event) {
  //   if (this.InviteForm.controls.Business.status === 'VALID') {
  //     this.InviteService.SellerAndBuyerBranchList({
  //       InviteTo: this.InviteForm.controls.Seller.value,
  //       CustomerCategory: this.CustomerCategory,
  //       InviteFrom: this.InviteForm.controls.Buyer.value,
  //       Business: this.InviteForm.controls.BuyerBusiness.value,
  //       // Branch: this.InviteForm.controls.BuyerBranch.value,
  //       BusinessTo: Event
  //     }).subscribe(Response => {
  //       if (Response.Status && Response.Status === true) {
  //         this.SellerAndBuyerBranch = Response.Response;
  //       }
  //     });
  //   } else {
  //     this.SellerAndBuyerBranch = [];
  //     // this.InviteForm.controls.Branch.setValue('Empty');
  //   }
  // }

  BuyerSendInvite() {
    if (this.InviteForm.valid) {
      const Info = this.InviteForm.value;
      this.InviteService.BuyerSendInvite(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invite Successfully Created' });
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

}
