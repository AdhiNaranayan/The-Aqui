import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

// const DevURL = 'http://localhost:3002/Web_API/InviteManagement/';
const DevURL = 'http://localhost:3002/APP_API/InviteManagements/';
// const StageURL = 'http://hundi.pptssolutions.com/Web_API/InviteManagement/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/InviteManagement/';
const TempURL = 'http://hundi.pptssolutions.com/Web_API/InviteManagement/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class InviteManagementService {
  API_URL: string = environment.apiUrl + 'APP_API/InviteManagements/';

  constructor(private http: HttpClient,
    private router: Router) { }



  SellerAgainstBusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerAgainstBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerAgainstBusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerAgainstBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  } DevURL

  BusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err))
    ); this.API_URL
  }

  CompleteInvitedList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerAndBuyerInviteList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }




  RejectInvite(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Invite_Reject', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  Sellersend_Invite(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerSendInvite', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }



  Verify_Mobile(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'Verify_Mobile', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerAndBuyerBusinessList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerAndBuyerBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // SellerAndBuyerBranchList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerAndBuyerBranchList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerSendInvite(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerSendInvite', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  BuyerSendInvite(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerSendInvite', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerIncreaseCreditLimit(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerIncreaseCreditLimit', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }
  // Invite_Reject(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'Invite_Reject', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  SellerInvite_StatusUpdate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerInvite_StatusUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerInvite_StatusUpdate(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerInvite_StatusUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  InvitedSeller_PendingList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'InvitedSeller_InviteList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // SendInvite(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SendInvite', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // SellerBusiness_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  BuyerBusiness_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerBranchesOfBusiness_List(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerAgainstBusinessList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // SellerBranchesOfBusiness_List(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'SellerBranchesOfBusiness_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  AllInvitedList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'AllInvitedList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerInvite_PendingList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerInvite_PendingList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // InvitedBuyer_InviteList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'InvitedBuyer_InviteList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  SellerInvite_AcceptList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerInvite_AcceptList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerInvite_RejectList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerInvite_RejectList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  // BuyerInvite_PendingList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerInvite_PendingList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerInvite_AcceptList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerInvite_AcceptList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // BuyerInvite_RejectList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'BuyerInvite_RejectList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  // Invite_StatusUpdate(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'Invite_StatusUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }



  // OverallInviteList(data: any): Observable<any> {
  //   return this.http.post<any>(DevURL + 'OverallInviteList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  // }

  SellerAgainstBuyerList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerAgainstBuyerList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  BuyerAgainstSellerList(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'BuyerAgainstSellerList', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

  SellerUpdateToBuyerCreditLimit(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'SellerUpdateToBuyerCreditLimit', data, httpOptions).pipe(map(res => res), catchError(err => of(err)));
  }

}
