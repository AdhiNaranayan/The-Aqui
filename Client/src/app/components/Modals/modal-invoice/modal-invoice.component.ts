import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Observable, Subject, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { InvoiceDataPassingService } from 'src/app/services/common-services/invoice-data-passing.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { InvoiceManagementService } from 'src/app/services/invoice-management/invoice-management.service';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { InviteManagementService } from 'src/app/services/invite-management/invite-management.service';
import { DatePipe } from '@angular/common';
import { ModalSellerIncreaseCreditLimitComponent } from '../modal-seller-increase-credit-limit/modal-seller-increase-credit-limit.component';

export class MyDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: any): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

export interface Business { _id: string; BusinessName: string; }
export interface Branch { _id: string; BranchName: string; }
export interface BuyerBusiness { _id: string; BusinessName: string; }
export interface BuyerBranch { _id: string; BranchName: string; AvailableCreditLimit: number; }
export interface Buyer { _id: string; ContactName: string; }

const DevURL = 'http://localhost:3002/APP_API/Invoice/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/Invoice/';
const TempURL = 'http://hundi.pptssolutions.com/APP_API/Invoice/';
@Component({
  selector: 'app-modal-invoice',
  templateUrl: './modal-invoice.component.html',
  styleUrls: ['./modal-invoice.component.scss'],
  providers: [DatePipe, { provide: DateAdapter, useClass: MyDateAdapter }],
})
export class ModalInvoiceComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('fileInput') fileInput: ElementRef;
  InvoiceForm: FormGroup;
  Type: string;


  forms: FormGroup[] = [];

  modalReference: BsModalRef;
  onClose: Subject<any>;
  Uploading = false;
  UserInfo: any;
  BusinessList: Business[] = [];
  BuyerBusinessList: BuyerBusiness[] = [];
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  InvoiceDetails: any;
  FilterBusiness: Observable<Business[]>;
  UpdateAmountList: any;
  LastSelectedBusiness = null;
  FilterBuyerBusiness: Observable<BuyerBusiness[]>;
  LastSelectedBuyerBusiness = null;
  FilterBranch: Observable<Branch[]>;
  BranchList: Branch[] = [];
  FilterBuyerBranch: Observable<Branch[]>;
  BuyerBranchList: BuyerBranch[] = [];
  LastSelectedBranch = null;
  LastSelectedBuyerBranch = null;
  AllBusiness: any[] = [];
  AllBranch: any[] = [];
  BuyerDetails: Buyer[] = [];
  FilterBuyer: Observable<Buyer[]>;
  LastSelectedBuyer = null;
  AllCategory: any[] = [];
  CustomerCategory: any;
  AvailCredAmount: number;
  AvailCredBusnsAmount: number;
  BuyerBusinessListDetailed: any;
  inputValue: number;
  SellerBusinessList: any;
  ShowInvoiceFiles = false;
  InvoicePreviewAvailable = false;
  InvoicePreview: any;
  InvoiceDetailsDisabled = false;
  screenHeight: any;
  screenWidth: any;

  previews: string[][] = []; // Array to store image previews for each form



  PaymentPreviewAvailable = false;
  ReadonlyPage = false;
  PaymentPreview: any;
  InvoicePath: any;
  fileName: FormArray;
  FileImages: any;
  BuyerBranchCredit: any;
  constructor(public ModalService: BsModalService,
    public InvoiceManagement: InvoiceManagementService,
    public InviteManagement: InviteManagementService,
    private DataPassingService: InvoiceDataPassingService,
    public modalRef: BsModalRef,
    private datepipe: DatePipe,
    private Toastr: ToastrService,
    private formBuilder: FormBuilder,
    public LoginService: LoginManageService,
    public BusinessManage: BusinessManagementService,
    private CategoryPassingService: CategoryDataPassingService,
    public modalRefView: BsModalRef) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());

    this.subscription.add(
      this.DataPassingService.AllBusiness.subscribe(response => {
        this.AllBusiness = response;
      })
    );

    this.subscription.add(
      this.DataPassingService.AllBranch.subscribe(response => {
        this.AllBranch = response;
      })
    );

    this.subscription.add(
      this.CategoryPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Seller') {
            this.BusinessManage.MyBusinessList({ Customer: this.UserInfo.User, CustomerCategory: this.CustomerCategory }).subscribe(response => {
              this.BusinessList = response.Response;
              // console.log(this.UserInfo, 'UserInfoUserInfoUserInfo');

            });
          } else if (this.CustomerCategory === 'Buyer') {
            this.BusinessManage.MyBusinessList({ Customer: this.UserInfo.User, CustomerCategory: this.CustomerCategory }).subscribe(response => {
              this.BusinessList = response.Response;
            });
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );
    this.getScreenSize();

  }

  ngOnInit(): void {
    // console.log(this.InvoiceDetails, 'InvoiceDetails');

    // Create one form initially
    this.addForm();
    this.onClose = new Subject();
    if (this.Type === 'Create') {
      // this.BranchList = [this.AllBranch[0]];
      this.InvoiceForm = new FormGroup({
        Seller: new FormControl(this.UserInfo.User),
        Business: new FormControl({ value: this.AllBusiness[0]?._id, disabled: true }, Validators.required),
        // Branch: new FormControl({ value: this.AllBranch[0]?._id, disabled: true }, Validators.required),
        Buyer: new FormControl('', Validators.required),
        BuyerBusiness: new FormControl('', Validators.required),
        // BuyerBranch: new FormControl('', Validators.required),
        InvoiceNumber: new FormControl('', Validators.required),
        InvoiceDate: new FormControl('', Validators.required),
        InvoiceAmount: new FormControl('', Validators.required),
        InvoiceDescription: new FormControl('', Validators.required),
        InvoiceAttachments: new FormArray([]),
        CurrentCreditAmount: new FormControl('0'),
        TemporaryCreditAmount: new FormControl('0'),
      });

      this.InviteManagement.SellerAgainstBuyerList({
        Seller: this.UserInfo.User,
        Business: this.InvoiceForm.getRawValue().Business,
        // Branch: this.InvoiceForm.getRawValue().Branch,
        CustomerCategory: this.CustomerCategory
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BuyerDetails = response.Response;

        }
      });

    } else if (this.Type === 'Update') {
      // this.BranchList = [this.AllBranch[0]];
      this.BuyerDetails = [this.InvoiceDetails?.buyer];

      this.BuyerBusinessList = [this.InvoiceDetails?.BuyerBusiness];
      // this.BuyerBranchList = [this.InvoiceDetails?.BuyerBranchInfo];
      this.InvoiceForm = new FormGroup({
        Seller: new FormControl(this.UserInfo.User),
        Business: new FormControl({ value: this.AllBusiness[0]?._id, disabled: true }, Validators.required),
        // Branch: new FormControl({ value: this.AllBranch[0]?._id, disabled: true }, Validators.required),
        Buyer: new FormControl({ value: this.InvoiceDetails?.buyer?._id, disabled: true }, Validators.required),
        BuyerBusiness: new FormControl({ value: this.InvoiceDetails.BuyerBusiness?._id, disabled: true }, Validators.required),
        // BuyerBranch: new FormControl({ value: this.InvoiceDetails.BuyerBranchInfo?._id, disabled: true }, Validators.required),
        InvoiceNumber: new FormControl(this.InvoiceDetails.InvoiceNumber, Validators.required),
        InvoiceDate: new FormControl(this.InvoiceDetails.InvoiceDate, Validators.required),
        InvoiceAmount: new FormControl(this.InvoiceDetails.InvoiceAmount, Validators.required),
        InvoiceDescription: new FormControl(this.InvoiceDetails.InvoiceDescription, Validators.required),
        InvoiceAttachments: new FormArray([]),
        Invoice: new FormControl(this.InvoiceDetails._id),
        InvoiceStatus: new FormControl(this.InvoiceDetails.InvoiceStatus),
        CurrentCreditAmount: new FormControl(this.InvoiceDetails.CurrentCreditAmount),
        TemporaryCreditAmount: new FormControl('this.InvoiceDetails.TemporaryCreditAmount'),
      });
      if (this.InvoiceDetails.InvoiceAttachments.length > 0) {
        this.InvoiceDetails.InvoiceAttachments.map(obj => {
          this.getBase64ImageFromUrl(DevURL + obj.fileName, obj.fileName, function (dataUrl) { });
        });
      }
    }
  }



  addForm(): void {
    // Create a new form group and push it into the forms array
    const form = this.formBuilder.group({
      Business: ['', Validators.required],
      Buyer: ['', Validators.required],
      BuyerBusiness: ['', Validators.required],
      InvoiceNumber: ['', Validators.required],
      InvoiceDate: ['', Validators.required],
      InvoiceAmount: ['', Validators.required],
      InvoiceDescription: ['', Validators.required],
      InvoiceAttachments: new FormArray([]),
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      file: [[]] // File input field (as an array to store multiple files)
    });
    this.forms.push(form);
    this.previews.push([]); // Initialize an empty array for image previews for this form
  }


  removeForm(index: number): void {
    // Remove the form at the specified index
    this.forms.splice(index, 1);
    this.previews.splice(index, 1); // Remove the corresponding preview URL
  }

  onFileSelected(event: any, index: number): void {
    const files = event.target.files;
    if (files) {
      if (!this.previews[index]) {
        this.previews[index] = []; // Ensure previews array is initialized for this form
      }

      // Iterate over each selected file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          // Read the image and set it as a data URL for preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previews[index].push(e.target.result); // Store preview URL in the array
          };
          reader.readAsDataURL(file);
        }
      }

      // Append the selected files to the existing list
      const existingFiles = this.forms[index].get('file').value || [];
      this.forms[index].get('file').setValue([...existingFiles, ...files]);
    }
  }


  submitAllForms(): void {
    // You can loop through forms array and handle submission for each form
    // For example:
    this.forms.forEach(form => {
      if (form.valid) {
        // Handle submission for valid form
        console.log(form.value);
      }
    });
  }

  getBase64ImageFromUrl(url, filename, callback) {
    const xhr = new XMLHttpRequest();
    const FArray = this.InvoiceForm.get('InvoiceAttachments') as FormArray;
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
      reader.onload = (events) => {
        const NewFGroup = new FormGroup({
          fileName: new FormControl(filename),
          InvoicePreviewAvailable: new FormControl(true),
          ShowInvoiceFiles: new FormControl(false),
          InvoicePreview: new FormControl(events.target['result']),
        });

        FArray.push(NewFGroup);
        callback(reader.result);
      };
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  onFileChange(event, Index: any) {
    if (event.target.files && event.target.files.length > 0) {
      const FArray = this.InvoiceForm.get('InvoiceAttachments') as FormArray;
      const FGroup = FArray.controls[Index] as FormGroup;
      FGroup.controls.InvoicePreviewAvailable.setValue(true);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (events) => {
        FGroup.controls.InvoicePreview.setValue(events.target['result']);
      };
    } else {
      const FArray = this.InvoiceForm.get('InvoiceAttachments') as FormArray;
      const FGroup = FArray.controls[Index] as FormGroup;
      FGroup.controls.fileName.setValue('');
      FGroup.controls.InvoicePreviewAvailable.setValue(false);
      FGroup.controls.InvoicePreview.setValue(null);
      this.fileInput.nativeElement.value = null;
    }
  }

  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 30;
    this.screenWidth = window.innerWidth - 10;
  }


  BusinessChanges(Event) {
    if (this.InvoiceForm.controls.Business.status === 'VALID') {
      this.BusinessManage.MyBusinessList({ Customer: this.UserInfo.User, CustomerCategory: 'Seller', Business: Event }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BranchList = response.Response;

        }
      });
    }
  }

  BuyerBranchChanges(Event) {
    if (this.InvoiceForm.controls.BuyerBranch.status === 'VALID') {
      const BuyerBranchArray = this.BuyerBranchList.filter(obj1 => obj1._id === Event);
      if (BuyerBranchArray.length > 0) {
        this.BuyerBranchCredit = BuyerBranchArray[0];
        this.InvoiceForm.controls.CurrentCreditAmount.setValue(this.BuyerBranchCredit?.CurrentCreditAmount);
        this.InvoiceForm.controls.TemporaryCreditAmount.setValue(this.BuyerBranchCredit?.TemporaryCreditAmount);
      } else {
        this.InvoiceForm.controls.CurrentCreditAmount.setValue(0);
        this.InvoiceForm.controls.TemporaryCreditAmount.setValue(0);
      }
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.InvoiceForm.get(KeyName) as FormControl;
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



  GetFormArray(ControlName: any): any[] {
    const FArray = this.InvoiceForm.get(ControlName) as FormArray;
    return FArray.controls;
  }

  RemoveInvoice(Index: any) {
    this.fileName = this.InvoiceForm.get('InvoiceAttachments') as FormArray;
    this.fileName.removeAt(Index);
  }

  AddInvoice(): void {
    this.fileName = this.InvoiceForm.get('InvoiceAttachments') as FormArray;
    this.fileName.push(this.createInvoice());
  }

  createInvoice(): FormGroup {
    return new FormGroup({
      fileName: new FormControl(''),
      InvoicePreviewAvailable: new FormControl(false),
      ShowInvoiceFiles: new FormControl(false),
      InvoicePreview: new FormControl(''),
    });
  }

  NotAllow(): boolean { return false; }
  ClearInput(event: KeyboardEvent): boolean {
    const Events = event.composedPath() as EventTarget[];
    const Input = Events[0] as HTMLInputElement;
    const FControl = Input.attributes as NamedNodeMap;
    const FControlName = FControl.getNamedItem('formcontrolname').textContent;
    this.InvoiceForm.controls[FControlName].setValue(null);
    return false;
  }

  BranchChanges(Event) {
    if (this.InvoiceForm.controls.Branch.status === 'VALID') {
      this.InviteManagement.SellerAgainstBuyerList({
        Seller: this.UserInfo.User,
        Business: this.InvoiceForm.value.Business,
        // Branch: Event,
        CustomerCategory: this.CustomerCategory
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BuyerDetails = response.Response;
        }
      });
    }
  }


  BuyerChanges(Event) {
    if (this.InvoiceForm.controls.Buyer.status === 'VALID') {
      this.InviteManagement.BuyerBranchesOfBusiness_List({
        Buyer: Event,
        Business: this.InvoiceForm.getRawValue().Business,
        // Branch: this.InvoiceForm.getRawValue().Branch,
        CustomerType: this.UserInfo.CustomerType
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BuyerBusinessList = response.Response;

        }
      });
    }
  }

  BuyerBusinessChanges(Event) {
    if (this.InvoiceForm.controls.BuyerBusiness.status === 'VALID') {
      this.InviteManagement.BuyerBranchesOfBusiness_List({
        Buyer: this.InvoiceForm.value.Buyer,
        Business: this.InvoiceForm.getRawValue().Business,
        CustomerType: this.UserInfo.CustomerType,
        BuyerBusiness: Event
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BuyerBranchList = response.Response;
          this.BuyerBranchList.forEach(obj => {
            this.AvailCredBusnsAmount = obj.AvailableCreditLimit;

            // Use type assertion (obj as any) to access AvailableCreditLimit
          });
        }
      });
    }
  }

  EdittrackInvoiceAmount(event: any) {
    this.inputValue = event.target.value;
    const InvoiceAmountControl = this.InvoiceForm.get('InvoiceAmount');
    const InvAmount = Number(this.inputValue);

    if (InvAmount < 0) {
      // If the value is negative, set it to 0
      InvoiceAmountControl.setValue(0);
    }
    if (this.inputValue > this.InvoiceDetails.BuyerBusiness.AvailableCreditLimit) {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Buyer Available Credit Amount is less than the Invoice Amount !' });

      this.InviteManagement.BuyerBranchesOfBusiness_List({
        Buyer: this.InvoiceDetails.buyer._id,
        Business: this.InvoiceDetails.Business._id,
        CustomerType: this.UserInfo.CustomerType,
        BuyerBusiness: this.InvoiceDetails.BuyerBusiness._id
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BuyerBranchList = response.Response;
          this.BuyerBranchList.forEach(obj => {
            this.UpdateAmountList = obj;
            this.AvailCredBusnsAmount = obj.AvailableCreditLimit;
          });
          this.BusinessList.map(oBj => {
            if (oBj._id === this.InvoiceForm.getRawValue().Business) {
              this.SellerBusinessList = oBj;
            }
          });

          // Pass obj to the modal component
          const initialState = {
            Type: 'BranchTable',
            UpdateAmountList: this.UpdateAmountList,  // Assuming you want to pass the entire list
            SellerBusinessList: this.SellerBusinessList
          };

          this.modalReference = this.ModalService.show(ModalSellerIncreaseCreditLimitComponent,
            Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));

          this.modalReference.content.onClose.subscribe(response => {
            // Handle modal close if needed
          });
        }
      });
    }
  }

  trackInvoiceAmount(event: any) {
    this.inputValue = event.target.value;
    const InvoiceAmountControl = this.InvoiceForm.get('InvoiceAmount');
    const InvAmount = Number(this.inputValue);

    if (InvAmount < 0) {
      // If the value is negative, set it to 0
      InvoiceAmountControl.setValue(0);
    }
    if (this.inputValue > this.AvailCredBusnsAmount) {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Buyer Available Credit Amount is less than the Invoice Amount !' });

      this.InviteManagement.BuyerBranchesOfBusiness_List({
        Buyer: this.InvoiceForm.value.Buyer,
        Business: this.InvoiceForm.getRawValue().Business,
        CustomerType: this.UserInfo.CustomerType,
        BuyerBusiness: Event
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BuyerBranchList = response.Response;
          this.BuyerBranchList.forEach(obj => {
            this.UpdateAmountList = obj;
            this.AvailCredBusnsAmount = obj.AvailableCreditLimit;
          });
          this.BusinessList.map(oBj => {
            if (oBj._id === this.InvoiceForm.getRawValue().Business) {
              this.SellerBusinessList = oBj;
            }
          });

          // Pass obj to the modal component
          const initialState = {
            Type: 'BranchTable',
            UpdateAmountList: this.UpdateAmountList,  // Assuming you want to pass the entire list
            SellerBusinessList: this.SellerBusinessList,
            Seller: this.UserInfo.User,
            Buyer: this.InvoiceForm.value.Buyer,
          };

          this.modalReference = this.ModalService.show(ModalSellerIncreaseCreditLimitComponent,
            Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));

          this.modalReference.content.onClose.subscribe(response => {
            // Handle modal close if needed
          });
        }
      });
    }
  }


  Submit() {
    var InvAmountValue = Number(this.InvoiceForm.controls.InvoiceAmount.value);
    if (InvAmountValue > this.AvailCredBusnsAmount) {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Buyer Available Credit Amount is less than the Invoice Amount !' });
    } else {
      if (this.InvoiceForm.valid) {
        const Info = [this.InvoiceForm.getRawValue()].map((item) => {
          return {
            "Seller": item.Seller,
            "Business": item.Business,
            "Buyer": item.Buyer,
            "BuyerBusiness": item.BuyerBusiness,
            "InvoiceNumber": item.InvoiceNumber,
            "InvoiceDate": this.datepipe.transform(item.InvoiceDate, "dd-MM-yyyy"),
            "InvoiceAmount": item.InvoiceAmount,
            "InvoiceDescription": item.InvoiceDescription,
            "InvoiceAttachments": item.InvoiceAttachments,
            "CurrentCreditAmount": item.CurrentCreditAmount,
            "TemporaryCreditAmount": item.TemporaryCreditAmount
          }
        });

        this.InvoiceManagement.InvoiceCreate(Info).subscribe(response => {
          this.Uploading = false;
          if (response.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invoice Successfully Created' });
            this.onClose.next({ Status: true, Response: response.Response });
            this.modalRef.hide();
          } else {
            if (response.Message === undefined || response.Message === '' || response.Message === null) {
              response.Message = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          }
        });
      } else {
        Object.keys(this.InvoiceForm.controls).map(obj => {
          const FControl = this.InvoiceForm.controls[obj] as FormControl;
          if (FControl.invalid) {
            FControl.markAsTouched();
            FControl.markAsDirty();
          }
        });
      }
    }
  }


  Update() {
    var InvAmountValue = Number(this.InvoiceForm.controls.InvoiceAmount.value);
    var EditAvailAmount = this.InvoiceDetails.BuyerBusiness.AvailableCreditLimit;

    if (InvAmountValue > EditAvailAmount) {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Buyer Available Credit Amount is less than the Invoice Amount !' });
    } else {
      if (this.InvoiceForm.valid) {
        const Info = this.InvoiceForm.getRawValue();
        Info.InvoiceDate = this.datepipe.transform(Info.InvoiceDate, "dd-MM-yyyy");
        this.InvoiceManagement.InvoiceDetailsUpdate(Info).subscribe(response => {
          this.Uploading = false;
          if (response.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Invoice Successfully Updated' });
            this.onClose.next({ Status: true, Response: response.Response });
            this.modalRef.hide();
          } else {
            if (response.Message === undefined || response.Message === '' || response.Message === null) {
              response.Message = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
          }
        });
      } else {
        Object.keys(this.InvoiceForm.controls).map(obj => {
          const FControl = this.InvoiceForm.controls[obj] as FormControl;
          if (FControl.invalid) {
            FControl.markAsTouched();
            FControl.markAsDirty();
          }
        });
      }
    }
  }

  downloadImage(fileName: string) {
    // Construct the image URL
    const imageUrl = 'http://localhost:3002/APP_API/Invoice/' + fileName;

    // Fetch the image as a blob
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        // Simulate click to trigger download
        link.click();

        // Clean up
        URL.revokeObjectURL(link.href);
      })
      .catch(error => {
        console.error('Error downloading image:', error);
      });
  }

}
