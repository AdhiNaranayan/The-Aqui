import { Component, OnInit, Renderer2, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { ToastrService } from '../../services/common-services/toastr.service';
import { CustomerManagementService } from '../../../app/services/customer-management/customer-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ModalCustomerEditComponent } from '../modals/modal-customer-edit/modal-customer-edit.component';
import { ModalCustomerViewComponent } from '../modals/modal-customer-view/modal-customer-view.component';
import { ModalCustomerBlockComponent } from '../modals/modal-customer-block/modal-customer-block.component';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataPassingService } from 'src/app/services/common-services/data-passing.service';
import { BusinessDataPassingService } from 'src/app/services/common-services/business-data-passing.service';
import { UserDataPassingService } from 'src/app/services/common-services/user-data-passing.service';
import { BranchDataPassingService } from 'src/app/services/branch-data-passing.service';
import { Router } from '@angular/router';
import { ModalInvoiceComponent } from '../modals/modal-invoice/modal-invoice.component';
export interface Owners { _id: string; ContactName: string; }
export interface Users { _id: string; ContactName: string; Owner: string; }
export interface Businesss { _id: string; BusinessName: string; }
export interface Branchs { _id: string; BranchName: string; }
@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.css']
})
export class InvoiceManagementComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  InvoiceManagement: any[] = [];
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
  SideFGroup: FormGroup;
  modalReference: BsModalRef;
  UserList: any[] = [];
  UserInfo: any;
  isVisible = false;
  CustomersList: any[] = [];
  UsersList: any[] = [];
  BusinessList: any[] = [];
  BranchList: any[] = [];
  FilterOwnerList: Observable<Owners[]>;
  FilterUserList: Observable<Users[]>;
  FilterBusinessList: Observable<Businesss[]>;
  FilterBranchList: Observable<Branchs[]>;
  LastSelectedOwner = null;
  FilterFGroup: FormGroup;
  FilterFGroupStatus = false;
  LastSelectedUser = null;
  LastSelectedBusiness = null;
  LastSelectedBranch = null;
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
  InvoiceStatus: any[] = [
    { Name: 'Pending', Key: 'Pending' },
    { Name: 'Disputed', Key: 'Disputed' },
    { Name: 'Accepted', Key: 'Accept' },
  ];
  THeaders: any[] = [{ Key: 'InvoiceNumber', ShortKey: 'InvoiceNumber', Name: 'Invoice Number', If_Short: false, Condition: '' },
  { Key: 'SellerInfo', ShortKey: 'SellerInfo', Name: 'Seller', If_Short: false, Condition: '' },
  { Key: 'BusinessName', ShortKey: 'BusinessName', Name: 'Business', If_Short: false, Condition: '' },
  // { Key: 'BranchName', ShortKey: 'BranchName', Name: 'Branch', If_Short: false, Condition: '' },
  { Key: 'BuyerInfo', ShortKey: 'BuyerInfo', Name: 'Buyer', If_Short: false, Condition: '' },
  { Key: 'BuyerBusinessInfo', ShortKey: 'BuyerBusinessInfo', Name: 'BuyerBusiness', If_Short: false, Condition: '' },
  // { Key: 'BuyerBranchInfo', ShortKey: 'BuyerBranchInfo', Name: 'BuyerBranch', If_Short: false, Condition: '' },
  { Key: 'InvoiceAmount', ShortKey: 'InvoiceAmount', Name: 'Amount', If_Short: false, Condition: '' },
  { Key: 'InvoiceStatus', ShortKey: 'InvoiceStatus', Name: 'Status', If_Short: false, Condition: '' },
  { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Invoice Date', If_Short: false, Condition: '' },
  ];
  FiltersArray: any[] = [
    { Active: false, Key: 'InvoiceStatus', Value: '', DisplayName: 'Invoice Status', DBName: 'InvoiceStatus', Type: 'String', Option: '' },
    { Active: false, Key: 'InvoiceAmount', Value: '', DisplayName: 'Invoice Amount', DBName: 'InvoiceAmount', Type: 'String', Option: '' },
    { Active: false, Key: 'InvoiceNumber', Value: '', DisplayName: 'Invoice Number', DBName: 'InvoiceNumber', Type: 'String', Option: '' },
    { Active: false, Key: 'InvoiceFrom', Value: '', DisplayName: 'Invoice From', DBName: 'InvoiceDate', Type: 'Date', Option: 'GTE' },
    { Active: false, Key: 'InvoiceTo', Value: '', DisplayName: 'Invoice To', DBName: 'InvoiceDate', Type: 'Date', Option: 'LTE' }
  ];

  PinCredentials: any[] = [
    { Active: false, Key: 'ContactName', Value: '', DisplayName: 'Customer Name', DBName: 'ContactName', Type: 'String', Option: '' },
    { Active: false, Key: 'Mobile', Value: '', DisplayName: 'Mobile', DBName: 'Mobile', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: '', DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' },
    { Active: false, Key: 'CustomerCategory', Value: '', DisplayName: 'CustomerCategory', DBName: 'CustomerCategory', Type: 'String', Option: 'Select' },
    { Active: false, Key: 'State_Name', Value: '', DisplayName: 'State Name', DBName: 'State_Name', Type: 'String', Option: '' }
  ];

  BusinessExpand = false;

  myControl = new FormControl();
  options: string[] = ['One 1', 'Two 2', 'Three 3'];
  Owner: any;
  User: any;
  Business: any;
  Branch: any;
  AllOwner: any[] = [];
  AllUser: any[] = [];
  AllBusiness: any[] = [];
  AllBranch: any[] = [];
  InvoiceRoute: any;
  InvoiceBoolean = false;
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
    this.CustomerService.GetStates({ User: this.UserInfo._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.StateList = response.Response;
      }
    });

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
          this.InvoiceManagement = [];
          this.TotalRows = 0;
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
      InvoiceStatus: new FormControl(''),
      InvoiceAmount: new FormControl(''),
      InvoiceNumber: new FormControl(''),
      InvoiceFrom: new FormControl(''),
      InvoiceTo: new FormControl('')
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
    this.CustomerService.InvoiceManagementList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvoiceManagement = response.Response;
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
      }
    });
  }




  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  ViewInvoice(index: any) {
    const initialState = {
      Type: 'View',
      InvoiceInfo: this.InvoiceManagement[index]
    };
    this.modalReference = this.ModalService.show(ModalInvoiceComponent, Object.assign({
      initialState
    }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.InvoiceManagement[index] = response.Response;
      }
    });
  }


  AutocompleteBlur(key: any) {
    const value = this.SideFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
      this.SideFGroup.controls[key].setValue(null);
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

  openFilterModal(template: TemplateRef<any>) {
    this.FiltersArray.map(obj => {
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.modalReference = this.ModalService.show(template, {
      ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'
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

}



