import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IndustryServiceService } from '../../../services/industry-service.service';
import { ToastrService } from '../../../services/common-services/toastr.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
@Component({
  selector: 'app-modal-industry',
  templateUrl: './modal-industry.component.html',
  styleUrls: ['./modal-industry.component.css']
})
export class ModalIndustryComponent implements OnInit {
  onClose: Subject<any>;
  Type: string;
  IndustryForm: FormGroup;
  Uploading = false;
  Info: any;
  User: any;
  IndustryDetails: any;
  UserInfo: any;
  constructor(
    public modalRef: BsModalRef,
    public IndustryService: IndustryServiceService,
    public LoginService: LoginManageService,
    public Toastr: ToastrService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
   }

  ngOnInit(): void {
    this.onClose = new Subject();
    if (this.Type === 'Create') {
      this.IndustryForm = new FormGroup({
        Industry_Name: new FormControl('', Validators.required),
        Status: new FormControl('Activated'),
        User: new FormControl(this.UserInfo._id),
      });

    }

    if (this.Type === 'Edit') {
      this.IndustryForm = new FormGroup({
        Industry_Name: new FormControl(this.IndustryDetails.Industry_Name, Validators.required),
        IndustryId: new FormControl(this.IndustryDetails._id),
        User: new FormControl(this.UserInfo._id),
    });
  }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.IndustryForm.get(KeyName) as FormControl;
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

  onSubmit() {
    if (this.Type === 'Create') {
      this.Submit();
    }
    if (this.Type === 'Edit') {
      this.Update();
    }

  }

  Submit() {
    if (this.IndustryForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.IndustryForm.value;
      this.IndustryService.Industry_Create(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
           this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'New Industries Successfully Created' } );
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
      Object.keys(this.IndustryForm.controls).map(obj => {
        const FControl = this.IndustryForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  NotAllow(): boolean { return false; }
   ClearInput(event: KeyboardEvent): boolean {
      const Events = event.composedPath() as EventTarget[];
      const Input = Events[0] as HTMLInputElement;
      const FControl = Input.attributes as NamedNodeMap;
      const FControlName = FControl.getNamedItem('formcontrolname').textContent;
      this.IndustryForm.controls[FControlName].setValue(null);
      return false;
   }

  Update() {
    if (this.IndustryForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.IndustryForm.value;

      this.IndustryService.Industry_Update(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.onClose.next({ Status: true, Response: response.Response });
          this.Toastr.NewToastrMessage( { Type: 'Success', Message: 'Industries Details Successfully Updated' } );
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
      Object.keys(this.IndustryForm.controls).map(obj => {
        const FControl = this.IndustryForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }


}
