import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
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
export class LoginManageService {
  API_URL: string = environment.apiUrl + 'Admin_API/UserManagement/';

  constructor(private http: HttpClient, private router: Router) {
  }

  User_login(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Login', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  If_LoggedIn() {
    if (localStorage.getItem('Session') && localStorage.getItem('SessionKey') && localStorage.getItem('SessionVerify')) {
      const LastSession = new Date(atob(localStorage.getItem('SessionVerify'))).getTime();
      const NowSession = new Date().getTime();
      const SessionDiff: number = NowSession - LastSession;
      const SessionDiffHours: number = SessionDiff / 1000 / 60 / 60;
      if (SessionDiffHours < 2) {
        return 'Valid';
      } else {
        return 'Expired';
      }
    } else {
      localStorage.clear();
      return 'Invalid';
    }
  }

  LoginUser_Info() {
    if (localStorage.getItem('Session') && localStorage.getItem('SessionKey') && localStorage.getItem('SessionVerify')) {
      return CryptoJS.AES.decrypt(localStorage.getItem('Session'), localStorage.getItem('SessionKey').slice(3, 10)).toString(CryptoJS.enc.Utf8);
    } else {
      localStorage.clear();
      this.router.navigate(['/admin-login']);
    }
  }


}
