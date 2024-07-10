import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { HundiScoreDataPassingService } from 'src/app/services/common-services/hundi-score-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { HundiScoreService } from 'src/app/services/hundi-score/hundi-score.service';
import { ModalTemporaryCreditComponent } from '../Modals/modal-temporary-credit/modal-temporary-credit.component';

@Component({
  selector: 'app-individual-business-details',
  templateUrl: './individual-business-details.component.html',
  styleUrls: ['./individual-business-details.component.scss']
})
export class IndividualBusinessDetailsComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  UserInfo: any;
  ChartArr = [];
  AllCategory: any[] = [];
  CustomerCategory: any;
  chartReady = false;
  CustomerForm: FormGroup;
  Business = '';
  Branch = '';
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
  ContactName: any;
  AllMyBusiness: any[] = [];
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#313a64', '#f2940c'],
      hoverBackgroundColor: ['#313a64', '#f2940c'],
      borderWidth: 2,
    }
  ];
  UrlParams = null;
  constructor(private LoginService: LoginManageService,
    private DataPassingService: CategoryDataPassingService,
    private BusinessManage: BusinessManagementService,
    public ActiveRoute: ActivatedRoute,
    private HundiScoreDataPassing: HundiScoreDataPassingService,
    public router: Router,
    public ModalService: BsModalService,
    public HundiScore: HundiScoreService) {
    this.UrlParams = this.ActiveRoute.snapshot.params;
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );

    this.subscription.add(
      this.HundiScoreDataPassing.AllMyBusiness.subscribe(response => {
        this.AllMyBusiness = response;
      })
    );
  }

  ngOnInit(): void {
    if (this.AllMyBusiness.length > 0) {
      // if (this.CustomerCategory === 'Buyer') {
      //   this.HundiScore.HundiScoreIndividualSellerBranchDetails({
      //     Seller: this.AllMyBusiness[0].Customer,
      //     Buyer: this.UserInfo.User,
      //     Business: this.AllMyBusiness[0].Business,
      //   }).subscribe(response => {
      //     if (response.Status && response.Status === true) {
      //       const BuyerArr = response.Response;
      //       BuyerArr.map(Obj => {
      //         const ChLabel = ['Credit Balance', 'Outstanding'] as Label[];
      //         const ChData = [Obj.AvailableCreditLimit, Obj.OutStandingPayments] as SingleDataSet;
      //         const ChType = 'pie' as ChartType;
      //         const ChOptions = { responsive: true } as ChartOptions;
      //         let DueTodayPercentage = 0;
      //         let OverDuePercentage = 0;
      //         let UpComingPercentage = 0;
      //         if (Obj.OverDueAmount > 0) {
      //           const UsedOverDuePercentage = parseFloat(Obj.OverDueAmount) / parseFloat(Obj.OutStandingPayments);
      //           OverDuePercentage = Math.round(UsedOverDuePercentage * 100);
      //         } else {
      //            OverDuePercentage = 0;
      //         }
      //         if (Obj.DueTodayAmount > 0) {
      //            const UsedDueTodayPercentage = parseFloat(Obj.DueTodayAmount) / parseFloat(Obj.OutStandingPayments);
      //            DueTodayPercentage = Math.round(UsedDueTodayPercentage  * 100);
      //         } else {
      //            DueTodayPercentage = 0;
      //         }
      //         if (Obj.UpComingAmount > 0) {
      //           const UsedUpComingPercentage = parseFloat(Obj.UpComingAmount) / parseFloat(Obj.OutStandingPayments);
      //           UpComingPercentage = Math.round(UsedUpComingPercentage * 100);
      //         } else {
      //           UpComingPercentage = 0;
      //         }
      //         const NewObj = {
      //           ChLabel,
      //           ChData,
      //           ChType,
      //           ChOptions,
      //           ChLegend: true,
      //           ChPlugins: '',
      //           HundiScore: Obj.HundiScore,
      //           _id: Obj._id,
      //           CreditLimit: Obj.CreditLimit,
      //           AvailableCreditLimit: Obj.AvailableCreditLimit,
      //           BranchName: Obj.BranchName,
      //           BuyerPaymentCycles: Obj.BuyerPaymentCycle,
      //           InviteId: Obj.InviteId,
      //           BuyerCreditLimit: Obj.CreditLimit,
      //           BuyerPaymentType: Obj.BuyerPaymentType,
      //           Mobile: Obj.InvitedMobile,
      //           Customer: Obj.Customer,
      //           Branch: Obj.SellerBranch,
      //           OverDueInvoiceCount: Obj.OverDueInvoiceCount,
      //           PendingInvoiceCount: Obj.PendingInvoiceCount,
      //           OverDuePercentages: OverDuePercentage,
      //           DueTodayPercentages: DueTodayPercentage,
      //           UpComingPercentages: UpComingPercentage,
      //           UpComingAmounts: Obj.UpComingAmount,
      //           DueTodayAmounts: Obj.DueTodayAmount,
      //           OverDueAmounts: Obj.OverDueAmount
      //         };
      //         this.ChartArr.push(NewObj);
      //       });
      //       this.TotalRows = this.ChartArr.length;
      //       // this.Pagination_Affect();
      //       this.chartReady = true;
      //     } else {
      //       this.TotalRows = 0;
      //     }
      //   });
      // } else if (this.CustomerCategory === 'Seller') {
      //     this.HundiScore.HundiScoreIndividualBuyerBranchDetails({
      //       Seller: this.UserInfo.User,
      //       Buyer: this.AllMyBusiness[0].Customer,
      //       Business: this.AllMyBusiness[0].Business,
      //     }).subscribe(response => {
      //       if (response.Status && response.Status === true) {
      //         const BuyerArr = response.Response;
      //         BuyerArr.map(Obj => {
      //           const ChLabel = ['Credit Balance', 'Outstanding'] as Label[];
      //           const ChData = [Obj.AvailableCreditLimit, Obj.OutStandingPayments] as SingleDataSet;
      //           const ChType = 'pie' as ChartType;
      //           const ChOptions = { responsive: true } as ChartOptions;
      //           let DueTodayPercentage = 0;
      //           let OverDuePercentage = 0;
      //           let UpComingPercentage = 0;
      //           if (Obj.OverDueAmount > 0) {
      //             const UsedOverDuePercentage = parseFloat(Obj.OverDueAmount) / parseFloat(Obj.OutStandingPayments);
      //             OverDuePercentage = Math.round(UsedOverDuePercentage * 100);
      //           } else {
      //              OverDuePercentage = 0;
      //           }
      //           if (Obj.DueTodayAmount > 0) {
      //              const UsedDueTodayPercentage = parseFloat(Obj.DueTodayAmount) / parseFloat(Obj.OutStandingPayments);
      //              DueTodayPercentage = Math.round(UsedDueTodayPercentage  * 100);
      //           } else {
      //              DueTodayPercentage = 0;
      //           }
      //           if (Obj.UpComingAmount > 0) {
      //             const UsedUpComingPercentage = parseFloat(Obj.UpComingAmount) / parseFloat(Obj.OutStandingPayments);
      //             UpComingPercentage = Math.round(UsedUpComingPercentage * 100);
      //           } else {
      //             UpComingPercentage = 0;
      //           }
      //           const NewObj = {
      //             ChLabel,
      //             ChData,
      //             ChType,
      //             ChOptions,
      //             ChLegend: true,
      //             ChPlugins: '',
      //             HundiScore: Obj.HundiScore,
      //             _id: Obj._id,
      //             CreditLimit: Obj.CreditLimit,
      //             AvailableCreditLimit: Obj.AvailableCreditLimit,
      //             BranchName: Obj.BranchName,
      //             BuyerPaymentCycles: Obj.BuyerPaymentCycle,
      //             InviteId: Obj.InviteId,
      //             BuyerCreditLimit: Obj.CreditLimit,
      //             BuyerPaymentType: Obj.BuyerPaymentType,
      //             Mobile: Obj.InvitedMobile,
      //             Customer: Obj.Customer,
      //             Branch: Obj.SellerBranch,
      //             OverDueInvoiceCount: Obj.OverDueInvoiceCount,
      //             PendingInvoiceCount: Obj.PendingInvoiceCount,
      //             OverDuePercentages: OverDuePercentage,
      //             DueTodayPercentages: DueTodayPercentage,
      //             UpComingPercentages: UpComingPercentage,
      //             UpComingAmounts: Obj.UpComingAmount,
      //             DueTodayAmounts: Obj.DueTodayAmount,
      //             OverDueAmounts: Obj.OverDueAmount
      //           };
      //           this.ChartArr.push(NewObj);
      //         });
      //         this.TotalRows = this.ChartArr.length;
      //         // this.Pagination_Affect();
      //         this.chartReady = true;
      //       } else {
      //         this.TotalRows = 0;
      //       }
      //     });
      // }
    } else {
      this.router.navigate(['seller-and-buyer']);
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
    }
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

}
