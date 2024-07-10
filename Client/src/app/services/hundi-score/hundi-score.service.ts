import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/HundiScoreManagement/';
const DevURL = 'http://localhost:3002/APP_API/HundiScoreManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/HundiScoreManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/HundiScoreManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/HundiScoreManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class HundiScoreService {

  constructor(private http: HttpClient,
    private router: Router) { }
  API_URL: string = environment.apiUrl + 'APP_API/HundiScoreManagement/';



  CustomerDashboard(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerDashBoard', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }


  // SellerOwnerDashboard(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerOwnerDashboard', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerUserDashboard(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerUserDashboard', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerOwnerDashboard(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerOwnerDashboard', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerUserDashboard(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerUserDashboard', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  FilterSellerAndBusinessAndBranchAgainstBuyerScore(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'ConnectedCustomerWithAdvancedFilter', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  FilterBuyerAndBusinessAndBranchAgainstSellerScore(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'ConnectedCustomerWithAdvancedFilter', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // SellerAndBusinessAndBranchAgainstBuyerScore(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAndBusinessAndBranchAgainstBuyerScore', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerAndBusinessAndBranchAgainstSellerScore(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerAndBusinessAndBranchAgainstSellerScore', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // HundiScoreIndividualSellerDetails(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'HundiScoreIndividualSellerDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // HundiScoreIndividualBuyerDetails(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'HundiScoreIndividualBuyerDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // HundiScoreIndividualBuyerBranchDetails(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'HundiScoreIndividualBuyerBranchDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // HundiScoreIndividualSellerBranchDetails(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'HundiScoreIndividualSellerBranchDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }
}
