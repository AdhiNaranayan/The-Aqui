

import { Component, OnInit } from '@angular/core';
// import { SocketManagementService } from './../../../services/socket-management/socket-management.service';
import { LoginManageService } from './../../../services/common-services/login-manage.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from '../../../services/common-services/toastr.service';


import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
@Component({
  selector: 'app-session-logout-modal',
  templateUrl: './session-logout-modal.component.html',
  styleUrls: ['./session-logout-modal.component.scss']
})
export class SessionLogoutModalComponent implements OnInit {


  onClose: Subject<any>;

  LoginForm: FormGroup;

  UserData = CryptoJS.AES.decrypt(localStorage.getItem('SessionWeb'), localStorage.getItem('SessionKeyWeb').slice(3, 10)).toString(CryptoJS.enc.Utf8);
  constructor(public LoginService: LoginManageService,
    public ModalRef: BsModalRef,
    public Toastr: ToastrService) { }

  ngOnInit() {
    this.UserData = JSON.parse(this.UserData);
    this.onClose = new Subject();
    this.LoginForm = new FormGroup({
      UpdateKey: new FormControl(localStorage.getItem('SessionKeyWeb'), Validators.required),
      Mobile: new FormControl(this.UserData.Mobile, Validators.required),
      Password: new FormControl('', Validators.required),
    });
  }

  GoToLogin() {
    this.onClose.next({ Status: false });
    this.ModalRef.hide();
  }

  Login() {
    if (this.LoginForm.valid) {
      this.LoginService.Login(this.LoginForm.getRawValue()).subscribe(response => {
        if (response.Status) {
          const UserData = CryptoJS.AES.decrypt(response.Response, response.Key.slice(3, 10)).toString(CryptoJS.enc.Utf8);
          localStorage.setItem('SessionWeb', response.Response);
          localStorage.setItem('SessionKeyWeb', response.Key);
          localStorage.setItem('SessionVerifyWeb', btoa(Date()));
          this.onClose.next({ Status: true });
          this.ModalRef.hide();
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Session Renewed Successfully!' });
        } else {
          if (response.Message === undefined || response.Message === '' || response.Message === null) {
            response.Message = 'Some Error Occoured!, But not Identified.';
          }
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          this.onClose.next({ Status: false });
          this.ModalRef.hide();
        }
      });
    } else {
      this.LoginForm.controls.Mobile.markAsTouched();
      this.LoginForm.controls.Mobile.markAsDirty();
      this.LoginForm.controls.Password.markAsTouched();
      this.LoginForm.controls.Password.markAsDirty();
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.LoginForm.get(KeyName) as FormControl;
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



