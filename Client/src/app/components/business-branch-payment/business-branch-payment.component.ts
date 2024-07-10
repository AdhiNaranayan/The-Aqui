import { Component, OnInit } from '@angular/core';
import { InvoiceDataPassingService } from 'src/app/services/common-services/invoice-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { Router } from '@angular/router';
import { PaymentManagementServiceService } from 'src/app/services/payment-management/payment-management-service.service';
import { Subscription } from 'rxjs';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
@Component({
  selector: 'app-business-branch-payment',
  templateUrl: './business-branch-payment.component.html',
  styleUrls: ['./business-branch-payment.component.scss']
})
export class BusinessBranchPaymentComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  UserInfo: any;
  BusinessAndBranch: any[] = [];
  BranchExpand = false;
  AllCategory: any[] = [];
  CustomerCategory: any;
  constructor(private DatePassingService: InvoiceDataPassingService,
    private PaymentManagement: PaymentManagementServiceService,
    private CategoryPassingService: CategoryDataPassingService,
    private router: Router,
    private LoginManage: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginManage.LoginUser_Info());
    this.subscription.add(
      this.CategoryPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Buyer') {
            this.BuyerService_Loader();
          } else if (this.CustomerCategory === 'Seller') {
            this.SellerService_Loader();
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );
  }

  ngOnInit(): void {
  }

  BuyerService_Loader() {
    this.PaymentManagement.Buyer_PaymentCount({ Buyer: this.UserInfo.User }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.BusinessAndBranch = response.Response;
      } else {
      }
    });
  }

  SellerService_Loader() {
    this.PaymentManagement.Seller_PaymentCount({ Seller: this.UserInfo.User }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.BusinessAndBranch = response.Response;

      } else {
      }
    });
  }

  ViewBranchDetails(Index: any) {
    if (!this.BusinessAndBranch[Index].BranchExpand) {
      this.BusinessAndBranch[Index].BranchExpand = true;
      this.DatePassingService.UpdateAllBusinessData([this.BusinessAndBranch[Index]]);
    } else if (this.BusinessAndBranch[Index].BranchExpand) {
      this.BusinessAndBranch[Index].BranchExpand = false;
      this.DatePassingService.UpdateAllBusinessData([]);
    }
  }

  MoveInvoiceManagement(Index1: any) {
    const selectedBusiness = this.BusinessAndBranch[Index1];
    this.DatePassingService.UpdateAllBusinessData([selectedBusiness]);
    if (selectedBusiness['Customer'] && selectedBusiness['_id']) this.router.navigate(['payment-management', selectedBusiness['Customer'], selectedBusiness['_id']]);
    localStorage.setItem('category_name', this.CustomerCategory)

  }

}

