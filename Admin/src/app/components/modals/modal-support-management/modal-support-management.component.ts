import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SupportManagementService } from 'src/app/services/support-management/support-management.service';
import { LoginManageService } from 'src/app/services/login-management/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';

@Component({
  selector: 'app-modal-support-management',
  templateUrl: './modal-support-management.component.html',
  styleUrls: ['./modal-support-management.component.css']
})
export class ModalSupportManagementComponent implements OnInit {
  CustomerSupportForm: FormGroup;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  User: any;
  UserInfo: any;
  GenderTypes: any[] = [{ Name: 'Male', Key: 'Male' },
  { Name: 'Female', Key: 'Female' }];
  id: string;
  Numerics = new RegExp('^[0-9]+$');
  CustomerSupportDetails: any;
  SupportDetails: any[] = [];

  constructor(
    public modalRef: BsModalRef,
    public SupportService: SupportManagementService,
    public LoginService: LoginManageService,
    public Toastr: ToastrService) {
      this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
  }

  ngOnInit(): void {
    this.onClose = new Subject();

    if (this.Type === 'Reply') {
       this.SupportDetails = this.CustomerSupportDetails.Support_Details;
       this.CustomerSupportForm = new FormGroup({
          CustomerId: new FormControl(this.CustomerSupportDetails.Customer._id, Validators.required),
          SupportId: new FormControl(this.CustomerSupportDetails._id, Validators.required),
          Message: new FormControl('', Validators.required),
          User: new FormControl(this.UserInfo._id, Validators.required),
       });
    }
  }

  AutocompleteBlur(key: any) {
    setTimeout(() => {
       const value = this.CustomerSupportForm.controls[key].value;
       if (!value || value === null || value === '' || typeof value !== 'object') {
          this.CustomerSupportForm.controls[key].setValue(null);
       }
    }, 500);
 }


 CommonInputReset(arg0: string, arg1: string) {

 }
 CommonValidatorsSet(arg0: string, arg1: boolean, arg2: string) {

 }
 onSubmit() {

   if (this.Type === 'Reply') {
     this.Update();
   }

 }

 Update() {
    if (this.CustomerSupportForm.valid && !this.Uploading) {
       this.Uploading = true;
       const Info = this.CustomerSupportForm.value;
       this.SupportService.CustomerSupport_Update(Info).subscribe(response => {
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
        } else if (ErrorKeys.indexOf('NumericsError') > -1) {
           returnText = 'Please Enter Only Numerics!';
        } else if (ErrorKeys.indexOf('minlength') > -1) {
           returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength + ' Digits/Characters';
        } else if (ErrorKeys.indexOf('maxlength') > -1) {
           returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength + ' Digits/Characters';
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
  if (Condition === 'Numerics') {
     return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.Numerics.test(control.value)) {
           return { NumericsError: true };
        }
        return null;
     };
  }
}

}
