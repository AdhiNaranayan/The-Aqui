import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/TemporaryManagement/';
const DevURL = 'http://localhost:3002/APP_API/CreditManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/TemporaryManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/CreditManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/TemporaryManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class TemporaryRequestService {
  API_URL: string = environment.apiUrl + 'APP_API/CreditManagement/';

  constructor(private http: HttpClient, private router: Router) { }

  //New

  Buyer_BusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Buyer_BusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err, console.log(err, 'errerrerr')
    )));
  }

  SellerRequest_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerRequest_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerRequest_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerRequest_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err, console.log(err, 'errerrerr')
    )));
  }


  Buyer_TemporaryRequest_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Buyer_TemporaryRequest_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err, console.log(err, 'errerrerr')
    )));
  }

  //New


  TemporaryRequestList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'TemporaryRequestList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerBusiness_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Buyer_BusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // BuyerBranchesOfBusiness_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerBranchesOfBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  CreditRequest_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CreditRequest_Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // SellerAgainstBusinessSimpleList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAgainstBusinessSimpleList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerAndBusinessAgainstBranchSimpleList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAndBusinessAgainstBranchSimpleList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  TempCreditCreate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'TempCreditCreate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
}
