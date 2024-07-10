import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/CustomerManagement/';
const DevURL = 'http://localhost:3002/APP_API/CustomerManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/CustomerManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/CustomerManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/CustomerManagement/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class OwnerRegisterService {
  API_URL: string = environment.apiUrl + 'APP_API/CustomerManagement/';

  constructor(private http: HttpClient, private router: Router) { }


  OwnerAgainstUserList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'OwnerAgainstUserList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  MonthlyReports(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'MonthlyReports', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  CustomerDetails(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Customer_Details', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  CustomerProfileUpload(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerProfileUpload', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SwitchTo_BothBuyerAndSeller(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SwitchTo_BothBuyerAndSeller', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  OwnerRegister(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'OwnerWebRegister', data, httpOptions).pipe(map(res => res), catchError(err => of(err, console.log(err, 'err')
    )));
  }

  // OwnerDetails(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'OwnerDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  OwnerDetailsUpdate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'OwnerDetailsUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  OwnerCreateUser(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'User_Create', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // UserDetails(data: any): Observable<anythis.API_URL> {
  //   return this.http.post<any>(DevURL + 'UserDetails', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  UserDetailsUpdate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'UserUpdated', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  OwnerOfUsersList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'OwnerOfUsersList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  GetStates(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'StateList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BusinessUnAssigned(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'MyBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // BranchUnAssigned(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BranchUnAssigned', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BusinessAndBranches_DetailsList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BusinessAndBranches_DetailsList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  CustomerProfileDetails(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Customer_Details', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // AllNotification_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'All_Notifications_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // DeleteAllRead(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'DeleteAllReadNotifications', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // MarkAllAsRead(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'MarkAllAsReadNotifications', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // Notification_Counts(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'Notification_Counts', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

}
