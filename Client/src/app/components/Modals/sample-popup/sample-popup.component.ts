import { Component, OnInit } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';
import { SessionLogoutModalComponent } from '../session-logout-modal/session-logout-modal.component';

@Component({
  selector: 'app-sample-popup',
  templateUrl: './sample-popup.component.html',
  styleUrls: ['./sample-popup.component.scss']
})
export class SamplePopupComponent implements OnInit {

  modalReference: BsModalRef;

  constructor(public ModalService: BsModalService) { }

  openModalPopup() {
    this.modalReference = this.ModalService.show(UserProfileModalComponent,
      Object.assign({ ignoreBackdropClick: false, class: 'modal-md modal-dialog-centered animated zoomIn' }));
  }

  samplePopup() {
    this.modalReference = this.ModalService.show(ModalPopupComponent,
      Object.assign({ ignoreBackdropClick: false, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
  }

  sessionLogout() {
    this.modalReference = this.ModalService.show(SessionLogoutModalComponent,
      Object.assign({ ignoreBackdropClick: false, class: 'modal-md modal-dialog-centered animated zoomIn' }));
  }



  ngOnInit() {

  }

}
