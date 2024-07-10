import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Feature Module
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';


// Common Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextTranslateDirective } from './directives/textTranslate.directive';

// Custom Modules
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalPopupComponent } from './components/Modals/modal-popup/modal-popup.component';
import { UserProfileModalComponent } from './components/Modals/user-profile-modal/user-profile-modal.component';
import { SessionLogoutModalComponent } from './components/Modals/session-logout-modal/session-logout-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestingComponent } from './components/testing/testing.component';
import { MyInterceptor } from './Authentication/my-interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ModalUserManagementComponent } from './components/Modals/modal-user-management/modal-user-management.component';
import { BusinessManagementComponent } from './components/business-management/business-management.component';
import { BusinessAndBranchesComponent } from './components/Modals/business-and-branches/business-and-branches.component';
import { BranchManagementComponent } from './components/branch-management/branch-management.component';
import { ModalBranchManagementComponent } from './components/Modals/modal-branch-management/modal-branch-management.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { InviteManagementComponent } from './components/invite-management/invite-management.component';
import { ModalInviteManagementComponent } from './components/Modals/modal-invite-management/modal-invite-management.component';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { BusinessBranchInvoiceComponent } from './components/business-branch-invoice/business-branch-invoice.component';
import { ModalInvoiceComponent } from './components/Modals/modal-invoice/modal-invoice.component';
import { MatNativeDateModule } from '@angular/material/core';
import { BusinessBranchPaymentComponent } from './components/business-branch-payment/business-branch-payment.component';
import { PaymentManagementComponent } from './components/payment-management/payment-management.component';
import { ModalPaymentComponent } from './components/Modals/modal-payment/modal-payment.component';
import { ModalInviteStatusApprovalComponent } from './components/Modals/modal-invite-status-approval/modal-invite-status-approval.component';
import { ModalBranchDetailUpdateComponent } from './components/Modals/modal-branch-detail-update/modal-branch-detail-update.component';
import { SellerAndBuyerConnectedComponent } from './components/seller-and-buyer-connected/seller-and-buyer-connected.component';
import { SupportManagementComponent } from './components/support-management/support-management.component';
import { ModalSupportManagementComponent } from './components/Modals/modal-support-management/modal-support-management.component';
import { TemporaryManagementComponent } from './components/temporary-management/temporary-management.component';
import { ModalTemporaryCreditComponent } from './components/Modals/modal-temporary-credit/modal-temporary-credit.component';
import { BusinessBranchDashboardComponent } from './components/business-branch-dashboard/business-branch-dashboard.component';
import { IndividualCustomerDetailsComponent } from './components/individual-customer-details/individual-customer-details.component';
import { IndividualBusinessDetailsComponent } from './components/individual-business-details/individual-business-details.component';
import { ModalCurrentMonthReportComponent } from './components/Modals/modal-current-month-report/modal-current-month-report.component';
import { ModalSellerCurrentMonthReportsComponent } from './components/Modals/modal-seller-current-month-reports/modal-seller-current-month-reports.component';
import { QRCodeModule } from 'angular2-qrcode';
import { SampleheaderComponent } from './components/sampleheader/sampleheader.component';
import { SellerThemeComponent } from './components/seller-theme/seller-theme.component';
import { BuyerThemeComponent } from './components/buyer-theme/buyer-theme.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ModalBusinessDeleteComponent } from './components/Modals/modal-business-delete/modal-business-delete.component';
import { LogoutModalComponent } from './components/Modals/logout-modal/logout-modal.component';
import { ModalSellerIncreaseCreditLimitComponent } from './components/Modals/modal-seller-increase-credit-limit/modal-seller-increase-credit-limit.component';
import { ModalSellerIncreaseCreditLimitConfirmationComponent } from './components/Modals/modal-seller-increase-credit-limit-confirmation/modal-seller-increase-credit-limit-confirmation.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalCalendarViewComponent } from './components/Modals/modal-calendar-view/modal-calendar-view.component';
import { ModalInvoiceApproveComponent } from './components/Modals/modal-invoice-approve/modal-invoice-approve.component';
import { ModalPaymentApproveComponent } from './components/Modals/modal-payment-approve/modal-payment-approve.component';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';


import { ModalNotificationDetailedViewComponent } from './components/Modals/modal-notification-detailed-view/modal-notification-detailed-view.component';
import { ModalInvoiceAcceptComponent } from './components/Modals/modal-invoice-accept/modal-invoice-accept.component';
import { LoadingService } from "./services/loading.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    // Common Modules
    AppComponent,
    TextTranslateDirective,
    // Custom Modules
    LoginComponent,
    HeaderComponent,
    FormComponent,
    ClientLoginComponent,
    RegistrationComponent,
    SideMenuComponent,
    WidgetsComponent,
    TableComponent,
    NotificationComponent,
    HalfBuyerSellerComponent,
    ProfileComponent,
    ErrorPageComponent,
    ModalPopupComponent,
    UserProfileModalComponent,
    SessionLogoutModalComponent,
    AdminTableComponent,
    TestingComponent,
    UserManagementComponent,
    ModalUserManagementComponent,
    BusinessManagementComponent,
    BusinessAndBranchesComponent,
    BranchManagementComponent,
    ModalBranchManagementComponent,
    DashboardComponent,
    InviteManagementComponent,
    ModalInviteManagementComponent,
    InvoiceManagementComponent,
    BusinessBranchInvoiceComponent,
    ModalInvoiceComponent,
    BusinessBranchPaymentComponent,
    PaymentManagementComponent,
    ModalPaymentComponent,
    ModalInviteStatusApprovalComponent,
    ModalBranchDetailUpdateComponent,
    SellerAndBuyerConnectedComponent,
    SupportManagementComponent,
    ModalSupportManagementComponent,
    TemporaryManagementComponent,
    ModalTemporaryCreditComponent,
    BusinessBranchDashboardComponent,
    IndividualCustomerDetailsComponent,
    IndividualBusinessDetailsComponent,
    ModalCurrentMonthReportComponent,
    ModalSellerCurrentMonthReportsComponent,
    SampleheaderComponent,
    SellerThemeComponent,
    BuyerThemeComponent,
    CalendarComponent,
    ModalBusinessDeleteComponent,
    LogoutModalComponent,
    ModalSellerIncreaseCreditLimitComponent,
    ModalSellerIncreaseCreditLimitConfirmationComponent,
    LoadingComponent,
    ModalCalendarViewComponent,
    ModalInvoiceApproveComponent,
    ModalPaymentApproveComponent,
    ModalNotificationDetailedViewComponent,
    ModalInvoiceAcceptComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    BrowserModule,
    AppRoutingModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatDialogModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatSlideToggleModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    ChartsModule,
    MatProgressBarModule,
    ButtonsModule.forRoot(),
    MatAutocompleteModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    QRCodeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule

  ],
  providers: [LoadingService, { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  // providers: [
  //   LoadingService, // Ensure LoadingService is provided here
  //   { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }
  // ],
  entryComponents: [
    ModalPopupComponent,
    UserProfileModalComponent,
    SessionLogoutModalComponent,
    ModalUserManagementComponent,
    BusinessAndBranchesComponent,
    ModalBranchManagementComponent,
    ModalInviteManagementComponent,
    ModalInvoiceComponent,
    ModalPaymentComponent,
    ModalBranchDetailUpdateComponent,
    ModalSupportManagementComponent,
    ModalTemporaryCreditComponent,
    ModalCurrentMonthReportComponent,
    ModalSellerCurrentMonthReportsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
