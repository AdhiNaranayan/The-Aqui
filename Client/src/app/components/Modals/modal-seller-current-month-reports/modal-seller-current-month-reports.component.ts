import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';

@Component({
  selector: 'app-modal-seller-current-month-reports',
  templateUrl: './modal-seller-current-month-reports.component.html',
  styleUrls: ['./modal-seller-current-month-reports.component.scss']
})
export class ModalSellerCurrentMonthReportsComponent implements OnInit {
  onClose: Subject<any>;
  OwnerInfo: any;
  Type: string;
  BusinessInfo: any;
  BusinessMonthlyReports: any;
  constructor(
    public modalRef: BsModalRef,
    private BusinessService: BusinessManagementService,
  ) {
  }

  ngOnInit(): void {
    this.onClose = new Subject();
    if (this.Type === 'SellerMonthlyReports') {
      // this.BusinessService.SellerBusinessMonthlyReports({ BusinessId: this.BusinessInfo._id }).subscribe(response => {
      //   this.BusinessMonthlyReports = response.Response;
      // });
    }
  }

}


