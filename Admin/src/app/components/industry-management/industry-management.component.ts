import { Component, OnInit, Renderer2, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalIndustryComponent } from '../modals/modal-industry/modal-industry.component';
import { IndustryServiceService } from '../../services/industry-service.service';
import { ModalIndustryStatusComponent } from '../../components/modals/modal-industry-status/modal-industry-status.component';
import { LoginManageService } from '../../services/login-management/login-manage.service';
import { from } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from '../../services/common-services/toastr.service';

interface LabelNumbers {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-industry-management',
  templateUrl: './industry-management.component.html',
  styleUrls: ['./industry-management.component.css']
})
export class IndustryManagementComponent implements OnInit {

  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;
  FilterFGroup: FormGroup;
  title = 'Industry Management';
  numbers: LabelNumbers[] = [
    { value: 'ten', viewValue: '10' },
    { value: 'twenty', viewValue: '20' },
    { value: 'thirty', viewValue: '30' }
  ];
  PageLoader = true;
  IndustryList: any[] = [];
  LimitCount = 5;
  TotalRows = 0;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  GoToPage = null;
  PagesArray = [];
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  modalReference: BsModalRef;
  THeaders: any[] = [{ Key: 'Industry_Name', ShortKey: 'Industry_Name', Name: 'Industry Name', If_Short: false, Condition: '' },
  { Key: 'updatedAt', ShortKey: 'updatedAt', Name: 'Last Updated Date', If_Short: false, Condition: '' },
  { Key: 'Status', ShortKey: 'Status', Name: 'Current Status', If_Short: false, Condition: '' },
  ];

  UserInfo: any;
  User_Status: any[] = [{ Name: 'Activated', Key: 'Activated' },
  { Name: 'InActive', Key: 'InActive' }];

  FiltersArray: any[] = [
    { Active: false, Key: 'Industry_Name', Value: '', DisplayName: 'Industry Name', DBName: 'Industry_Name', Type: 'String', Option: '' },
    { Active: false, Key: 'Status', Value: '', DisplayName: 'Industry Status', DBName: 'Status', Type: 'String', Option: '' },
  ];
  FilterFGroupStatus = false;
  constructor(
    public ModalService: BsModalService,
    public IndustryService: IndustryServiceService,
    public LoginService: LoginManageService,
    public renderer: Renderer2,
    public Toastr: ToastrService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.Service_Loader();
  }

  ngOnInit() {

    this.FilterFGroup = new FormGroup({
      Industry_Name: new FormControl(''),
      Status: new FormControl(''),
    });

    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });
  }
  FilterFormChanges() {
    const FilteredValues = this.FilterFGroup.value;
    this.FilterFGroupStatus = false;
    Object.keys(FilteredValues).map(obj => {
      const value = this.FilterFGroup.controls[obj].value;
      if (value !== undefined && value !== null && value !== '') {
        this.FilterFGroupStatus = true;
      }
    });
  }

  NotAllow(): boolean { return false; }
  ClearInput(event: KeyboardEvent): boolean {
    const Events = event.composedPath() as EventTarget[];
    const Input = Events[0] as HTMLInputElement;
    const FControl = Input.attributes as NamedNodeMap;
    const FControlName = FControl.getNamedItem('formcontrolname').textContent;
    this.FilterFGroup.controls[FControlName].setValue(null);
    return false;
  }

  Service_Loader() {
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });
    const Filters = this.FiltersArray.filter(obj => obj.Active === true);
    const Data = {
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      User: this.UserInfo._id,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters
    };
    this.TableLoader();
    this.IndustryService.All_Industry_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.IndustryList = response.Response;
        // this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully Industries details' });
        setTimeout(() => {
          this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        }, 10);
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        //  this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        //  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
      }
    });
  }
  TableLoader() {
    setTimeout(() => {
      //  const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
      //  const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
    }, 10);
  }


  Pagination_Affect() {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    const PrevClass = (this.CurrentIndex > 1 ? '' : 'PageAction_Disabled');
    this.PagePrevious = { Disabled: !(this.CurrentIndex > 1), Value: (this.CurrentIndex - 1), Class: PrevClass };
    const NextClass = (this.CurrentIndex < NoOfArrays ? '' : 'PageAction_Disabled');
    this.PageNext = { Disabled: !(this.CurrentIndex < NoOfArrays), Value: (this.CurrentIndex + 1), Class: NextClass };
    this.PagesArray = [];
    for (let index = 1; index <= NoOfArrays; index++) {
      if (index === 1) {
        this.PagesArray.push({ Text: '1', Class: 'Number', Value: 1, Show: true, Active: (this.CurrentIndex === index) });
      }
      if (index > 1 && NoOfArrays > 2 && index < NoOfArrays) {
        if (index === (this.CurrentIndex - 2)) {
          this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
        }
        if (index === (this.CurrentIndex - 1)) {
          this.PagesArray.push({ Text: (this.CurrentIndex - 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
        }
        if (index === this.CurrentIndex) {
          this.PagesArray.push({ Text: this.CurrentIndex.toString(), Class: 'Number', Value: index, Show: true, Active: true });
        }
        if (index === (this.CurrentIndex + 1)) {
          this.PagesArray.push({ Text: (this.CurrentIndex + 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
        }
        if (index === (this.CurrentIndex + 2)) {
          this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
        }
      }
      if (index === NoOfArrays && NoOfArrays > 1) {
        // tslint:disable-next-line: max-line-length
        this.PagesArray.push({ Text: NoOfArrays.toString(), Class: 'Number', Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index) });
      }
    }
    let ToCount = this.SkipCount + this.LimitCount;
    if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
    // tslint:disable-next-line: max-line-length
    this.ShowingText = 'Showing <span>' + (this.SkipCount + 1) + '</span> to <span>' + ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
  }

  Pagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
    }

  }

  Short_Change(index: any) {
    if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
    } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Descending';
      this.Pagination_Action(1);
      // tslint:disable-next-line: max-line-length
    } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
    } else {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.Pagination_Action(1);
    }
  }

  CreateIndustry() {
    const initialState = { Type: 'Create' };
    // tslint:disable-next-line: max-line-length
    this.modalReference = this.ModalService.show(ModalIndustryComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

  EditIndustry(index: any) {
    const initialState = {
      Type: 'Edit',
      IndustryDetails: this.IndustryList[index]
    };
    this.modalReference = this.ModalService.show(ModalIndustryComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.IndustryList[index] = response.Response;
        this.Service_Loader();
      }
    });
  }

  ViewIndustry(index: any) {
    const initialState = {
      Type: 'View',
      IndustryDetails: this.IndustryList[index]
    };
    this.modalReference = this.ModalService.show(ModalIndustryComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.IndustryList[index] = response.Response;
      }
    });
  }

  IndustryInActive(index: any) {
    const initialState = {
      Icon: 'block',
      ColorCode: 'danger',
      TextOne: 'You Want to',
      TextTwo: 'In-active',
      TextThree: 'this Industries ?',
    };
    this.modalReference = this.ModalService.show(ModalIndustryStatusComponent,
      Object.assign({ initialState }, {
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered animated zoomIn modal-small-with'
      }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        const IndustryId = this.IndustryList[index]._id;
        this.IndustryService.Industry_InActiveStatus({
          IndustryId,
          Status: 'InActive', User: this.UserInfo._id
        }).subscribe(responseNew => {
          if (responseNew.Status) {
            this.Service_Loader();
          } else {
            this.Toastr.NewToastrMessage({ Type: 'Warning', Message: responseNew.Message });
          }
        });
      }
    });
  }


  IndustryActive(index: any) {
    const initialState = {
      Icon: 'verified_user',
      ColorCode: 'success',
      TextOne: 'You Want to',
      TextTwo: 'Active',
      TextThree: 'this Industries?',
    };
    this.modalReference = this.ModalService.show(ModalIndustryStatusComponent,
      Object.assign({ initialState }, {
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered animated zoomIn modal-small-with'
      }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        const IndustryId = this.IndustryList[index]._id;
        this.IndustryService.Industry_ActiveStatus({
          User: this.UserInfo._id, Status: 'Activated',
          IndustryId
        }).subscribe(responseNew => {
          if (responseNew.Status) {
            this.Service_Loader();
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Industry details has been Activated' });
          } else if (!responseNew.error.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: responseNew.error.Message });
          }
        });
      }
    });
  }

  SubmitFilters() {
    const FilteredValues = this.FilterFGroup.value;
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
    });
    Object.keys(FilteredValues).map(obj => {
      const value = this.FilterFGroup.controls[obj].value;
      if (value !== undefined && value !== null && value !== '') {
        const index = this.FiltersArray.findIndex(objNew => objNew.Key === obj);
        this.FiltersArray[index].Active = true;
        this.FiltersArray[index].Value = value;
      }
    });
    this.Pagination_Action(1);
    this.modalReference.hide();
  }


  AutocompleteBlur(key: any) {
    const value = this.FilterFGroup.controls[key].value;
    if (!value || value === null || value === '' || typeof value !== 'object') {
      this.FilterFGroup.controls[key].setValue(null);
    }
  }

  ResetFilters() {
    this.FiltersArray.map(obj => {
      obj.Active = false;
      obj.Value = obj.Type === 'String' ? '' : null;
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.FilterFGroupStatus = false;
    this.Pagination_Action(1);
    // this.modalReference.hide();
  }


  RemoveFilter(index: any) {
    const KeyName = this.FiltersArray[index].Key;
    const EmptyValue = this.FiltersArray[index].Type === 'String' ? '' : null;
    this.FilterFGroup.controls[KeyName].setValue(EmptyValue);
    this.SubmitFilters();
  }

  openFilterModal(template: TemplateRef<any>) {
    this.FiltersArray.map(obj => {
      this.FilterFGroup.controls[obj.Key].setValue(obj.Value);
    });
    this.modalReference = this.ModalService.show(template,
      { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' });
  }

}
