import { ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, from } from 'rxjs';
import { OwnerRegisterService } from '../../services/registration/owner-register.service';
import { ModalUserManagementComponent } from '../../components/Modals/modal-user-management/modal-user-management.component';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { LoadingService } from 'src/app/services/loading.service';
interface LabelNumbers {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection') TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection') TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection') TableLoaderSection: ElementRef;

  title = 'Client';
  StateList: any[] = [];
  numbers: LabelNumbers[] = [
    { value: 'ten', viewValue: '10' },
    { value: 'twenty', viewValue: '20' },
    { value: 'thirty', viewValue: '30' }
  ];
  PageLoader = true;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 5;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  CustomerCategory: any;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  FilterFGroup: FormGroup;
  FilterFGroupStatus = false;
  OwnerOfUsers: any[] = [];
  THeaders: any[] = [
    { Key: 'ContactName', ShortKey: 'ContactName', Name: 'ContactName', If_Short: false, Condition: '' },
    { Key: 'Mobile', ShortKey: 'Mobile', Name: 'Mobile', If_Short: false, Condition: '' },
    { Key: 'Email', ShortKey: 'Email', Name: 'Email', If_Short: false, Condition: '' },
    { Key: 'CustomerCategory', ShortKey: 'CustomerCategory', Name: 'Customer Category', If_Short: false, Condition: '' },
    { Key: 'CustomerType', ShortKey: 'CustomerType', Name: 'CustomerType', If_Short: false, Condition: '' },
    { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date', If_Short: false, Condition: '' },
  ];

  FiltersArray: any[] = [
    { Active: false, Key: 'ContactName', Value: '', DisplayName: 'ContactName', DBName: 'ContactName', Type: 'String', Option: '' },
    { Active: false, Key: 'Mobile', Value: '', DisplayName: 'Mobile', DBName: 'Mobile', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: '', DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' }
  ];
  modalReference: BsModalRef;
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  UserInfo: any;
  AllCategory: any[] = [];
  constructor(
    private OwnerRegister: OwnerRegisterService,
    private renderer: Renderer2,
    public ModalService: BsModalService,
    private loadingService: LoadingService,
    private LoginService: LoginManageService,
    private DataPassingService: CategoryDataPassingService,
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    // this.Service_Loader();


    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Buyer') {
            this.Service_Loader();
          } else if (this.CustomerCategory === 'Seller') {
            this.Service_Loader();
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    )


  }



  ngOnInit(): void {
    this.FilterFGroup = new FormGroup({
      ContactName: new FormControl('', [Validators.required, this.CustomValidation('AlphabetsSpaceHyphenDot')]),
      Mobile: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10), Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email])
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
    this.loadingService.show(); // Show loader

    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });
    const Filters = this.FiltersArray.filter(obj => obj.Active === true);
    const Data = {
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters,
      Owner: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory
    };

    this.TableLoader();
    this.OwnerRegister.OwnerOfUsersList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.OwnerOfUsers = response.Response;
        // After the asynchronous operation completes, hide the loader
        this.loadingService.hide();
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        //  this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        //  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Support Records Getting Error!!' });
      }
    });
  }

  CreateUser() {
    const initialState = { Type: 'Create' };
    this.modalReference = this.ModalService.show(ModalUserManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

  TableLoader() {
    setTimeout(() => {
      // const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
      // const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
      if (this.TableLoaderSection != undefined) {
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      }
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

  ViewCustomer(index: any) {
    this.OwnerRegister.CustomerDetails({ CustomerId: this.OwnerOfUsers[index]._id }).subscribe(responseSub => {
      if (responseSub.Status && responseSub.Status === true) {
        this.OwnerOfUsers[index] = responseSub.Response;
        const initialState = {
          Type: 'View',
          UserOfInfo: this.OwnerOfUsers[index]
        };
        this.modalReference = this.ModalService.show(ModalUserManagementComponent,
          Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
        this.modalReference.content.onClose.subscribe(response => {
          if (response.Status) {
            this.OwnerOfUsers[index] = response.Response;
          }
        });
      }
    });
  }

  EditUserDetails(Index: any) {
    this.OwnerRegister.CustomerDetails({ CustomerId: this.OwnerOfUsers[Index]._id }).subscribe(responseSub => {
      if (responseSub.Status && responseSub.Status === true) {
        this.OwnerOfUsers[Index] = responseSub.Response;
        const initialState = {
          Type: 'Update',
          UserOfInfo: this.OwnerOfUsers[Index]
        };
        this.modalReference = this.ModalService.show(ModalUserManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
        this.modalReference.content.onClose.subscribe(response => {
          if (response.Status) {
            this.OwnerOfUsers[Index] = response.Response;
            this.Pagination_Action(1);
          }
        });
      }
    });
  }

  // ViewUser()

}
