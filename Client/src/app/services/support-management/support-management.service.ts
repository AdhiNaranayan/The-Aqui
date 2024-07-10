import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/supportManagement/';
const DevURL = 'http://localhost:3002/APP_API/SupportManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/supportManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/supportManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/supportManagement/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SupportManagementService {
  API_URL: string = environment.apiUrl + 'APP_API/SupportManagement/';

  constructor(private http: HttpClient, private router: Router) { }

  CustomerSupport_DetailList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerSupport_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  CustomerSupport_Detail(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerSupport_Detail', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
  CustomerSupport_Reply(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerSupport_Reply', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  CustomerSupport_Create(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerSupport_Create', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  //CustomerSupportDetail_List<WEB>
  CustomerSupportDetail_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerSupportDetail_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
}
