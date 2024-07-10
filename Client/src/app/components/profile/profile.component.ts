import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { OwnerRegisterService } from 'src/app/services/registration/owner-register.service';
import { SamplePopupComponent } from 'src/app/components/Modals/sample-popup/sample-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalPopupComponent } from '../Modals/modal-popup/modal-popup.component';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: any = "https://i.postimg.cc/bryMmCQB/profile-image.jpg";
  UserInfo: any;
  url: 'http://localhost:3002/Uploads/Customer_Profile/';
  OwnerForm: FormGroup;
  sessionLan: any;
  StateList: any[] = [];
  Type: string;
  Uploading = false;
  isChecked: boolean = false;
  Info: any;
  FileName: any;
  CustomerProfile: any;
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  modalReference: BsModalRef;
  UserCategoryApprove: boolean = false;
  constructor(
    private LoginService: LoginManageService,
    private OwnerRegister: OwnerRegisterService,
    private Toastr: ToastrService,
    private router: Router,
    public ModalService: BsModalService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.OwnerRegister.CustomerProfileDetails({ CustomerId: this.UserInfo.User }).subscribe(response => {


      if (response.Status && response.Status === true) {
        this.CustomerProfile = response.Response;
        this.OwnerForm.controls.ContactName.setValue(this.CustomerProfile?.ContactName);
        this.OwnerForm.controls.Mobile.setValue(this.CustomerProfile?.Mobile);
        this.OwnerForm.controls.Email.setValue(this.CustomerProfile?.Email);
        this.OwnerForm.controls.CustomerId.setValue(this.CustomerProfile?._id);
        this.FileName = this.url + this.CustomerProfile?.File_Name;
      }
    });
  }

  ngOnInit() {

    this.OwnerForm = new FormGroup({
      ContactName: new FormControl(this.CustomerProfile?.ContactName, [Validators.required, this.CustomValidation('AlphabetsSpaceHyphenDot')]),
      Mobile: new FormControl({ value: this.CustomerProfile?.Mobile, disabled: true }, [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10), Validators.required]),
      Email: new FormControl(this.CustomerProfile?.Email, [Validators.required, Validators.email]),
      CustomerId: new FormControl(this.CustomerProfile?._id)
    });
  }



  onToggle(checked: boolean) {
    this.isChecked = checked;
    console.log('Toggle state:', this.isChecked);
    if (this.isChecked) {
      var Info = {
        CustomerId: this.CustomerProfile?._id,
        CustomerCategory: "BothBuyerAndSeller"
      }
      this.OwnerRegister.SwitchTo_BothBuyerAndSeller(Info).subscribe(response => {
        console.log(response, '121312312');

      })
    }
  }





  Profile() {
    this.modalReference = this.ModalService.show(ModalPopupComponent, Object.assign({}, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => { });
  }
  MobileNumberChange() {
    this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Contact Your Admin to Change the Mobile Number' });

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


  UpdateProfile() {
    if (this.OwnerForm.valid) {
      const Info = this.OwnerForm.getRawValue();
      this.OwnerRegister.OwnerDetailsUpdate(Info).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Details Successfully Updated' });
          this.router.navigate(['/dashboard']);
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
        }
      });
    } else {
      Object.keys(this.OwnerForm.controls).map(obj => {
        const FControl = this.OwnerForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  Deregister() {
    const Info = this.OwnerForm.getRawValue();
    var CustomerId = String(Info.CustomerId);

    this.LoginService.DeviceDeRegister(CustomerId).subscribe(response => {
      if (response) {
        this.router.navigate(['/web-login']);
        this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Deregistered SucessFully!' });
      } else {
        this.Toastr.NewToastrMessage({ Type: 'error', Message: 'Some Error Occured!' });
      }
    })

  }
  profileUpload(image: any) {
    // console.log("event_image", image.target.files)
    let fileName = image.target.files[0];
    var imageConvert = new FileReader();
    var baseString;
    const reader = new FileReader();
    reader.readAsDataURL(fileName);
    reader.onload = () => {
      reader.result;
      if (reader.result != '') {
        this.OwnerRegister.CustomerProfileUpload({ "CustomerId": this.CustomerProfile?._id, "File_Name": reader.result }).subscribe((result: any) => {
          try {
            // console.log("result", result)
          } catch (err) {

          }
        })
      }
    }
  }

  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.OwnerForm.get(KeyName) as FormControl;
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
