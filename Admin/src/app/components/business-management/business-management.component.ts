import { Component, OnInit, Renderer2, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { ToastrService } from '../../services/common-services/toastr.service';
import { CustomerManagementService } from '../../../app/services/customer-management/customer-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ModalCustomerEditComponent } from '../modals/modal-customer-edit/modal-customer-edit.component';
import { ModalCustomerViewComponent } from '../modals/modal-customer-view/modal-customer-view.component';
import { ModalCustomerBlockComponent } from '../modals/modal-customer-block/modal-customer-block.component';
import { DataPassingService } from './../../services/common-services/data-passing.service';
import { Observable } from 'rxjs';
import { Subscription, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BusinessDataPassingService } from 'src/app/services/common-services/business-data-passing.service';
import { UserDataPassingService } from 'src/app/services/common-services/user-data-passing.service';
import { BranchDataPassingService } from 'src/app/services/branch-data-passing.service';
import { ModalBusinessComponent } from '../modals/modal-business/modal-business.component';
import { ModalBranchComponent } from '../modals/modal-branch/modal-branch.component';
import { ModalBusinessEditComponent } from '../modals/modal-business-edit/modal-business-edit.component';
import { ModalBranchEditComponent } from '../modals/modal-branch-edit/modal-branch-edit.component';
export interface Owners { _id: string; ContactName: string; }
export interface Users { _id: string; ContactName: string; }
export interface Businesss { _id: string; BusinessName: string; }
export interface Branchs { _id: string; BranchName: string; }

@Component({
  selector: 'app-business-management',
  templateUrl: './business-management.component.html',
  styleUrls: ['./business-management.component.css']
})
export class BusinessManagementComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  BusinessDetails: any[] = [];
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
  UsersList: any[] = [];
  BusinessList: any[] = [];
  BranchList: any[] = [];
  FilterOwnerList: Observable<Owners[]>;
  FilterUserList: Observable<Users[]>;
  FilterBusinessList: Observable<Businesss[]>;
  FilterBranchList: Observable<Branchs[]>;
  LastSelectedOwner = null;
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
  CustomerType: any[] = [
    { Name: 'Owner', Key: 'Owner' },
    { Name: 'User', Key: 'User' }
  ];
  THeaders: any[] = [{ Key: 'Name', ShortKey: 'Name', Name: 'Business Name', If_Short: false, Condition: '' },
  { Key: 'Mobile', ShortKey: 'Mobile', Name: 'Credit Limit ', If_Short: false, Condition: '' },
  { Key: 'Email', ShortKey: 'Email', Name: 'Available Credit', If_Short: false, Condition: '' },
  { Key: 'BusinessCategory', ShortKey: 'BusinessCategory', Name: 'Business Category', If_Short: false, Condition: '' },
  // { Key: 'TotalBranch', ShortKey: 'TotalBranch', Name: 'No.of Branch', If_Short: false, Condition: '' },
  { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created At', If_Short: false, Condition: '' },
  ];

  FiltersArray: any[] = [
    { Active: false, Key: '_id', Value: '', DisplayName: '_id', DBName: '_id', Type: 'Object', Option: '' },
    { Active: false, Key: 'BusinessName', Value: '', DisplayName: 'First Name', DBName: 'BusinessName', Type: 'String', Option: '' },
    { Active: false, Key: 'BusinessCreditLimit', Value: '', DisplayName: 'BusinessCreditLimit', DBName: 'BusinessCreditLimit', Type: 'String', Option: '' },
    { Active: false, Key: 'AvailableCreditLimit', Value: '', DisplayName: 'AvailableCreditLimit', DBName: 'AvailableCreditLimit', Type: 'String', Option: '' }
  ];



  FilterFGroupStatus = false;
  BusinessExpand = false;

  myControl = new FormControl();
  options: string[] = ['One 1', 'Two 2', 'Three 3'];
  Owner: any;
  Business: any;
  User: any;
  AllOwner: any[] = [];
  AllUser: any[] = [];
  AllBusiness: any[] = [];
  AllBranch: any[] = [];
  constructor(
    private Toastr: ToastrService,
    private renderer: Renderer2,
    private CustomerService: CustomerManagementService,
    private dataPassingService: DataPassingService,
    private businessDataPassingService: BusinessDataPassingService,
    private userDataPassingService: UserDataPassingService,
    private branchDataPassingService: BranchDataPassingService,
    public router: Router,
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
        }
      })
    );

    this.subscription.add(
      this.businessDataPassingService.AllBusiness.subscribe(response => {
        this.AllBusiness = response;
        if (this.AllBusiness.length !== 0) {
          this.FiltersArray.map(Obj => {
            if (Obj.Key === '_id') {
              Obj.Value = this.AllBusiness[0];
              Obj.Active = true;
              return Obj;
            }
          });
          this.Service_Loader();
        }
      })
    );
  }


  ngOnInit() {
    this.FilterFGroup = new FormGroup({
      BusinessName: new FormControl(''),
      BusinessCreditLimit: new FormControl('')
    });
    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });

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
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters
    };
    this.TableLoader();
    this.CustomerService.UserBusinessList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.BusinessDetails = response.Response;
        this.BusinessDetails = this.BusinessDetails.map(obj => {
          obj.ExpandClass = false;
          obj.BusinessClass = false;
          return obj;
        });

        this.TotalRows = response.SubResponse;

        this.Pagination_Affect();


      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        // this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        // this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
      }
    });
  }

  PinBusiness(index: any) {
    if (this.AllBusiness.length === 0) {
      if (typeof this.BusinessDetails[index] === 'object') {
        this.AllBusiness = [];
        this.AllBusiness.push(this.BusinessDetails[index]);
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData([]);
        this.router.navigate(['Customers/Business']);
      }
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Info', Message: 'Already Selected The Business Details' });
    }

  }

  PinBranch(IndexBusiness: any, indexBranch: any) {
    if (this.AllBranch.length === 0) {
      if (typeof this.BusinessDetails[IndexBusiness].BranchInfo[indexBranch] === 'object') {
        this.AllBranch = [];
        this.AllBranch.push(this.BusinessDetails[IndexBusiness].BranchInfo[indexBranch]);
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      }
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Info', Message: 'Already Selected The Branch Details' });
    }
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




  ExpandThis(idx: number) {
    this.BusinessDetails = this.BusinessDetails.map(obj => {
      obj.ExpandClass = false;
      return obj;
    });
    this.BusinessDetails[idx].ExpandClass = true;
  }

  CollapseThis(idx: number) {
    this.BusinessDetails[idx].ExpandClass = false;
  }


  BusinessExpandThis(index: any, idx: number) {
    this.BusinessDetails = this.BusinessDetails.map(obj => {
      obj.BusinessClass = false;
      return obj;
    });
    this.BusinessDetails[index].UserInfo[idx].BusinessAndBranches.BusinessClass = true;
  }

  BusinessCollapseThis(index: any, idx: number) {

    this.BusinessDetails[index].UserInfo[idx].BusinessAndBranches.BusinessClass = false;
  }


  ViewBusiness(index: any) {

    const initialState = {
      Type: 'View',
      BusinessInfo: this.BusinessDetails[index],
    };

    this.modalReference = this.ModalService.show(ModalBusinessComponent, Object.assign({
      initialState
    }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      console.log(response.Status);

      if (response.Status) {
        this.BusinessDetails[index] = response.Response;

      }
    });
  }


  ViewBranch(index: any, idx: any) {

    const initialState = {
      Type: 'View',
      BranchInfo: this.BusinessDetails[index].BranchInfo[idx],
    };

    this.modalReference = this.ModalService.show(ModalBranchComponent, Object.assign({
      initialState
    }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.BusinessDetails[index] = response.Response;
      }
    });
  }

  EditBusiness(index: any) {
    const initialState = {
      Type: 'Edit',
      BusinessDetails: this.BusinessDetails[index],
      BusinessId: this.BusinessDetails[index]._id
    };
    this.modalReference = this.ModalService.show(ModalBusinessEditComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.BusinessDetails[index] = response.Response;
        this.Service_Loader();
      }
    });
  }

  EditBranch(index: any, idx: any) {
    const initialState = {
      Type: 'Edit',
      BranchDetails: this.BusinessDetails[index].BranchInfo[idx],
      BranchId: this.BusinessDetails[index].BranchInfo[idx]._id
    };
    this.modalReference = this.ModalService.show(ModalBranchEditComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.BusinessDetails[index] = response.Response;
        this.Service_Loader();
      }
    });
  }



  UserExpand(index: any) {
    this.isVisible = true;
    const Info = this.BusinessDetails[index];
  }


  AutocompleteBlur(key: any) {
    const value = this.SideFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
      this.SideFGroup.controls[key].setValue(null);
    }
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
