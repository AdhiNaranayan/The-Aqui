import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndustryManagementComponent } from './components/industry-management/industry-management.component';
import { ModalIndustryComponent } from './components/modals/modal-industry/modal-industry.component';
import { MyInterceptor } from './Authentication/my-interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { CdkScrollableModule } from '@angular/material'
// import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalIndustryStatusComponent } from './components/modals/modal-industry-status/modal-industry-status.component';
import { LoginComponent } from './components/login/login.component';
import { ModalSessionExpiredComponent } from './components/Modals/modal-session-expired/modal-session-expired.component';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { ModalUserManagementComponent } from './components/modals/modal-user-management/modal-user-management.component';
import { ModalUserViewComponent } from './components/modals/modal-user-view/modal-user-view.component';
import { ModalUserStatusComponent } from './components/modals/modal-user-status/modal-user-status.component';
import { from } from 'rxjs';
import { SupportManagementComponent } from './components/support-management/support-management.component';
import { ModalSupportManagementComponent } from './components/modals/modal-support-management/modal-support-management.component';
import { ModalApprovedComponent } from './components/modals/modal-approved/modal-approved.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { ModalCustomerViewComponent } from './components/modals/modal-customer-view/modal-customer-view.component';
import { ModalCustomerBlockComponent } from './components/modals/modal-customer-block/modal-customer-block.component';
import { ModalCustomerEditComponent } from './components/modals/modal-customer-edit/modal-customer-edit.component';
import { CustomerViewComponent } from './components/customer-view/customer-view.component';
import { ModalAddbranchComponent } from './components/modals/modal-addbranch/modal-addbranch.component';
import { OwnerViewComponent } from './components/owner-view/owner-view.component';
import { CustomerRecordsComponent } from './components/customer-records/customer-records.component';
import { CustomUserManagementComponent } from './components/custom-user-management/custom-user-management.component';
import { BusinessManagementComponent } from './components/business-management/business-management.component';
import { BranchManagementComponent } from './components/branch-management/branch-management.component';
import { InvoiceManagementComponent } from './components/invoice-management/invoice-management.component';
import { PaymentManagementComponent } from './components/payment-management/payment-management.component';
import { ModalBusinessComponent } from './components/modals/modal-business/modal-business.component';
import { ModalBranchComponent } from './components/modals/modal-branch/modal-branch.component';
import { ModalPaymentComponent } from './components/modals/modal-payment/modal-payment.component';
import { ModalInvoiceComponent } from './components/modals/modal-invoice/modal-invoice.component';
import { ModalBusinessEditComponent } from './components/modals/modal-business-edit/modal-business-edit.component';
import { ModalBranchEditComponent } from './components/modals/modal-branch-edit/modal-branch-edit.component';




@NgModule({
  declarations: [
    AppComponent,
    IndustryManagementComponent,
    ModalIndustryComponent,
    ModalIndustryStatusComponent,
    LoginComponent,
    ModalSessionExpiredComponent,
    UsersManagementComponent,
    ModalUserManagementComponent,
    ModalUserViewComponent,
    ModalUserStatusComponent,
    SupportManagementComponent,
    ModalSupportManagementComponent,
    ModalApprovedComponent,
    CustomerManagementComponent,
    ModalCustomerViewComponent,
    ModalCustomerBlockComponent,
    ModalCustomerEditComponent,
    CustomerViewComponent,
    ModalAddbranchComponent,
    OwnerViewComponent,
    CustomerRecordsComponent,
    CustomUserManagementComponent,
    BusinessManagementComponent,
    BranchManagementComponent,
    InvoiceManagementComponent,
    PaymentManagementComponent,
    ModalBusinessComponent,
    ModalBranchComponent,
    ModalPaymentComponent,
    ModalInvoiceComponent,
    ModalBusinessEditComponent,
    ModalBranchEditComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatNativeDateModule,
    // MatExpansionModule,
    // MatSnackBarModule,
    // MatMenuModule,
    // MatDividerModule,
    // MatButtonModule,
    // MatCardModule,
    MatDatepickerModule,
    // MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    // MatTooltipModule,
    MatAutocompleteModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  entryComponents: [
    ModalIndustryComponent,
    ModalIndustryStatusComponent,
    ModalSessionExpiredComponent,
    ModalUserManagementComponent,
    ModalUserViewComponent,
    ModalUserStatusComponent,
    ModalSupportManagementComponent,
    ModalApprovedComponent,
    ModalCustomerBlockComponent,
    ModalCustomerViewComponent,
    ModalCustomerEditComponent,
    ModalAddbranchComponent,
    ModalBusinessComponent,
    ModalBranchComponent,
    ModalPaymentComponent,
    ModalInvoiceComponent,
    ModalBusinessEditComponent,
    ModalBranchEditComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
