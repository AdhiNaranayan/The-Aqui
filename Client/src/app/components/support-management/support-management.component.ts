// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Subscription } from 'rxjs';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { SupportManagementService } from 'src/app/services/support-management/support-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { ModalSupportManagementComponent } from '../Modals/modal-support-management/modal-support-management.component';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-support-management',
  templateUrl: './support-management.component.html',
  styleUrls: ['./support-management.component.scss']
})
export class SupportManagementComponent implements OnInit {
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;
  PageLoader = true;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 6;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  modalReference: BsModalRef;
  GoToPage = null;
  FilterFGroup: FormGroup;
  FilterFGroupStatus = false;
  SupportDetails: any[] = [];
  AllCategory: any[] = [];
  UserInfo: any;
  FiltersArray: any[] = [
    { Active: false, Key: 'Support_Title', Value: '', DisplayName: 'Support Title', DBName: 'Support_Title', Type: 'String', Option: '' },
    { Active: false, Key: 'Support_key', Value: '', DisplayName: 'Support key', DBName: 'Support_key', Type: 'String', Option: '' }
  ];

  THeaders: any[] = [
    { Key: 'ContactName', ShortKey: 'ContactName', Name: 'ContactName', If_Short: false, Condition: '' },
    { Key: 'Mobile', ShortKey: 'Mobile', Name: 'Mobile', If_Short: false, Condition: '' },
    { Key: 'Email', ShortKey: 'Email', Name: 'Email', If_Short: false, Condition: '' },
    { Key: 'CustomerCategory', ShortKey: 'CustomerCategory', Name: 'Customer Category', If_Short: false, Condition: '' },
    { Key: 'CustomerType', ShortKey: 'CustomerType', Name: 'CustomerType', If_Short: false, Condition: '' },
    { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date', If_Short: false, Condition: '' },
  ];
  constructor(private Login: LoginManageService,
    private renderer: Renderer2,
    private Toastr: ToastrService,
    public SupportManage: SupportManagementService,
    private loadingService: LoadingService,
    private DataPassingService: CategoryDataPassingService,
    public ModalService: BsModalService) {
    this.UserInfo = JSON.parse(this.Login.LoginUser_Info());
    this.Service_Loader();



    if (this.UserInfo.CustomerCategory === 'Seller') {
      this.AllCategory = ['Seller'];
      this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
    } else if (this.UserInfo.CustomerCategory === 'Buyer') {
      this.AllCategory = ['Buyer'];
      this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
    }
    // else if (this.UserInfo.CustomerCategory === 'BothBuyerAndSeller') {
    //   if (this.AllCategory.length === 0) {
    //     this.AllCategory = ['Seller'];
    //     this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
    //   }
    // }


  }

  ngOnInit(): void {
    // alert(this.AllCategory[0])
    this.FilterFGroup = new FormGroup({
      Support_Title: new FormControl('', Validators.required),
      Support_key: new FormControl('', Validators.required),
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


  Service_Loader() {
    this.loadingService.show(); // Show loader
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });
    const Filters = this.FiltersArray.filter(obj => obj.Active === true);
    const Data = {
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters,
      CustomerId: this.UserInfo.User
    };
    this.TableLoader();
    this.SupportManage.CustomerSupportDetail_List(Data).subscribe(response => {

      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        this.SupportDetails = response.Response;
        // After the asynchronous operation completes, hide the loader
        this.loadingService.hide();
        setTimeout(() => {
          if (this.TableLoaderSection != undefined) {
            this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
          }
        }, 10);
        this.TotalRows = response.SubResponse;
        // for (const key in response) {
        //   if (response.hasOwnProperty(key)) {
        //     // console.log(`Length of ${key}: ${Object.keys(response[key]).length}`);
        //     // console.log(`Length of Response: ${Object.keys(response.Response).length}`);
        //     this.TotalRows = Object.keys(response.Response).length
        //   }
        // }
        this.Pagination_Affect();
      } else {
        this.SupportDetails = [];
      }
    });
  }

  TableLoader() {
    setTimeout(() => {
      // const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
      // const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
      if (this.TableLoaderSection != undefined) {
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
        this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
      }
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
        this.PagesArray.push({
          Text: NoOfArrays.toString(),
          Class: 'Number', Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index)
        });
      }
    }
    let ToCount = this.SkipCount + this.LimitCount;
    if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
    this.ShowingText = 'Showing <span>' + (this.SkipCount + 1) + '</span> to <span>'
      + ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
  }

  Pagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
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
    this.modalReference = this.ModalService.show(template, {
      ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn'
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


  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.FilterFGroup.get(KeyName) as FormControl;
    if (FControl.invalid && FControl.touched) {
      const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
      if (ErrorKeys.length > 0) {
        let returnText = '';
        if (ErrorKeys.indexOf('required') > -1) {
          returnText = 'This field is required';
        } else if (ErrorKeys.indexOf('min') > -1) {
          returnText = 'Enter the value should be more than ' + FControl.errors.min.min;
        } else if (ErrorKeys.indexOf('max') > -1) {
          returnText = 'Enter the value should be less than or equal ' + FControl.errors.max.max;
        } else if (ErrorKeys.indexOf('minlength') > -1) {
          returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength + ' Digits/Characters';
        } else if (ErrorKeys.indexOf('maxlength') > -1) {
          returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength + ' Digits/Characters';
        } else if (ErrorKeys.indexOf('AlphaNumericError') > -1) {
          returnText = 'Please Enter Only Alphabets and Numerics!';
        } else if (ErrorKeys.indexOf('AlphaNumericSpaceHyphen') > -1) {
          returnText = 'Please Enter Only Alphabets, Numerics, Space and Hyphen!';
        } else if (ErrorKeys.indexOf('AlphabetsError') > -1) {
          returnText = 'Please Enter Only Alphabets!';
        } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenError') > -1) {
          returnText = 'Please Enter Only Alphabets, Space and Hyphen!';
        } else if (ErrorKeys.indexOf('AlphabetsSpaceHyphenDotError') > -1) {
          returnText = 'Please Enter Only Alphabets, Space, Dot and Hyphen!';
        } else if (ErrorKeys.indexOf('email') > -1) {
          returnText = 'Please Enter Valid Email!';
        } else if (ErrorKeys.indexOf('NumericsError') > -1) {
          returnText = 'Please Enter Only Numerics!';
        } else if (ErrorKeys.indexOf('NumericDecimalError') > -1) {
          returnText = 'Please Enter Only Numeric and Decimals!';
        } else if (ErrorKeys.indexOf('MobileNumericError') > -1) {
          returnText = 'Please Enter Only Numeric, Spaces and +!';
        } else {
          returnText = 'Undefined error detected!';
        }
        return returnText;
      } else {
        return '';
      }
    }
  }

  SupportDetailsViewAndEdit(Index: any) {
    const initialState = {
      Type: 'SupportDetailsViewAndEdit',
      SupportDetails: this.SupportDetails[Index]
    };
    this.modalReference = this.ModalService.show(ModalSupportManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.SupportDetails[Index] = response.Response;
        this.Service_Loader();
      }
    });
  }

  CreateSupport() {
    const initialState = { Type: 'SupportCreate' };
    this.modalReference = this.ModalService.show(ModalSupportManagementComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }
}
