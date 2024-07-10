import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/InvoiceManagement/';
const DevURL = 'http://localhost:3002/App_API/InvoiceManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/InvoiceManagement/';
const StageURL = 'http://hundi.pptssolutions.com/App_API/InvoiceManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/InvoiceManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceManagementService {
  API_URL: string = environment.apiUrl + 'APP_API/InvoiceManagement/';

  constructor(private http: HttpClient,
    private router: Router) { }


  //New
  BuyerPending_Invoice_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerInvoice_PendingList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
  // SellerPending_Invoice_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevAppURL + 'BuyerPendingInvoice_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  CompleteInvoiceList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CompleteInvoiceList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  //New


  BuyerPendingInvoice_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerPendingInvoice_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerAcceptInvoice_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerAcceptInvoice_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerDisputedInvoice_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerDisputedInvoice_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Buyer_InvoiceCount(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Buyer_InvoiceCount', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Seller_InvoiceCount(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Seller_InvoiceCount', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerPendingInvoice_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerPendingInvoice_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerAcceptInvoice_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerAcceptInvoice_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerDisputedInvoice_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerDisputedInvoice_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }


  // SellerAgainstBuyerList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAgainstBuyerList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerAgainstBusinessList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerAgainstBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerAgainstBranchList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerAgainstBranchList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }


  InvoiceCreate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'InvoiceCreate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  InvoiceDetailsUpdate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'InvoiceDetailsUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerInvoice_Dispute(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Web_BuyerInvoice_Dispute', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerInvoice_Accept(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerInvoice_Accept', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerInvoice_Disputed(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerInvoice_Dispute', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerInvoice_AcceptList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerInvoice_AcceptList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
}
