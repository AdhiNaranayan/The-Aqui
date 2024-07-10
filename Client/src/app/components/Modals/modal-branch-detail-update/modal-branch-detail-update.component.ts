import { ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Observable, Subject, Subscription } from 'rxjs';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { Router } from '@angular/router';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
@Component({
  selector: 'app-modal-branch-detail-update',
  templateUrl: './modal-branch-detail-update.component.html',
  styleUrls: ['./modal-branch-detail-update.component.scss']
})
export class ModalBranchDetailUpdateComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  BranchDetails: any;
  BusinessAndBranchForm: FormGroup;
  Type: any;
  UserInfo: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  onClose: Subject<any>;
  constructor(
    public modalRef: BsModalRef,
    private renderer: Renderer2,
    public ModalService: BsModalService,
    public BusinessManage: BusinessManagementService,
    public router: Router,
    public LoginService: LoginManageService,
    public Toastr: ToastrService,
    private DataPassingService: CategoryDataPassingService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Seller') {
          } else if (this.CustomerCategory === 'Buyer') {
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );
  }

  ngOnInit(): void {
    this.onClose = new Subject();
    if (this.Type === 'BranchEdit' && this.CustomerCategory === 'Buyer') {
      this.BusinessAndBranchForm = new FormGroup({
        Customer: new FormControl(this.UserInfo.User),
        Mobile: new FormControl(this.BranchDetails?.Mobile, Validators.required),
        GSTIN: new FormControl(this.BranchDetails?.GSTIN, Validators.required),
        BranchName: new FormControl(this.BranchDetails?.BranchName, Validators.required),
        BusinessId: new FormControl(this.BranchDetails?.Business),
        BranchCreditLimit: new FormControl('0'),
        BranchId: new FormControl(this.BranchDetails?._id),
        RegistrationId: new FormControl(this.BranchDetails?.RegistrationId, Validators.required),
        CustomerCategory: new FormControl(this.CustomerCategory, Validators.required),
        Address: new FormControl(this.BranchDetails?.Address, Validators.required),
      });
    } else if (this.Type === 'BranchEdit' && this.CustomerCategory === 'Seller') {
      this.BusinessAndBranchForm = new FormGroup({
        Customer: new FormControl(this.UserInfo.User),
        Mobile: new FormControl(this.BranchDetails?.Mobile, Validators.required),
        GSTIN: new FormControl(this.BranchDetails?.GSTIN, Validators.required),
        BranchName: new FormControl(this.BranchDetails?.BranchName, Validators.required),
        BusinessId: new FormControl(this.BranchDetails?.Business),
        BusinessCreditLimit: new FormControl(this.BranchDetails?.BusinessInfo?.BusinessCreditLimit),
        BranchCreditLimit: new FormControl(this.BranchDetails?.BranchCreditLimit, Validators.required),
        BranchId: new FormControl(this.BranchDetails?._id),
        RegistrationId: new FormControl(this.BranchDetails?.RegistrationId, Validators.required),
        CustomerCategory: new FormControl(this.CustomerCategory, Validators.required),
        Address: new FormControl(this.BranchDetails?.Address, Validators.required),
      });
      this.BusinessAndBranchForm.get('BranchCreditLimit').setValidators([this.CreditAmountChange()]);
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.BusinessAndBranchForm.get(KeyName) as FormControl;
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
        } else if (ErrorKeys.indexOf('BLSMaximum') > -1) {
          returnText = 'Enter the value should be less than or equal ' + this.BusinessAndBranchForm.get('BusinessCreditLimit').value;
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

  CreditAmountChange(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const BranchCreditLimit = this.BusinessAndBranchForm.get('BranchCreditLimit').value;
      const BusinessCreditLimit = this.BusinessAndBranchForm.get('BusinessCreditLimit').value;
      if (control.value !== '' && control.value !== null) {
        const value = !isNaN(control.value) ? Number(control.value) : 0;
        if (BusinessCreditLimit < value) {
          return { BLSMaximum: true };
        } else {
          return null;
        }
      } else {
        return null;
      }
    };
  }


  // BuyerBranchUpdated() {
  //   if (this.BusinessAndBranchForm.valid) {
  //     const Info = this.BusinessAndBranchForm.value;
  //     this.BusinessManage.BranchDetailsUpdate(Info).subscribe(response => {
  //       if (response.Status) {
  //         this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Branch Successfully Updated' } );
  //         this.onClose.next({ Status: true, Response: response.Response });
  //         this.modalRef.hide();
  //       } else {
  //         this.Toastr.NewToastrMessage( { Type: 'Error', Message: response.Message } );
  //       }
  //     });
  //   } else {
  //     Object.keys(this.BusinessAndBranchForm.controls).map(obj => {
  //       const FControl = this.BusinessAndBranchForm.controls[obj] as FormControl;
  //       if (FControl.invalid) {
  //         FControl.markAsTouched();
  //         FControl.markAsDirty();
  //       }
  //     });
  //   }
  // }

}
