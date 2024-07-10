import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/CustomerManagement/';
const DevURL = 'http://localhost:3002/APP_API/CommonManagement/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/CustomerManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/CustomerManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/CustomerManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient, private router: Router) { }
  API_URL: string = environment.apiUrl + 'APP_API/CommonManagement/';


  NotificationList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'All_Notifications_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Notification_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Notification_Viewed_Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Notification_delete(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Viewed_Notifications_Delete', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Read_All_Notifications_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Read_All_Notifications_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Delete_All_Notifications_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Delete_All_Notifications_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

}
