import { Component, OnInit } from "@angular/core";

import {
  AbstractControl,
  FormControl,
  ValidatorFn,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginManageService } from "src/app/services/common-services/login-manage.service";
import { ToastrService } from "src/app/services/common-services/toastr.service";
import { SocketManagementService } from "src/app/services/socket-management/socket-management.service";
import * as crypto from "crypto-js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  FormStage = "Stage_1"; // Stage_1 -> only Mobile Number, Stage_2 -> Sign Up, Stage_3 -> Password Config, Stage_4 -> Login, Stage_5 -> Forgot Password
  LoginForm: FormGroup;
  OTPGenerated = false;
  OTPValue: any;
  AlphaNumeric = new RegExp("^[A-Za-z0-9]+$");
  AlphaNumericSpaceHyphen = new RegExp("^[A-Za-z0-9 -]+$");
  Alphabets = new RegExp("^[A-Za-z]+$");
  AlphabetsSpaceHyphen = new RegExp("^[A-Za-z -]+$");
  AlphabetsSpaceHyphenDot = new RegExp("^[A-Za-z -.]+$");
  Numerics = new RegExp("^[0-9]+$");
  NumericDecimal = new RegExp("^[0-9]+([.][0-9]+)?$");
  MobileNumeric = new RegExp("^[0-9 +]+$");
  Uploading = false;
  MobileNumber: any;
  RandomToken = "";
  constructor(
    public Login: LoginManageService,
    public Toastr: ToastrService,
    public Socket: SocketManagementService,
    public router: Router
  ) {
    this.getRandomString();
    this.Socket.Initiate(this.RandomToken);
  }

  ngOnInit() {

    this.LoginForm = new FormGroup({
      Mobile: new FormControl("", [
        this.CustomValidation("MobileNumeric"),
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
        Validators.required,
      ]),
      OTP: new FormControl("", Validators.required),
      password: new FormControl("", [
        // this.CustomValidation("MobileNumeric"),
        Validators.minLength(4),
        Validators.maxLength(8),
        Validators.required,
      ]),
      // OTPGenerate: new FormControl(false),
    });



  }

  OnChangeMobileNo() {
    this.LoginForm.controls["OTP"].setValue("");
  }

  getRandomString() {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 110; i++) {
      this.RandomToken += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    }
    return this.RandomToken;
  }

  CustomValidation(Condition: any): ValidatorFn {
    if (Condition === "AlphaNumeric") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.AlphaNumeric.test(control.value)
        ) {
          return { AlphaNumericError: true };
        }
        return null;
      };
    }
    if (Condition === "AlphaNumericSpaceHyphen") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.AlphaNumericSpaceHyphen.test(control.value)
        ) {
          return { AlphaNumericSpaceHyphenError: true };
        }
        return null;
      };
    }
    if (Condition === "Alphabets") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.Alphabets.test(control.value)
        ) {
          return { AlphabetsError: true };
        }
        return null;
      };
    }
    if (Condition === "AlphabetsSpaceHyphen") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.AlphabetsSpaceHyphen.test(control.value)
        ) {
          return { AlphabetsSpaceHyphenError: true };
        }
        return null;
      };
    }
    if (Condition === "AlphabetsSpaceHyphenDot") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.AlphabetsSpaceHyphenDot.test(control.value)
        ) {
          return { AlphabetsSpaceHyphenDotError: true };
        }
        return null;
      };
    }
    if (Condition === "Numerics") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.Numerics.test(control.value)
        ) {
          return { NumericsError: true };
        }
        return null;
      };
    }
    if (Condition === "NumericDecimal") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.NumericDecimal.test(control.value)
        ) {
          return { NumericDecimalError: true };
        }
        return null;
      };
    }
    if (Condition === "MobileNumeric") {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
          control.value !== "" &&
          control.value !== null &&
          !this.MobileNumeric.test(control.value)
        ) {
          return { MobileNumericError: true };
        }
        return null;
      };
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.LoginForm.get(KeyName) as FormControl;
    if (FControl.invalid && FControl.touched) {
      const ErrorKeys: any[] =
        FControl.errors !== null ? Object.keys(FControl.errors) : [];
      if (ErrorKeys.length > 0) {
        let returnText = "";
        if (ErrorKeys.indexOf("required") > -1) {
          returnText = "This field is required";
        } else if (ErrorKeys.indexOf("min") > -1) {
          returnText =
            "Enter the value should be more than " + FControl.errors.min.min;
        } else if (ErrorKeys.indexOf("max") > -1) {
          returnText =
            "Enter the value should be less than or equal " +
            FControl.errors.max.max;
        } else if (ErrorKeys.indexOf("minlength") > -1) {
          returnText =
            "Enter the value should be greater than " +
            FControl.errors.minlength.requiredLength +
            " Digits/Characters";
        } else if (ErrorKeys.indexOf("maxlength") > -1) {
          returnText =
            "Enter the value should be less than " +
            FControl.errors.maxlength.requiredLength +
            " Digits/Characters";
        } else if (ErrorKeys.indexOf("AlphaNumericError") > -1) {
          returnText = "Please Enter Only Alphabets and Numerics!";
        } else if (ErrorKeys.indexOf("AlphaNumericSpaceHyphen") > -1) {
          returnText =
            "Please Enter Only Alphabets, Numerics, Space and Hyphen!";
        } else if (ErrorKeys.indexOf("AlphabetsError") > -1) {
          returnText = "Please Enter Only Alphabets!";
        } else if (ErrorKeys.indexOf("AlphabetsSpaceHyphenError") > -1) {
          returnText = "Please Enter Only Alphabets, Space and Hyphen!";
        } else if (ErrorKeys.indexOf("AlphabetsSpaceHyphenDotError") > -1) {
          returnText = "Please Enter Only Alphabets, Space, Dot and Hyphen!";
        } else if (ErrorKeys.indexOf("OTPNumber") > -1) {
          returnText = "Please Enter Valid OTP Number!";
        } else if (ErrorKeys.indexOf("NumericsError") > -1) {
          returnText = "Please Enter Only Numerics!";
        } else if (ErrorKeys.indexOf("NumericDecimalError") > -1) {
          returnText = "Please Enter Only Numeric and Decimals!";
        } else if (ErrorKeys.indexOf("MobileNumericError") > -1) {
          returnText = "Please Enter Only Numeric, Spaces and +!";
        } else {
          returnText = "Undefined error detected!";
        }
        return returnText;
      } else {
        return "";
      }
    }
  }

  Registration() {
    if (this.LoginForm.valid) {
      const Info = this.LoginForm.value;
      this.Login.Login(Info).subscribe((response) => {
        this.Uploading = false;
        if (response.Status === true && response.Http_Code === 200) {
          this.Login.StatusVerify({
            Mobile: this.LoginForm.value.Mobile,
          }).subscribe((ResponseStatus) => {
            if (
              ResponseStatus.Status === true &&
              ResponseStatus.Http_Code === 200
            ) {
              localStorage.setItem("SessionKeyWeb", response.Key);
              localStorage.setItem("SessionWeb", response.Response);
              localStorage.setItem("SessionVerifyWeb", btoa(Date()));
              this.router.navigate(["/dashboard"]);
              this.Toastr.NewToastrMessage({
                Type: "Success",
                Message: "Login Successfully!",
              });
            } else if (
              ResponseStatus.Status === true &&
              ResponseStatus.Http_Code === 201
            ) {
              localStorage.setItem("SessionWeb", response.Response);
              localStorage.setItem("SessionKeyWeb", response.Key);
              localStorage.setItem("SessionVerifyWeb", btoa(Date()));
              this.router.navigate(["/dashboard"]);
              this.Toastr.NewToastrMessage({
                Type: "Success",
                Message: "Login Successfully!",
              });
            }
          });
        } else if (response.Status === true && response.Http_Code === 201) {
          localStorage.setItem(
            "NewMobileNumber",
            this.LoginForm.controls.Mobile.value
          );
          this.router.navigate(["/registration"]);
        }
      });
    } else {
      Object.keys(this.LoginForm.controls).map((obj) => {
        const FControl = this.LoginForm.controls[obj] as FormControl;

        if (FControl.invalid) {
          FControl.markAsTouched();
          FControl.markAsDirty();
          this.LoginForm.controls[obj].setValue(null);
          this.GetFormControlErrorMessage("Mobile");
        }
      });
    }
  }


  OTPGenerate() {
    const Mobile = "Mobile";
    const OTP = "OTP";
    if (this.LoginForm.controls[Mobile].status !== "INVALID") {
      const MobileNumber = this.LoginForm.controls[Mobile].value;
      this.MobileNumber = MobileNumber;
      this.Login.MobileOTP({ Mobile: MobileNumber }).subscribe((response) => {
        this.OTPGenerated = true;
        // this.OTPValue = response.OTP;
        this.LoginForm.controls["OTP"].setValue(response.OTP);
      });
    } else {
      this.LoginForm.controls[OTP].setValue(null);
      this.GetFormControlErrorMessage("password");
    }
  }

  MobileNumberChange(event) {
    if (
      this.LoginForm.controls.Mobile.status !== "INVALID" &&
      this.MobileNumber !== event
    ) {
      this.OTPGenerated = false;
      this.LoginForm.controls.OTP.setValue(null);
    }
  }
}
