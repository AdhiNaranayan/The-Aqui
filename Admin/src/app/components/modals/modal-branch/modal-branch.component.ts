import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-branch',
  templateUrl: './modal-branch.component.html',
  styleUrls: ['./modal-branch.component.css']
})
export class ModalBranchComponent implements OnInit {

  onClose: Subject<any>;
  Type: string;
  BranchInfo: any;
  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

}
