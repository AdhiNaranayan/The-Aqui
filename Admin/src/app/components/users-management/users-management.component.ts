import { Component, OnInit, Renderer2, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ToastrService } from '../../services/common-services/toastr.service';
import { UserManagementService } from '../../../app/services/user-management/user-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalUserViewComponent } from '../modals/modal-user-view/modal-user-view.component';
import { ModalUserStatusComponent } from '../modals/modal-user-status/modal-user-status.component';
import { from } from 'rxjs';
import { ModalUserManagementComponent } from '../modals/modal-user-management/modal-user-management.component';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserDetails: any[] = [];
  PageLoader = true;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 5;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  FilterFGroup: FormGroup;
  modalReference: BsModalRef;
  UserList: any[] = [];
  UserInfo: any;

  // Filter Input Validation
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  User_Status: any[] = [{ Name: 'Activated', Key: 'Activated' },
  { Name: 'InActive', Key: 'InActive' }];
  Genders: any[] = [
    { Name: 'Male', Key: 'Male' },
    { Name: 'Female', Key: 'Female' }
  ];
  THeaders: any[] = [{ Key: 'Name', ShortKey: 'Name', Name: 'Name', If_Short: false, Condition: '' },
  { Key: 'UserName', ShortKey: 'UserName', Name: 'User Name', If_Short: false, Condition: '' },
  { Key: 'Email', ShortKey: 'Email', Name: 'Email', If_Short: false, Condition: '' },
  { Key: 'Gender', ShortKey: 'Gender', Name: 'Gender', If_Short: false, Condition: '' },
  { Key: 'Phone', ShortKey: 'Phone', Name: 'Mobile Number', If_Short: false, Condition: '' },
  { Key: 'User_Role', ShortKey: 'User_Role', Name: 'User Role', If_Short: false, Condition: '' },
  { Key: 'User_Status', ShortKey: 'User_Status', Name: 'Current Status', If_Short: false, Condition: '' }
  ];
  FiltersArray: any[] = [
    { Active: false, Key: 'Name', Value: '', DisplayName: 'Name', DBName: 'Name', Type: 'String', Option: '' },
    { Active: false, Key: 'UserName', Value: '', DisplayName: 'User Name', DBName: 'UserName', Type: 'String', Option: '' },
    { Active: false, Key: 'Gender', Value: '', DisplayName: 'Gender', DBName: 'Gender', Type: 'String', Option: '' },
    { Active: false, Key: 'Phone', Value: '', DisplayName: 'Phone', DBName: 'Phone', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: '', DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' },
    { Active: false, Key: 'User_Status', Value: '', DisplayName: 'User Status', DBName: 'User_Status', Type: 'String', Option: '' }
  ];
  FilterFGroupStatus = false;
  constructor(private Toastr: ToastrService,
    private renderer: Renderer2,
    private UserService: UserManagementService,
    public ModalService: BsModalService,
    public LoginService: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.Service_Loader();

  }

  ngOnInit() {
    this.FilterFGroup = new FormGroup({
      Name: new FormControl(''),
      UserName: new FormControl('', Validators.required),
      Phone: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10)]),
      User_Status: new FormControl(''),
      Email: new FormControl(''),
      Gender: new FormControl('')
    });
    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });
  }

  FilterFormChanges() {
    const FilteredValues = this.FilterFGroup.value;
    this.FilterFGroupStatus = false;
    Object.keys(FilteredValues).map(obj => {
      const value = this.FilterFGroup.controls[obj].value;
      if (value !== undefined && value !== null && value !== '') {
        this.FilterFGroupStatus = true;
      }
    });
  }

  Service_Loader() {
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });
    const Filters = this.FiltersArray.filter(obj => obj.Active === true);
    const Data = {
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      User: this.UserInfo._id,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters
    };
    this.TableLoader();
    this.UserService.Users_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.UserDetails = response.Response;
        setTimeout(() => {
          this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        }, 10);
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
        //  this.Toastr.NewToastrMessage({ Type: 'Success', Message: response.Message });
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        //   this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        //  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
      }
    });
  }


  TableLoader() {
    setTimeout(() => {
      //  const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
      //  const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
    }, 10);
  }


  Pagination_Affect() {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    const PrevClass = (this.CurrentIndex > 1 ? '' : 'PageAction_Disabled');
    this.PagePrevious = { Disabled: !(this.CurrentIndex > 1), Value: (this.CurrentIndex - 1), Class: PrevClass };
    const NextClass = (this.CurrentIndex < NoOfArrays ? '' : 'PageAction_Disabled');
    this.PageNext = { Disabled: !(this.CurrentIndex < NoOfArrays), Value: (this.CurrentIndex + 1), Class: NextClass };
    this.PagesArray = [];
    for (let index = 1; index <= NoOfArrays; index++) {
      if (index === 1) {
        this.PagesArray.push({ Text: '1', Class: 'Number', Value: 1, Show: true, Active: (this.CurrentIndex === index) });
      }
      if (index > 1 && NoOfArrays > 2 && index < NoOfArrays) {
        if (index === (this.CurrentIndex - 2)) {
          this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
        }
        if (index === (this.CurrentIndex - 1)) {
          this.PagesArray.push({ Text: (this.CurrentIndex - 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
        }
        if (index === this.CurrentIndex) {
          this.PagesArray.push({ Text: this.CurrentIndex.toString(), Class: 'Number', Value: index, Show: true, Active: true });
        }
        if (index === (this.CurrentIndex + 1)) {
          this.PagesArray.push({ Text: (this.CurrentIndex + 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
        }
        if (index === (this.CurrentIndex + 2)) {
          this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
        }
      }
      if (index === NoOfArrays && NoOfArrays > 1) {
        this.PagesArray.push({
          Text: NoOfArrays.toString(),
          Class: 'Number', Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index)
        });
      }
    }
    let ToCount = this.SkipCount + this.LimitCount;
    if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
    this.ShowingText = 'Showing <span>' + (this.SkipCount + 1) + '</span> to <span>'
      + ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
  }

  Pagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
    }
  }

  Short_Change(index: any) {
    if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
    } else if (this.THeaders[index].If_Short !== undefined &&
      this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Descending';
      this.Pagination_Action(1);
    } else if (this.THeaders[index].If_Short !== undefined
      && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
    } else {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.Pagination_Action(1);
    }
  }

  EditUser(index: any) {
    const initialState = {
      Type: 'Edit',
      UserDetails: this.UserDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalUserManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.UserDetails[index] = response.Response;
        this.Service_Loader();
      }
    });
  }

  ViewUser(index: any) {
    const initialState = {
      Info: this.UserDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalUserViewComponent, Object.assign({
      initialState
    }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.UserDetails[index] = response.Response;
      }
    });
  }

  UserInActive(index: any) {
    const initialState = {
      Icon: 'block',
      ColorCode: 'danger',
      TextOne: 'You Want to',
      TextTwo: 'In-active',
      TextThree: 'this User?',
    };
    this.modalReference = this.ModalService.show(ModalUserStatusComponent,
      Object.assign({ initialState }, {
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered animated zoomIn modal-small-with'
      }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        const UserId = this.UserDetails[index]._id;
        this.UserService.UserActive_Status({
          UserId,
          User_Status: 'InActive', User: this.UserInfo._id
        }).subscribe(responseNew => {
          if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'User  Account Inactivated' });
          }
        });
      }
    });
  }


  UserActive(index: any) {
    const initialState = {
      Icon: 'verified_user',
      ColorCode: 'success',
      TextOne: 'You Want to',
      TextTwo: 'Active',
      TextThree: 'this User?',
    };
    this.modalReference = this.ModalService.show(ModalUserStatusComponent,
      Object.assign({ initialState }, {
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered animated zoomIn modal-small-with'
      }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        const UserId = this.UserDetails[index]._id;
        const User = this.UserInfo._id;
        this.UserService.UserActive_Status({
          User, User_Status: 'Activated',
          UserId
        }).subscribe(responseNew => {
          if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'User Account has been Activated' });
          } else if (!responseNew.error.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: responseNew.error.Message });
          }
        });
      }
    });
  }


  CreateUser() {
    const initialState = { Type: 'Create' };
    // tslint:disable-next-line: max-line-length
    this.modalReference = this.ModalService.show(ModalUserManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }


  Success() {
    this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Success Message! Everything is working Good' });
  }

  Info() {
    this.Toastr.NewToastrMessage({ Type: 'Info', Message: 'Info Message! This is just for Information' });
  }

  Warning() {
    this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Warning Message! Don`t do this again' });
  }

  Error() {
    this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Error Message! Some error occured' });
  }


  SubmitFilters() {
    const FilteredValues = this.FilterFGroup.value;
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
    });
    Object.keys(FilteredValues).map(obj => {
      const value = this.FilterFGroup.controls[obj].value;
      if (value !== undefined && value !== null && value !== '') {
        const index = this.FiltersArray.findIndex(objNew => objNew.Key === obj);
        this.FiltersArray[index].Active = true;
        this.FiltersArray[index].Value = value;
      }
    });

    this.Pagination_Action(1);
    this.modalReference.hide();
  }

  AutocompleteBlur(key: any) {
    const value = this.FilterFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
      this.FilterFGroup.controls[key].setValue(null);
    }
  }

  ResetFilters() {
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.FilterFGroupStatus = false;
    this.Pagination_Action(1);
    // this.modalReference.hide();
  }

  RemoveFilter(index: any) {
    const KeyName = this.FiltersArray[index].Key;
    const EmptyValue = this.FiltersArray[index].Type === 'String' ? '' : null;
    this.FilterFGroup.controls[KeyName].setValue(EmptyValue);
    this.SubmitFilters();
  }

  openFilterModal(template: TemplateRef<any>) {
    this.FiltersArray.map(obj => {
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.modalReference = this.ModalService.show(template, {
      ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'
    });
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
    const FControl = this.FilterFGroup.get(KeyName) as FormControl;
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
