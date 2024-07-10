import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataPassingService } from 'src/app/services/common-services/data-passing.service';
import { CustomerManagementService } from 'src/app/services/customer-management/customer-management.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalCustomerViewComponent } from '../modals/modal-customer-view/modal-customer-view.component';
import { ModalAddbranchComponent } from '../modals/modal-addbranch/modal-addbranch.component';
import { ModalApprovedComponent } from '../modals/modal-approved/modal-approved.component';
 
@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  private dataSubscription: Subscription = new Subscription();

  isVisible = false;
  modalReference: BsModalRef;

  CustomerDetails: any;
  id: string;
  UrlParams = null;

  constructor(private route: ActivatedRoute,
              public ModalService: BsModalService,
              private dataPassingService: DataPassingService,
              private CustomerService: CustomerManagementService,
              public ActiveRoute: ActivatedRoute) {
    this.UrlParams = this.ActiveRoute.snapshot.params;
    const ParamsArr = Object.keys(this.UrlParams);
    this.dataSubscription.add(
      this.dataPassingService.AllOwner.subscribe( response => {
      const Data = {
        Mobile: this.UrlParams.Mobile
      };
      this.CustomerService.View(Data).subscribe(CustomerResponse => {
        if (CustomerResponse.Status && CustomerResponse.Status === true) {
          this.CustomerDetails = CustomerResponse.Response;
          this.CustomerDetails = this.CustomerDetails.map(obj => {
            obj.ExpandClass = false;
            return obj;
          });
          const Branches = JSON.parse(JSON.stringify(this.CustomerDetails[0].Branches));
        }
      });
    }));
  }
  ngOnInit(): void {
  }

  ExpandThis(idx: number) {
    this.CustomerDetails[idx].ExpandClass = true;
    this.CustomerDetails = this.CustomerDetails.map(obj => {
      obj.ExpandClass = false;
      return obj;
    });

  }


  AddBranch(index: any) {
    const initialState = {
       Type: 'Create',
       Business: this.CustomerDetails.BusinessAndBranches[index].Business._id,
       CustomerDetails: this.CustomerDetails
    };
    this.modalReference = this.ModalService.show(ModalAddbranchComponent,
       Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
       if (response.Status) {
          this.CustomerDetails[index] = response.Response;
       }
    });
 }

RemoveBranch(index: any) {
  // const initialState = {
  //    Icon: 'block',
  //    ColorCode: 'danger',
  //    TextOne: 'You Want to',
  //    TextTwo: 'Remove the Branch',
  //    TextThree: 'for this User?',
  // };
  // this.modalReference = this.ModalService.show(ModalApprovedComponent,
  //    Object.assign({ initialState }, {
  //       ignoreBackdropClick: true,
  //       class: 'modal-dialog-centered animated zoomIn modal-small-with'
  //    }));
  // this.modalReference.content.onClose.subscribe(response => {
  //    if (response.Status) {
  //       const Data = {
  //         Customer: this.CustomerDetails._id,
  //         Branch: this.CustomerDetails[index].UserInfo[customer].Mobile
  //       };
  //       this.CustomerService.UnBlock(Data).subscribe(responseNew => {
  //          if (responseNew.Status) {
  //             this.Service_Loader();
  //             this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'User Account Blocked' });
  //          }
  //       });
  //    }
  // });
}




  CollapseThis(idx: number) {
    this.CustomerDetails[idx].ExpandClass = false;
  }

  UserExpand(index: any) {
    this.isVisible = true;
    const Info = this.CustomerDetails[index];
  }

  ViewBusiness(index: any) {
    const initialState = {
      UserInfo: this.CustomerDetails[index].BusinessAndBranches,
    };
    this.modalReference = this.ModalService.show(ModalCustomerViewComponent, Object.assign({
      initialState
    }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.CustomerDetails[index] = response.Response;
      }
    });
  }

  openFilterModal(template: TemplateRef<any>) {

    this.modalReference = this.ModalService.show(template, {
      ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'
    });
  }
}
