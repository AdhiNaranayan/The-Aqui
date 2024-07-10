import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from '../../../services/common-services/toastr.service';

export interface Industry { _id: string; Industry_Name: string; }
@Component({
  selector: 'app-business-and-branches',
  templateUrl: './business-and-branches.component.html',
  styleUrls: ['./business-and-branches.component.scss']
})
export class BusinessAndBranchesComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  modalReference: BsModalRef;
  onClose: Subject<any>;
  UserInfo: any;
  Type: string;
  BusinessAndBranchForm: FormGroup;
  ViewFormGroup: FormGroup;
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  BranchInfo: any;
  FilterIndustry: Observable<Industry[]>;
  LastSelectedIndustry = null;
  IndustryList: Industry[] = [];
  Uploading = false;
  BusinessInfo: any;
  inputValue: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  constructor(
    public ModalService: BsModalService,
    public modalRef: BsModalRef,
    public modalRefView: BsModalRef,
    private BusinessService: BusinessManagementService,
    private Toastr: ToastrService,
    public router: Router,
    public LoginService: LoginManageService,
    private DataPassingService: CategoryDataPassingService,
  ) {
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
    if (this.Type === 'Create' && this.CustomerCategory === 'Seller') {
      this.BusinessService.IndustrySimpleList({ Owner: this.UserInfo.User }).subscribe(response => {
        this.IndustryList = response.Response;
      });

      this.BusinessAndBranchForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User),
        // BusinessName: new FormControl('', Validators.required),
        FirstName: new FormControl('', Validators.required),
        LastName: new FormControl(''),
        Industry: new FormControl('', Validators.required),
        BusinessCreditLimit: new FormControl('', [this.CustomValidation('Numerics'), Validators.required]),
        Mobile: new FormControl({ value: this.UserInfo.Mobile, disabled: true }),
        // Mobile : new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10), Validators.required]),
        CustomerCategory: new FormControl('Seller'),
      });

      this.FilterIndustry = this.BusinessAndBranchForm.controls.Industry.valueChanges.pipe(
        startWith(''), map(value => {
          if (value && value !== null && value !== '') {
            if (typeof value === 'object') {
              if (this.LastSelectedIndustry === null || this.LastSelectedIndustry !== value._id) {
                this.LastSelectedIndustry = value._id;
              }
              value = value.Industry_Name;
            }
            return this.IndustryList.filter(option => option.Industry_Name.toLowerCase().includes(value.toLowerCase()));
          } else {
            this.LastSelectedIndustry = null;
            return this.IndustryList;
          }
        })
      );
      // this.BusinessAndBranchForm.get('BranchCreditLimit').setValidators([this.CreditAmountChange()]);
    } else if (this.Type === 'Create' && this.CustomerCategory === 'Buyer') {
      this.BusinessService.IndustrySimpleList({ Owner: this.UserInfo.User }).subscribe(response => {
        this.IndustryList = response.Response;
      });
      this.BusinessAndBranchForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User),
        FirstName: new FormControl('', Validators.required),
        LastName: new FormControl(''),
        Industry: new FormControl('', Validators.required),
        BusinessCreditLimit: new FormControl('0'),
        // BranchName: new FormControl('', Validators.required),
        Mobile: new FormControl({ value: this.UserInfo.Mobile, disabled: true }),
        // Address: new FormControl('', Validators.required),
        // RegistrationId: new FormControl('', Validators.required),
        // GSTIN: new FormControl('', Validators.required),
        CustomerCategory: new FormControl('Buyer'),
      });

      this.FilterIndustry = this.BusinessAndBranchForm.controls.Industry.valueChanges.pipe(
        startWith(''), map(value => {
          if (value && value !== null && value !== '') {
            if (typeof value === 'object') {
              if (this.LastSelectedIndustry === null || this.LastSelectedIndustry !== value._id) {
                this.LastSelectedIndustry = value._id;
              }
              value = value.Industry_Name;
            }
            return this.IndustryList.filter(option => option.Industry_Name.toLowerCase().includes(value.toLowerCase()));
          } else {
            this.LastSelectedIndustry = null;
            return this.IndustryList;
          }
        })
      );
    } else if (this.Type === 'BusinessEdit' && this.CustomerCategory === 'Seller') {
      this.BusinessService.IndustrySimpleList({ Owner: this.UserInfo.User }).subscribe(response => {
        this.IndustryList = response.Response;

      });

      this.BusinessAndBranchForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User),
        FirstName: new FormControl(this.BusinessInfo?.FirstName, Validators.required),
        LastName: new FormControl(''),
        Industry: new FormControl(this.BusinessInfo?.Industry, Validators.required),
        BusinessCreditLimit: new FormControl(this.BusinessInfo?.BusinessCreditLimit, Validators.required),
        BusinessId: new FormControl(this.BusinessInfo?._id, [this.CustomValidation('Numerics'), Validators.required]),
        CustomerCategory: new FormControl(this.UserInfo?.CustomerCategory, Validators.required),
      });
    } else if (this.Type === 'BusinessEdit' && this.CustomerCategory === 'Buyer') {
      this.BusinessService.IndustrySimpleList({ Owner: this.UserInfo.User }).subscribe(response => {
        this.IndustryList = response.Response;
      });
      this.BusinessAndBranchForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User),
        FirstName: new FormControl(this.BusinessInfo?.FirstName, Validators.required),
        LastName: new FormControl(''),
        Industry: new FormControl(this.BusinessInfo?.Industry, Validators.required),
        BusinessCreditLimit: new FormControl(this.BusinessInfo?.BusinessCreditLimit, Validators.required),
        BusinessId: new FormControl(this.BusinessInfo?._id, [this.CustomValidation('Numerics'), Validators.required]),
        CustomerCategory: new FormControl(this.UserInfo?.CustomerCategory, Validators.required),
      });
    } else if (this.Type === 'AddBranch' && this.CustomerCategory === 'Seller') {


      this.BusinessAndBranchForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User),
        Business: new FormControl(this.BusinessInfo._id),
        BusinessCreditLimit: new FormControl(this.BusinessInfo.BusinessCreditLimit, Validators.required),
        BranchName: new FormControl('', Validators.required),
        Mobile: new FormControl('', Validators.required),
        Address: new FormControl('', Validators.required),
        RegistrationId: new FormControl('', Validators.required),
        GSTIN: new FormControl('', Validators.required),
        BranchCreditLimit: new FormControl('', Validators.required),
      });
      this.BusinessAndBranchForm.get('BranchCreditLimit').setValidators([this.CreditAmountChange()]);
    } else if (this.Type === 'AddBranch' && this.CustomerCategory === 'Buyer') {
      this.BusinessAndBranchForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User),
        Business: new FormControl(this.BusinessInfo._id),
        BranchName: new FormControl('', Validators.required),
        Mobile: new FormControl('', Validators.required),
        Address: new FormControl('', Validators.required),
        RegistrationId: new FormControl('', Validators.required),
        GSTIN: new FormControl('', Validators.required),
      });
    }


  }

  IndustryDisplayName(Industry: any) {
    return (Industry && Industry !== null && Industry !== '') ? Industry.Industry_Name : null;
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
    if (Condition === 'MobileNumeric') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.MobileNumeric.test(control.value)) {
          return { MobileNumericError: true };
        }
        return null;
      };
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

  trackBusinessAmount(event: any) {
    this.inputValue = event.target.value;
    const BusineessAmountControl = this.BusinessAndBranchForm.get('BusinessCreditLimit');
    const BusnsAmount = Number(this.inputValue);

    if (BusnsAmount < 0) {
      // If the value is negative, set it to 0
      BusineessAmountControl.setValue(0);
    }
  }

  SellerCreateBusiness() {

    if (this.BusinessAndBranchForm.valid) {
      // const Info = this.BusinessAndBranchForm.value;
      const Info = {
        "CustomerId": this.BusinessAndBranchForm.controls["CustomerId"].value,
        "FirstName": this.BusinessAndBranchForm.controls["FirstName"].value,
        "LastName": this.BusinessAndBranchForm.controls["LastName"].value,
        "Industry": this.BusinessAndBranchForm.controls["Industry"].value,
        "BusinessCreditLimit": this.BusinessAndBranchForm.controls["BusinessCreditLimit"].value,
        "Mobile": this.BusinessAndBranchForm.controls["Mobile"].value,
        "CustomerCategory": this.BusinessAndBranchForm.controls["CustomerCategory"].value,
      }

      this.BusinessService.CreateBusiness(Info).subscribe(response => {

        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Business Successfully Created' });
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
      Object.keys(this.BusinessAndBranchForm.controls).map(obj => {
        const FControl = this.BusinessAndBranchForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  BuyerCreateBusinessAndBranch() {
    if (this.BusinessAndBranchForm.valid) {
      // const Info = this.BusinessAndBranchForm.value;
      const Info = {
        "CustomerId": this.BusinessAndBranchForm.controls["CustomerId"].value,
        "FirstName": this.BusinessAndBranchForm.controls["FirstName"].value,
        "LastName": this.BusinessAndBranchForm.controls["LastName"].value,
        "Industry": this.BusinessAndBranchForm.controls["Industry"].value,
        "BusinessCreditLimit": this.BusinessAndBranchForm.controls["BusinessCreditLimit"].value,
        "Mobile": this.BusinessAndBranchForm.controls["Mobile"].value,
        "CustomerCategory": this.BusinessAndBranchForm.controls["CustomerCategory"].value,
      }
      this.BusinessService.CreateBusiness(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Business Successfully Created' });
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
      Object.keys(this.BusinessAndBranchForm.controls).map(obj => {
        const FControl = this.BusinessAndBranchForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  SellerBusinessUpdated() {

    if (this.BusinessAndBranchForm) {
      const Info = this.BusinessAndBranchForm.value;
      // this.BusinessService.BusinessAndBranchUpdate(Info).subscribe(response => {
      this.BusinessService.BusinessUpdate(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Business Successfully Updated' });
          this.onClose.next({ Status: true, Response: response.Response });
          this.modalRef.hide();
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
        }
      });
    } else {
      Object.keys(this.BusinessAndBranchForm.controls).map(obj => {
        const FControl = this.BusinessAndBranchForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }


  // SellerAddBranch() {
  //   if (this.BusinessAndBranchForm.valid) {
  //     const Info = this.BusinessAndBranchForm.value;
  //     this.BusinessService.SellerAddBranch(Info).subscribe(response => {
  //       this.Uploading = false;
  //       if (response.Status) {
  //         this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Branch Successfully Created' });
  //         this.onClose.next({ Status: true, Response: response.Response });
  //         this.modalRef.hide();
  //       } else {
  //         if (response.Message === undefined || response.Message === '' || response.Message === null) {
  //           response.Message = 'Some Error Occoured!, But not Identified.';
  //         }
  //         this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
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

  // BuyerAddBranch() {
  //   if (this.BusinessAndBranchForm.valid) {
  //     const Info = this.BusinessAndBranchForm.value;
  //     this.BusinessService.BuyerAddBranch(Info).subscribe(response => {
  //       this.Uploading = false;
  //       if (response.Status) {
  //         this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Branch Successfully Created' });
  //         this.onClose.next({ Status: true, Response: response.Response });
  //         this.modalRef.hide();
  //       } else {
  //         if (response.Message === undefined || response.Message === '' || response.Message === null) {
  //           response.Message = 'Some Error Occoured!, But not Identified.';
  //         }
  //         this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
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
