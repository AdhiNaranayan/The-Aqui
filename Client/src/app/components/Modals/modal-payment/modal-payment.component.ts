import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Observable, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { BusinessManagementService } from 'src/app/services/business-management/business-management.service';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { PaymentManagementServiceService } from 'src/app/services/payment-management/payment-management-service.service';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { InvoiceDataPassingService } from 'src/app/services/common-services/invoice-data-passing.service';
import { startWith, map } from 'rxjs/operators';
import { InviteManagementService } from 'src/app/services/invite-management/invite-management.service';
import { DatePipe } from '@angular/common';
import { InvoiceManagementService } from 'src/app/services/invoice-management/invoice-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Injectable()
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
export interface Seller { _id: string; ContactName: string; }

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const DevURL = 'http://localhost:3002/APP_API/Payment/';
const StageURL = 'http://hundi.pptssolutions.com/APP_API/Payment/';
const TempURL = 'http://hundi.pptssolutions.com/APP_API/Payment/';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss'],
  providers: [DatePipe, { provide: DateAdapter, useClass: MyDateAdapter }],
})

export class ModalPaymentComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  private subscription: Subscription = new Subscription();
  @ViewChild('fileInput') fileInput: ElementRef;
  PaymentForm: FormGroup;
  Type: string;
  modalReference: BsModalRef;
  onClose: Subject<any>;
  Uploading = false;
  PaymentAmount = 0;
  UserInfo: any;
  AlphaNumeric = new RegExp('^[A-Za-z0-9]+$');
  AlphaNumericSpaceHyphen = new RegExp('^[A-Za-z0-9 -]+$');
  Alphabets = new RegExp('^[A-Za-z]+$');
  AlphabetsSpaceHyphen = new RegExp('^[A-Za-z -]+$');
  AlphabetsSpaceHyphenDot = new RegExp('^[A-Za-z -.]+$');
  Numerics = new RegExp('^[0-9]+$');
  NumericDecimal = new RegExp('^[0-9]+([.][0-9]+)?$');
  MobileNumeric = new RegExp('^[0-9 +]+$');
  AllCategory: any[] = [];
  CustomerCategory: any;
  AllBusiness: any[] = [];
  AllBranch: any[] = [];
  inputvalue: any;
  SellerList: Seller[] = [];
  FilterSellerList: Observable<Seller[]>;
  LastSelectedSellerList = null;
  BusinessList: Business[] = [];
  FilterBusinessList: Observable<Business[]>;
  LastSelectedBusinessList = null;
  BranchList: Branch[] = [];
  FilterBranchList: Observable<Branch[]>;
  LastSelectedBranchList = null;
  BuyerAcceptList: any[] = [];
  InvoiceDetails: FormArray;
  PaymentModes: any[] = [{ Name: 'Cheque', Key: 'Cheque' },
  { Name: 'Online', Key: 'Online' },
  { Name: 'Cash', Key: 'Cash' }];
  fileName: FormArray;
  PaymentPreviewAvailable = false;
  StemiDetailsDisabled = false;
  ReadonlyPage = false;
  PaymentPreview: any;
  ShowPaymentPreview = false;
  PaymentDetails: any;
  PayToInvoiceAmountDetails: any;
  screenHeight: any;
  screenWidth: any;
  PaymentDetailsDisabled = false;
  constructor(public ModalService: BsModalService,
    public modalRef: BsModalRef,
    private Toastr: ToastrService,
    public LoginService: LoginManageService,
    private DataPassingService: InvoiceDataPassingService,
    private PaymentManage: PaymentManagementServiceService,
    private InviteManagement: InviteManagementService,
    private InvoiceManagement: InvoiceManagementService,
    public modalRefView: BsModalRef,
    private datepipe: DatePipe,
    private CategoryPassingService: CategoryDataPassingService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    this.subscription.add(
      this.DataPassingService.AllBusiness.subscribe(response => {
        this.AllBusiness = response;
      })
    );

    // this.subscription.add(
    //   this.DataPassingService.AllBranch.subscribe(response => {
    //     this.AllBranch = response;
    //   })
    // );
    this.subscription.add(
      this.CategoryPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Seller') {

          } else if (this.CustomerCategory === 'Buyer') {
            this.InviteManagement.BuyerAgainstSellerList({
              Buyer: this.UserInfo.User,
              Business: this.AllBusiness[0]?._id,
              CustomerCategory: 'Buyer'
              // Branch: this.AllBranch[0]
            }).subscribe(response => {
              this.SellerList = response.Response;
              if (this.Type === 'Create') {
                setTimeout(() => {
                  this.PaymentForm.controls.Seller.updateValueAndValidity();
                }, 100);
              }
            });
          }
        } else {

        }
      })
    );
    this.getScreenSize();


  }

  ngOnInit(): void {


    this.onClose = new Subject();
    if (this.Type === 'Create') {
      this.PaymentForm = new FormGroup({
        Buyer: new FormControl(this.UserInfo.User),
        BuyerBusiness: new FormControl(this.AllBusiness[0]._id, Validators.required),
        // BuyerBranch: new FormControl(this.AllBranch[0]._id, Validators.required),
        Seller: new FormControl('', Validators.required),
        Business: new FormControl('', Validators.required),
        // Branch: new FormControl('', Validators.required),
        InvoiceDetails: new FormArray([]),
        PaymentMode: new FormControl('', Validators.required),
        PaymentDate: new FormControl('', Validators.required),
        Remarks: new FormControl('', Validators.required),
        PaymentAttachments: new FormArray([])
      });

      this.FilterBusinessList = this.PaymentForm.controls.Business.valueChanges.pipe(
        startWith(''), map(value => {
          if (value && value !== null && value !== '') {
            if (typeof value === 'object') {
              if (this.LastSelectedBusinessList === null || this.LastSelectedBusinessList !== value._id) {
                this.LastSelectedBusinessList = value._id;
              }
              value = value.BusinessName;
            }
            return this.BusinessList.filter(option => option.BusinessName.toLowerCase().includes(value.toLowerCase()));
          } else {
            this.LastSelectedBusinessList = null;
            return this.BusinessList;
          }
        })
      );

    } else if (this.Type === 'Update') {
      this.SellerList = [this.PaymentDetails?.Seller];
      this.BusinessList = [this.PaymentDetails?.Business];
      this.PaymentForm = new FormGroup({
        Buyer: new FormControl(this.UserInfo.User),
        BuyerBusiness: new FormControl(this.AllBusiness[0]?._id, Validators.required),
        PaymentId: new FormControl(this.PaymentDetails._id, Validators.required),
        Seller: new FormControl({ value: this.PaymentDetails?.Seller?._id, disabled: true }, Validators.required),
        Business: new FormControl({ value: this.PaymentDetails?.Business?._id, disabled: true }, Validators.required),
        InvoiceDetails: new FormArray([]),
        PaymentMode: new FormControl(this.PaymentDetails.PaymentMode, Validators.required),
        PaymentDate: new FormControl(this.PaymentDetails.PaymentDate, Validators.required),
        Remarks: new FormControl(this.PaymentDetails.Remarks, Validators.required),
        Payment_Status: new FormControl(this.PaymentDetails.Payment_Status, Validators.required),
        PaymentAttachments: new FormArray([])
      });

      this.PaymentManage.PaymentDetails({ PaymentId: this.PaymentDetails._id }).subscribe(response => {
        // console.log(response, 'PaymentDetails->>>>---->responseresponseresponse');

        if (response.Status && response.Status === true) {
          this.PayToInvoiceAmountDetails = response.Response;
          console.log('  this.PayToInvoiceAmountDetails  this.PayToInvoiceAmountDetails', this.PayToInvoiceAmountDetails);

          if (this.PayToInvoiceAmountDetails.InvoiceDetails !== 0) {
            this.PayToInvoiceAmountDetails.InvoiceDetails.map(obj => {
              // console.log(obj, '2981747294794');

              const NewFGroup = new FormGroup({
                InvoiceId: new FormControl(obj.InvoiceId._id, Validators.required),
                InvoiceNumber: new FormControl(obj.InvoiceId.InvoiceNumber, Validators.required),
                InvoiceDate: new FormControl(obj.InvoiceId.InvoiceDate, Validators.required),
                InvoiceAmount: new FormControl(obj.InvoiceId.InvoiceAmount),
                InvoiceAcceptAndCancel: new FormControl({ value: true, disabled: true }),
                PayToInvoiceAmount: new FormControl(obj.PayToInvoiceAmount),
                PaidORUnpaid: new FormControl(obj.PaidORUnpaid),
                InProgressAmount: new FormControl(obj.InProgressAmount),
                RemainingAmount: new FormControl(obj.RemainingAmount)
              });


              const FArray = this.PaymentForm.get('InvoiceDetails') as FormArray;
              FArray.push(NewFGroup);
              console.log(FArray, 'FArrayFArray');

            });
          }
        }
      });
      if (this.PaymentDetails.PaymentAttachments.length > 0) {
        this.PaymentDetails.PaymentAttachments.map(obj => {
          this.getBase64ImageFromUrl(DevURL + obj.fileName, obj.fileName, function (dataUrl) { });
        });
      }
    }
  }

  getBase64ImageFromUrl(url, filename, callback) {
    const xhr = new XMLHttpRequest();
    const FArray = this.PaymentForm.get('PaymentAttachments') as FormArray;
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
      reader.onload = (events) => {
        const NewFGroup = new FormGroup({
          fileName: new FormControl(filename),
          PaymentPreviewAvailable: new FormControl(true),
          ShowPaymentFiles: new FormControl(false),
          PaymentPreview: new FormControl(events.target['result']),
        });
        FArray.push(NewFGroup);
        callback(reader.result);
      };
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  NotAllow(): boolean { return false; }
  ClearInput(event: KeyboardEvent): boolean {
    const Events = event.composedPath() as EventTarget[];
    const Input = Events[0] as HTMLInputElement;
    const FControl = Input.attributes as NamedNodeMap;
    const FControlName = FControl.getNamedItem('formcontrolname').textContent;
    this.PaymentForm.controls[FControlName].setValue(null);
    return false;
  }


  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 30;
    this.screenWidth = window.innerWidth - 10;
  }


  RemovePayment(Index: any) {
    this.fileName = this.PaymentForm.get('PaymentAttachments') as FormArray;
    this.fileName.removeAt(Index);
  }



  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.PaymentForm.get(KeyName) as FormControl;
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

  SellerChanges(Event: any) {
    if (this.PaymentForm.controls.Seller.status === 'VALID') {
      this.InviteManagement.SellerAgainstBusinessList({
        Seller: Event,
        CustomerCategory: 'Seller',
        BuyerBusiness: this.PaymentForm.controls.BuyerBusiness.value,
        CustomerType: this.UserInfo.CustomerType
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BusinessList = response.Response;
        } else {
          this.BusinessList = [];
          this.PaymentForm.controls["Business"].setValue("");
        }
      });
    }
  }


  onFileChange(event, Index: any) {
    if (event.target.files && event.target.files.length > 0) {
      const FArray = this.PaymentForm.get('PaymentAttachments') as FormArray;
      const FGroup = FArray.controls[Index] as FormGroup;
      FGroup.controls.PaymentPreviewAvailable.setValue(true);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (events) => {
        FGroup.controls.PaymentPreview.setValue(events.target['result']);
      };
    } else {
      const FArray = this.PaymentForm.get('PaymentAttachments') as FormArray;
      const FGroup = FArray.controls[Index] as FormGroup;
      FGroup.controls.fileName.setValue('');
      FGroup.controls.PaymentPreviewAvailable.setValue(false);
      FGroup.controls.PaymentPreview.setValue(null);
      this.fileInput.nativeElement.value = null;
    }
  }

  getFArray(): FormArray {
    return this.PaymentForm.get('InvoiceDetails') as FormArray;
  }


  BusinessChanges(Event: { _id: any; }) {
    if (this.PaymentForm.controls.Business.status === 'VALID') {
      this.InviteManagement.SellerAgainstBusinessList({
        Seller: this.PaymentForm.controls.Seller.value,
        BuyerBusiness: this.PaymentForm.controls.BuyerBusiness.value,
        CustomerCategory: 'Seller',
        CustomerType: this.UserInfo.CustomerType,
        Business: Event
      }).subscribe(response => {
        if (response && response === true) {
          this.BranchList = response.Response;
        }
      });
    }
  }



  createPayment(): FormGroup {
    return new FormGroup({
      fileName: new FormControl(''),
      PaymentPreviewAvailable: new FormControl(false),
      ShowPaymentFiles: new FormControl(false),
      PaymentPreview: new FormControl(''),
    });
  }

  GetFormArray(ControlName: any): any[] {
    const FArray = this.PaymentForm.get(ControlName) as FormArray;
    return FArray.controls;
  }

  AddPayment(): void {
    this.fileName = this.PaymentForm.get('PaymentAttachments') as FormArray;
    this.fileName.push(this.createPayment());
  }


  BranchChanges(Event: any) {
    if (this.PaymentForm.controls.Business.status === 'VALID') {
      this.InvoiceManagement.BuyerInvoice_AcceptList({
        Seller: this.PaymentForm.controls.Seller.value,
        Business: this.PaymentForm.controls.Business.value,
        Buyer: this.PaymentForm.controls.Buyer.value,
        BuyerBusiness: this.PaymentForm.controls.BuyerBusiness.value
      }).subscribe(response => {
        if (response.Status && response.Status === true) {
          this.BuyerAcceptList = response.Response;
          // console.log(this.BuyerAcceptList, 'BuyerAcceptListBuyerAcceptList');

          if (this.BuyerAcceptList.length > 0) {
            this.BuyerAcceptList = this.BuyerAcceptList.map(obj => {
              obj.InvoiceAcceptAndCancel = false;
              return obj;
            });

            const FArray = this.PaymentForm.get('InvoiceDetails') as FormArray;
            FArray.clear(); // Clear the form array before populating with new values

            this.BuyerAcceptList.forEach(obj => {
              const NewFGroup = new FormGroup({
                InvoiceId: new FormControl(obj._id, Validators.required),
                InvoiceNumber: new FormControl(obj.InvoiceNumber, Validators.required),
                InvoiceDate: new FormControl(obj.InvoiceDate, Validators.required),
                InvoiceAmount: new FormControl(obj.InvoiceAmount),
                InvoiceAcceptAndCancel: new FormControl(obj.InvoiceAcceptAndCancel),
                PayToInvoiceAmount: new FormControl(0),
                PaidORUnpaid: new FormControl('Unpaid'),
                PaidAmount: new FormControl(obj.PaidAmount + obj.InProgressAmount),
                IfUsedTemporaryCredit: new FormControl(obj.IfUsedTemporaryCredit),
                IfUsedPaidTemporaryCredit: new FormControl(obj.IfUsedTemporaryCredit),
                RemainingAmount: new FormControl(obj.InvoiceAmount - obj.PaidAmount - obj.InProgressAmount),
                InProgressAmount: new FormControl(obj.InProgressAmount),
                CurrentCreditAmount: new FormControl(obj.CurrentCreditAmount),
                UsedCurrentCreditAmount: new FormControl(obj.UsedCurrentCreditAmount),
                PaidCurrentCreditAmount: new FormControl(obj.PaidCurrentCreditAmount),
                TemporaryCreditAmount: new FormControl(obj.TemporaryCreditAmount),
                UsedTemporaryCreditAmount: new FormControl(obj.UsedTemporaryCreditAmount),
                PaidTemporaryCreditAmount: new FormControl(obj.PaidTemporaryCreditAmount),
              });
              FArray.push(NewFGroup);
            });
          }
        } else {
          this.BuyerAcceptList = [];
          const FArray = this.PaymentForm.get('InvoiceDetails') as FormArray;
          FArray.clear(); // Clear the form array when no data is available
        }
      });
    } else {
      const FArray = this.PaymentForm.get('InvoiceDetails') as FormArray;
      FArray.clear(); // Clear the form array when the Business is not valid
    }
  }




  PaidORUnpaid(FControl: any, Event: any) {
    console.log(FControl.value, 'FControlFControl');

    const invoiceAmount = FControl.get('RemainingAmount').value;
    const payToInvoiceAmountControl = FControl.get('PayToInvoiceAmount');
    const PaidAmount = FControl.get('PaidAmount').value;
    const Inprogress = FControl.get('InProgressAmount').value;


    if (payToInvoiceAmountControl instanceof FormControl) {
      var payToInvoiceAmountValue = Number(payToInvoiceAmountControl.value);


      if (payToInvoiceAmountValue > invoiceAmount) {
        // If the value is higher, set it to 0
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Payment Amount should not be greater than Invoice Amount' });
        payToInvoiceAmountControl.patchValue(0);
      } else if (payToInvoiceAmountValue < 0) {
        // If the value is negative, set it to 0
        payToInvoiceAmountControl.patchValue(0);
      }
    }

    if (Number(FControl.get('InvoiceAmount').value) === Number(FControl.get('PayToInvoiceAmount').value)) {
      FControl.controls.PaidORUnpaid.setValue('Paid');
    } else if (Number(FControl.get('InvoiceAmount').value) === Number(FControl.get('PaidAmount').value)) {
      FControl.controls.PaidORUnpaid.setValue('Paid');
    } else {
      FControl.controls.PaidORUnpaid.setValue('Unpaid');
    }
  }

  EditPaidORUnpaid(FControl: any, Event: any) {

    const invoiceAmount = FControl.get('InProgressAmount').value;
    const payToInvoiceAmountControl = FControl.get('PayToInvoiceAmount');


    if (payToInvoiceAmountControl instanceof FormControl) {
      let payToInvoiceAmountValue = Number(payToInvoiceAmountControl.value);

      if (payToInvoiceAmountValue > invoiceAmount) {
        // If the value is higher, set it to 0
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Payment Amount should not be greater than Invoice Amount' });
        payToInvoiceAmountControl.patchValue(0);
      } else if (payToInvoiceAmountValue < 0) {
        // If the value is negative, set it to 0
        payToInvoiceAmountControl.patchValue(0);
      }
    }

    if (Number(FControl.get('InvoiceAmount').value) === Number(FControl.get('PayToInvoiceAmount').value)) {
      FControl.controls.PaidORUnpaid.setValue('Paid');
    } else {
      FControl.controls.PaidORUnpaid.setValue('Unpaid');
    }


  }

  Submit() {
    if (this.PaymentForm.valid) {
      var InvList = this.PaymentForm.getRawValue().InvoiceDetails.filter((k) => k.InvoiceAcceptAndCancel == true)
        .map((item: any) => {
          let paidORUnpaid = 'Unpaid'; // Default value
          if (Number(item.InvoiceAmount) === Number(item.InProgressAmount)) {
            paidORUnpaid = 'Paid';
          } else if (Number(item.InvoiceAmount) === Number(item.PaidAmount)) {
            paidORUnpaid = 'Paid';
          }
          console.log(paidORUnpaid, 'paidORUnpaid');

          return {
            "InvoiceId": item.InvoiceId,
            "InvoiceNumber": item.InvoiceNumber,
            "InvoiceDate": item.InvoiceDate,
            "InvoiceAmount": item.InvoiceAmount,
            "InvoiceAcceptAndCancel": item.InvoiceAcceptAndCancel,
            "PayToInvoiceAmount": item.PayToInvoiceAmount,
            "PaidORUnpaid": paidORUnpaid,
            "IfUsedTemporaryCredit": item.IfUsedTemporaryCredit,
            "IfUsedPaidTemporaryCredit": item.IfUsedPaidTemporaryCredit,
            "RemainingAmount": item.RemainingAmount - item.PayToInvoiceAmount,
            "InProgressAmount": item.PayToInvoiceAmount,
            "CurrentCreditAmount": item.CurrentCreditAmount,
            "UsedCurrentCreditAmount": item.UsedCurrentCreditAmount,
            "PaidCurrentCreditAmount": item.PaidCurrentCreditAmount,
            "TemporaryCreditAmount": item.TemporaryCreditAmount,
            "UsedTemporaryCreditAmount": item.UsedTemporaryCreditAmount,
            "PaidTemporaryCreditAmount": item.PaidTemporaryCreditAmount
          }
        });

      console.log(InvList, 'InvListInvList');

      return;

      var Info = {
        "Seller": this.PaymentForm.getRawValue().Seller,
        "Business": this.PaymentForm.getRawValue().Business,
        "Buyer": this.PaymentForm.getRawValue().Buyer,
        "BuyerBusiness": this.PaymentForm.getRawValue().BuyerBusiness,
        "InvoiceDetails": InvList,
        "PaymentMode": this.PaymentForm.getRawValue().PaymentMode,
        "PaymentDate": this.datepipe.transform(this.PaymentForm.getRawValue().PaymentDate, "dd-MM-yyyy"),
        "Remarks": this.PaymentForm.getRawValue().Remarks,
        "PaymentAttachments": this.PaymentForm.getRawValue().PaymentAttachments,
        "PaymentAmount": InvList.reduce((acc, curr) => acc + curr.PayToInvoiceAmount, 0)
      };
      // console.log(Info.InvoiceDetails, 'Paymentttttttttttttttttttt');
      // return;
      this.PaymentManage.PaymentCreate(Info).subscribe(response => {
        this.Uploading = false;
        // console.log(Info, 'InfoInfoInfoinnnnn');
        // console.log(response, 'responseresponseresponseq24q');
        if (response.Status && response.Status === true) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Payment Successfully Created' });
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
      Object.keys(this.PaymentForm.controls).map(obj => {
        const FControl = this.PaymentForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }


  trackPayment(event: any) {
    this.inputvalue = event.target.value;
    this.PaymentAmount = this.inputvalue;
  }

  Update() {
    if (this.PaymentForm.valid) {
      // const Info = this.PaymentForm.getRawValue();
      // console.log(this.PaymentDetails, '213123');
      // return;
      // console.log(this.PayToInvoiceAmountDetails, 'PayToInvoiceAmountDetailsPayToInvoiceAmountDetails');


      var InvList = this.PayToInvoiceAmountDetails.InvoiceDetails.filter((k) => k.InvoiceId.InvoiceStatus === "Accept")
        .map((item) => {

          return {
            "InvoiceId": item.InvoiceId._id,
            "InvoiceNumber": item.InvoiceNumber,
            "InvoiceDate": item.InvoiceDate,
            // "InvoiceDate": this.datepipe.transform(item.InvoiceDate, "dd-MM-yyyy"),
            "InvoiceAmount": item.InvoiceAmount,
            "InvoiceAcceptAndCancel": item.InvoiceId.InvoiceStatus,
            "PayToInvoiceAmount": Number(this.PaymentAmount),
            "PaidORUnpaid": item.PaidORUnpaid,
            "IfUsedTemporaryCredit": item.IfUsedTemporaryCredit,
            // "IfUsedPaidTemporaryCredit": item.IfUsedPaidTemporaryCredit, // Check if exists
            "RemainingAmount": item.InvoiceAmount - this.PaymentAmount,
            "InProgressAmount": Number(this.PaymentAmount),
            "CurrentCreditAmount": item.CurrentCreditAmount,
            "UsedCurrentCreditAmount": item.UsedCurrentCreditAmount,
            "PaidCurrentCreditAmount": item.PaidCurrentCreditAmount,
            "TemporaryCreditAmount": item.TemporaryCreditAmount,
            "UsedTemporaryCreditAmount": item.UsedTemporaryCreditAmount,
            "PaidTemporaryCreditAmount": item.PaidTemporaryCreditAmount
          };
        });

      // console.log(InvList, 'Invvvvvvvvvvvvvvvv');


      var PaymentInfo = {

        "Business": this.PaymentForm.getRawValue().Business,
        "Buyer": this.PaymentForm.getRawValue().Buyer,
        "BuyerBusiness": this.PaymentForm.getRawValue().BuyerBusiness,
        "InvoiceDetails": InvList,
        "PaymentAmount": InvList.reduce((acc, curr) => acc + curr.PayToInvoiceAmount, 0),
        "PaymentAttachments": this.PaymentForm.getRawValue().PaymentAttachments,
        "PaymentDate": this.datepipe.transform(this.PaymentForm.getRawValue().PaymentDate, "dd-MM-yyyy"),
        "PaymentId": this.PayToInvoiceAmountDetails._id,
        "PaymentMode": this.PaymentForm.getRawValue().PaymentMode,
        "Payment_Status": "Pending",
        "Remarks": this.PaymentForm.getRawValue().Remarks,
        "Seller": this.PaymentForm.getRawValue().Seller,
        // "PaymentAmount": Number(this.PaymentAmount)
      };

      // return;
      this.PaymentManage.PaymentDetailsUpdate(PaymentInfo).subscribe(response => {


        this.Uploading = false;
        if (response.Status) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Payment Successfully Updated' });
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
      Object.keys(this.PaymentForm.controls).map(obj => {
        const FControl = this.PaymentForm.controls[obj] as FormControl;
        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
        }
      });
    }
  }
}



const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
