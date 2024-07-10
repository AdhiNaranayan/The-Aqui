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
const StageURL = 'http://hundi.pptssolutions.com/APP_API/CommonManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/CustomerManagement/';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class LoginManageService {

  API_URL: string = environment.apiUrl + 'APP_API/CommonManagement/';

  constructor(private http: HttpClient, private router: Router) { }

  MobileOTP(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'MobileOTP', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Login(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'CustomerWebLogin', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  StatusVerify(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'WebStatusVerify', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  DeviceDeRegister(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'DeviceDeRegister', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  If_LoggedIn() {
    if (localStorage.getItem('SessionWeb') && localStorage.getItem('SessionKeyWeb') && localStorage.getItem('SessionVerifyWeb')) {
      const LastSession = new Date(atob(localStorage.getItem('SessionVerifyWeb'))).getTime();
      const NowSession = new Date().getTime();
      const SessionDiff: number = NowSession - LastSession;
      const SessionDiffHours: number = SessionDiff / 1000 / 60 / 60;
      if (SessionDiffHours < 2) {
        return 'Valid';
      } else {
        return 'Expired';
      }
    } else {
      localStorage.removeItem('SessionVerifyWeb');
      localStorage.removeItem('SessionWeb');
      localStorage.removeItem('SessionKeyWeb');
      return 'Invalid';
    }
  }

  LoginUser_Info() {
    if (localStorage.getItem('SessionWeb') && localStorage.getItem('SessionKeyWeb') && localStorage.getItem('SessionVerifyWeb')) {
      return CryptoJS.AES.decrypt(localStorage.getItem('SessionWeb'), localStorage.getItem('SessionKeyWeb').slice(3, 10)).toString(CryptoJS.enc.Utf8);
    } else {
      localStorage.removeItem('SessionVerifyWeb');
      localStorage.removeItem('SessionWeb');
      localStorage.removeItem('SessionKeyWeb');
      this.router.navigate(['/web-login']);
    }
  }


}
