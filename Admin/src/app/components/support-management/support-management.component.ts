import { Component, OnInit, Renderer2, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginManageService } from 'src/app/services/login-management/login-manage.service';
import { SupportManagementService } from 'src/app/services/support-management/support-management.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ModalSupportManagementComponent } from '../modals/modal-support-management/modal-support-management.component';
import { ModalApprovedComponent } from '../modals/modal-approved/modal-approved.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
export interface CustomerId { _id: string; ContactName: string; }
export interface Supportkey { _id: string; Support_key: string; }
export interface SupportTitle { _id: string; Support_Title: string; }

@Component({
  selector: 'app-support-management',
  templateUrl: './support-management.component.html',
  styleUrls: ['./support-management.component.css']
})
export class SupportManagementComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  CustomerSupportDetails: any[] = [];
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
  UserInfo: any;
  CustomersList: CustomerId[] = [];
  TitleList: any[] = [];
  KeyList: any[] = [];
  filteredCustomersList: Observable<CustomerId[]>;
  SupportkeyList: Observable<Supportkey[]>;
  SupportTitleList: Observable<SupportTitle[]>;

  LastSelectedCustomer = null;
  LastSelectedKey = null;
  LastSelectedTitle = null;

  // Filter Input Validation
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');

  THeaders: any[] = [
    { Key: 'Customer', ShortKey: 'Customer', Name: 'Customer Name', If_Short: false, Condition: '' },
    { Key: 'CustomerCategory', ShortKey: 'CustomerCategory', Name: 'Customer Category', If_Short: false, Condition: '' },
    { Key: 'Support_key', ShortKey: 'Support_key', Name: 'Support  key', If_Short: false, Condition: '' },
    { Key: 'Support_Title', ShortKey: 'Support_Title', Name: 'Support Title', If_Short: false, Condition: '' },
    { Key: 'Support_Status', ShortKey: 'Support_Status', Name: 'Status', If_Short: false, Condition: '' },
    { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Date', If_Short: false, Condition: '' },
    { Key: 'LastConversation', ShortKey: 'LastConversation', Name: 'Last Conversation', If_Short: false, Condition: '' }
  ];

  FiltersArray: any[] = [
    { Active: false, Key: 'CustomerId', Value: '', DisplayName: 'CustomerId', DBName: 'CustomerId', Type: 'Object', Option: '' },
    { Active: false, Key: 'CustomerCategory', Value: '', DisplayName: 'Customer Category', DBName: 'CustomerCategory', Type: 'String', Option: 'Select' },
    { Active: false, Key: 'Support_key', Value: '', DisplayName: 'Support key', DBName: 'Support_key', Type: 'String', Option: '' },
    { Active: false, Key: 'Support_Title', Value: '', DisplayName: 'Support Title', DBName: 'Support_Title', Type: 'String', Option: '' },
    { Active: false, Key: 'LastConversation', Value: '', DisplayName: 'Last Conversation', DBName: 'LastConversation', Type: 'String', Option: 'Select' },
    { Active: false, Key: 'SupportFrom', Value: null, DisplayName: 'Support From', DBName: 'createdAt', Type: 'Date', Option: 'GTE' },
    { Active: false, Key: 'SupportTo', Value: null, DisplayName: 'Support To', DBName: 'createdAt', Type: 'Date', Option: 'LTE' }
  ];

  CustomerCategory: any[] = [{ Name: 'Seller', Key: 'Seller' },
  { Name: 'Buyer', Key: 'Buyer' },
  { Name: 'Both', Key: 'Both' }];
  LastConversation: any[] = [
    { Name: 'Admin', Key: 'Admin' },
    { Name: 'Customer', Key: 'Customer' }];
  FilterFGroupStatus = false;
  constructor(
    private Toastr: ToastrService,
    private renderer: Renderer2,
    private Service: SupportManagementService,
    public ModalService: BsModalService,
    public LoginService: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.Service_Loader();

    this.Service.Customer_List({ User: this.UserInfo._id }).subscribe(response => {
      this.CustomersList = response.Response;
      setTimeout(() => {
        this.FilterFGroup.controls.CustomerId.updateValueAndValidity();
      }, 100);
    });

    this.Service.TitleKey_List({ User: this.UserInfo._id }).subscribe(NewResponse => {
      this.TitleList = NewResponse.Response;
    });
  }

  ngOnInit() {
    this.FilterFGroup = new FormGroup({
      CustomerId: new FormControl(''),
      Support_Title: new FormControl('', Validators.required),
      Support_key: new FormControl('', Validators.required),
      LastConversation: new FormControl('', Validators.required),
      CustomerCategory: new FormControl('', Validators.required),
      SupportFrom: new FormControl(''),
      SupportTo: new FormControl(''),
    });
    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });



    this.filteredCustomersList = this.FilterFGroup.controls.CustomerId.valueChanges.pipe(
      startWith(''), map(value => {

        if (value && value !== null && value !== '') {

          if (typeof value === 'object') {
            if (this.LastSelectedCustomer === null || this.LastSelectedCustomer !== value._id) {
              this.LastSelectedCustomer = value._id;
            }
            value = value.ContactName;
          }
          return this.CustomersList.filter(option => option.ContactName.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedCustomer = null;
          return this.CustomersList;
        }
      })
    );

    this.SupportkeyList = this.FilterFGroup.controls.Support_key.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedKey === null || this.LastSelectedKey !== value._id) {
              this.LastSelectedKey = value._id;
            }
            value = value.Support_key;
          }
          return this.TitleList.filter(option => option.Support_key.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedKey = null;
          return this.TitleList;
          // return [];
        }
      })
    );

    this.SupportTitleList = this.FilterFGroup.controls.Support_Title.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedTitle === null || this.LastSelectedTitle !== value._id) {
              this.LastSelectedTitle = value._id;
            }
            value = value.Support_Title;
          }
          return this.TitleList.filter(option => option.Support_Title.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedTitle = null;
          return this.TitleList;
          // return [];
        }
      })
    );
  }

  // tslint:disable-next-line: no-shadowed-variable
  TitleDisplayName(SupportTitle: any) {
    return (SupportTitle && SupportTitle !== null && SupportTitle !== '') ? SupportTitle.Support_Title : null;
  }
  // tslint:disable-next-line: no-shadowed-variable
  CustomerDisplayName(CustomerId: any) {
    return (CustomerId && CustomerId !== null && CustomerId !== '') ? CustomerId.ContactName : null;
  }

  // tslint:disable-next-line: variable-name
  KeyDisplayName(Support_key: any) {
    return (Support_key && Support_key !== null && Support_key !== '') ? Support_key.Support_key : null;
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
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters,
      User: this.UserInfo._id
    };
    this.TableLoader();
    this.Service.All_CustomerSupport_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.CustomerSupportDetails = response.Response;
        setTimeout(() => {
          this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
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
  NotAllow() {

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
    const AddCount = this.TotalRows > 0 ? 1 : 0;
    this.ShowingText = 'Showing <span>' + (this.SkipCount + AddCount) + '</span> to <span>' +
      ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
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

  EditCustomer_Support(index: any) {
    const initialState = {
      Type: 'Reply',
      CustomerSupportDetails: this.CustomerSupportDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalSupportManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.CustomerSupportDetails[index] = response.Response;
        this.Service_Loader();

      }
    });
  }

  ViewCustomer_Support(index: any) {
    const initialState = {
      Type: 'View',
      CustomerSupportDetails: this.CustomerSupportDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalSupportManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.CustomerSupportDetails[index] = response.Response;
      }
    });
  }


  CustomerSupportClosed(index: any) {
    const initialState = {
      Icon: 'block',
      ColorCode: 'danger',
      TextOne: 'You Want to',
      TextTwo: 'Close',
      TextThree: 'this Customer Support?',
    };
    this.modalReference = this.ModalService.show(ModalApprovedComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-dialog-centered animated zoomIn modal-small-with' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        // tslint:disable-next-line: no-shadowed-variable
        const CustomerId = this.CustomerSupportDetails[index].Customer._id;
        const SupportId = this.CustomerSupportDetails[index]._id;
        this.Service.CustomerSupport_Closed({ CustomerId, SupportId }).subscribe(responseNew => {
          if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer Support has been DeActivated Successfully' });
          }
        });
      }
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

  AutocompleteBlur(key: any) {
    const value = this.FilterFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
      this.FilterFGroup.controls[key].setValue(null);
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
