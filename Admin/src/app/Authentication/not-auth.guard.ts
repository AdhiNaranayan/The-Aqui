import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { LoginManageService } from './../services/login-management/login-manage.service';
import { ModalSessionExpiredComponent } from '../components/Modals/modal-session-expired/modal-session-expired.component';


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
            this.modalReference = this.ModalService.show(ModalSessionExpiredComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-dialog-centered animated bounceInRight'} ));
            this.modalReference.content.onClose.subscribe(response => {
               if (response.Status) {
                  const UserInfo = this.LoginService.LoginUser_Info();
                  if (UserInfo.User_Role === 'Super_Admin') {
                     this.router.navigate(['/Industry']);
                  } else {
                     this.router.navigate(['/Industry']);
                  }
                  resolve(false);
               } else {
                  resolve(true);
               }
            });
         });
      } else {
         const UserInfo = this.LoginService.LoginUser_Info();
         if (UserInfo.User_Role === 'Super_Admin') {
            this.router.navigate(['/Industry']);
         } else {
            this.router.navigate(['/Industry']);
         }
         return false;
      }
   }
}