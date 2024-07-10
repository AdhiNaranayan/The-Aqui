import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerManagementService } from 'src/app/services/customer-management/customer-management.service';
import { LoginManageService } from 'src/app/services/login-management/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';

@Component({
  selector: 'app-modal-branch-edit',
  templateUrl: './modal-branch-edit.component.html',
  styleUrls: ['./modal-branch-edit.component.css']
})
export class ModalBranchEditComponent implements OnInit {

  BranchForm: FormGroup;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  User: any;
  Info: any;
  BranchDetails: any;
  BranchId: any;
  UserInfo: any;
  MobileNumeric = new RegExp('^[0-9 +]+$');
  AlphaNumericUnderscoreHyphenDot = new RegExp('^[A-Za-z0-9_.-]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Numeric = new RegExp('^[0-9]+$');


  constructor(
    public modalRef: BsModalRef,
    public CustomerService: CustomerManagementService,
    public LoginService: LoginManageService,
    public Toastr: ToastrService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
   }
 
  ngOnInit(): void {
    this.onClose = new Subject();

    if (this.Type === 'Edit') {
      this.BranchForm = new FormGroup({
        BranchId: new FormControl(this.BranchId),
        BranchName : new FormControl(this.BranchDetails.BranchName),
        BranchCreditLimit : new FormControl(this.BranchDetails.BranchCreditLimit),
        Address : new FormControl(this.BranchDetails.Address),
        RegistrationId : new FormControl(this.BranchDetails.RegistrationId),
        Mobile : new FormControl(this.BranchDetails.Mobile),
        GSTIN : new FormControl(this.BranchDetails.GSTIN),
      });
    }
  }

  onSubmit() {

    if (this.Type === 'Edit') {
      this.Update();
    }

  }

  Update() {
    if (this.BranchForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.BranchForm.value;
      this.CustomerService.BranchDetails_Update(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.onClose.next({ Status: true, Response: response.Response });
          this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'User details Successfully Updated' } );
          this.modalRef.hide();
        } else {
          if (response.error.Message === undefined || response.error.Message === '' || response.error.Message === null) {
            response.error.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.error.Message });
          this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
          this.modalRef.hide();
        }
      });
    } else {
      Object.keys(this.BranchForm.controls).map(obj => {
        const FControl = this.BranchForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }


  CustomValidation(Condition: any): ValidatorFn {
    if (Condition === 'AlphabetsSpaceHyphen') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphen.test(control.value)) {
          return { AlphabetsSpaceHyphenError: true };
        }
        return null;
      };
    }
    if (Condition === 'AlphaNumericUnderscoreHyphenDot') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphaNumericUnderscoreHyphenDot.test(control.value)) {
          return { AlphaNumericUnderscoreHyphenDotError: true };
        }
        return null;
      };
    }
    if (Condition === 'Numeric') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.Numeric.test(control.value)) {
          return { NumericError: true };
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
    const FControl = this.BranchForm.get(KeyName) as FormControl;
    if (FControl.invalid && FControl.touched) {
      const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
      if (ErrorKeys.length > 0) {
        let returnText = '';
        if (ErrorKeys.indexOf('required') > -1) {
          returnText = 'This field is required';
        } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenError') > -1) {
          returnText = 'Please Enter Only Alphabets, Space and Hyphen!';
        } else if (ErrorKeys.indexOf('AlphaNumericUnderscoreHyphenDotError') > -1) {
          returnText = 'Please Enter Only Alphabets, Numerics, Space, Hyphen and Dot!';
        } else if (ErrorKeys.indexOf('MobileNumericError') > -1) {
          returnText = 'Please Enter Only Numeric, Spaces and +!';
        } else if (ErrorKeys.indexOf('NumericError') > -1) {
          returnText = 'Please Enter Only Numbers!';
        } else if (ErrorKeys.indexOf('minlength') > -1) {
          returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength;
        } else if (ErrorKeys.indexOf('maxlength') > -1) {
          returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength;
        } else if (ErrorKeys.indexOf('email') > -1) {
          returnText = 'Please Enter Valid Email!';
        } else if (ErrorKeys.indexOf('AlphaNumericSpaceHyphenError') > -1) {
          returnText = 'Please Enter Only Alphabets, Numerics, Space and Hyphen!';
        } else {
          returnText = 'Undefined error detected!';
        }
        return returnText;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  CommonInputReset(control: any, value: any) {
    this.BranchForm.controls[control].setValue(value);
    this.BranchForm.controls[control].clearValidators();
    this.BranchForm.controls[control].setErrors(null);
    this.BranchForm.controls[control].markAsPristine();
    this.BranchForm.controls[control].markAsUntouched();
    this.BranchForm.controls[control].updateValueAndValidity();
  }

  NotAllow(): boolean { return false; }
  ClearInput(event: KeyboardEvent): boolean {
     const Events = event.composedPath() as EventTarget[];
     const Input = Events[0] as HTMLInputElement;
     const FControl = Input.attributes as NamedNodeMap;
     const FControlName = FControl.getNamedItem('formcontrolname').textContent;
     this.BranchForm.controls[FControlName].setValue(null);
     return false;
  }

}
