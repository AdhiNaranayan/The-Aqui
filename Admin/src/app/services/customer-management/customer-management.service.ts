import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const DevURL = 'http://localhost:3002/Admin_API/CustomerManagement/';
const StageURL = 'http://aquila-admin.pptssolutions.com/Admin_API/CustomerManagement/';
const TempURL = 'http://aquila.pptssolutions.com/Admin_API/CustomerManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService {
  API_URL: string = environment.apiUrl + 'Admin_API/CustomerManagement/';

  constructor(private http: HttpClient) { }

  All_Customer_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  OwnerOfUsersList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'OwnerOfUsersList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UserBusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'AllOwnerAndUserOfBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UserBranchList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'AllOwnerAndUserAndBusinessOfBranchList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  InvoiceManagementList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'InvoiceManagementList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }


  PaymentHistoryList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'PaymentHistoryList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }


  View(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'View', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Customer_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerDetailsUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Block(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerBlock', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UnBlock(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerUnBlock', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UserBusiness_Details(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'UserBusiness_Details', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  GetStates(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'State_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Branch_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Branch_Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }



  BranchDetails_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BranchDetails_Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }


  Business_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Business_Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BranchList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'UserBranchList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  OwnerList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'OwnerList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UserList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'UserList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  PaymentDetails(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'PaymentDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerBusinessMonthlyReports(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerBusinessMonthlyReports', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerBusinessMonthlyReports(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerBusinessMonthlyReports', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
}
