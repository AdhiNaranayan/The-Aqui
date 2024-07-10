import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/PaymentManagement/';
const DevURL = 'http://localhost:3002/APP_API/PaymentManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/PaymentManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/PaymentManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/PaymentManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class PaymentManagementServiceService {
  API_URL: string = environment.apiUrl + 'APP_API/PaymentManagement/';

  constructor(private http: HttpClient,
    private router: Router) { }


  CompletePaymentList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CompletePaymentList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }


  BuyerPendingPayment_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerPendingPayment_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerAcceptPayment_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'BuyerAcceptPayment_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerDisputedPayment_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerDisputedPayment_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Buyer_PaymentCount(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Buyer_PaymentCount', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Seller_PaymentCount(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Seller_PaymentCount', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerPendingPayment_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerPendingPayment_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerAcceptPayment_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerAcceptPayment_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerDisputedPayment_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerDisputedPayment_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // BuyerAgainstSellerList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerAgainstSellerList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerAgainstBusinessList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAgainstBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerAgainstBranchList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAgainstBranchList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  Web_PaymentCreate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Web_PaymentCreate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  PaymentCreate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'PaymentCreate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  PaymentDetailsUpdate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'PaymentDetailsUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  PaymentDetails(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'PaymentDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerInvoice_AcceptList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerInvoice_AcceptList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerPayment_Approve(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerPayment_Approve', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerPayment_Disputed(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerPayment_Disputed', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // BuyerPayment_Disputed(data: any): Observable<any> {
  //   return this.http.post<any>(this.API_URL + 'Web_BuyerPayment_Disputed', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }


}

