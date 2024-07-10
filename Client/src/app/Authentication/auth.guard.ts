import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { LoginManageService } from './../services/common-services/login-manage.service';
import { SessionLogoutModalComponent } from '../components/Modals/session-logout-modal/session-logout-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  modalReference: BsModalRef;

  constructor(private router: Router,
    private LoginService: LoginManageService,
    public ModalService: BsModalService) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.LoginService.If_LoggedIn() === 'Valid') {
      return true;
    } else if (this.LoginService.If_LoggedIn() === 'Expired') {
      return new Promise(resolve => {
        // const initialState = {};
        // this.modalReference = this.ModalService.show(SessionLogoutModalComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated bounceInRight'} ));
        // this.modalReference.content.onClose.subscribe(response => {
        //    if (response.Status) {
        //       resolve(true);
        //    } else {
        //       localStorage.clear();
        //       this.router.navigate(['/web-login']);
        //       resolve(false);
        //    }
        // });
      });
    } else {
      // localStorage.clear();
      // this.router.navigate(['/web-login']);
      // return false;
    }
  }
}
