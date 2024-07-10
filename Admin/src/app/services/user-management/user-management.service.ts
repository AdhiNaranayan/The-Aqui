import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const DevURL = 'http://localhost:3002/Admin_API/UserManagement/';
const StageURL = 'http://aquila-admin.pptssolutions.com/Admin_API/UserManagement/';
const TempURL = 'http://aquila.pptssolutions.com/Admin_API/UserManagement/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  API_URL: string = environment.apiUrl + 'Admin_API/UserManagement/';

  constructor(private http: HttpClient) { }

  User_AsyncValidate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'User_AsyncValidate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  User_Create(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Create', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Users_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Users_Delete(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Delete', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  User_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UserActive_Status(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Active', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  UserInActive_Status(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'InActive', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  AllNotification_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Notifications_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Notification_Counts(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Notification_Counts', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  DeleteAllRead(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'DeleteAllRead', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  MarkAllAsRead(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'MarkAllAsRead', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Read_Notification(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Read_Notification', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }


}
