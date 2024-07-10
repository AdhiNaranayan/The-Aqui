import { Component, ElementRef, HostListener, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { InvoiceManagementService } from 'src/app/services/invoice-management/invoice-management.service';
import { InvoiceDataPassingService } from 'src/app/services/common-services/invoice-data-passing.service';
import { Router } from '@angular/router';
import { ModalInvoiceComponent } from '../Modals/modal-invoice/modal-invoice.component';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { ActivatedRoute } from '@angular/router';
import { SamplePopupComponent } from '../Modals/sample-popup/sample-popup.component';
import { ModalInvoiceApproveComponent } from '../Modals/modal-invoice-approve/modal-invoice-approve.component';
@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})


export class InvoiceManagementComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  @ViewChild('tab') tab: any; // Reference to the mat-tab



  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   $event.returnValue = true;
  // }

  bussines_id: String;
  customer_id: String;
  title = 'Client';
  StateList: any[] = [];

  detailedInvoice: any[] = [];
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
  InvoiceDetails: any[] = [];
  FiltersArray: any[] = [
    { Active: false, Key: 'InvoiceNumber', Value: '', DisplayName: 'InvoiceNumber', DBName: 'InvoiceNumber', Type: 'String', Option: '' },
    { Active: false, Key: 'InvoiceAmount', Value: '', DisplayName: 'InvoiceAmount', DBName: 'InvoiceAmount', Type: 'String', Option: '' }
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
  OpenCounts = 0;
  AcceptedCounts = 0;
  DisputedCounts = 0;
  InvoiceStatusArr: any[] = [
    { Name: 'Open', Key: 'Open' },
    { Name: 'Accept', Key: 'Accepted' },
    { Name: 'Dispute', Key: 'Disputed' }];
  ActiveInvoiceStatus: any;
  ActiveAcceptAndDisputed: any;
  AllBusiness: any[] = [];
  AllBranch: any[] = [];
  AllCategory: any[] = [];
  CustomerCategory: any;
  WaitForApprovalArray: any[] = [];
  InvoiceStatusArray: any[] = [{ Name: 'Accept', Key: 'Accepted' },
  { Name: 'Dispute', Key: 'Disputed' }];
  DisableCheckBox: boolean = false;

  constructor(private Login: LoginManageService,
    private renderer: Renderer2,
    private InvoiceManage: InvoiceManagementService,
    private DataPassingService: InvoiceDataPassingService,
    private router: Router,
    private Toastr: ToastrService,
    private CategoryPassingService: CategoryDataPassingService,
    public ModalService: BsModalService, private route: ActivatedRoute) {
    this.bussines_id = this.route.snapshot.paramMap.get('BussinessId').toString();
    this.customer_id = this.route.snapshot.paramMap.get('CustomerId').toString();
    this.UserInfo = JSON.parse(this.Login.LoginUser_Info());
    this.ActiveInvoiceStatus = 'Open';

    this.subscription.add(
      this.DataPassingService.AllBusiness.subscribe(response => {
        this.AllBusiness = response;
      })
    );


    this.subscription.add(
      this.DataPassingService.AllBranch.subscribe(response => {
        this.AllBranch = response;
      })
    );
    if (this.AllBusiness.length === 0 && this.AllBranch.length === 0) {
      this.router.navigate(['invoice-management']);
    }

    // this.subscription.add(
    //   this.CategoryPassingService.AllCategory.subscribe(response => {

    //     this.AllCategory = response;
    //     if (this.AllCategory.length > 0) {
    //       this.CustomerCategory = this.AllCategory[0];
    //       if (this.CustomerCategory === 'Buyer') {
    //         if (this.ActiveInvoiceStatus === 'Open') {
    //           this.BuyerPendingInvoice_List();
    //         }
    //       } else if (this.CustomerCategory === 'Seller') {
    //         if (this.ActiveInvoiceStatus === 'Open') {
    //           this.SellerPendingInvoice_List();
    //         }
    //       }
    //     } else {
    //       // this.router.navigate(['Customers/Owner']);
    //     }
    //   })
    // );

  }

  ngOnInit(): void {

    this.CustomerCategory = localStorage.getItem('category_name');

    this.CustomerCategory == 'Seller' ? this.SellerPendingInvoice_List() : this.BuyerPendingInvoice_List()
    this.InvoiceCounts();
    this.FilterFGroup = new FormGroup({
      InvoiceNumber: new FormControl('', Validators.required),
      InvoiceAmount: new FormControl('', Validators.required),
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

  tabChanged(index: number) {
    const selectedInvoice = this.InvoiceStatusArr[index];
    // Handle your click event here using selectedInvoice
    this.ChangeInvoiceStatus(selectedInvoice.Key);
  }


  InvoiceCounts() {
    const Data = {
      "CustomerCategory": this.CustomerCategory, //categry
      "CustomerId": this.customer_id, // custmr id
      "FilterQuery": {
        "Business": "",
        "Buyer": "",
        "BuyerBusiness": "",
        "CustomDateRange": {
          "From": "",
          "To": ""
        },
        "DateRange": "",
        "SearchKey": "",
        "Seller": "",
        "StatusType": "All"
      },
      "InvoiceType": "Accept",
      "PageNumber": 1
    }
    this.InvoiceManage.CompleteInvoiceList(Data).subscribe(response => {
      if (response !== null) {
        this.OpenCounts = response.Response.OpenCount,
          this.AcceptedCounts = response.Response.AcceptCount,
          this.DisputedCounts = response.Response.DisputeCount
      } else {
        this.OpenCounts = 0,
          this.AcceptedCounts = 0,
          this.DisputedCounts = 0
      }
    })
  }

  BuyerPendingInvoice_List() {
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
      Buyer: this.customer_id,
      BuyerBusiness: this.bussines_id,
      // Branch: this.AllBranch[0]._id,
      CustomerCategory: "Buyer",
      // Buyer: this.UserInfo.User,
    };
    this.TableLoader();
    this.InvoiceManage.BuyerPendingInvoice_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response) {
        this.InvoiceDetails = response.Response;

        this.InvoiceDetails = this.InvoiceDetails.map(obj => {
          obj.WaitingForApproval = false;
          return obj;
        });
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
      } else {
      }
    });
  }


  SwitchToAcceptAndDisputed(Key) {
    if (Key === 'Accepted') {
      var invList = this.InvoiceDetails.filter((k: any) => k.WaitingForApproval == true);
      // this.InvoiceDetails.map(Obj => {
      //   if (Obj.WaitingForApproval === true) {
      //     this.WaitForApprovalArray.push(Obj);
      //   }
      // });
      var Info = {};
      invList.map(obj => {
        Info = {
          InvoiceId: [{ id: obj._id }],
          Buyer: this.UserInfo.User,
          InvoiceStatus: "Accept"
        }
      });
      this.InvoiceManage.BuyerInvoice_Accept(Info).subscribe(response => {

        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invoice Status  Successfully Updated' });
          if (this.ActiveInvoiceStatus === 'Open' && this.CustomerCategory === 'Buyer') {
            this.BuyerPendingInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Buyer') {
            this.BuyerAcceptInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Buyer') {
            this.BuyerDisputedInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Open' && this.CustomerCategory === 'Seller') {
            this.SellerPendingInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Seller') {
            this.SellerAcceptInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Seller') {
            this.SellerDisputedInvoice_List();
          }
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
        }
      });
    } else if (Key === 'Disputed') {
      this.InvoiceDetails.map(Obj => {
        if (Obj.WaitingForApproval === true) {
          this.WaitForApprovalArray.push(Obj);
        }
      });
      this.InvoiceManage.BuyerInvoice_Dispute({ WaitForApprovalArray: this.WaitForApprovalArray, Buyer: this.UserInfo.User }).subscribe(response => {
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invoice Status  Successfully Updated' });
          if (this.ActiveInvoiceStatus === 'Open' && this.CustomerCategory === 'Buyer') {
            this.BuyerPendingInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Buyer') {
            this.BuyerAcceptInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Buyer') {
            this.BuyerDisputedInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Open' && this.CustomerCategory === 'Seller') {
            this.SellerPendingInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Seller') {
            this.SellerAcceptInvoice_List();
          } else if (this.ActiveInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Seller') {
            this.SellerDisputedInvoice_List();
          }
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
        }
      });
    }
  }


  WaitForApproval(Event: any, Index: any) {
    this.InvoiceDetails[Index].WaitingForApproval = Event.checked;
    this.DisableCheckBox = this.InvoiceDetails.some((k: any) => k.WaitingForApproval == true);
  }

  ResInv(inv: any) {
    // Perform any actions you want when a message is clicked
    const initialState = {
      Type: 'DefaultPage',
      detailedInvoice: inv,
      UserInfo: this.UserInfo
    };
    this.modalReference = this.ModalService.show(ModalInvoiceApproveComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {

      if (response.Data === 'Accepted') {
        var Info = {};

        Info = {
          InvoiceId: [{ id: inv._id }],
          Buyer: this.UserInfo.User,
          InvoiceStatus: "Accept"
        }

        this.InvoiceManage.BuyerInvoice_Accept(Info).subscribe(response => {
          if (response.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invoice Accepted  Successfully Updated' });
            if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Open') {
              this.BuyerPendingPagination_Action(1);
            } else if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Accepted') {
              this.BuyerAcceptPagination_Action(1);
            } else if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Disputed') {
              this.BuyerDisputedPagination_Action(1);
            } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Open') {
              this.SellerPendingPagination_Action(1);
            } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Accepted') {
              this.SellerAcceptPagination_Action(1);
            } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Disputed') {
              this.SellerDisputedPagination_Action(1);
            }
          } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          }
        })

      } else if (response.Data === 'Disputed') {
        var Info = {};
        Info = {
          InvoiceId: [{ _id: inv._id }],
          Buyer: this.UserInfo.User,
          InvoiceStatus: "Disputed"
        }


        this.InvoiceManage.BuyerInvoice_Disputed(Info).subscribe(response => {
          if (response.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Invoice Disputed  Successfully Updated' });
            if (this.ActiveInvoiceStatus === 'Open' && this.CustomerCategory === 'Buyer') {
              this.BuyerPendingInvoice_List();
            } else if (this.ActiveInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Buyer') {
              this.BuyerAcceptInvoice_List();
            } else if (this.ActiveInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Buyer') {
              this.BuyerDisputedInvoice_List();
            } else if (this.ActiveInvoiceStatus === 'Open' && this.CustomerCategory === 'Seller') {
              this.SellerPendingInvoice_List();
            } else if (this.ActiveInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Seller') {
              this.SellerAcceptInvoice_List();
            } else if (this.ActiveInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Seller') {
              this.SellerDisputedInvoice_List();
            }
          } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          }
        });
      } else {

      }
    });

  }


  SellerPendingInvoice_List() {
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
      Seller: this.customer_id,
      Business: this.bussines_id,
      // Branch: this.AllBranch[0]._id,
      CustomerCategory: "Seller",
    };
    this.TableLoader();
    this.InvoiceManage.SellerPendingInvoice_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvoiceDetails = response.Response;

        // setTimeout(() => {
        if (this.TableLoaderSection != undefined) {
          this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        }
        // }, 10);
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
      } else {
      }
    });
  }


  BuyerAcceptInvoice_List() {
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
      // Buyer: this.UserInfo.User,
      // BuyerBusiness: this.AllBusiness[0]?._id,
      Buyer: this.customer_id,
      BuyerBusiness: this.bussines_id,
      // Branch: this.AllBranch[0]._id,
      CustomerCategory: "Buyer",
      // CustomerId: this.UserInfo.User
    };
    this.TableLoader();
    this.InvoiceManage.BuyerAcceptInvoice_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvoiceDetails = response.Response;
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
      } else {
      }
    });
  }

  SellerAcceptInvoice_List() {
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
      Seller: this.customer_id,
      Business: this.bussines_id,
      // Branch: this.AllBranch[0]._id,
      CustomerCategory: "Seller",
      // "CustomerId": this.UserInfo.User,
    };
    this.TableLoader();
    this.InvoiceManage.SellerAcceptInvoice_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvoiceDetails = response.Response;
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
      } else {
      }
    });
  }

  BuyerDisputedInvoice_List() {
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
      // Buyer: this.UserInfo.User,
      // BuyerBusiness: this.AllBusiness[0]._id,
      Buyer: this.customer_id,
      BuyerBusiness: this.bussines_id,
      CustomerCategory: "Buyer",
      // CustomerId: this.UserInfo.User,

    };
    this.TableLoader();
    this.InvoiceManage.BuyerDisputedInvoice_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvoiceDetails = response.Response;
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
      } else {
      }
    });
  }

  SellerDisputedInvoice_List() {
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
      Seller: this.customer_id,
      Business: this.bussines_id,
      // Branch: this.AllBranch[0]._id,
      CustomerCategory: "Seller",
      // "CustomerId": this.UserInfo.User,
    };
    this.TableLoader();
    this.InvoiceManage.SellerDisputedInvoice_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.InvoiceDetails = response.Response;
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
      } else {
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

  BuyerPendingPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.BuyerPendingInvoice_List();
    }
  }

  SellerPendingPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.SellerPendingInvoice_List();
    }
  }

  BuyerAcceptPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.BuyerAcceptInvoice_List();
    }
  }

  SellerAcceptPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.SellerAcceptInvoice_List();
    }
  }

  BuyerDisputedPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.BuyerDisputedInvoice_List();
    }
  }

  SellerDisputedPagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.SellerDisputedInvoice_List();
    }
  }


  Short_Change(index: any) {
    if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.BuyerPendingPagination_Action(1);
    } else if (this.THeaders[index].If_Short !== undefined &&
      this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Descending';
      this.BuyerPendingPagination_Action(1);
    } else if (this.THeaders[index].If_Short !== undefined
      && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.BuyerPendingPagination_Action(1);
    } else {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.BuyerPendingPagination_Action(1);
    }
  }

  ResetFilters() {
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.FilterFGroupStatus = false;
    if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Open') {
      this.BuyerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Accepted') {
      this.BuyerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Disputed') {
      this.BuyerDisputedPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Open') {
      this.SellerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Accepted') {
      this.SellerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Disputed') {
      this.SellerDisputedPagination_Action(1);
    }
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
    if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Open') {
      this.BuyerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Accepted') {
      this.BuyerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Buyer' && this.ActiveInvoiceStatus === 'Disputed') {
      this.BuyerDisputedPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Open') {
      this.SellerPendingPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Accepted') {
      this.SellerAcceptPagination_Action(1);
    } else if (this.CustomerCategory === 'Seller' && this.ActiveInvoiceStatus === 'Disputed') {
      this.SellerDisputedPagination_Action(1);
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

  ViewInvoicesDetails(Index: any) {
    const initialState = {
      Type: 'DefaultPage',
      InvoiceDetails: this.InvoiceDetails[Index]
    };


    this.modalReference = this.ModalService.show(ModalInvoiceComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.InvoiceDetails[Index] = response.Response;
      }
    });
  }

  ChangeInvoiceStatus(CheckInvoiceStatus) {
    this.ActiveInvoiceStatus = CheckInvoiceStatus;
    if (CheckInvoiceStatus === 'Open' && this.CustomerCategory === 'Buyer') {
      this.BuyerPendingInvoice_List();
    } else if (CheckInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Buyer') {
      this.BuyerAcceptInvoice_List();
    } else if (CheckInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Buyer') {
      this.BuyerDisputedInvoice_List();
    } else if (CheckInvoiceStatus === 'Open' && this.CustomerCategory === 'Seller') {
      this.SellerPendingInvoice_List();
    } else if (CheckInvoiceStatus === 'Accepted' && this.CustomerCategory === 'Seller') {
      this.SellerAcceptInvoice_List();
    } else if (CheckInvoiceStatus === 'Disputed' && this.CustomerCategory === 'Seller') {
      this.SellerDisputedInvoice_List();
    }
  }

  CreateInvoice() {
    const initialState = { Type: 'Create' };
    this.modalReference = this.ModalService.show(ModalInvoiceComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        // tslint:disable-next-line:no-conditional-assignment
        if (this.ActiveInvoiceStatus = 'Open') {
          this.SellerPendingPagination_Action(1);
        } else if (this.ActiveInvoiceStatus === 'Accepted') {
          this.SellerAcceptPagination_Action(1);
        } else if (this.ActiveInvoiceStatus === 'Disputed') {
          this.SellerDisputedPagination_Action(1);
        }
      }
    });
  }

  EditInvoicesDetails(Index: any) {

    const initialState = {
      Type: 'Update',
      InvoiceDetails: this.InvoiceDetails[Index]
    };
    this.modalReference = this.ModalService.show(ModalInvoiceComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        // tslint:disable-next-line:no-conditional-assignment
        if (this.ActiveInvoiceStatus = 'Open') {
          this.SellerPendingPagination_Action(1);
        } else if (this.ActiveInvoiceStatus === 'Accepted') {
          this.SellerAcceptPagination_Action(1);
        } else if (this.ActiveInvoiceStatus === 'Disputed') {
          this.SellerDisputedPagination_Action(1);
        }
      }
    });
  }

  InvoiceAccept(Index: any) {

  }

}
