import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';

@Component({
  selector: 'app-modal-current-month-report',
  templateUrl: './modal-current-month-report.component.html',
  styleUrls: ['./modal-current-month-report.component.scss']
})
export class ModalCurrentMonthReportComponent implements OnInit {
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
    if (this.Type === 'BuyerMonthlyReports') {
      // this.BusinessService.BuyerBusinessMonthlyReports({ BusinessId: this.BusinessInfo._id }).subscribe(response => {
      //   this.BusinessMonthlyReports = response.Response;
      // });
    }
  }

}

