import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const DevURL = 'http://localhost:3002/Admin_API/SupportManagement/';
const StageURL = 'http://aquila-admin.pptssolutions.com/Admin_API/SupportManagement/';
const TempURL = 'http://aquila.pptssolutions.com/Admin_API/SupportManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SupportManagementService {
  API_URL: string = environment.apiUrl + 'Admin_API/SupportManagement/';

  constructor(private http: HttpClient) { }

  All_CustomerSupport_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'All_SupportManagement_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SupportTitle_List(): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SimpleList_For_SupportTitle', httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SupportTitle_Create(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SupportTitle_Create', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  CustomerSupport_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'User_Update_Support', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  CustomerSupport_Closed(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Customer_Support_Closed', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Customer_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'FilteredCustomer_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Title_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Title_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Key_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Key_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  TitleKey_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SupportKeyAndSupport_Title_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
}
