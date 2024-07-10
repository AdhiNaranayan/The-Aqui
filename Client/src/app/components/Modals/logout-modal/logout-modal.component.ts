import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss']
})
export class LogoutModalComponent implements OnInit {

  @HostListener('window:keydown.esc', ['$event'])
  onEsc(event: any): void {
    if (event.keyCode === 27) {
      this.Cancel();
      event.preventDefault();
    }
  }

  onClose: Subject<any>;

  Icon = '';
  ColorCode = 'red';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public modalRef: BsModalRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }
  Cancel() {
    this.onClose.next({ Status: false });
    this.modalRef.hide();
  }
  // Proceed() {
  //   this.onClose.next({ Status: true });
  //   this.ModalRef.hide();
  // }


  Logout() {
    this.onClose.next({ Status: true });
    this.modalRef.hide();

    // this.modalRef.content.onClose.subscribe(response => {
    localStorage.removeItem('SessionVerifyWeb');
    localStorage.removeItem('SessionWeb');
    localStorage.removeItem('SessionKeyWeb');
    // window.location.reload();
    this.router.navigate(['/web-login']);
    // });
  }



}
