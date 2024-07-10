import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotAuthGuard } from '../app/Authentication/not-auth.guard';
import { IndustryManagementComponent } from './components/industry-management/industry-management.component';
import { LoginComponent } from './components/login/login.component';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { SupportManagementComponent } from './components/support-management/support-management.component';
import { AuthGuard } from './Authentication/auth.guard';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { CustomerViewComponent } from './components/customer-view/customer-view.component';
import { CustomerRecordsComponent } from './components/customer-records/customer-records.component';
import { CustomUserManagementComponent } from './components/custom-user-management/custom-user-management.component';
import { BusinessManagementComponent } from './components/business-management/business-management.component';
import { BranchManagementComponent } from './components/branch-management/branch-management.component';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { PaymentManagementComponent } from './components/payment-management/payment-management.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin-login',
    pathMatch: 'full',
    data: {}
  },
  {
    path: 'admin-login',
    component: LoginComponent,
    canActivate: [NotAuthGuard],
    data: {}
  },
  {
    path: 'Industry',
    component: IndustryManagementComponent,
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'UserManagement',
    component: UsersManagementComponent,
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'Support',
    component: SupportManagementComponent,
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'Customer-View/:Mobile',
    component: CustomerViewComponent,
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'Customers',
    canActivate: [AuthGuard],
    component: CustomerRecordsComponent,
    children: [
      {
        path: '',
        redirectTo: 'Owner',
        pathMatch: 'full'
      },
      {
        path: 'Owner',
        component: CustomerManagementComponent
      },
      {
        path: 'User',
        component: CustomUserManagementComponent
      },
      {
        path: 'Business',
        component: BusinessManagementComponent
      },
      {
        path: 'Branch',
        component: BranchManagementComponent
      },
      {
        path: 'Invoice',
        component: InvoiceManagementComponent
      },
      {
        path: 'Payment',
        component: PaymentManagementComponent
      },
    ],
    data: {}
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
