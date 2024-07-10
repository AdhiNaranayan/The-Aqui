import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { HundiScoreService } from 'src/app/services/hundi-score/hundi-score.service';
import { ModalTemporaryCreditComponent } from '../Modals/modal-temporary-credit/modal-temporary-credit.component';
import { InviteManagementService } from 'src/app/services/invite-management/invite-management.service';
import { LoadingService } from 'src/app/services/loading.service';
export interface Business { _id: string; BusinessName: string; }
export interface Branch { _id: string; BranchName: string; }

@Component({
  selector: 'app-seller-and-buyer-connected',
  templateUrl: './seller-and-buyer-connected.component.html',
  styleUrls: ['./seller-and-buyer-connected.component.scss']
})
export class SellerAndBuyerConnectedComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  UserInfo: any;
  ChartArr: any[] = [];
  AllCategory: any[] = [];
  CustomerCategory: any;
  chartReady = false;
  CustomerForm: FormGroup;
  // public pieChartOptions: ChartOptions = { responsive: true };
  // public pieChartLabels: Label[] = ['Over Due', 'Due Today', 'Upcoming'];
  // public pieChartData: SingleDataSet = [0, 0, 0];
  // public pieChartType: ChartType = 'pie';
  // public pieChartLegend = true;
  // public pieChartPlugins = [];
  BusinessList: Business[] = [];
  FilterBusiness: Observable<Business[]>;
  LastSelectedBusiness = null;
  BranchList: Branch[] = [];
  FilterBranch: Observable<Branch[]>;
  LastSelectedBranch = null;
  Business = '';
  Buyerrdetails = '';
  BuyerBusiness = '';
  Branch = '';
  BusinessName : any = [];
  BuyerBusinessName: any = [];
  SellerBusinessName: any = [];
  LimitCount = 3;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  CurrentIndex = 1;
  SkipCount = 0;
  modalReference: BsModalRef;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#ff0000', '#FFA200', '#008000'], //'#313a64', '#f2940c'
      hoverBackgroundColor: ['#ff0000', '#FFA200', '#008000'], // '#313a64', '#f2940c'
      borderWidth: 2,
    }
  ];
  BuyerBusinessList: any = [];
  BuyerList: any = [];
  SellerBusinessList: any = [];
  FilterFGroupStatus = false;
  FiltersArray: any[] = [
    { Active: false, Key: 'Business', Value: '', DisplayName: 'Business', DBName: 'Business', Type: 'Object', Option: '' },
    { Active: false, Key: 'BuyerBusiness', Value: '', DisplayName: 'BuyerBusiness', DBName: 'BuyerBusiness', Type: 'Object', Option: '' },
    { Active: false, Key: 'Branch', Value: '', DisplayName: 'Branch', DBName: 'Branch', Type: 'Object', Option: '' }
  ];
  constructor(private LoginService: LoginManageService,
    private DataPassingService: CategoryDataPassingService,
    private BusinessManage: BusinessManagementService,
    private InviteManagement: InviteManagementService,
    public ModalService: BsModalService,
    private loadingService: LoadingService,
    public router: Router,
    public HundiScore: HundiScoreService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Seller') {
            this.BusinessManage.Business_List({ CustomerId: this.UserInfo.User, CustomerCategory: this.CustomerCategory }).subscribe(response => {

              this.BusinessList = response.Response;
              setTimeout(() => {
                this.CustomerForm.controls.Business.updateValueAndValidity();
              }, 100);
            });

            this.BusinessManage.MyBusinessList({ Customer: this.UserInfo.User, CustomerCategory: "Buyer" }).subscribe((data: any) => {
              this.BuyerBusinessList = data.Response;
            });

            // Branch API payload
            this.BusinessManage.UsersBusinessAndBranches_List({ CustomerId: this.UserInfo.User, CustomerCategory: this.CustomerCategory, User: this.UserInfo.User }).subscribe((response: any) => {
              this.BuyerList = response.Response;
            })

          } else if (this.CustomerCategory === 'Buyer') {
            this.BusinessManage.Business_List({ CustomerId: this.UserInfo.User, CustomerCategory: this.CustomerCategory }).subscribe(response => {
              this.BusinessList = response.Response;
              setTimeout(() => {
                this.CustomerForm.controls.Business.updateValueAndValidity();
              }, 100);
            });
            this.BusinessManage.MyBusinessList({ Customer: this.UserInfo.User, CustomerCategory: "Seller" }).subscribe((data: any) => {
              this.SellerBusinessList = data.Response;
            });
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );
  }

  ngOnInit(): void {

    this.CustomerForm = new FormGroup({
      Business: new FormControl(''),
      BuyerBusiness: new FormControl(''),
      Branch: new FormControl('')
    });
    this.ConnectedBuyer();
    // Newly Added
    const FilterControls = this.CustomerForm.controls;
    Object.keys(FilterControls).map(obj => {
      this.CustomerForm.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      })
    })
  }

  BusinessDisplayName(Business: any) {
    return (Business && Business !== null && Business !== '') ? Business.FirstName + ' ' + Business.LastName : null;
  }


  BranchDisplayName(Branch: any) {
    return (Branch && Branch !== null && Branch !== '') ? Branch.BranchName : null;
  }

  // newly added for buyer business
  BuyerBusinessDisplayName(BuyerBusiness: any) {
    return (BuyerBusiness && BuyerBusiness !== null && BuyerBusiness !== '') ? BuyerBusiness.FirstName+ ' ' + BuyerBusiness.LastName: null;
  }

  ConnectedBuyer() {
    this.loadingService.show(); // Show loader
    this.ChartArr = [];
    if (this.CustomerCategory === 'Buyer') {
      this.HundiScore.FilterBuyerAndBusinessAndBranchAgainstSellerScore({
        CustomerId: this.UserInfo.User,
        CustomerCategory: 'Buyer',
        Business: this.Business,
        "FilterQuery": {
          "Business": this.Business,
          "Buyer": "",
          "BuyerBusiness": this.BuyerBusiness,
          "Seller": ""
        }
        // Branch: this.Branch,
        // Low_To_High_Invoice: false,
        // Low_To_High_OverDue: false,
        // High_To_Low_Invoice: false,
        // High_To_Low_OverDue: false
      }).subscribe(response => {
        // console.log(response, 'w352353253245');
        if (response.Status && response.Status === true) {
          const BuyerArr = response.Response;
          // After the asynchronous operation completes, hide the loader
          this.loadingService.hide();
          BuyerArr.map(Obj => {
            // const ChLabel = ['Credit Balance', 'Outstanding'] as Label[];
            // const ChData = [Obj.AvailableCreditLimit, Obj.OutStandingPayments] as SingleDataSet;
            const ChLabel = ['OverDue', 'Due Today', 'Upcoming'] as Label[];
            const ChData = [Obj.OverDueAmount, Obj.DueTodayAmount, Obj.UpComingAmount] as SingleDataSet;
            const ChType = 'pie' as ChartType;
            const ChOptions = { responsive: true } as ChartOptions;
            let DueTodayPercentage = 0;
            let OverDuePercentage = 0;
            let UpComingPercentage = 0;

            if (Obj.OverDueAmount > 0) {
              const UsedOverDuePercentage = parseFloat(Obj.OverDueAmount) / parseFloat(Obj.AvailableCreditLimit);
              OverDuePercentage = Math.round(UsedOverDuePercentage * 100);
            } else {
              OverDuePercentage = 0;
            }
            if (Obj.DueTodayAmount > 0) {
              const UsedDueTodayPercentage = parseFloat(Obj.DueTodayAmount) / parseFloat(Obj.AvailableCreditLimit);
              DueTodayPercentage = Math.round(UsedDueTodayPercentage * 100);
            } else {
              DueTodayPercentage = 0;
            }

            if (Obj.UpComingAmount > 0) {
              const UsedUpComingPercentage = parseFloat(Obj.UpComingAmount) / parseFloat(Obj.AvailableCreditLimit);
              UpComingPercentage = Math.round(UsedUpComingPercentage * 100);
            } else {
              UpComingPercentage = 0;
            }
            const NewObj = {
              ChLabel,
              ChData,
              ChType,
              ChOptions,
              ChLegend: true,
              ChPlugins: '',
              HundiScore: Obj.HundiScore,
              _id: Obj._id,
              CreditLimit: Obj.TotalCreditLimit,
              AvailableCreditLimit: Obj.AvailableCreditLimit,
              ContactName: Obj.Name,
              OverDueInvoiceCount: Obj.OverDueInvoiceCount,
              PendingInvoiceCount: Obj.PendingInvoiceCount,
              OverDuePercentages: OverDuePercentage,
              DueTodayPercentages: DueTodayPercentage,
              UpComingPercentages: UpComingPercentage,
              UpComingAmounts: Obj.UpComingAmount,
              DueTodayAmounts: Obj.DueTodayAmount,
              OverDueAmounts: Obj.OverDueAmount,
              BuyerPaymentCycle: Obj.inviteData.BuyerPaymentCycle,
              BuyerPaymentType: Obj.inviteData.BuyerPaymentType,
              Business: Obj.inviteData.Business._id,
              SellerBusinesName: Obj.inviteData.Business.FirstName + ' ' + Obj.inviteData.Business.LastName,
              BuyerBusiness: Obj.inviteData.BuyerBusiness._id,
              BuyerBusinessName: Obj.inviteData.BuyerBusiness.FirstName + ' ' + Obj.inviteData.BuyerBusiness.LastName,
              CustomerId: Obj._id,
              InviteId: Obj.inviteData.InviteId,
              Mobile: Obj.Mobile
            };
            this.ChartArr.push(NewObj);            
          });
          this.TotalRows = this.ChartArr.length;
          this.Pagination_Affect();
          this.chartReady = true;
        } else {
          this.TotalRows = 0;
          this.Pagination_Affect();
        }
      });
    } else if (this.CustomerCategory === 'Seller') {

      this.HundiScore.FilterSellerAndBusinessAndBranchAgainstBuyerScore({
        CustomerId: this.UserInfo.User,
        CustomerCategory: 'Seller',
        "FilterQuery": {
          "Business": this.Business,
          "Buyer": "",
          "BuyerBusiness": this.BuyerBusiness,
          "Seller": ""
        }
        // Business: this.Business,
        // Branch: this.Branch,
        // Low_To_High_Invoice: false,
        // Low_To_High_OverDue: false,
        // High_To_Low_Invoice: false,
        // High_To_Low_OverDue: false
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          const BuyerArr = response.Response;
          // After the asynchronous operation completes, hide the loader
          this.loadingService.hide();
          BuyerArr.map(Obj => {

            // const ChLabel = ['OverDue', 'Due Today', 'Upcoming', 'Credit Balance', 'Total Credit Limit'] as Label[];
            // const ChData = [Obj.OverDueAmount, Obj.DueTodayAmount, Obj.UpComingAmount, Obj.AvailableCreditLimit, Obj.TotalCreditLimit] as SingleDataSet;
            const ChLabel = ['OverDue', 'Due Today', 'Upcoming'] as Label[];
            const ChData = [Obj.OverDueAmount, Obj.DueTodayAmount, Obj.UpComingAmount] as SingleDataSet;
            const ChType = 'pie' as ChartType;
            const ChOptions = { responsive: true } as ChartOptions;
            let DueTodayPercentage = 0;
            let OverDuePercentage = 0;
            let UpComingPercentage = 0;

            if (Obj.OverDueAmount > 0) {
              const UsedOverDuePercentage = parseFloat(Obj.OverDueAmount) / parseFloat(Obj.AvailableCreditLimit);
              OverDuePercentage = Math.round(UsedOverDuePercentage * 100);
            } else {
              OverDuePercentage = 0;
            }
            if (Obj.DueTodayAmount > 0) {
              const UsedDueTodayPercentage = parseFloat(Obj.DueTodayAmount) / parseFloat(Obj.AvailableCreditLimit);
              DueTodayPercentage = Math.round(UsedDueTodayPercentage * 100);
            } else {
              DueTodayPercentage = 0;
            }

            if (Obj.UpComingAmount > 0) {
              const UsedUpComingPercentage = parseFloat(Obj.UpComingAmount) / parseFloat(Obj.AvailableCreditLimit);
              UpComingPercentage = Math.round(UsedUpComingPercentage * 100);
            } else {
              UpComingPercentage = 0;
            }

            const NewObj = {
              ChLabel,
              ChData,
              ChType,
              ChOptions,
              ChLegend: true,
              ChPlugins: '',
              HundiScore: Obj.HundiScore,
              _id: Obj._id,
              CreditLimit: Obj.TotalCreditLimit,
              AvailableCreditLimit: Obj.AvailableCreditLimit,
              ContactName: Obj.Name,
              OverDueInvoiceCount: Obj.OverDueInvoiceCount,
              PendingInvoiceCount: Obj.PendingInvoiceCount,
              OverDuePercentages: OverDuePercentage,
              DueTodayPercentages: DueTodayPercentage,
              UpComingPercentages: UpComingPercentage,
              UpComingAmounts: Obj.UpComingAmount,
              DueTodayAmounts: Obj.DueTodayAmount,
              OverDueAmounts: Obj.OverDueAmount,
              BuyerPaymentCycle: Obj.inviteData.BuyerPaymentCycle,
              BuyerPaymentType: Obj.inviteData.BuyerPaymentType,
              Business: Obj.inviteData.Business._id,
              SellerBusinesName: Obj.inviteData.Business.FirstName + ' ' + Obj.inviteData.Business.LastName,
              BuyerBusiness: Obj.inviteData.BuyerBusiness._id,
              BuyerBusinessName: Obj.inviteData.BuyerBusiness.FirstName + ' ' + Obj.inviteData.BuyerBusiness.LastName,
              CustomerId: Obj._id,
              InviteId: Obj.inviteData.InviteId
            };


            this.ChartArr.push(NewObj);
          });
          this.TotalRows = this.ChartArr.length;
          this.Pagination_Affect();
          this.chartReady = true;
        } else {
          this.TotalRows = 0;
          this.Pagination_Affect();
        }
      });
    }
  }

  BusinessChanges(Event) { // Business 
    if (this.CustomerForm.controls.Business.status === 'VALID') {
      this.Business = Event;
      this.ChartArr = [];
      this.ConnectedBuyer();
      if (this.CustomerCategory === 'Seller') {
        this.BusinessManage.Business_List({ CustomerId: this.UserInfo.User, CustomerCategory: 'Seller', Business: Event }).subscribe(response => {
          if (response.Status && response.Status === true) {
            this.BranchList = response.Response;
          }
        });
      } else if (this.CustomerCategory === 'Buyer') {
        this.BusinessManage.Business_List({ CustomerId: this.UserInfo.User, CustomerCategory: 'Buyer', Business: Event }).subscribe(response => {
          if (response.Status && response.Status === true) {
            this.BranchList = response.Response;
          }
        });
      }
    } else {
      this.Business = '';
      this.ChartArr = [];
      this.ConnectedBuyer();
    }
  }

  BranchChanges(Event) {
    if (this.CustomerForm.controls.Branch.status === 'VALID') {
      this.Branch = Event;
      this.ChartArr = [];
      this.ConnectedBuyer();
    } else {
      this.Branch = '';
      this.ChartArr = [];
      this.ConnectedBuyer();
    }
  }

  openFilterModal(template: TemplateRef<any>) {
    this.FiltersArray.map(obj => {
      this.CustomerForm.controls[obj.Key].setValue(obj.Value);
      
    });
    this.modalReference = this.ModalService.show(template, {
      ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'
    });
  }

  ResetFilters() {
    // this.CustomerForm.reset();
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'Object' ? '' : null;
    });
    this.FilterFGroupStatus = false;
    this.Pagination_Action(1);
    this.CustomerForm.reset();
    // this.modalReference.hide();
  }

  SubmitFilters() {
    const FilteredValues = this.CustomerForm.value;
    console.log(`FilteredValues from submit`, FilteredValues);
    this.FiltersArray.map(obj => {
      obj.Active = false;
      // obj.Value = obj.Type === 'String' ? '' : null;
    });
    Object.keys(FilteredValues).map(obj => {
      const value = this.CustomerForm.controls[obj].value;
      this.BusinessName = this.BusinessList.filter((item)=>{
        return item._id === FilteredValues.Business;
       });
      this.BuyerBusinessName = this.BuyerBusinessList.filter((item)=>{
        return item._id === FilteredValues.BuyerBusiness;
       }); 
       this.SellerBusinessName = this.SellerBusinessList.filter((item) => {
        return item._id === FilteredValues.SellerBusiness;
       })
      if (value !== undefined && value !== null && value !== '') {
        const index = this.FiltersArray.findIndex(objNew => objNew.Key === obj);
        this.FiltersArray[index].Active = true;
        this.FiltersArray[index].Value = value;
      }
    });
    this.Pagination_Action(1);
    this.modalReference.hide();
  }

  RemoveFilter(index: any) {
    const KeyName = this.FiltersArray[index].Key;
    const EmptyValue = this.FiltersArray[index].Type === 'String' ? '' : null;
    this.CustomerForm.controls[KeyName].setValue(EmptyValue);

    if(KeyName == "Business") {
      this.Business = "";
    }
    if(KeyName == "BuyerBusiness") {
      this.BuyerBusiness = "";
    }
    this.SubmitFilters();
  }

  BuyerBusinessChanges(Event) { // BuyerBusiness
    if (this.CustomerForm.controls.BuyerBusiness.status === 'VALID') {
      this.BuyerBusiness = Event;
      this.ChartArr = [];
      this.ConnectedBuyer();
    } else {
      this.BuyerBusiness = '';
      this.ChartArr = [];
      this.ConnectedBuyer();
    }
  }

  BuyerChanges(Event) {
    if (this.CustomerForm.controls.Business.status === 'VALID') {
      this.Buyerrdetails = Event;
      this.ChartArr = [];
      this.ConnectedBuyer();
    } else {
      this.Buyerrdetails = '';
      this.ChartArr = [];
      this.ConnectedBuyer();
    }
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
      this.ConnectedBuyer();
    }
  }


  BuyerDetails(Index: any) {
    this.router.navigate(['individual-person-details/' + this.ChartArr[Index]._id]);
  }

  BuyerRequestToTemporary(Index: any) {
    const initialState = {
      Type: 'BuyerRequestToTemporary',
      TemporaryDetails: this.ChartArr[Index]
    };
    this.modalReference = this.ModalService.show(ModalTemporaryCreditComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.ChartArr = [];
        this.ConnectedBuyer();
      }
    });
  }

  SellerUpdateToBuyerCreditLimit(Index: any) {
    const initialState = {
      Type: 'SellerUpdateToBuyerCreditLimit',
      TemporaryDetails: this.ChartArr[Index]
    };
    this.modalReference = this.ModalService.show(ModalTemporaryCreditComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.ChartArr = [];
        this.ngOnInit();
      }
    });
  }

  FilterFormChanges() {
    const FilteredValues = this.CustomerForm.value;
    this.FilterFGroupStatus = false;
    Object.keys(FilteredValues).map(obj => {
      const value = this.CustomerForm.controls[obj].value;
      if (value !== undefined && value !== null && value !== '') {
        this.FilterFGroupStatus = true;
      }
    });
  }
}