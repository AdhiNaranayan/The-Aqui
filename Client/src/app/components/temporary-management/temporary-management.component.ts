import { ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BusinessAndBranchesComponent } from '../../components/Modals/business-and-branches/business-and-branches.component';
import { OwnerRegisterService } from '../../services/registration/owner-register.service';
import { ModalBranchManagementComponent } from '../../components/Modals/modal-branch-management/modal-branch-management.component';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { TemporaryRequestService } from 'src/app/services/temporary-management/temporary-request.service';
import { ModalTemporaryCreditComponent } from '../Modals/modal-temporary-credit/modal-temporary-credit.component';
interface LabelNumbers {
  value: string;
  viewValue: string;
}

export interface Business { _id: string; BusinessName: string; }
export interface Branch { _id: string; BranchName: string; }
@Component({
  selector: 'app-temporary-management',
  templateUrl: './temporary-management.component.html',
  styleUrls: ['./temporary-management.component.scss']
})
export class TemporaryManagementComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;

  title = 'Client';
  StateList: any[] = [];
  numbers: LabelNumbers[] = [
    { value: 'ten', viewValue: '10' },
    { value: 'twenty', viewValue: '20' },
    { value: 'thirty', viewValue: '30' }
  ];
  PageLoader = true;
  CurrentIndex = 1;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 5;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  TempForm: FormGroup;
  FilterFGroupStatus = false;
  TemporaryDetails: any[] = [];
  THeaders: any[] = [
    { Key: 'BusinessName', ShortKey: 'BusinessName', Name: 'Business Name', If_Short: false, Condition: '' },
    { Key: 'PrimaryBranches', ShortKey: 'PrimaryBranches', Name: 'PrimaryBranch', If_Short: false, Condition: '' },
    { Key: 'Industries', ShortKey: 'Industries', Name: 'Industry', If_Short: false, Condition: '' },
    { Key: 'BusinessCreditLimit', ShortKey: 'BusinessCreditLimit', Name: 'BusinessCreditLimit', If_Short: false, Condition: '' },
    { Key: 'AvailableCreditLimit', ShortKey: 'AvailableCreditLimit', Name: 'AvailableCreditLimit', If_Short: false, Condition: '' },
    { Key: 'UserAssigned', ShortKey: 'UserAssigned', Name: 'User Assigned', If_Short: false, Condition: '' },
    { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date', If_Short: false, Condition: '' },
  ];
  modalReference: BsModalRef;
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  UserInfo: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  BusinessList: Business[] = [];
  FilterBusiness: Observable<Business[]>;
  LastSelectedBusiness = null;
  BranchList: Branch[] = [];
  FilterBranch: Observable<Branch[]>;
  LastSelectedBranch = null;
  constructor(
    private OwnerRegister: OwnerRegisterService,
    private TemporaryRequest: TemporaryRequestService,
    private renderer: Renderer2,
    public ModalService: BsModalService,
    private DataPassingService: CategoryDataPassingService,
    private LoginService: LoginManageService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Buyer') {
            this.TemporaryRequest.Buyer_BusinessList({ Customer: this.UserInfo.User, Category: 'Buyer' }).subscribe(response => {
              this.BusinessList = response.Response;
            });
          } else if (this.CustomerCategory === 'Seller') {
            this.Service_Loader();
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );
  }


  ngOnInit(): void {
    this.TempForm = new FormGroup({
      Business: new FormControl(''),
      // Branch: new FormControl('')
    });
  }


  BusinessChanges(Event) {
    if (this.TempForm.controls.Business.status === 'VALID') {
      this.TemporaryRequest.BuyerBusiness_List({ Customer: this.UserInfo.User, Category: this.CustomerCategory, Business: Event }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BranchList = response.Response;
        }
      });
      this.Service_Loader();
    }
  }


  BusinessDisplayName(Business: any) {
    return (Business && Business !== null && Business !== '') ? Business.BusinessName : null;
  }


  BranchDisplayName(Branch: any) {
    return (Branch && Branch !== null && Branch !== '') ? Branch.BranchName : null;
  }


  TempCreditUpdate(Index: any) {
    const initialState = {
      Type: 'SellerUpdate',
      TemporaryDetails: this.TemporaryDetails[Index]
    };
    this.modalReference = this.ModalService.show(ModalTemporaryCreditComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Service_Loader();
      }
    });
  }



  Service_Loader() {
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });
    // let Data = {};
    if (this.CustomerCategory === 'Seller') {
      const Data = {
        Skip_Count: this.SkipCount,
        Limit_Count: this.LimitCount,
        ShortKey: ShortOrderKey,
        ShortCondition: ShortOrderCondition,
        FilterQuery: [],
        CustomerId: this.UserInfo.User,
        CustomerCategory: this.CustomerCategory
      };
      this.TableLoader();
      this.TemporaryRequest.TemporaryRequestList(Data).subscribe(response => {
        this.PageLoader = false;
        this.SerialNoAddOn = this.SkipCount;
        if (response.Status && response.Status === true) {
          this.TemporaryDetails = response.Response;
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
          this.TemporaryDetails = [];
        }
      });
    }

    if (this.CustomerCategory === 'Buyer') {
      const BuyData = {
        Skip_Count: this.SkipCount,
        Limit_Count: this.LimitCount,
        ShortKey: ShortOrderKey,
        ShortCondition: ShortOrderCondition,
        FilterQuery: [],
        Buyer: this.UserInfo.User,
        BuyerBusiness: this.TempForm.controls.Business.value,
        // Branch: this.TempForm.controls.Branch.value,
        CustomerCategory: this.CustomerCategory
      };

      this.TableLoader();
      this.TemporaryRequest.Buyer_TemporaryRequest_List(BuyData).subscribe(response => {
        this.PageLoader = false;
        this.SerialNoAddOn = this.SkipCount;
        if (response.Status && response.Status === true) {
          this.TemporaryDetails = response.Response;
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
          this.TemporaryDetails = [];
        }
      });
    }
  }

  BranchChanges(Event) {
    if (this.TempForm.controls.Branch.status === 'VALID') {
      this.Service_Loader();
    }
  }

  CreateUser() {
    const initialState = { Type: 'Create' };
    this.modalReference = this.ModalService.show(BusinessAndBranchesComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
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

  Short_Change(index: any) {
    if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
    } else if (this.THeaders[index].If_Short !== undefined &&
      this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Descending';
      this.Pagination_Action(1);
    } else if (this.THeaders[index].If_Short !== undefined
      && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
    } else {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.Pagination_Action(1);
    }
  }


  CustomValidation(Condition: any): ValidatorFn {
    if (Condition === 'AlphaNumeric') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphaNumeric.test(control.value)) {
          return { AlphaNumericError: true };
        }
        return null;
      };
    }
    if (Condition === 'AlphaNumericSpaceHyphen') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphaNumericSpaceHyphen.test(control.value)) {
          return { AlphaNumericSpaceHyphenError: true };
        }
        return null;
      };
    }
    if (Condition === 'Alphabets') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.Alphabets.test(control.value)) {
          return { AlphabetsError: true };
        }
        return null;
      };
    }
    if (Condition === 'AlphabetsSpaceHyphen') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphen.test(control.value)) {
          return { AlphabetsSpaceHyphenError: true };
        }
        return null;
      };
    }
    if (Condition === 'AlphabetsSpaceHyphenDot') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.AlphabetsSpaceHyphenDot.test(control.value)) {
          return { AlphabetsSpaceHyphenDotError: true };
        }
        return null;
      };
    }
    if (Condition === 'Numerics') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.Numerics.test(control.value)) {
          return { NumericsError: true };
        }
        return null;
      };
    }
    if (Condition === 'NumericDecimal') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.NumericDecimal.test(control.value)) {
          return { NumericDecimalError: true };
        }
        return null;
      };
    }
    if (Condition === 'MobileNumeric') {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== '' && control.value !== null && !this.MobileNumeric.test(control.value)) {
          return { MobileNumericError: true };
        }
        return null;
      };
    }
  }



}
