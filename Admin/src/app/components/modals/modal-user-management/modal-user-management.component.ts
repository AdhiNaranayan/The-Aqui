import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { ToastrService } from '../../../services/common-services/toastr.service';
import { UserManagementService } from '../../../services/user-management/user-management.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
@Component({
  selector: 'app-modal-user-management',
  templateUrl: './modal-user-management.component.html',
  styleUrls: ['./modal-user-management.component.css']
})
export class ModalUserManagementComponent implements OnInit {
  UserForm: FormGroup;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  Info: any;
  User: any;
  UserDetails: any;
  UserInfo: any;

  ShowPassword = false;

  MobileNumeric = new RegExp('^[0-9 +]+$');
  AlphaNumericUnderscoreHyphenDot = new RegExp('^[A-Za-z0-9_.-]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Numeric = new RegExp('^[0-9]+$');

  User_Roles: any[] = [
    { Name: 'Super Admin', Key: 'Super_Admin' },
    { Name: 'Staff', Key: 'Staff' }];

  Genders: any[] = [
    { Name: 'Male', Key: 'Male' },
    { Name: 'Female', Key: 'Female' }
  ];


  constructor(
    public modalRef: BsModalRef,
    public UserService: UserManagementService,
    public LoginService: LoginManageService,
    public Toastr: ToastrService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
   }

  ngOnInit(): void {
    this.onClose = new Subject();
    if (this.Type === 'Create') {
      this.UserForm = new FormGroup({
        UserName: new FormControl('', {
          validators: [Validators.required, this.CustomValidation('AlphaNumericUnderscoreHyphenDot')],
           }),
        Name: new FormControl('', Validators.required),
        Gender: new FormControl('', Validators.required),
        Email: new FormControl('', Validators.required),
        Phone: new FormControl('', [Validators.required, this.CustomValidation('MobileNumeric'), Validators.maxLength(10)]),
        User_Role: new FormControl('', Validators.required),
        Password: new FormControl('', Validators.required),
        User: new FormControl(this.UserInfo._id),
        RetypePassword: new FormControl('', Validators.required),
        User_Status: new FormControl('Activated')
      });

    }

    if (this.Type === 'Edit') {
      this.UserForm = new FormGroup({
        User: new FormControl(this.UserDetails._id),
        Name: new FormControl(this.UserDetails.Name, Validators.required),
        UserName: new FormControl(this.UserDetails.UserName, Validators.required),
        Gender: new FormControl(this.UserDetails.Gender, Validators.required),
        Phone: new FormControl(this.UserDetails.Phone, Validators.required),
        Email: new FormControl(this.UserDetails.Email, Validators.required),
        User_Role: new FormControl(this.UserDetails.User_Role, Validators.required),
        Password: new FormControl(this.UserDetails.Password, Validators.required),
        RetypePassword: new FormControl(this.UserDetails.Password, Validators.required),
        User_Status: new FormControl(this.UserDetails.User_Status)
    });
  }

    this.UserForm.setValidators(this.passwordMatchValidator());

  }

  onSubmit() {
    if (this.Type === 'Create') {
      this.Submit();
    }
    if (this.Type === 'Edit') {
      this.Update();
    }

  }

  Submit() {
    if (this.UserForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.UserForm.value;
      this.UserService.User_Create(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New User Successfully Created' } );
          this.onClose.next({ Status: true, Response: response.Response });
          this.modalRef.hide();
        } else {
          if (response.Message === undefined || response.Message === '' || response.Message === null) {
            response.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage( { Type: 'Error', Message: response.Message } );
          this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
          this.modalRef.hide();
        }
      });
    } else {
      Object.keys(this.UserForm.controls).map(obj => {
        const FControl = this.UserForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (FGroup: FormGroup): ValidationErrors => {
       const password: string = FGroup.get('Password').value;
       const confirmPassword: string = FGroup.get('RetypePassword').value;
       if (password !== '' && confirmPassword !== '') {
          if (password !== confirmPassword) {
             FGroup.get('RetypePassword').markAsTouched();
             FGroup.get('RetypePassword').setErrors({ notSame: true });
          } else {
             FGroup.get('RetypePassword').setErrors(null);
          }
       }
       return;
    };
 }

  Update() {
    if (this.UserForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.UserForm.value;

      this.UserService.User_Update(Info).subscribe(response => {

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
      Object.keys(this.UserForm.controls).map(obj => {
        const FControl = this.UserForm.controls[obj] as FormControl;
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
    const FControl = this.UserForm.get(KeyName) as FormControl;
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
    this.UserForm.controls[control].setValue(value);
    this.UserForm.controls[control].clearValidators();
    this.UserForm.controls[control].setErrors(null);
    this.UserForm.controls[control].markAsPristine();
    this.UserForm.controls[control].markAsUntouched();
    this.UserForm.controls[control].updateValueAndValidity();
  }

  NotAllow(): boolean { return false; }
  ClearInput(event: KeyboardEvent): boolean {
     const Events = event.composedPath() as EventTarget[];
     const Input = Events[0] as HTMLInputElement;
     const FControl = Input.attributes as NamedNodeMap;
     const FControlName = FControl.getNamedItem('formcontrolname').textContent;
     this.UserForm.controls[FControlName].setValue(null);
     return false;
  }

}



