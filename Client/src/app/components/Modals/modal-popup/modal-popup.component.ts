import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss']
})
export class ModalPopupComponent implements OnInit {
  onClose: Subject<any>;

  Icon = '';
  ColorCode = '';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';
  constructor(public ModalRef: BsModalRef,
              private router: Router) {
                router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {
                     if (event.url === '/business' ) {
                      this.ModalRef.hide();
                     }
                    }
                  });
               }

  ngOnInit() {
    this.onClose = new Subject();
  }

  AddBusiness() {
    this.ModalRef.hide();
    this.router.navigate(['/business']);
  }

}
