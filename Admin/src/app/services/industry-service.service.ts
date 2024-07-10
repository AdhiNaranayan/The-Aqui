import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const DevURL = 'http://localhost:3002/Admin_API/IndustryManagement/';
const StageURL = 'http://aquila-admin.pptssolutions.com/Admin_API/IndustryManagement/';
const TempURL = 'http://aquila.pptssolutions.com/Admin_API/IndustryManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IndustryServiceService {
  API_URL: string = environment.apiUrl + 'Admin_API/IndustryManagement/';

  constructor(private http: HttpClient) { }

  All_Industry_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Industry_Create(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Create', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Industry_Edit(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Edit', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Industry_Update(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Industry_ActiveStatus(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Active', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Industry_InActiveStatus(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'InActive', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

}
