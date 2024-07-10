import { Component, OnInit } from '@angular/core';
import { InvoiceDataPassingService } from 'src/app/services/common-services/invoice-data-passing.service';
import { InvoiceManagementService } from 'src/app/services/invoice-management/invoice-management.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { Router } from '@angular/router';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-business-branch-invoice',
  templateUrl: './business-branch-invoice.component.html',
  styleUrls: ['./business-branch-invoice.component.scss']
})
export class BusinessBranchInvoiceComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  UserInfo: any;
  BusinessAndBranch: any[] = [];
  BranchExpand = false;
  AllCategory: any[] = [];
  CustomerCategory: any;
  constructor(private DatePassingService: InvoiceDataPassingService,
    private InvoiceManagement: InvoiceManagementService,
    private router: Router,
    private DataPassingService: CategoryDataPassingService,
    private loadingService: LoadingService,
    private LoginManage: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginManage.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {

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
    this.loadingService.show(); // Show loader
    this.InvoiceManagement.Buyer_InvoiceCount({ Buyer: this.UserInfo.User, CustomerCategory: this.CustomerCategory }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.BusinessAndBranch = response.Response;
        // After the asynchronous operation completes, hide the loader
        this.loadingService.hide();
      } else {
      }
    });
  }

  SellerService_Loader() {
    this.loadingService.show(); // Show loader
    this.InvoiceManagement.Seller_InvoiceCount({ Seller: this.UserInfo.User, CustomerCategory: this.CustomerCategory }).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.BusinessAndBranch = response.Response;
        // After the asynchronous operation completes, hide the loader
        this.loadingService.hide();
        // console.log(this.BusinessAndBranch, 'this.BusinessAndBranchthis.BusinessAndBranch');
        this.BusinessAndBranch.map(Obj => {
          Obj.BranchExpand = false;
        });
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

  // MoveInvoiceManagement(Index1: any) {
  //   // this.DatePassingService.UpdateAllBranchData([this.BusinessAndBranch[Index1]]);
  //   // console.log(this.BusinessAndBranch, 'this.BusinessAndBranchthis.BusinessAndBranchthis.BusinessAndBranch');

  //   // this.router.navigate(['invoice-management']);
  // }

  MoveInvoiceManagement(Index1: any) {
    const selectedBusiness = this.BusinessAndBranch[Index1];
    this.DatePassingService.UpdateAllBusinessData([selectedBusiness]);
    if (selectedBusiness['Customer'] && selectedBusiness['_id']) this.router.navigate(['invoice-management', selectedBusiness['Customer'], selectedBusiness['_id']]);
    localStorage.setItem('category_name', this.CustomerCategory)
  }

}
