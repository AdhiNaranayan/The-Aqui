import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const DevURL = 'http://localhost:3000/API/Global_Management/';
const StageURL = 'http://aquila.pptssolutions.com/API/Global_Management/';
const TempURL = 'http://aquila.pptssolutions.com/Admin_API/Global_Management/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  API_URL: string = environment.apiUrl + 'Admin_API/Global_Management/';

  constructor(private http: HttpClient) { }

  GetCountries(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Country_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  GetStates(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'State_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  GetCities(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'City_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

}
