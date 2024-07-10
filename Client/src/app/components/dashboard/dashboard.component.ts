import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { HundiScoreService } from 'src/app/services/hundi-score/hundi-score.service';
import { ModalPopupComponent } from '../Modals/modal-popup/modal-popup.component';
import { OwnerRegisterService } from 'src/app/services/registration/owner-register.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  UserInfo: any;

  // public pieChartOptions: ChartOptions = { responsive: true };
  public pieChartLabels: Label[] = ['Over Due', 'Due Today', 'Upcoming'];
  public pieChartData: SingleDataSet = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#ff0000', '#FFA200', '#008000'],
      hoverBackgroundColor: ['#ff0000', '#FFA200', '#008000'],
      borderWidth: 2,
    }
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 50 // Adjust this value to control the size of the hole in the center (donut hole)
  };

  ChartArr = [];
  CustomerId: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  DashBoard: any;
  AvailableCreditLimitPercentage = 0;
  AvailableTemprorayCreditLimitPercentage = 0;
  modalReference: BsModalRef;
  constructor(private spinner: NgxSpinnerService,
    private LoginService: LoginManageService,
    private DataPassingService: CategoryDataPassingService,
    private Dashboard: OwnerRegisterService,
    private router: Router,
    public ModalService: BsModalService,
    private loadingService: LoadingService,
    public HundiScore: HundiScoreService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {

        this.AllCategory = response;


        this.AllCategory[0] == 'Seller' ? this.loadDashBoardDetails('Seller') : this.loadDashBoardDetails('Buyer');

        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );
  }



  ngOnInit(): void {
    // this.spinner.show();
    this.loadingService.show(); // Show loader
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
    if (this.CustomerCategory === 'Buyer') {

      if (this.UserInfo.CustomerType === 'Owner') {
        this.HundiScore.CustomerDashboard({ CustomerId: this.UserInfo.User, CustomerCategory: 'Buyer' }).subscribe(response => {
          if (response.Status && response.Status === true) {
            this.DashBoard = response.Response;
            // After the asynchronous operation completes, hide the loader
            this.loadingService.hide();
            const UsedAvailableAmount = this.DashBoard.CreditLimit - this.DashBoard.AvailableCreditLimit;
            this.AvailableCreditLimitPercentage = Math.round(UsedAvailableAmount / this.DashBoard.CreditLimit * 100);
            this.pieChartData = [response.Response.OverDueAmount, response.Response.DueTodayAmount, response.Response.UpComingAmount];

            if (this.DashBoard.MyBusiness === false) {

              this.modalReference = this.ModalService.show(ModalPopupComponent, Object.assign({}, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
              this.modalReference.content.onClose.subscribe(response => { });
            }
          } else {
          }
        });
        this.spinner.hide();
      } else if (this.UserInfo.CustomerType === 'User') {
        this.spinner.show();
        this.HundiScore.CustomerDashboard({ CustomerId: this.UserInfo.User, CustomerCategory: 'Buyer' }).subscribe(response => {
          if (response.Status && response.Status === true) {
            this.DashBoard = response.Response;
            // After the asynchronous operation completes, hide the loader
            this.loadingService.hide();
            const UsedAvailableAmount = this.DashBoard.CreditLimit - this.DashBoard.AvailableCreditLimit;
            const UsedTemproraryAvailableAmount = this.DashBoard.TemporaryCreditAmount - this.DashBoard.AvailableTemporaryCreditAmount;
            this.AvailableCreditLimitPercentage = Math.round(UsedAvailableAmount / this.DashBoard.CreditLimit * 100);
            this.AvailableTemprorayCreditLimitPercentage = Math.round(UsedTemproraryAvailableAmount / this.DashBoard.TemporaryCreditAmount * 100);
            this.pieChartData = [response.Response.OverDueAmount, response.Response.DueTodayAmount, response.Response.UpComingAmount];
            if (this.DashBoard.MyBusiness === false) {


              this.modalReference = this.ModalService.show(ModalPopupComponent, Object.assign({}, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
              this.modalReference.content.onClose.subscribe(response => { });
            }
          } else {
          }
        });

        this.spinner.hide();
      }
    } else if (this.CustomerCategory === 'Seller') {
      if (this.UserInfo.CustomerType === 'Owner') {

        this.spinner.show();
        this.HundiScore.CustomerDashboard({ CustomerId: this.UserInfo.User, CustomerCategory: 'Seller' }).subscribe(response => {
          if (response.Status && response.Status === true) {


            this.DashBoard = response.Response;
            // After the asynchronous operation completes, hide the loader
            this.loadingService.hide();
            const UsedAvailableAmount = this.DashBoard.CreditLimit - this.DashBoard.AvailableCreditLimit;
            const UsedTemproraryAvailableAmount = this.DashBoard.TemporaryCreditAmount - this.DashBoard.AvailableTemporaryCreditAmount;
            this.AvailableCreditLimitPercentage = Math.round(UsedAvailableAmount / this.DashBoard.CreditLimit * 100);
            this.AvailableTemprorayCreditLimitPercentage = Math.round(UsedTemproraryAvailableAmount / this.DashBoard.TemporaryCreditAmount * 100);

            this.pieChartData = [response.Response.OverDueAmount, response.Response.DueTodayAmount, response.Response.UpComingAmount];

            if (this.DashBoard.MyBusiness === false) {
              this.modalReference = this.ModalService.show(ModalPopupComponent, Object.assign({}, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
              this.modalReference.content.onClose.subscribe(response => { });
            }
          } else {
          }
        });

      } else if (this.UserInfo.CustomerType === 'User') {
        this.HundiScore.CustomerDashboard({ CustomerId: this.UserInfo.User, CustomerCategory: 'Seller' }).subscribe(response => {
          if (response.Status && response.Status === true) {
            this.DashBoard = response.Response;
            // After the asynchronous operation completes, hide the loader
            this.loadingService.hide();
            const UsedAvailableAmount = this.DashBoard.CreditLimit - this.DashBoard.AvailableCreditLimit;
            const UsedTemproraryAvailableAmount = this.DashBoard.TemporaryCreditAmount - this.DashBoard.AvailableTemporaryCreditAmount;
            this.AvailableCreditLimitPercentage = Math.round(UsedAvailableAmount / this.DashBoard.CreditLimit * 100);
            this.AvailableTemprorayCreditLimitPercentage = Math.round(UsedTemproraryAvailableAmount / this.DashBoard.TemporaryCreditAmount * 100);
            this.pieChartData = [response.Response.OverDueAmount, response.Response.DueTodayAmount, response.Response.UpComingAmount];
            if (this.DashBoard.MyBusiness === false) {
              this.modalReference = this.ModalService.show(ModalPopupComponent, Object.assign({}, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
              this.modalReference.content.onClose.subscribe(response => { });
            }
          } else {
          }
        });
      }
    }
  }

  calendarView() {
    this.router.navigate(['/Calendar']);
  }


  loadDashBoardDetails(typeData: any) {
    // console.log(typeData, '2346782345623');
    // console.log(this.CustomerCategory,'2135211111111111111169ghsdfg');

    this.HundiScore.CustomerDashboard({ CustomerId: this.UserInfo.User, CustomerCategory: typeData }).subscribe(response => {

      if (response.Status && response.Status === true) {
        this.DashBoard = response.Response;

        const UsedAvailableAmount = this.DashBoard.CreditLimit - this.DashBoard.AvailableCreditLimit;
        const UsedTemproraryAvailableAmount = this.DashBoard.TemporaryCreditAmount - this.DashBoard.AvailableTemporaryCreditAmount;

        this.AvailableCreditLimitPercentage = Math.round(UsedAvailableAmount / this.DashBoard.CreditLimit * 100);
        this.AvailableTemprorayCreditLimitPercentage = Math.round(UsedTemproraryAvailableAmount / this.DashBoard.TemporaryCreditAmount * 100);

        this.pieChartData = [response.Response.OverDueAmount, response.Response.DueTodayAmount, response.Response.UpComingAmount];
        if (this.DashBoard.MyBusiness === false) {
          this.modalReference = this.ModalService.show(ModalPopupComponent, Object.assign({}, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
          this.modalReference.content.onClose.subscribe(response => { });
        }
      } else {
      }
    });
  }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  changeLegendPosition(): void {
    this.pieChartOptions.legend.position = this.pieChartOptions.legend.position === 'left' ? 'top' : 'left';
  }

}
