import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { HundiScoreDataPassingService } from 'src/app/services/common-services/hundi-score-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { HundiScoreService } from 'src/app/services/hundi-score/hundi-score.service';
export interface Business { _id: string; BusinessName: string; }
export interface Branch { _id: string; BranchName: string; }

@Component({
  selector: 'app-business-branch-dashboard',
  templateUrl: './business-branch-dashboard.component.html',
  styleUrls: ['./business-branch-dashboard.component.scss']
})
export class BusinessBranchDashboardComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  UserInfo: any;
  ChartArr = [];
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
  Branch = '';
  LimitCount = 3;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  CurrentIndex = 1;
  SkipCount = 0;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#ff0000', '#f2940c', '#313a64'],
      hoverBackgroundColor: ['#ff0000', '#f2940c', '#313a64'],
      borderWidth: 2,
    }
  ];
  BranchDetails: any;
  onClose: Subject<any>;
  AllMyBusiness: any[] = [];
  constructor(private LoginService: LoginManageService,
    private DataPassingService: CategoryDataPassingService,
    private BusinessManage: BusinessManagementService,
    public HundiScore: HundiScoreService,
    private router: Router,
    private HundiScoreDataPassing: HundiScoreDataPassingService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Seller') {

          } else if (this.CustomerCategory === 'Buyer') {

          }
        } else {
        }
      })
    );

    this.subscription.add(
      this.HundiScoreDataPassing.AllMyBusiness.subscribe(response => {
        this.AllMyBusiness = response;
        // if (this.AllMyBusiness.length > 0) {
        //   if (this.CustomerCategory === 'Buyer') {
        //     this.HundiScore.BuyerAndBusinessAndBranchAgainstSellerScore({
        //       Customer: this.UserInfo.User,
        //       CustomerCategory: 'Seller',
        //       Business: this.AllMyBusiness[0].Business,
        //       Branch: this.AllMyBusiness[0]._id,
        //     }).subscribe(response => {
        //       if (response.Status && response.Status === true) {
        //         const BuyerArr = response.Response;
        //         BuyerArr.map(Obj => {
        //           const ChLabel = ['Over Due', 'Due Today', 'Upcoming'] as Label[];
        //           const ChData = [Obj.OverDueAmount, Obj.DueTodayAmount, Obj.UpComingAmount] as SingleDataSet;
        //           const ChType = 'pie' as ChartType;
        //           const ChOptions = { responsive: true } as ChartOptions;
        //           let AvailableCreditLimitPercentage = 0;
        //           const UsedAvailableAmount = Obj.CreditLimit - Obj.AvailableCreditLimit;
        //           AvailableCreditLimitPercentage = Math.round( UsedAvailableAmount / Obj.CreditLimit  * 100);
        //           const NewObj = {
        //             ChLabel,
        //             ChData,
        //             ChType,
        //             ChOptions,
        //             ChLegend: true,
        //             ChPlugins: '',
        //             HundiScore: Obj.HundiScore,
        //             CreditLimit: Obj.CreditLimit,
        //             AvailableCreditLimit: Obj.AvailableCreditLimit,
        //             ExtraUnitizedCreditLimit: Obj.ExtraUnitizedCreditLimit,
        //             ContactName: Obj.ContactName,
        //             PendingInvoiceCount: Obj.PendingInvoiceCount,
        //             AvailableCreditLimitPercentages: AvailableCreditLimitPercentage,
        //             UpComingAmounts: Obj.UpComingAmount,
        //             DueTodayAmounts: Obj.DueTodayAmount,
        //             OverDueAmounts: Obj.OverDueAmount
        //           };
        //           this.ChartArr.push(NewObj);
        //         });
        //         this.TotalRows = this.ChartArr.length;
        //         this.Pagination_Affect();
        //         this.chartReady = true;
        //       } else {
        //         this.TotalRows = 0;
        //         this.Pagination_Affect();
        //       }
        //     });
        //   } else if (this.CustomerCategory === 'Seller') {
        //       this.HundiScore.SellerAndBusinessAndBranchAgainstBuyerScore({
        //         Customer: this.UserInfo.User,
        //         CustomerCategory: 'Seller',
        //         Business: this.AllMyBusiness[0].Business,
        //         Branch: this.AllMyBusiness[0]._id,
        //       }).subscribe(response => {
        //         if (response.Status && response.Status === true) {
        //           const BuyerArr = response.Response;
        //           BuyerArr.map(Obj => {
        //             const ChLabel = ['Over Due', 'Due Today', 'Upcoming'] as Label[];
        //             const ChData = [Obj.OverDueAmount, Obj.DueTodayAmount, Obj.UpComingAmount] as SingleDataSet;
        //             const ChType = 'pie' as ChartType;
        //             const ChOptions = { responsive: true } as ChartOptions;
        //             let AvailableCreditLimitPercentage = 0;
        //             const UsedAvailableAmount = Obj.CreditLimit - Obj.AvailableCreditLimit;
        //             AvailableCreditLimitPercentage = Math.round( UsedAvailableAmount / Obj.CreditLimit  * 100);

        //             const NewObj = {
        //               ChLabel,
        //               ChData,
        //               ChType,
        //               ChOptions,
        //               ChLegend: true,
        //               ChPlugins: '',
        //               HundiScore: Obj.HundiScore,
        //               CreditLimit: Obj.CreditLimit,
        //               AvailableCreditLimit: Obj.AvailableCreditLimit,
        //               ExtraUnitizedCreditLimit: Obj.ExtraUnitizedCreditLimit,
        //               ContactName: Obj.ContactName,
        //               PendingInvoiceCount: Obj.PendingInvoiceCount,
        //               AvailableCreditLimitPercentages: AvailableCreditLimitPercentage,
        //               UpComingAmounts: Obj.UpComingAmount,
        //               DueTodayAmounts: Obj.DueTodayAmount,
        //               OverDueAmounts: Obj.OverDueAmount
        //             };
        //             this.ChartArr.push(NewObj);
        //           });
        //           this.TotalRows = this.ChartArr.length;
        //           this.Pagination_Affect();
        //           this.chartReady = true;
        //         } else {
        //           this.TotalRows = 0;
        //           this.Pagination_Affect();
        //         }
        //       });
        //   }
        // } else {
        //   this.router.navigate(['business']);
        // }
      })
    );
  }

  ngOnInit(): void {

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

}

