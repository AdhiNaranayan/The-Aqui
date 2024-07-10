import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { SupportManagementService } from 'src/app/services/support-management/support-management.service';
@Component({
  selector: 'app-modal-support-management',
  templateUrl: './modal-support-management.component.html',
  styleUrls: ['./modal-support-management.component.scss']
})
export class ModalSupportManagementComponent implements OnInit {
  modalReference: BsModalRef;
  onClose: Subject<any>;
  UserInfo: any;
  Type: string;
  UserGroup: FormGroup;
  SupportDetails: any;
  CustomerSupportForm: FormGroup;
  Uploading = false;
  SupportDetailsView: any;
  SupportDetailsArray: any[] = [];
  constructor(
    public ModalService: BsModalService,
    public modalRef: BsModalRef,
    public Toastr: ToastrService,
    public LoginService: LoginManageService,
    public SupportManagement: SupportManagementService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
  }

  ngOnInit(): void {
    this.onClose = new Subject();
    if (this.Type === 'SupportDetailsViewAndEdit') {
      this.SupportDetailsArray = this.SupportDetails.Support_Details;
      const Data = {
        CustomerId: this.UserInfo.User,
        SupportId: this.SupportDetails._id
      };
      this.SupportManagement.CustomerSupport_Detail(Data).subscribe(response => {

        this.SupportDetailsView = response.Response
      });

      this.CustomerSupportForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User, Validators.required),
        SupportId: new FormControl(this.SupportDetails._id, Validators.required),
        Message: new FormControl('', Validators.required),
      });
    } else if (this.Type === 'SupportCreate') {
      this.CustomerSupportForm = new FormGroup({
        CustomerId: new FormControl(this.UserInfo.User, Validators.required),
        SupportTitle: new FormControl('', Validators.required),
        Message: new FormControl('', Validators.required),
      });
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.CustomerSupportForm.get(KeyName) as FormControl;
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

  Update() {
    if (this.CustomerSupportForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.CustomerSupportForm.value;
      this.SupportManagement.CustomerSupport_Reply(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Support details Successfully Updated' });
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
      Object.keys(this.CustomerSupportForm.controls).map(obj => {
        const FControl = this.CustomerSupportForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  Submit() {
    if (this.CustomerSupportForm.valid) {
      this.Uploading = true;
      const Info = this.CustomerSupportForm.value;
      this.SupportManagement.CustomerSupport_Create(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Support details Successfully Updated' });
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
      Object.keys(this.CustomerSupportForm.controls).map(obj => {
        const FControl = this.CustomerSupportForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }



}
