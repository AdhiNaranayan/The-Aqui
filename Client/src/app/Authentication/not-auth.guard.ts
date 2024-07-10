import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { LoginManageService } from './../services/common-services/login-manage.service';
import { SessionLogoutModalComponent } from '../components/Modals/session-logout-modal/session-logout-modal.component';


@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {

   modalReference: BsModalRef;
   constructor( private router: Router,
                private LoginService: LoginManageService,
                public ModalService: BsModalService) {}
   canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      // if (localStorage.getItem('User') !== null) {
      //    this.router.navigate(['/Industry']);
      //    return false;
      // } else {
      //    localStorage.clear();
      //    return true;
      // }

      if (this.LoginService.If_LoggedIn() === 'Invalid') {
         return true;
      } else if (this.LoginService.If_LoggedIn() === 'Expired') {
         return new Promise(resolve => {
            const initialState = {};
            this.modalReference = this.ModalService.show(SessionLogoutModalComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated bounceInRight'} ));
            this.modalReference.content.onClose.subscribe(response => {
               if (response.Status) {
                  const UserInfo = this.LoginService.LoginUser_Info();
                  if (UserInfo.CustomerType === 'Owner' || UserInfo.CustomerType === 'User') {
                     this.router.navigate(['/dashboard']);
                  } else {
                     this.router.navigate(['/dashboard']);
                  }
                  resolve(false);
               } else {
                  resolve(true);
               }
            });
         });
      } else {
         const UserInfo = this.LoginService.LoginUser_Info();
         this.router.navigate(['/dashboard']);
         return false;
      }
   }
}
