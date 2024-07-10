import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FormComponent } from './components/form/form.component';
import { ClientLoginComponent } from './components/client-login/client-login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { WidgetsComponent } from './components/widgets/widgets.component';
import { TableComponent } from './components/table/table.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HalfBuyerSellerComponent } from './components/half-buyer-seller/half-buyer-seller.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorPageComponent } from './components/error-Page/error-Page.component';
import { AdminTableComponent } from './components/admin-table/admin-table.component';

import { ModalPopupComponent } from './components/Modals/modal-popup/modal-popup.component';
import { SamplePopupComponent } from './components/Modals/sample-popup/sample-popup.component';

import { TestingComponent } from './components/testing/testing.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { BusinessManagementComponent } from './components/business-management/business-management.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InviteManagementComponent } from './components/invite-management/invite-management.component';
import { NotAuthGuard } from './Authentication/not-auth.guard';
import { AuthGuard } from './Authentication/auth.guard';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { BusinessBranchInvoiceComponent } from 'src/app/components/business-branch-invoice/business-branch-invoice.component';
import { BusinessBranchPaymentComponent } from 'src/app/components/business-branch-payment/business-branch-payment.component';
import { PaymentManagementComponent } from 'src/app/components/payment-management/payment-management.component';
import { SellerAndBuyerConnectedComponent } from './components/seller-and-buyer-connected/seller-and-buyer-connected.component';
import { SupportManagementComponent } from './components/support-management/support-management.component';
import { TemporaryManagementComponent } from './components/temporary-management/temporary-management.component';
import { BusinessBranchDashboardComponent } from './components/business-branch-dashboard/business-branch-dashboard.component';
import { IndividualCustomerDetailsComponent } from './components/individual-customer-details/individual-customer-details.component';
import { IndividualBusinessDetailsComponent } from './components/individual-business-details/individual-business-details.component';
import { SampleheaderComponent } from './components/sampleheader/sampleheader.component';
import { CalendarComponent } from './components/calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/web-login',
    pathMatch: 'full',
    data: {}
  },
  {
    path: 'web-login',
    component: LoginComponent,
    canActivate: [NotAuthGuard],
    data: {}
  },
  {
    path: 'header',
    component: HeaderComponent,
    canActivate: [AuthGuard],
    data: {}
  },
  {
    path: 'form',
    component: FormComponent,
    data: {}
  },
  {
    path: 'client-login',
    canActivate: [AuthGuard],
    component: ClientLoginComponent,
    data: {}
  },
  {
    path: 'registration',
    canActivate: [NotAuthGuard],
    component: RegistrationComponent,
    data: {}
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { title: 'Dashboard' }
  },
  {
    path: 'invite-management',
    canActivate: [AuthGuard],
    component: InviteManagementComponent,
    data: { title: 'Invite Management' }
  },
  {
    path: 'temporary-management',
    canActivate: [AuthGuard],
    component: TemporaryManagementComponent,
    data: { title: 'Temporary Management' }
  },
  {
    path: 'invoice',
    canActivate: [AuthGuard],
    component: BusinessBranchInvoiceComponent,
    data: { title: 'Invoice Management' }
  },
  {
    path: 'support-manage',
    canActivate: [AuthGuard],
    component: SupportManagementComponent,
    data: { title: 'Support Management' }
  },
  {
    path: 'business-branch-dashboard',
    canActivate: [AuthGuard],
    component: BusinessBranchDashboardComponent,
    data: {}
  },
  {
    path: 'individual-business-dashboard',
    canActivate: [AuthGuard],
    component: IndividualBusinessDetailsComponent,
    data: {}
  },
  {
    path: 'seller-and-buyer',
    canActivate: [AuthGuard],
    component: SellerAndBuyerConnectedComponent,
    data: { title: 'Seller / Buyer' }
  },
  {
    path: 'invoice-management/:CustomerId/:BussinessId',
    canActivate: [AuthGuard],
    component: InvoiceManagementComponent,
    data: { title: 'Invoice Management' }
  },
  {
    path: 'payment',
    canActivate: [AuthGuard],
    component: BusinessBranchPaymentComponent,
    data: { title: 'Payment Management' }
  },
  {
    path: 'payment-management/:CustomerId/:BussinessId',
    canActivate: [AuthGuard],
    component: PaymentManagementComponent,
    data: { title: 'Payment Management' }
  },

  {
    path: 'sample',
    canActivate: [AuthGuard],
    component: SampleheaderComponent,
    data: {}
  },
  {
    path: 'Calendar',
    canActivate: [AuthGuard],
    component: CalendarComponent,
    data: { title: 'Calendar' }
  },
  {
    path: 'client-menu',
    component: SideMenuComponent,
    data: {}
  },
  {
    path: 'client-widget',
    component: WidgetsComponent,
    data: {}
  },
  {
    path: 'individual-person-details/:id',
    component: IndividualCustomerDetailsComponent,
    data: {}
  },
  {
    path: 'user-management',
    canActivate: [AuthGuard],
    component: UserManagementComponent,
    data: { title: 'User Management' }
  },
  {
    path: 'business',
    canActivate: [AuthGuard],
    component: BusinessManagementComponent,
    data: { title: 'Business Management' }
  },
  {
    path: 'admin-table',
    component: AdminTableComponent,
    data: {}
  },
  {
    path: 'client-table',
    component: TableComponent,
    data: {}
  },
  {
    path: 'client-notify',
    component: NotificationComponent,
    data: {}
  },
  {
    path: 'client-buyer-seller',
    component: HalfBuyerSellerComponent,
    data: {}
  }
  ,
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Profile' }
  }
  ,
  {
    path: '404Page',
    component: ErrorPageComponent,
    data: {}
  },
  {
    path: 'modals',
    component: SamplePopupComponent,
    data: {}
  }
  ,
  {
    path: 'testing',
    component: TestingComponent,
    data: {}
  },
  {
    path: 'sample',
    component: SampleheaderComponent,
    data: {}
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
