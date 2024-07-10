import { ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BusinessAndBranchesComponent } from '../../components/Modals/business-and-branches/business-and-branches.component';
import { BusinessManagementService } from '../../services/business-management/business-management.service';
import { OwnerRegisterService } from '../../services/registration/owner-register.service';
import { ModalBranchManagementComponent } from '../../components/Modals/modal-branch-management/modal-branch-management.component';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { ModalCurrentMonthReportComponent } from '../Modals/modal-current-month-report/modal-current-month-report.component';
import { ModalSellerCurrentMonthReportsComponent } from '../Modals/modal-seller-current-month-reports/modal-seller-current-month-reports.component';
import { ModalBusinessDeleteComponent } from '../Modals/modal-business-delete/modal-business-delete.component';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';

interface LabelNumbers {
  value: string;
  viewValue: string;
}
export interface Branch { _id: string; BranchName: string; }
export interface Industry { _id: string; Industry_Name: string; }
@Component({
  selector: 'app-business-management',
  templateUrl: './business-management.component.html',
  styleUrls: ['./business-management.component.scss']
})
export class BusinessManagementComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('TableHeaderSection', { static: false }) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', { static: false }) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', { static: false }) TableLoaderSection: ElementRef;
  @ViewChild('templateOne', { static: false }) elementView: ElementRef;

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
  LimitCount = 6;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  FilterFGroup: FormGroup;
  FilterFGroupStatus = false;
  BusinessDetails: any[] = [];
  length: boolean;
  THeaders: any[] = [
    { Key: 'FirstName', ShortKey: 'FirstName', Name: 'First Name', If_Short: false, Condition: '' },
    { Key: 'LastName', ShortKey: 'LastName', Name: 'Last Name', If_Short: false, Condition: '' },
    // { Key: 'PrimaryBranches', ShortKey: 'PrimaryBranches', Name: 'PrimaryBranch', If_Short: false, Condition: '' },
    { Key: 'Industries', ShortKey: 'Industries', Name: 'Industry', If_Short: false, Condition: '' },
    { Key: 'BusinessCreditLimit', ShortKey: 'BusinessCreditLimit', Name: 'BusinessCreditLimit', If_Short: false, Condition: '' },
    { Key: 'AvailableCreditLimit', ShortKey: 'AvailableCreditLimit', Name: 'AvailableCreditLimit', If_Short: false, Condition: '' },
    { Key: 'UserAssigned', ShortKey: 'UserAssigned', Name: 'User Assigned', If_Short: false, Condition: '' },
    { Key: 'createdAt', ShortKey: 'createdAt', Name: 'Created Date', If_Short: false, Condition: '' },
  ];

  FiltersArray: any[] = [
    { Active: false, Key: 'FirstName', Value: '', DisplayName: 'First Name', DBName: 'FirstName', Type: 'String', Option: '' },
    { Active: false, Key: 'LastName', Value: '', DisplayName: 'Last Name', DBName: 'LastName', Type: 'String', Option: '' },
    // { Active: false, Key: 'PrimaryBranch', Value: '', DisplayName: 'PrimaryBranch', DBName: 'PrimaryBranch', Type: 'Object', Option: '' },
    { Active: false, Key: 'Industry', Value: '', DisplayName: 'Industry', DBName: 'Industry', Type: 'Object', Option: '' },
    { Active: false, Key: 'BusinessCreditLimit', Value: '', DisplayName: 'BusinessCreditLimit', DBName: 'BusinessCreditLimit', Type: 'String', Option: '' }
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
  FilterPrimaryBranch: Observable<Branch[]>;
  FilterIndustry: Observable<Industry[]>;
  LastSelectedIndustry = null;
  LastSelectedPrimary = null;
  BusinessList: Branch[] = [];
  IndustryList: Industry[] = [];
  UserInfo: any;
  AllCategory: any[] = [];
  CustomerCategory: any;
  constructor(
    private OwnerRegister: OwnerRegisterService,
    private BusinessService: BusinessManagementService,
    private renderer: Renderer2,
    private router: Router,
    public ModalService: BsModalService,
    private Toastr: ToastrService,
    private DataPassingService: CategoryDataPassingService,
    private LoginService: LoginManageService,
    private loadingService: LoadingService
  ) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.Service_Loader();
    this.BusinessService.IndustrySimpleList({ Owner: this.UserInfo.User }).subscribe(response => {
      this.IndustryList = response.Response;
      setTimeout(() => {
        this.FilterFGroup.controls.Industry.updateValueAndValidity();
      }, 100);
    });




    // this.BusinessService.PrimaryBranchSimpleList({ Owner: this.UserInfo.User }).subscribe(response => {
    //   this.BusinessList = response.Response;
    //   setTimeout(() => {
    //     // this.FilterFGroup.controls.PrimaryBranch.updateValueAndValidity();
    //   }, 100);
    // });

    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Buyer') {
            this.Service_Loader();
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
    this.FilterFGroup = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      // PrimaryBranch: new FormControl('', Validators.required),
      Industry: new FormControl('', Validators.required),
      BusinessCreditLimit: new FormControl('', Validators.required),
    });
    const FilterControls = this.FilterFGroup.controls;
    Object.keys(FilterControls).map(obj => {
      this.FilterFGroup.controls[obj].valueChanges.subscribe(value => {
        this.FilterFormChanges();
      });
    });

    this.FilterIndustry = this.FilterFGroup.controls.Industry.valueChanges.pipe(
      startWith(''), map(value => {
        if (value && value !== null && value !== '') {
          if (typeof value === 'object') {
            if (this.LastSelectedIndustry === null || this.LastSelectedIndustry !== value._id) {
              this.LastSelectedIndustry = value._id;
            }
            value = value.Industry_Name;
          }
          return this.IndustryList.filter(option => option.Industry_Name.toLowerCase().includes(value.toLowerCase()));
        } else {
          this.LastSelectedIndustry = null;
          return this.IndustryList;
        }
      })
    );

    // this.FilterPrimaryBranch = this.FilterFGroup.controls.PrimaryBranch.valueChanges.pipe(
    //   startWith(''), map(value => {
    //     if (value && value !== null && value !== '') {
    //       if (typeof value === 'object') {
    //         if (this.LastSelectedPrimary === null || this.LastSelectedPrimary !== value._id) {
    //           this.LastSelectedPrimary = value._id;
    //         }
    //         value = value.BranchName;
    //       }
    //       return this.BusinessList.filter(option => option.BranchName.toLowerCase().includes(value.toLowerCase()));
    //     } else {
    //       this.LastSelectedPrimary = null;
    //       return this.BusinessList;
    //     }
    //   })
    // );
  }

  // tslint:disable-next-line:no-shadowed-variable
  PrimaryDisplayName(Branch: any) {
    return (Branch && Branch !== null && Branch !== '') ? Branch.BranchName : null;
  }

  IndustryDisplayName(Industry: any) {
    return (Industry && Industry !== null && Industry !== '') ? Industry.Industry_Name : null;
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

    // Simulate an asynchronous operation
    setTimeout(() => {
      let ShortOrderKey = '';
      let ShortOrderCondition = '';
      this.THeaders.map(obj => {
        if (obj.If_Short === true) {
          ShortOrderKey = obj.ShortKey;
          ShortOrderCondition = obj.Condition;
        }
      });

      const Filters = this.FiltersArray.filter(obj => obj.Active === true);
      const Data = {
        Skip_Count: this.SkipCount,
        Limit_Count: this.LimitCount,
        ShortKey: ShortOrderKey,
        ShortCondition: ShortOrderCondition,
        FilterQuery: Filters,
        CustomerId: this.UserInfo.User,
        CustomerCategory: this.CustomerCategory
      };

      this.TableLoader();

      if (this.CustomerCategory === 'Seller') {
        this.BusinessService.Business_List(Data).subscribe(response => {
          // After the asynchronous operation completes, hide the loader
          this.loadingService.hide();
          this.PageLoader = false;
          this.SerialNoAddOn = this.SkipCount;

          if (response.Status && response.Status === true) {
            this.BusinessDetails = response.Response;

            setTimeout(() => {
              if (this.TableLoaderSection != undefined) {
                this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
              }
            }, 10);

            this.TotalRows = response.SubResponse;

            if (this.BusinessDetails != undefined) {
              this.BusinessDetails.map((obj, index) => {
                this.BusinessService.BusinessDeletebtn({
                  Customer: this.UserInfo.User,
                  CustomerCategory: 'Seller',
                  BusinessId: obj._id
                }).subscribe(response => {

                  this.BusinessDetails[index].deleteStatus = response.Status;

                });
              });
            }

            this.Pagination_Affect();
          } else {
            this.BusinessDetails = [];
          }
        });
      } else if (this.CustomerCategory === 'Buyer') {
        this.BusinessService.Business_List(Data).subscribe(response => {
          // After the asynchronous operation completes, hide the loader
          this.loadingService.hide();
          this.PageLoader = false;
          this.SerialNoAddOn = this.SkipCount;

          if (response.Status && response.Status === true) {
            this.BusinessDetails = response.Response;

            setTimeout(() => {
              if (this.TableLoaderSection != undefined) {
                this.renderer.selectRootElement(this.TableLoaderSection.nativeElement);
              }
            }, 10);

            this.TotalRows = response.SubResponse;

            if (this.BusinessDetails != undefined) {
              this.BusinessDetails.map((obj, index) => {
                this.BusinessService.BusinessDeletebtn({
                  Customer: this.UserInfo.User,
                  CustomerCategory: 'Buyer',
                  BusinessId: obj._id
                }).subscribe(response => {
                  this.BusinessDetails[index].deleteStatus = response.Status;
                });
              });
            }

            this.Pagination_Affect();
          } else {
            this.BusinessDetails = [];
          }
        });
      }
    }, 2000);
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

  EditBusiness(index: any) {
    const initialState = {
      Type: 'BusinessEdit',
      BusinessInfo: this.BusinessDetails[index]
    };
    this.modalReference = this.ModalService.show(BusinessAndBranchesComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Service_Loader();
      }
    });
  }


  BusinessNavigate(index: any) {
    const initialState = {
      BusinessInfo: this.BusinessDetails[index]
    };
    this.router.navigate(['seller-and-buyer']);
  }


  CurrentMonthReports(index: any) {
    if (this.CustomerCategory === 'Seller') {
      const initialState = {
        Type: 'SellerMonthlyReports',
        BusinessInfo: this.BusinessDetails[index]
      };
      this.modalReference = this.ModalService.show(ModalSellerCurrentMonthReportsComponent,
        Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
        if (response.Status) {
        }
      });
    } else if (this.CustomerCategory === 'Buyer') {
      const initialState = {
        Type: 'BuyerMonthlyReports',
        BusinessInfo: this.BusinessDetails[index]
      };
      this.modalReference = this.ModalService.show(ModalCurrentMonthReportComponent,
        Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
      this.modalReference.content.onClose.subscribe(response => {
        if (response.Status) {
        }
      });
    }

  }

  BranchTable(Index: any) {
    const initialState = {
      Type: 'BranchTable',
      BusinessInfo: this.BusinessDetails[Index]
    };

    this.modalReference = this.ModalService.show(ModalBranchManagementComponent,

      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));

    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.BusinessDetails[Index] = response.Response;

      }
    });
  }


  BusinessDelete(index: any) {
    // Define the type of initialState to match Partial<ModalBusinessDeleteComponent>
    const initialState = {
      Type: 'BusinessDelete',
      BusinessInfo: this.BusinessDetails[index]
    } as Partial<ModalBusinessDeleteComponent>;

    // Show the modal dialog with the specified initialState
    this.modalReference = this.ModalService.show(
      ModalBusinessDeleteComponent,
      {
        initialState,
        ignoreBackdropClick: true,
        class: 'modal-md modal-dialog-centered animated zoomIn'
      }
    );

    // Subscribe to the onClose event of the modal dialog content
    this.modalReference.content.onClose.subscribe((response: any) => {
      // Handle the response based on the application logic
      if (this.CustomerCategory === 'Seller' && response.Status) {
        const BusinessInfo = this.BusinessDetails[index]._id;
        this.BusinessService.SellerWholeBusinessDelete({ Customer: this.UserInfo.User, CustomerCategory: 'Seller', BusinessId: BusinessInfo }).subscribe(newResponse => {
          if (newResponse.Status) {
            // Access the nativeElement property of elementView
            this.modalReference = this.ModalService.show(this.elementView.nativeElement, { ignoreBackdropClick: false, class: 'modal-dialog-centered animated zoomIn modal-small-with' });
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: newResponse.Message });
            this.modalReference.hide();
          } else {
            this.Pagination_Action(1);
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: newResponse.Message });
          }
        });
      } else if (this.CustomerCategory === 'Buyer' && response.Status) {
        const BusinessInfo = this.BusinessDetails[index]._id;
        this.BusinessService.SellerWholeBusinessDelete({ Customer: this.UserInfo.User, CustomerCategory: 'Buyer', BusinessId: BusinessInfo }).subscribe(newResponse => {
          if (newResponse.Status) {
            // Access the nativeElement property of elementView
            this.modalReference = this.ModalService.show(this.elementView.nativeElement, { ignoreBackdropClick: false, class: 'modal-dialog-centered animated zoomIn modal-small-with' });
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: newResponse.Message });
            this.modalReference.hide();
          } else {
            this.Pagination_Action(1);
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: newResponse.Message });
          }
        });
      }
    });
  }




  AddBranch(index: any) {
    const initialState = {
      Type: 'AddBranch',
      BusinessInfo: this.BusinessDetails[index]
    };
    this.modalReference = this.ModalService.show(BusinessAndBranchesComponent, Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        this.Pagination_Action(1);
      }
    });
  }

}
