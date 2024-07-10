import { Component, OnInit, Renderer2, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { ToastrService } from '../../services/common-services/toastr.service';
import { CustomerManagementService } from '../../../app/services/customer-management/customer-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ModalCustomerEditComponent } from '../modals/modal-customer-edit/modal-customer-edit.component';
import { ModalCustomerViewComponent } from '../modals/modal-customer-view/modal-customer-view.component';
import { ModalCustomerBlockComponent } from '../modals/modal-customer-block/modal-customer-block.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subscription, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataPassingService } from 'src/app/services/common-services/data-passing.service';
import { BusinessDataPassingService } from 'src/app/services/common-services/business-data-passing.service';
import { UserDataPassingService } from 'src/app/services/common-services/user-data-passing.service';
import { BranchDataPassingService } from 'src/app/services/branch-data-passing.service';
import { ModalPaymentComponent } from '../modals/modal-payment/modal-payment.component';
export interface Owners { _id: string; ContactName: string; }
export interface Users { _id: string; ContactName: string; Owner: string; }
export interface Businesss { _id: string; BusinessName: string; }
export interface Branchs { _id: string; BranchName: string; }
@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css']
})
export class PaymentManagementComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  PaymentManagement: any[] = [];
  StateList: any[] = [];
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
  SideFGroup: FormGroup;
  modalReference: BsModalRef;
  UserList: any[] = [];
  UserInfo: any;
  isVisible = false;
  CustomersList: any[] = [];
  FilterOwnerList: Observable<Owners[]>;
  LastSelectedOwner = null;
  // Filter Input Validation
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  // tslint:disable-next-line: variable-name
  CustomerCategory: any[] = [{ Name: 'Buyer', Key: 'Buyer' },
  { Name: 'Seller', Key: 'Seller' }];
  PaymentModes: any[] = [
    { Name: 'Cheque', Key: 'Cheque' },
    { Name: 'Cash', Key: 'Cash' }
  ];
  PaymentStatuses: any[] = [
    { Name: 'Pending', Key: 'Pending' },
    { Name: 'Accepted', Key: 'Accept' },
    { Name: 'Disputed', Key: 'Disputed' },
  ];
  THeaders: any[] = [{ Key: 'PaymentID', ShortKey: 'PaymentID', Name: 'Payment ID', If_Short: false, Condition: '' },
  { Key: 'SellerInfo', ShortKey: 'SellerInfo', Name: 'Seller', If_Short: false, Condition: '' },
  { Key: 'BusinessInfo', ShortKey: 'BusinessInfo', Name: 'Business Name ', If_Short: false, Condition: '' },
  // { Key: 'BranchInfo', ShortKey: 'BranchInfo', Name: 'Branch Name', If_Short: false, Condition: '' },
  { Key: 'BuyerInfo', ShortKey: 'BuyerInfo', Name: 'Buyer', If_Short: false, Condition: '' },
  { Key: 'BuyerBusinessInfo', ShortKey: 'BuyerBusinessInfo', Name: 'Buyer Business Name ', If_Short: false, Condition: '' },
  // { Key: 'BuyerBranchInfo', ShortKey: 'BuyerBranchInfo', Name: 'Buyer Branch Name ', If_Short: false, Condition: '' },
  { Key: 'PaymentAmount', ShortKey: 'PaymentAmount', Name: 'PaymentAmount', If_Short: false, Condition: '' },
  // { Key: 'PaymentMode', ShortKey: 'PaymentMode', Name: 'Payment Mode', If_Short: false, Condition: '' },
  { Key: 'Status', ShortKey: 'Status', Name: 'Payment Status', If_Short: false, Condition: '' },
  // { Key: 'Remarks', ShortKey: 'Remarks', Name: 'Remarks', If_Short: false, Condition: '' },
  { Key: 'PaymentDate', ShortKey: 'PaymentDate', Name: 'Payment Date', If_Short: false, Condition: '' },
  ];
  FiltersArray: any[] = [
    { Active: false, Key: 'PaymentID', Value: '', DisplayName: 'Payment ID', DBName: 'PaymentID', Type: 'String', Option: '' },
    { Active: false, Key: 'PaymentAmount', Value: '', DisplayName: 'Payment Amount', DBName: 'PaymentAmount', Type: 'String', Option: '' },
    { Active: false, Key: 'PaymentMode', Value: '', DisplayName: 'Payment Mode', DBName: 'PaymentMode', Type: 'String', Option: '' },
    { Active: false, Key: 'Payment_Status', Value: '', DisplayName: 'Payment Status', DBName: 'Payment_Status', Type: 'String', Option: '' },
    { Active: false, Key: 'PaymentFrom', Value: '', DisplayName: 'Payment From', DBName: 'PaymentDate', Type: 'Date', Option: 'GTE' },
    { Active: false, Key: 'PaymentTo', Value: '', DisplayName: 'Payment To', DBName: 'PaymentDate', Type: 'Date', Option: 'LTE' }
  ];

  PinCredentials: any[] = [
    { Active: false, Key: 'ContactName', Value: '', DisplayName: 'Customer Name', DBName: 'ContactName', Type: 'String', Option: '' },
    { Active: false, Key: 'Mobile', Value: '', DisplayName: 'Mobile', DBName: 'Mobile', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: '', DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' },
    { Active: false, Key: 'CustomerCategory', Value: '', DisplayName: 'CustomerCategory', DBName: 'CustomerCategory', Type: 'String', Option: 'Select' },
    { Active: false, Key: 'State_Name', Value: '', DisplayName: 'State Name', DBName: 'State_Name', Type: 'String', Option: '' }
  ];

  FilterFGroupStatus = false;
  BusinessExpand = false;

  myControl = new FormControl();
  options: string[] = ['One 1', 'Two 2', 'Three 3'];
  Owner: any;
  UsersList: any[] = [];
  BusinessList: any[] = [];
  BranchList: any[] = [];
  FilterUserList: Observable<Users[]>;
  FilterBusinessList: Observable<Businesss[]>;
  FilterBranchList: Observable<Branchs[]>;
  LastSelectedUser = null;
  LastSelectedBusiness = null;
  LastSelectedBranch = null;
  AllOwner: any[] = [];
  AllUser: any[] = [];
  AllBusiness: any[] = [];
  AllBranch: any[] = [];
  PaymentRoute: any;
  PaymentBoolean = false;
  User: any;
  Business: any;
  Branch: any;
  constructor(
    private Toastr: ToastrService,
    private renderer: Renderer2,
    private CustomerService: CustomerManagementService,
    private router: Router,
    private dataPassingService: DataPassingService,
    private businessDataPassingService: BusinessDataPassingService,
    private userDataPassingService: UserDataPassingService,
    private branchDataPassingService: BranchDataPassingService,
    public ModalService: BsModalService,
    public LoginService: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());

    this.subscription.add(
      this.dataPassingService.AllOwner.subscribe(response => {
        this.AllOwner = response;
        if (this.AllOwner.length > 0) {
          this.Owner = this.AllOwner[0]._id;
          this.Service_Loader();
        } else {
          this.router.navigate(['Customers/Owner']);
        }
      })
    );

    this.subscription.add(
      this.userDataPassingService.AllUser.subscribe(response => {
        this.AllUser = response;
        if (this.AllUser.length !== 0) {
          this.User = this.AllUser[0];
          this.Service_Loader();
        } else {
          this.User = null;
          this.Service_Loader();
        }
      })
    );

    this.subscription.add(
      this.businessDataPassingService.AllBusiness.subscribe(response => {
        this.AllBusiness = response;
        if (this.AllBusiness.length !== 0) {
          this.Business = this.AllBusiness[0];
          this.Service_Loader();
        } else {
          this.Business = null;
          this.Service_Loader();
        }
      })
    );

    this.subscription.add(
      this.branchDataPassingService.AllBranch.subscribe(response => {
        this.AllBranch = response;
        if (this.AllBranch.length !== 0) {
          this.Branch = this.AllBranch[0];
          this.Service_Loader();
        } else {
          this.Branch = null;
          this.Service_Loader();
        }
      })
    );

  }


  ngOnInit() {
    this.FilterFGroup = new FormGroup({
      PaymentID: new FormControl(''),
      PaymentAmount: new FormControl(''),
      PaymentMode: new FormControl(''),
      Payment_Status: new FormControl(''),
      PaymentFrom: new FormControl(''),
      PaymentTo: new FormControl('')
    });

    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });
  }

  NotAllow() {

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      Owner: this.Owner,
      User: this.User,
      Business: this.Business,
      Branch: this.Branch,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters
    };
    this.TableLoader();
    this.CustomerService.PaymentHistoryList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.PaymentManagement = response.Response;

        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();

      } else {
        //   this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
      }
    });
  }



  TableLoader() {
    setTimeout(() => {
      // const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
      // const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
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







  ViewPayment(index: any) {
    const initialState = {
      Type: 'View',
      PaymentInfo: this.PaymentManagement[index],
    };
    this.modalReference = this.ModalService.show(ModalPaymentComponent, Object.assign({
      initialState
    }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.PaymentManagement[index] = response.Response;
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

  AutocompleteBlur(key: any) {
    const value = this.SideFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
      this.SideFGroup.controls[key].setValue(null);
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

}



