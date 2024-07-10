import { Component, OnInit, Renderer2, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ToastrService } from '../../services/common-services/toastr.service';
import { CustomerManagementService } from '../../../app/services/customer-management/customer-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ModalCustomerEditComponent } from '../modals/modal-customer-edit/modal-customer-edit.component';
import { ModalCustomerViewComponent } from '../modals/modal-customer-view/modal-customer-view.component';
import { ModalCustomerBlockComponent } from '../modals/modal-customer-block/modal-customer-block.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataPassingService } from 'src/app/services/common-services/data-passing.service';
import { Subscription, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ModalBusinessComponent } from '../modals/modal-business/modal-business.component';
import { ModalBranchComponent } from '../modals/modal-branch/modal-branch.component';
import { ModalBranchEditComponent } from '../modals/modal-branch-edit/modal-branch-edit.component';
import { ModalBusinessEditComponent } from '../modals/modal-business-edit/modal-business-edit.component';
import { BusinessDataPassingService } from 'src/app/services/common-services/business-data-passing.service';
import { UserDataPassingService } from 'src/app/services/common-services/user-data-passing.service';
import { BranchDataPassingService } from 'src/app/services/branch-data-passing.service';
export interface Owner { _id: string; ContactName: string; }
export interface Users { _id: string; ContactName: string; }
export interface Businesss { _id: string; BusinessName: string; }
export interface Branchs { _id: string; BranchName: string; }
@Component({
  selector: 'app-customer-records',
  templateUrl: './customer-records.component.html',
  styleUrls: ['./customer-records.component.css']
})
export class CustomerRecordsComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  UserDetails: any[] = [];
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
  CustomersList: Owner[] = [];
  UsersList: any[] = [];
  BusinessList: any[] = [];
  BranchList: any[] = [];
  FilterOwnerList: Observable<Owner[]>;
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
  THeaders: any[] = [{ Key: 'Name', ShortKey: 'Name', Name: 'CustomerName', If_Short: false, Condition: '' },
  { Key: 'Mobile', ShortKey: 'Mobile', Name: 'Mobile ', If_Short: false, Condition: '' },
  { Key: 'Email', ShortKey: 'Email', Name: 'Email', If_Short: false, Condition: '' },
  { Key: 'CustomerCategory', ShortKey: 'CustomerCategory', Name: 'Owner Category', If_Short: false, Condition: '' },
  { Key: 'TotalUser', ShortKey: 'TotalUser', Name: 'No.of User', If_Short: false, Condition: '' },
  { Key: 'TotalBusiness', ShortKey: 'TotalBusiness', Name: 'No.of Business', If_Short: false, Condition: '' },
  { Key: 'State', ShortKey: 'StateSort', Name: 'State', If_Short: false, Condition: '' },
  { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created At', If_Short: false, Condition: '' },
  ];
  FiltersArray: any[] = [
    { Active: false, Key: 'ContactName', Value: '', DisplayName: 'Customer Name', DBName: 'ContactName', Type: 'String', Option: '' },
    { Active: false, Key: 'Mobile', Value: '', DisplayName: 'Mobile', DBName: 'Mobile', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: '', DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' },
    { Active: false, Key: 'CustomerCategory', Value: '', DisplayName: 'CustomerCategory', DBName: 'CustomerCategory', Type: 'String', Option: 'Select' },
    { Active: false, Key: 'State', Value: '', DisplayName: 'State Name', DBName: 'State', Type: 'Object', Option: '' }
  ];

  PinCredentials: any[] = [
    { Active: false, Key: 'ContactName', Value: '', DisplayName: 'Customer Name', DBName: 'ContactName', Type: 'String', Option: '' },
    { Active: false, Key: 'Mobile', Value: '', DisplayName: 'Mobile', DBName: 'Mobile', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: '', DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' },
    { Active: false, Key: 'CustomerCategory', Value: '', DisplayName: 'CustomerCategory', DBName: 'CustomerCategory', Type: 'String', Option: 'Select' },
    { Active: false, Key: 'State_Name', Value: '', DisplayName: 'State Name', DBName: 'State_Name', Type: 'String', Option: '' }
  ];
  AllOwner: any[] = [];
  AllUser: any[] = [];
  AllBusiness: any[] = [];
  AllBranch: any[] = [];
  BusinessExpand = false;
  enable = false;
  Owner: any;
  User: any;
  Business: any;
  Branch: any;
  myControl = new FormControl();
  options: string[] = ['One 1', 'Two 2', 'Three 3'];
  BranchDetails: any[] = [];
  BranchUserDetails: any[] = [];
  UserBusinessInfo: any[] = [];
  UserBusinessBoolean = false;
  filteredOptions: Observable<string[]>;
  PaymentRoute: any;
  PaymentBoolean = false;
  InvoiceRoute: any;
  InvoiceBoolean = false;
  constructor(
    private Toastr: ToastrService,
    private renderer: Renderer2,
    private router: Router,
    private CustomerService: CustomerManagementService,
    public ModalService: BsModalService,
    private dataPassingService: DataPassingService,
    private businessDataPassingService: BusinessDataPassingService,
    private userDataPassingService: UserDataPassingService,
    private branchDataPassingService: BranchDataPassingService,
    public LoginService: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.CustomerService.GetStates({ User: this.UserInfo._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.StateList = response.Response;
      }
    });


    this.CustomerService.OwnerList({ User: this.UserInfo._id }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.CustomersList = response.Response;
        setTimeout(() => {
          this.SideFGroup.controls.Owner.setValue(null);
          this.SideFGroup.controls.Owner.updateValueAndValidity();
        }, 100);
      } else {
        this.CustomersList = [];
      }
    });

    this.subscription.add(
      this.dataPassingService.AllOwner.subscribe(response => {
        this.AllOwner = response;
        if (this.AllOwner.length > 0) {
          this.Owner = this.AllOwner[0]._id;
          this.LastSelectedOwner = this.AllOwner[0]._id;
          this.ngOnInit();
          this.DefaultNameLoading(this.Owner, this.User, this.Business, this.Branch);
        } else {
          this.PaymentBoolean = false;
          this.InvoiceBoolean = false;
          this.router.navigate(['Customers/Owner']);
        }
      })
    );


    this.subscription.add(
      this.userDataPassingService.AllUser.subscribe(response => {
        this.AllUser = response;
        if (this.AllUser.length !== 0) {
          this.User = this.AllUser[0];
          this.LastSelectedUser = this.AllUser[0]._id;
          this.ngOnInit();
          this.DefaultNameLoading(this.Owner, this.User, this.Business, this.Branch);
        }
      })
    );

    this.subscription.add(
      this.businessDataPassingService.AllBusiness.subscribe(response => {
        this.AllBusiness = response;
        if (this.AllBusiness.length !== 0) {
          this.Business = this.AllBusiness[0];
          this.LastSelectedBusiness = this.AllBusiness[0]._id;
          this.ngOnInit();
          this.DefaultNameLoading(this.Owner, this.User, this.Business, this.Branch);
        }
      })
    );

    this.subscription.add(
      this.branchDataPassingService.AllBranch.subscribe(response => {
        this.AllBranch = response;
        if (this.AllBranch.length !== 0) {
          this.Branch = this.AllBranch[0];
          this.LastSelectedBranch = this.AllBranch[0]._id;
          this.ngOnInit();
          this.DefaultNameLoading(this.Owner, this.User, this.Business, this.Branch);
        }
      })
    );
  }


  ngOnInit() {
    if (this.AllOwner.length !== 0) {
      const OwnerContactName = this.AllOwner[0];
      const UserContactName = this.AllUser[0];
      const BusinessName = this.AllBusiness[0];
      const BranchName = this.AllBranch[0];
      this.SideFGroup = new FormGroup({
        Owner: new FormControl(OwnerContactName, Validators.required),
        User: new FormControl(UserContactName, Validators.required),
        Business: new FormControl(BusinessName, Validators.required),
        Branch: new FormControl(BranchName, Validators.required),
        Invoice: new FormControl(this.InvoiceBoolean),
        Payment: new FormControl(this.PaymentBoolean)
      });
    } else {
      this.SideFGroup = new FormGroup({
        Owner: new FormControl('', Validators.required),
        User: new FormControl('', Validators.required),
        Business: new FormControl('', Validators.required),
        Branch: new FormControl('', Validators.required),
        Invoice: new FormControl(false),
        Payment: new FormControl(false)
      });
    }

    this.FilterOwnerList = this.SideFGroup.controls.Owner.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedOwner === null || this.LastSelectedOwner !== value._id) {
              this.LastSelectedOwner = value._id;
            }
            value = value.ContactName;
          }
          return this.CustomersList.filter(option => option.ContactName.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedOwner = null;
          return this.CustomersList;
        }
      })
    );

    this.FilterUserList = this.SideFGroup.controls.User.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedUser === null || this.LastSelectedUser !== value._id) {
              this.LastSelectedUser = value._id;
            }
            value = value.ContactName;
          }
          return this.UsersList.filter(option => option.ContactName.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedUser = null;
          return this.UsersList;
        }
      })
    );

    this.FilterBusinessList = this.SideFGroup.controls.Business.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedBusiness === null || this.LastSelectedBusiness !== value._id) {
              this.LastSelectedBusiness = value._id;
            }
            value = value.BusinessName;
          }
          return this.BusinessList.filter(option => option.BusinessName.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedBusiness = null;
          return this.BusinessList;
        }
      })
    );

    this.FilterBranchList = this.SideFGroup.controls.Branch.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedBranch === null || this.LastSelectedBranch !== value._id) {
              this.LastSelectedBranch = value._id;
            }
            value = value.BranchName;
          }
          return this.BranchList.filter(option => option.BranchName.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedBranch = null;
          return this.BranchList;
        }
      })
    );
  }

  OwnerDisplayName(Owner: any) {
    return (Owner && Owner !== null && Owner !== '') ? Owner.ContactName : null;
  }


  UserDisplayName(User: any) {
    return (User && User !== null && User !== '') ? User.ContactName : null;
  }

  // tslint:disable-next-line: no-shadowed-variable
  BusinessDisplayName(Businesss: any) {
    return (Businesss && Businesss !== null && Businesss !== '') ? Businesss.FirstName + ' ' + Businesss.LastName : null;
  }

  // tslint:disable-next-line: no-shadowed-variable
  BranchDisplayName(Branchs: any) {
    return (Branchs && Branchs !== null && Branchs !== '') ? Branchs.BranchName : null;
  }


  OwnerNameChange(Owner: any) {
    if (typeof Owner === 'object' && Owner !== null && Owner !== undefined) {
      this.Owner = Owner._id;
      this.AllOwner = [];
      this.AllOwner.push(Owner);
      const UserControlName = 'User';
      const BusinessControlName = 'Business';
      const BranchControlName = 'Branch';
      this.DefaultNameLoading(this.Owner, this.User, this.Business, this.Branch);
      this.SideFGroup.controls[UserControlName].setValue(null);
      this.SideFGroup.controls[BranchControlName].setValue(null);
      this.SideFGroup.controls[BusinessControlName].setValue(null);
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.businessDataPassingService.UpdateAllBusinessData([]);
      this.branchDataPassingService.UpdateAllBranchData([]);
      this.userDataPassingService.UpdateAllUserData([]);
      if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
        this.router.navigate(['Customers/Payment']);
      } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
        this.router.navigate(['Customers/Invoice']);
      } else {
        this.router.navigate(['Customers/User']);
      }
    } else if (this.LastSelectedOwner === null && Owner === null) {
      this.Owner = undefined;
      this.User = undefined;
      this.Business = undefined;
      this.Branch = undefined;
      this.AllOwner = [];
      this.AllUser = [];
      this.AllBusiness = [];
      this.AllBranch = [];
      this.dataPassingService.UpdateAllOwnerData([]);
      this.businessDataPassingService.UpdateAllBusinessData([]);
      this.branchDataPassingService.UpdateAllBranchData([]);
      this.userDataPassingService.UpdateAllUserData([]);
      this.router.navigate(['/Customers/Owner']);
    }
  }

  UserNameChange(User) {
    if (typeof User === 'object' && User !== null && User !== undefined) {
      this.AllUser = [];
      this.AllUser.push(User);
      this.User = User;
      const BusinessControlName = 'Business';
      const BranchControlName = 'Branch';
      this.DefaultNameLoading(this.Owner, this.User, this.Business, this.Branch);
      this.SideFGroup.controls[BranchControlName].setValue(null);
      this.SideFGroup.controls[BusinessControlName].setValue(null);
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.userDataPassingService.UpdateAllUserData(this.AllUser);
      this.businessDataPassingService.UpdateAllBusinessData([]);
      this.branchDataPassingService.UpdateAllBranchData([]);
      if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
        this.router.navigate(['Customers/Payment']);
      } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
        this.router.navigate(['Customers/Invoice']);
      } else {
        this.router.navigate(['Customers/Business']);
      }
    } else if (this.LastSelectedUser === null && User === null) {
      this.User = undefined;
      this.Business = undefined;
      this.Branch = undefined;
      this.AllUser = [];
      this.userDataPassingService.UpdateAllUserData([]);
      this.AllBusiness = [];
      this.AllBranch = [];
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.businessDataPassingService.UpdateAllBusinessData([]);
      this.branchDataPassingService.UpdateAllBranchData([]);
      if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
        this.router.navigate(['Customers/Payment']);
      } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
        this.router.navigate(['Customers/Invoice']);
      } else {
        this.router.navigate(['Customers/Owner']);
      }
    }
  }

  BusinessNameChange(Business) {
    if (typeof Business === 'object' && Business !== null && Business !== undefined) {
      this.Business = Business;
      this.DefaultNameLoading(this.Owner, this.User, this.Business, this.Branch);
      this.AllBusiness = [];
      this.AllBusiness.push(Business);
      const BranchControlName = 'Branch';
      this.SideFGroup.controls[BranchControlName].setValue(null);
      if (this.AllUser.length === 0) {
        this.userDataPassingService.UpdateAllUserData([]);
      } else {
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
      }
      this.AllBranch = [];
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
      this.branchDataPassingService.UpdateAllBranchData([]);
      if (this.AllUser.length === 0) {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/Business']);
        }
      } else {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/Branch']);
        }
      }
    } else if (this.LastSelectedBusiness === null && Business === null) {
      this.Business = undefined;
      this.Branch = undefined;
      if (this.AllUser.length === 0) {
        this.AllUser = [];
      }
      this.AllBusiness = [];
      this.AllBranch = [];
      this.userDataPassingService.UpdateAllUserData(this.AllUser);
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.businessDataPassingService.UpdateAllBusinessData([]);
      this.branchDataPassingService.UpdateAllBranchData([]);
      if (this.AllUser.length > 0) {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/User']);

        }
      } else {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/Owner']);
        }
      }
    }
  }

  BranchNameChange(Branch) {
    if (typeof Branch === 'object' && Branch !== null && Branch !== undefined) {
      this.Branch = Branch;
      this.AllBranch = [];
      this.AllBranch.push(Branch);
      if (this.AllUser.length === 0) {
        this.userDataPassingService.UpdateAllUserData([]);
      } else {
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
      }

      if (this.AllBusiness.length === 0) {
        this.businessDataPassingService.UpdateAllBusinessData([]);
      } else {
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
      }
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
      if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
        this.router.navigate(['Customers/Payment']);
      } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
        this.router.navigate(['Customers/Invoice']);
      } else {
        this.router.navigate(['Customers/Branch']);
      }
    } else if (this.LastSelectedBranch === null && Branch === null) {
      this.Branch = undefined;
      if (this.AllUser.length === 0) {
        this.userDataPassingService.UpdateAllUserData([]);
      } else {
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
      }

      if (this.AllBusiness.length === 0) {
        this.businessDataPassingService.UpdateAllBusinessData([]);
      } else {
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
      }
      this.AllBranch = [];
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
      if (this.AllUser.length > 0 && this.AllBusiness.length > 0) {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/Business']);
        }
      } else if (this.AllUser.length > 0 && this.AllBusiness.length === 0) {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/User']);
        }
      } else if (this.AllUser.length === 0 && this.AllBusiness.length > 0) {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/Business']);
        }
      } else {
        if (this.PaymentBoolean === true && this.InvoiceBoolean === false) {
          this.router.navigate(['Customers/Payment']);
        } else if (this.PaymentBoolean === false && this.InvoiceBoolean === true) {
          this.router.navigate(['Customers/Invoice']);
        } else {
          this.router.navigate(['Customers/Owner']);
        }
      }
    }
  }

  PaymentHistory() {
    const PaymentControlName = 'Payment';
    if (this.PaymentBoolean === false) {
      this.PaymentBoolean = true;
      this.InvoiceBoolean = false;
    } else {
      this.PaymentBoolean = false;
      this.InvoiceBoolean = false;
    }
    if (this.SideFGroup.controls[PaymentControlName].value === true) {
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.userDataPassingService.UpdateAllUserData(this.AllUser);
      this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
      this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
      this.router.navigate(['Customers/Payment']);
    } else if (this.SideFGroup.controls[PaymentControlName].value === false) {
      if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length === 0 && this.AllBranch.length === 0) {
        this.AllUser = [];
        this.AllBusiness = [];
        this.AllBranch = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/User']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length !== 0 && this.AllBusiness.length === 0 && this.AllBranch.length === 0) {
        this.AllBranch = [];
        this.AllBusiness = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Business']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length !== 0 && this.AllBranch.length === 0) {
        this.AllBranch = [];
        this.AllUser = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Business']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length !== 0 && this.AllBusiness.length !== 0 && this.AllBranch.length === 0) {
        this.AllBranch = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length === 0 && this.AllBranch.length !== 0) {
        this.AllBusiness = [];
        this.AllUser = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length !== 0 && this.AllBranch.length !== 0) {
        this.AllUser = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length !== 0 && this.AllBusiness.length !== 0 && this.AllBranch.length !== 0) {
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      }
    }
  }

  InvoiceHistory() {
    const InvoiceControlName = 'Invoice';
    if (this.InvoiceBoolean === false) {
      this.InvoiceBoolean = true;
      this.PaymentBoolean = false;
    } else {
      this.InvoiceBoolean = false;
      this.PaymentBoolean = false;
    }
    if (this.SideFGroup.controls[InvoiceControlName].value === true) {
      this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
      this.userDataPassingService.UpdateAllUserData(this.AllUser);
      this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
      this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
      this.router.navigate(['Customers/Invoice']);
    } else if (this.SideFGroup.controls[InvoiceControlName].value === false) {
      if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length === 0 && this.AllBranch.length === 0) {
        this.AllUser = [];
        this.AllBusiness = [];
        this.AllBranch = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/User']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length !== 0 && this.AllBusiness.length === 0 && this.AllBranch.length === 0) {
        this.AllBranch = [];
        this.AllBusiness = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Business']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length !== 0 && this.AllBranch.length === 0) {
        this.AllBranch = [];
        this.AllUser = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Business']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length !== 0 && this.AllBusiness.length !== 0 && this.AllBranch.length === 0) {
        this.AllBranch = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length === 0 && this.AllBranch.length !== 0) {
        this.AllBusiness = [];
        this.AllUser = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length === 0 && this.AllBusiness.length !== 0 && this.AllBranch.length !== 0) {
        this.AllUser = [];
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      } else if (this.AllOwner.length !== 0 && this.AllUser.length !== 0 && this.AllBusiness.length !== 0 && this.AllBranch.length !== 0) {
        this.dataPassingService.UpdateAllOwnerData(this.AllOwner);
        this.userDataPassingService.UpdateAllUserData(this.AllUser);
        this.businessDataPassingService.UpdateAllBusinessData(this.AllBusiness);
        this.branchDataPassingService.UpdateAllBranchData(this.AllBranch);
        this.router.navigate(['Customers/Branch']);
      }
    }
  }

  DefaultNameLoading(OwnerValue: any, UserValue: any, BusinessValue: any, BranchValue: any) {
    this.CustomerService.UserList({ Owner: OwnerValue }).subscribe(response1 => {
      if (response1.Status && response1.Status === true) {
        this.UsersList = response1.Response;
        setTimeout(() => {
          this.SideFGroup.controls.User.updateValueAndValidity();
        }, 100);
      } else {
        this.UserList = [];
      }
    });

    this.CustomerService.BusinessList({ Owner: OwnerValue, User: UserValue }).subscribe(response1 => {
      if (response1.Status && response1.Status === true) {
        this.BusinessList = response1.Response;
        setTimeout(() => {
          this.SideFGroup.controls.Business.updateValueAndValidity();
        }, 1000);
      } else {
        this.BusinessList = [];
      }
    });

    // this.CustomerService.BranchList({ Owner: OwnerValue, User: UserValue, Business: BusinessValue }).subscribe(response1 => {
    //   if (response1.Status && response1.Status === true) {
    //     this.BranchList = response1.Response;
    //     setTimeout(() => {
    //       this.SideFGroup.controls.Branch.updateValueAndValidity();
    //     }, 100);
    //   } else {
    //     this.BranchList = [];
    //   }
    // });
  }


  AutocompleteBlur(key: any) {
    setTimeout(() => {
      const value = this.SideFGroup.controls[key].value;
      if (!value || value === null || value === '' || typeof value !== 'object') {
        this.SideFGroup.controls[key].setValue(null);
      }
    }, 500);
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
