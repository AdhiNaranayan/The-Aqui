import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { OwnerRegisterService } from 'src/app/services/registration/owner-register.service';
@Component({
  selector: 'app-modal-user-management',
  templateUrl: './modal-user-management.component.html',
  styleUrls: ['./modal-user-management.component.scss']
})
export class ModalUserManagementComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  modalReference: BsModalRef;
  onClose: Subject<any>;
  UserInfo: any;
  Type: string;
  UserGroup: FormGroup;
  UserOfInfo: any;
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
  StateList: any[] = [];
  Uploading = false;
  Business: FormArray;
  Branch: FormArray;
  BusinessAssigned: any[] = [];
  BranchUnAssigned: any[] = [];
  BusinessArray: any[] = [];
  AllCategory: any[] = [];
  length: boolean = true;
  UserPaymentApprove: boolean = false;
  UserInvoiceApprove: boolean = false;
  CustomerCategory: any;
  constructor(
    public ModalService: BsModalService,
    public OwnerRegister: OwnerRegisterService,
    public modalRef: BsModalRef,
    public Toastr: ToastrService,
    public LoginService: LoginManageService,
    private CategoryPassingService: CategoryDataPassingService,
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.OwnerRegister.GetStates({ User: '' }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.StateList = response.Response;
      }
    });

    this.subscription.add(
      this.CategoryPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          this.GetBusinessUnAssigned();
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );

  }


  ngOnInit(): void {

    this.onClose = new Subject();
    if (this.Type === 'Create' && this.CustomerCategory === 'Seller') {
      this.UserGroup = new FormGroup({
        ContactName: new FormControl('', [Validators.required, this.CustomValidation('AlphabetsSpaceHyphenDot')]),
        Mobile: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(10), Validators.maxLength(10), Validators.required]),
        Email: new FormControl('', [Validators.required, Validators.email]),
        CustomerType: new FormControl('User', Validators.required),
        CustomerCategory: new FormControl('Seller', Validators.required),
        Owner: new FormControl(this.UserInfo.User),
        UserPaymentApprove: new FormControl(this.UserPaymentApprove),
        BusinessAndBranches: new FormArray([])
      });
    }
    else if (this.Type === 'Create' && this.CustomerCategory === 'Buyer') {
      this.UserGroup = new FormGroup({
        ContactName: new FormControl('', [Validators.required, this.CustomValidation('AlphabetsSpaceHyphenDot')]),
        Mobile: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(10), Validators.maxLength(10), Validators.required]),
        Email: new FormControl('', [Validators.required, Validators.email]),
        CustomerType: new FormControl('User', Validators.required),
        CustomerCategory: new FormControl('Buyer', Validators.required),
        Owner: new FormControl(this.UserInfo.User),
        UserInvoiceApprove: new FormControl(this.UserInvoiceApprove),
        BusinessAndBranches: new FormArray([])
      });
    }
    else if (this.Type === 'View') {
      this.ViewFormGroup = new FormGroup({
        // IfUserBranch: new FormControl('No'),
        IfUserBusiness: new FormControl('')
      });
    }
    if (this.Type === 'Update' && this.CustomerCategory === 'Seller') {
      this.UserGroup = new FormGroup({
        ContactName: new FormControl(this.UserOfInfo?.ContactName, [Validators.required, this.CustomValidation('AlphabetsSpaceHyphenDot')]),
        Mobile: new FormControl(this.UserOfInfo?.Mobile, [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10), Validators.required]),
        Email: new FormControl(this.UserOfInfo?.Email, [Validators.required, Validators.email]),
        UserPaymentApprove: new FormControl(this.UserOfInfo?.IfSellerUserPaymentApprove),
        UserId: new FormControl(this.UserOfInfo?._id, Validators.required),
        BusinessAndBranches: new FormArray([])
      });

      this.UserOfInfo.BusinessAndBranches.map(obj => {
        const NewFGroup = new FormGroup({
          Business: new FormControl(obj.FirstName),
          // Branches: new FormArray([])
        });
        const FArray = this.UserGroup.get('BusinessAndBranches') as FormArray;
        FArray.push(NewFGroup);
        FArray.controls.map(Obj => {
          const FGroup = Obj as FormGroup;
          const FBranchArray = FGroup.get('Branches') as FormArray;
        });
      });
    } else if (this.Type === 'Update' && this.CustomerCategory === 'Buyer') {
      this.UserGroup = new FormGroup({
        ContactName: new FormControl(this.UserOfInfo?.ContactName, [Validators.required, this.CustomValidation('AlphabetsSpaceHyphenDot')]),
        Mobile: new FormControl(this.UserOfInfo?.Mobile, [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10), Validators.required]),
        Email: new FormControl(this.UserOfInfo?.Email, [Validators.required, Validators.email]),
        UserInvoiceApprove: new FormControl(this.UserOfInfo?.IfBuyerUserInvoiceApprove),
        UserId: new FormControl(this.UserOfInfo?._id, Validators.required),
        BusinessAndBranches: new FormArray([])
      });
    }

  }

  GetBusinessUnAssigned() {
    if (this.CustomerCategory === 'Seller') {
      this.OwnerRegister.BusinessUnAssigned({ Customer: this.UserInfo.User, CustomerCategory: this.CustomerCategory, IfSeller: true, IfBuyer: false }).subscribe(response => {

        if (response.Status && response.Status === true) {
          this.BusinessAssigned = response.Response;
          if (this.Business != undefined) {
            this.BusinessAssigned = this.BusinessAssigned.filter(itemAssigned =>
              !this.Business.value.some((itemBusiness: any) => itemBusiness.Business?._id === itemAssigned._id)
            );
            this.length = this.Business.value.filter((k: any) => k.Business != "").length == response.Response.length ? false : true;
          }
        } else {
          this.BusinessAssigned = [];
        }
      });
    } else if (this.CustomerCategory === 'Buyer') {
      this.OwnerRegister.BusinessUnAssigned({ Customer: this.UserInfo.User, CustomerCategory: this.CustomerCategory, IfSeller: false, IfBuyer: true }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BusinessAssigned = response.Response;

          if (this.Business != undefined) {
            this.BusinessAssigned = this.BusinessAssigned.filter(itemAssigned =>
              !this.Business.value.some((itemBusiness: any) => itemBusiness.Business?._id === itemAssigned._id)
            );
            this.length = this.Business.value.filter((k: any) => k.Business != "").length == response.Response.length ? false : true;
          }
        } else {
          this.BusinessAssigned = [];
        }
      });
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
    const FControl = this.UserGroup.get(KeyName) as FormControl;
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

  BusinessAssignedDisplay(BusinessAssigned: any) {
    return (BusinessAssigned && BusinessAssigned !== null && BusinessAssigned !== '') ? BusinessAssigned.FirstName + ' ' + BusinessAssigned.LastName : null;
  }

  BranchAssignedDisplay(BranchUnAssigned: any) {
    return (BranchUnAssigned && BranchUnAssigned !== null && BranchUnAssigned !== '') ? BranchUnAssigned.BranchName : null;
  }

  StateNameDisplay(State: any) {
    return (State && State !== null && State !== '') ? State.State_Name : null;
  }

  ViewBranch(index: any) {
    const IfUserBusiness = 'IfUserBusiness';
    const IfUserBranch = 'IfUserBranch';
    this.ViewFormGroup.controls[IfUserBusiness].setValue('Yes');
    this.ViewFormGroup.controls[IfUserBranch].setValue('Yes');
    if (this.ViewFormGroup.controls[IfUserBranch].value === 'Yes') {
      this.BranchInfo = this.UserOfInfo?.BusinessAndBranches[index].Branches;
    }
  }

  createBusiness(): FormGroup {
    return new FormGroup({
      Business: new FormControl('', Validators.required),
      Branches: new FormArray([
      ])
    });
  }

  createBranch(): FormGroup {
    return new FormGroup({
      Branch: new FormControl('', Validators.required)
    });
  }

  AddBusiness(): void {
    this.Business = this.UserGroup.get('BusinessAndBranches') as FormArray;
    this.Business.push(this.createBusiness());
    this.GetBusinessUnAssigned();
  }


  GetFormArray(ControlName: any): any[] {
    const FArray = this.UserGroup.get(ControlName) as FormArray;
    return FArray.controls;
  }



  AddBranch(Form) {
    const FGroup = Form as FormGroup;
    this.Branch = FGroup.get('Branches') as FormArray;
    this.Branch.push(this.createBranch());
  }

  RemoveBranch(Business, j) {
    const FGroup = Business as FormGroup;
    this.Branch = FGroup.get('Branches') as FormArray;
    this.Branch.removeAt(j);
  }

  GetFormArrayBranch() {
    const FArray = this.UserGroup.get('BusinessAndBranches') as FormArray;
    FArray.controls.map(obj => {
      const FGroup = obj as FormGroup;
      this.Branch = FGroup.get('Branches') as FormArray;
      return this.Branch;
    });
  }

  RemoveBusiness(Index: any) {
    this.Business = this.UserGroup.get('BusinessAndBranches') as FormArray;
    this.Business.removeAt(Index);
    this.GetBusinessUnAssigned();
    // this.length = this.BusinessAssigned.length == 1 || this.BusinessAssigned.length == 0 ? false : true;
  }

  Submit() {
    if (this.UserGroup.valid) {
      var transformedData = {}
      if (this.CustomerCategory === 'Seller') {
        const inputData = this.UserGroup.value;
        transformedData = {
          "ContactName": inputData.ContactName,
          "Mobile": inputData.Mobile,
          "Email": inputData.Email,
          "CustomerType": inputData.CustomerType,
          "CustomerCategory": 'Seller',
          "Owner": inputData.Owner,
          "UserPaymentApprove": inputData.UserPaymentApprove,
          "BusinessAndBranches": inputData.BusinessAndBranches.map(item => ({ "Business": item.Business._id }))
        };
      } else if (this.CustomerCategory === 'Buyer') {
        const inputData = this.UserGroup.value;
        transformedData = {
          "ContactName": inputData.ContactName,
          "Mobile": inputData.Mobile,
          "Email": inputData.Email,
          "CustomerType": inputData.CustomerType,
          "CustomerCategory": 'Buyer',
          "Owner": inputData.Owner,
          "UserInvoiceApprove": inputData.UserInvoiceApprove,
          "BusinessAndBranches": inputData.BusinessAndBranches.map(item => ({ "Business": item.Business._id }))
        };
      }
      this.OwnerRegister.OwnerCreateUser(transformedData).subscribe(response => {
        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'User Successfully Created' });
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
      Object.keys(this.UserGroup.controls).map(obj => {
        const FControl = this.UserGroup.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  Update() {
    if (this.UserGroup.valid) {
      const inputData = this.UserGroup.value;
      const transformedData = {
        "ContactName": inputData.ContactName,
        "Mobile": inputData.Mobile,
        "Email": inputData.Email,
        "UserId": inputData.UserId,
        "UserPaymentApprove": inputData.UserPaymentApprove,
        "BusinessAndBranches": inputData.BusinessAndBranches.map(item => ({
          "Business": {
            "_id": item.Business._id,
            "FirstName": item.Busines.FirstName,
            "LastName": item.Business.LastName
          }
        }))
      };

      console.log(transformedData, '6327837892347');
      return;
      this.OwnerRegister.UserDetailsUpdate(transformedData).subscribe(response => {

        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'User Details Successfully Updated' });
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
      Object.keys(this.UserGroup.controls).map(obj => {
        const FControl = this.UserGroup.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }

  BusinessChanges(Event: any) {
    this.OwnerRegister.BusinessUnAssigned({ Customer: this.UserInfo.User, CustomerCategory: this.CustomerCategory, Business: Event._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.BranchUnAssigned = response.Response;
      } else {
        this.BranchUnAssigned = [];
      }
    });
    this.GetBusinessUnAssigned();
  }

  BranchChanges(Event: any, Business, Branch) {

  }

  GoBack() {
    const IfUserBusiness = 'IfUserBusiness';
    const IfUserBranch = 'IfUserBranch';
    this.ViewFormGroup.controls[IfUserBusiness].setValue('Yes');
    this.ViewFormGroup.controls[IfUserBranch].setValue('No');
  }

}
