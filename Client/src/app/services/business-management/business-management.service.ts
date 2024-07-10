import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/WEB_API/BusinessAndBranchManagement/';
const DevURL = 'http://localhost:3002/APP_API/BusinessAndBranchManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/WEB_API/BusinessAndBranchManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/BusinessAndBranchManagement/';
const TempURL = 'http://hundi.pptssolutions.com/WEB_API/BusinessAndBranchManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class BusinessManagementService {
  constructor(private http: HttpClient, private router: Router) { }
  API_URL: string = environment.apiUrl + 'APP_API/BusinessAndBranchManagement/';

  // SellerCreateBusinessAndBranch(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerCreateBusinessAndBranch', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }


  CreateBusiness(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CreateBusiness', data, httpOptions).pipe(map(res => res), catchError(err => of(err, console.log(err, 'errerr')
    )));
  }

  Business_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'FilteredBusinessDetailsList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  FilterBusinessDetailsList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'FilterBusinessDetailsList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  MyBusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'MyBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BusinessUpdate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BusinessUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BusinessDeletebtn(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerBusinessDeletebtn', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerWholeBusinessDelete(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerWholeBusinessDelete', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerWholeBusinessDelete(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerWholeBusinessDelete', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UsersBusinessAndBranches_List(data: any): Observable<any>{
    return this.http.post<any>(this.API_URL + 'UsersBusinessAndBranches_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // BuyerCreateBusinessAndBranch(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerCreateBusinessAndBranch', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerAddBranch(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAddBranch', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerAddBranch(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerAddBranch', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BusinessList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  IndustrySimpleList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'IndustrySimpleList', data, httpOptions).pipe(map(res => res), catchError(err => of(console.log(err, 'errrrrr')
    )));
  }

  // PrimaryBranchSimpleList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'PrimaryBranchSimpleList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BranchList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BranchList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BusinessAndBranchUpdate(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BusinessAndBranchUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BranchDetailsUpdate(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BranchDetailsUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerBusiness_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerBusiness_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  BusinessAgainstUsersLists(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BusinessAgainstUsersLists', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // SellerBranchesOfBusiness_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerBranchesOfBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }


  // BuyerBranchesOfBusiness_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerBranchesOfBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerBusinessMonthlyReports(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerBusinessMonthlyReports', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerBusinessMonthlyReports(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerBusinessMonthlyReports', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }
}
