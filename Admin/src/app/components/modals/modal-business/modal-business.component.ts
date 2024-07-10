import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-business',
  templateUrl: './modal-business.component.html',
  styleUrls: ['./modal-business.component.css']
})
export class ModalBusinessComponent implements OnInit {

  onClose: Subject<any>;
  Type: string;
  BusinessInfo: any;
  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

}
