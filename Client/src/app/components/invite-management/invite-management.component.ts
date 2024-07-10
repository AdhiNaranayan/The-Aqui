import { ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Subscription } from 'rxjs';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { InviteManagementService } from 'src/app/services/invite-management/invite-management.service';
import { ModalInviteManagementComponent } from '../Modals/modal-invite-management/modal-invite-management.component';
import { ModalPopupComponent } from '../Modals/modal-popup/modal-popup.component';
import { ToastrService } from '../../services/common-services/toastr.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { ModalInviteStatusApprovalComponent } from '../Modals/modal-invite-status-approval/modal-invite-status-approval.component';
import { LoadingService } from 'src/app/services/loading.service';
interface LabelNumbers {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-invite-management',
  templateUrl: './invite-management.component.html',
  styleUrls: ['./invite-management.component.scss']
})
export class InviteManagementComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

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
  LimitCount = 6;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  FilterFGroup: FormGroup;
  FilterFGroupStatus = false;
  InvitedDetails: any[] = [];
  FiltersArray: any[] = [
    { Active: false, Key: 'ContactName', Value: '', DisplayName: 'ContactName', DBName: 'ContactName', Type: 'String', Option: '' },
    { Active: false, Key: 'Mobile', Value: '', DisplayName: 'Mobile', DBName: 'Mobile', Type: 'String', Option: '' },
    { Active: false, Key: 'Email', Value: '', DisplayName: 'Email', DBName: 'Email', Type: 'String', Option: '' }
  ];

  THeaders: any[] = [
    { Key: 'ContactName', ShortKey: 'ContactName', Name: 'ContactName', If_Short: false, Condition: '' },
    { Key: 'Mobile', ShortKey: 'Mobile', Name: 'Mobile', If_Short: false, Condition: '' },
    { Key: 'Email', ShortKey: 'Email', Name: 'Email', If_Short: false, Condition: '' },
    { Key: 'CustomerCategory', ShortKey: 'CustomerCategory', Name: 'Customer Category', If_Short: false, Condition: '' },
    { Key: 'CustomerType', ShortKey: 'CustomerType', Name: 'CustomerType', If_Short: false, Condition: '' },
    { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date', If_Short: false, Condition: '' },
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
  InviteStatusArr: any[] = [{ Name: 'Pending Approval', Key: 'Pending_Approval' },
  { Name: 'Pending', Key: 'Pending' },
  { Name: 'Accept', Key: 'Accept' },
  { Name: 'Reject', Key: 'Reject' }];
  ActiveInviteStatus: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  constructor(private Login: LoginManageService,
    private renderer: Renderer2,
    private InviteManage: InviteManagementService,
    private Toastr: ToastrService,
    private loadingService: LoadingService,
    private DataPassingService: CategoryDataPassingService,
    public ModalService: BsModalService) {
    this.UserInfo = JSON.parse(this.Login.LoginUser_Info());
    this.ActiveInviteStatus = 'Pending_Approval';
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Buyer') {
            if (this.ActiveInviteStatus === 'Pending_Approval') {
              this.PendingApprovalBuyer();
            }
          } else if (this.CustomerCategory === 'Seller') {
            if (this.ActiveInviteStatus === 'Pending_Approval') {
              this.PendingApprovalSeller();
            }
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );

  }

  ngOnInit(): void {
    this.FilterFGroup = new FormGroup({
      Mobile: new FormControl('', [this.CustomValidation('MobileNumeric'), Validators.minLength(9), Validators.maxLength(10), Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      ContactName: new FormControl('', Validators.required),
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
      CustomerId: this.UserInfo.User
    };
    this.TableLoader();
    this.InviteManage.AllInvitedList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        // After the asynchronous operation completes, hide the loader
        this.loadingService.hide();
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
      }
    });
  }

  tabChanged(index: number) {
    const selectedInvite = this.InviteStatusArr[index];
    // Handle your click event here using selectedInvoice
    this.ChangeInviteStatus(selectedInvite.Key);
  }

  SellerInvite_AcceptList() {
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
      CustomerId: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Accept"
    };
    this.TableLoader();
    this.InviteManage.SellerInvite_AcceptList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        // After the asynchronous operation completes, hide the loader
        this.loadingService.hide();
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  SellerInvite_PendingList() {
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
      CustomerId: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Pending"
    };
    this.TableLoader();
    this.InviteManage.CompleteInvitedList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  SellerInvite_RejectList() {
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
      CustomerId: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Reject"
    };
    this.TableLoader();
    this.InviteManage.SellerInvite_RejectList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  PendingApprovalBuyer() {
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
      CustomerId: this.UserInfo.User,
      Mobile: this.UserInfo.Mobile,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Pending_Approval"
    };
    this.TableLoader();
    this.InviteManage.InvitedSeller_PendingList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  BuyerInvite_PendingList() {
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
      CustomerId: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Pending"
    };
    this.TableLoader();
    this.InviteManage.CompleteInvitedList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        // this.TotalRows = response.SubResponse;
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            this.TotalRows = Object.keys(response.Response).length
          }
        }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  BuyerInvite_AcceptList() {
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
      CustomerId: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Accept"
    };
    // console.log(Data, '23131231');

    this.TableLoader();
    this.InviteManage.SellerInvite_AcceptList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  BuyerInvite_RejectList() {
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
      CustomerId: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Reject"
    };
    this.TableLoader();
    this.InviteManage.SellerInvite_RejectList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  PendingApprovalSeller() {
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
      CustomerId: this.UserInfo.User,
      Mobile: this.UserInfo.Mobile,
      CustomerCategory: this.CustomerCategory,
      Invite_Status: "Pending_Approval"
    };
    this.TableLoader();
    this.InviteManage.InvitedSeller_PendingList(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvitedDetails = response.Response;
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.InvitedDetails = [];
        this.TotalRows = 0;
      }
    });
  }

  ChangeInviteStatus(CheckValidStatus) {
    this.ActiveInviteStatus = CheckValidStatus;
    if (CheckValidStatus === 'Pending' && this.CustomerCategory === 'Seller') {
      this.SellerInvite_PendingList();
    } else if (CheckValidStatus === 'Pending' && this.CustomerCategory === 'Buyer') {
      this.BuyerInvite_PendingList();
    } else if (CheckValidStatus === 'Accept' && this.CustomerCategory === 'Seller') {
      this.SellerInvite_AcceptList();
    } else if (CheckValidStatus === 'Reject' && this.CustomerCategory === 'Seller') {
      this.SellerInvite_RejectList();
    } else if (CheckValidStatus === 'Pending_Approval' && this.CustomerCategory === 'Buyer') {
      this.PendingApprovalBuyer();
    } else if (CheckValidStatus === 'Pending_Approval' && this.CustomerCategory === 'Seller') {
      this.PendingApprovalSeller();
    } else if (CheckValidStatus === 'Accept' && this.CustomerCategory === 'Buyer') {
      this.BuyerInvite_AcceptList();
    } else if (CheckValidStatus === 'Reject' && this.CustomerCategory === 'Buyer') {
      this.BuyerInvite_RejectList();
    } else {
      this.InvitedDetails = [];
      this.TotalRows = 0;
      this.Pagination_Affect();
    }
  }


  InviteStatusAcceptUpdate(Index: any) {
    let initialState = {};
    if (this.CustomerCategory === 'Seller') {
      initialState = {
        Type: 'SellerInviteAccept',
        InviteInfo: this.InvitedDetails[Index]
      };
    } else if (this.CustomerCategory === 'Buyer') {
      initialState = {
        Type: 'BuyerInviteAccept',
        InviteInfo: this.InvitedDetails[Index]
      };
    }
    this.modalReference = this.ModalService.show(ModalInviteStatusApprovalComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending_Approval') {
          this.BuyerPendingApprovalPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending') {
          this.BuyerPendingPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Accept') {
          this.BuyerAcceptPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Reject') {
          this.BuyerRejectPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending_Approval') {
          this.SellerPendingApprovalPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending') {
          this.SellerPendingPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Accept') {
          this.SellerAcceptPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Reject') {
          this.SellerRejectPagination_Action(1);
        }
      }
    });
  }

  InviteStatusRejectUpdate(Index: any) {
    const AcceptStatus = {
      Invite_Status: 'Reject',
      InviteId: this.InvitedDetails[Index]._id,
      CustomerId: this.UserInfo.User,
      CustomerCategory: this.CustomerCategory
    };
    this.InviteManage.RejectInvite(AcceptStatus).subscribe(response => {
      if (response.Status) {
        if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending_Approval') {
          this.BuyerPendingApprovalPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending') {
          this.BuyerPendingPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Accept') {
          this.BuyerAcceptPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Reject') {
          this.BuyerRejectPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending_Approval') {
          this.SellerPendingApprovalPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending') {
          this.SellerPendingPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Accept') {
          this.SellerAcceptPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Reject') {
          this.SellerRejectPagination_Action(1);
        }
        this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invite Status Successfully Updated' });
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
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

  SellerAcceptPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.SellerInvite_AcceptList();
    }
  }


  SellerRejectPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.SellerInvite_RejectList();
    }
  }

  SellerPendingPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.SellerInvite_PendingList();
    }
  }

  SellerPendingApprovalPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.PendingApprovalSeller();
    }
  }


  BuyerAcceptPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.BuyerInvite_AcceptList();
    }
  }


  BuyerRejectPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.BuyerInvite_RejectList();
    }
  }

  BuyerPendingPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.BuyerInvite_PendingList();
    }
  }

  BuyerPendingApprovalPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.PendingApprovalBuyer();
    }
  }


  Short_Change(index: any) {
    if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
    } else if (this.THeaders[index].If_Short !== undefined &&
      this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Descending';
    } else if (this.THeaders[index].If_Short !== undefined
      && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
    } else {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
    }
  }

  ResetFilters() {
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.FilterFGroupStatus = false;
    if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending_Approval') {
      this.BuyerPendingApprovalPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending') {
      this.BuyerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Accept') {
      this.BuyerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Reject') {
      this.BuyerRejectPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending_Approval') {
      this.SellerPendingApprovalPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending') {
      this.SellerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Accept') {
      this.SellerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Reject') {
      this.SellerRejectPagination_Action(1);
    }    // this.modalReference.hide();
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
    if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending_Approval') {
      this.BuyerPendingApprovalPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending') {
      this.BuyerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Accept') {
      this.BuyerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Reject') {
      this.BuyerRejectPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending_Approval') {
      this.SellerPendingApprovalPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending') {
      this.SellerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Accept') {
      this.SellerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Reject') {
      this.SellerRejectPagination_Action(1);
    }
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

  ViewInviteDetails(index: any) {
    const initialState = {
      Type: 'DefaultPage',
      InviteInfo: this.InvitedDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalInviteManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.InvitedDetails[index] = response.Response;
      }
    });
  }

  AcceptToCustomer(index: any) {
    const initialState = {
      Type: 'DefaultPage',
      InviteInfo: this.InvitedDetails[index]
    } as Partial<ModalPopupComponent>

    this.modalReference = this.ModalService.show(
      ModalPopupComponent,
      {
        initialState,
        ignoreBackdropClick: true,
        class: 'modal-lg modal-dialog-centered animated zoomIn'
      }
    );

    this.modalReference.content.onClose.subscribe((response: any) => {
      if (response.Status) {
        this.InvitedDetails[index] = response.Response;
      }
    });
  }









  EditInviteDetails(index: any) {
    const initialState = {
      Type: 'Update',
      InviteInfo: this.InvitedDetails[index]
    };
    this.modalReference = this.ModalService.show(ModalInviteManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.InvitedDetails[index] = response.Response;
      }
    });
  }

  CreateInvite() {
    const initialState = { Type: 'Create' };
    this.modalReference = this.ModalService.show(ModalInviteManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending_Approval') {
          this.BuyerPendingApprovalPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Pending') {
          this.BuyerPendingPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Accept') {
          this.BuyerAcceptPagination_Action(1);
        } else if (this.CustomerCategory === 'Buyer' && this.ActiveInviteStatus === 'Reject') {
          this.BuyerRejectPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending_Approval') {
          this.SellerPendingApprovalPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Pending') {
          this.SellerPendingPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Accept') {
          this.SellerAcceptPagination_Action(1);
        } else if (this.CustomerCategory === 'Seller' && this.ActiveInviteStatus === 'Reject') {
          this.SellerRejectPagination_Action(1);
        }
      }
    });
  }

}
