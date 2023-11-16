import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { LoaderService } from 'src/app/services/loader.service';
import { ClientService } from 'src/app/pages/setup/Service/client.service';
import { IdeaBService } from 'src/app/pages/GlobalServices/ideab.service';
import { TestService } from 'src/app/pages/GlobalServices/testService.service';
import sha256 from 'crypto-js/sha256';
import { UserIdleConfig, UserIdleService } from 'angular-user-idle';
import { UsermanagementService } from 'src/app/pages/master/user-management/service/usermanagement.service';

declare var require: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginObj = new Loginobj();
  resetObj = new Resetobj();
  supportingList: any = [];

  @ViewChild("remember") remember: ElementRef;
  @ViewChild("modalOTP") OtpModal: any;
  @ViewChild("modalResetPswd") ResetModal: any;
  @ViewChild("modalChangePswd") ChangePswdModal: any;
  @ViewChild('modalChangePswd1') modalChangePswd1: any;
  supportMail: string;
  contactNum: string;

  showSupportMail: boolean = true;
  showcontactNum: boolean = true;

  loginBottomLogo: string;
  OTPvalue: any;
  isSend: boolean = false;
  isDisabled: boolean = true;
  isFormDisabled: boolean = false;
  itemsList: any = [];
  showMsg: string = "";
  requestedUserID: string = "";
  userDomain: string = "";
  requestedUserName: string = "";
  selectedRadioItem: any;
  responseList: any = [];
  YearLabel: any;

  modelList: any = [];

  versionNumber: string;
  AppName: string;
  ClientLogoPath: string;
  ClientloginBG: string;
  configIdle: UserIdleConfig = {
    idle: 6000,
    timeout: 2,
    ping: 1
  };
  constructor(
    private _router: Router,
    private _http: HttpClient,
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _cookieService: CookieService,
    private loaderService: LoaderService,
    private clientService: ClientService,
    private userManagementService: UsermanagementService,
    private _testService: TestService,
    private userIdle: UserIdleService
  ) {
    this.versionNumber = this._commanService.VERSIONNUMBER;
  }

  ngOnInit() {
    sessionStorage.clear();

    this.randomString(6);

    this.getClientInfo();

    var date = new Date();
    this.YearLabel = date.getFullYear();


    this.loginObj = new Loginobj();
    if (this._cookieService.get('UserName')) {
      this.loginObj.UserName = this._cookieService.get('UserName');
    }
    if (this._cookieService.get('UserPassword')) {
      this.loginObj.Password = this._cookieService.get('UserPassword');
      this.remember.nativeElement.checked = true;
    }

    $(".toggle-password").click(function () {
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });



  }
  skipChangePassword(){
    this.modalChangePswd1.hide();
  }
  popupClose() {
    debugger
    if (this.pwdExpiryDays == 0) {
      this._toaster.warning("Password Expired for this User");
    }
    else {
      var parameters = this.supportingList.userDetails[0].defaultPage.split('/');
      this._router.navigate(['pages', parameters[0], parameters[1]]);
    }
  }
  getClientInfo() {

    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };

    var userObj: any;

    var clientInfo: any = [];

    this.loaderService.display(true)
    this._http.post(this._commanService.BASE_URL_ASSET + 'login/getClientInfo', userObj, HTTPOPTIONS_ASSET).subscribe(result => {

      clientInfo = result;

      this.loaderService.display(false)
      if (clientInfo != null) {
        this.ClientloginBG = clientInfo.bglogoPath;
        this.ClientLogoPath = clientInfo.logoPath;

        if (this.ClientLogoPath != "") {
          sessionStorage.setItem('logoImage', this.ClientLogoPath);
        }
        else {
          sessionStorage.setItem('logoImage', "assets/Images/ib.png");
        }

        this._commanService.loginBottomLogo = clientInfo.bottomLogo;

        sessionStorage.setItem('loginattempts', clientInfo.Loginattempts);

        this.maxAttempts = Number(clientInfo.Loginattempts);

        if (this.maxAttempts == 0) {
          this.maxAttempts = 5;
        }

        sessionStorage.setItem('bottomLogo', clientInfo.bottomLogo);
        //setting the value for login alerts
        sessionStorage.setItem('alertLogin', "true");
        sessionStorage.setItem('previousAlertCount', "0");
        sessionStorage.setItem('userClick', 'true');

        this.loginBottomLogo = clientInfo.bottomLogo;

        this.contactNum = clientInfo.contactNo;
        this._commanService.contactNum = this.contactNum;

        debugger
        if (this.contactNum.length == 0) {
          this.showcontactNum = false;
        }


        sessionStorage.setItem('supportMail', clientInfo.supportMail);
        this.supportMail = clientInfo.supportMail;
        this._commanService.supportMail = this.supportMail;

        debugger

        if (this.supportMail.length == 0) {
          this.showSupportMail = false;
        }

        this._commanService.contactWebURL = clientInfo.webURL;
        sessionStorage.setItem('contactWebURL', clientInfo.webURL);

        this._commanService.companyName = clientInfo.companyName;
        sessionStorage.setItem('companyName', clientInfo.companyName);

        this.AppName = clientInfo.AppName;

        //-1 means NEVER
        if (clientInfo.IdleMins != "" && clientInfo.IdleMins != null && clientInfo.IdleMins != -1) {
          sessionStorage.setItem('IdleMins', clientInfo.IdleMins);
          this.configIdle["idle"] = Number(clientInfo.IdleMins) * 60;
          this.userIdle.setConfigValues(this.configIdle);
          console.log(this.userIdle);
          this.userIdle.startWatching();

          // Start watching when user idle is starting.
          this.userIdle.onTimerStart().subscribe(event => console.log(event));

          // Start watch when time is up.
          this.userIdle.onTimeout().subscribe(() => this.logout());
        }

      }
    });
  }

  logout() {
    sessionStorage.clear();
    this._router.navigateByUrl('IoT');
  }


  Login(isForm: boolean, userObj: any) {

    debugger

    if (this.noOfAttempts >= this.maxAttempts) {
      this.doLock(userObj);
    } else {
      this.doLogin(isForm, userObj);
    }
  }

  lockres: any;
  doLock(userObj: any) {
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let obj = {
      "userID": userObj.UserName
    }
    this._http.post(this._commanService.BASE_URL_ASSET + 'Login/LockUser', obj, HTTPOPTIONS_ASSET).
      subscribe(result => {
        this.lockres = result;
        this._toaster.warning(this.lockres.msg);
        this.loaderService.display(false);
      });
  }

  doLogin(isForm: boolean, userObj: any) {


    if (isForm) {

      if (this.remember.nativeElement.checked) {
        this._cookieService.put('UserName', userObj.UserName);
        this._cookieService.put('UserPassword', userObj.Password);
      } else {
        this._cookieService.remove('UserName');
        this._cookieService.remove('UserPassword');
      }
      this.GetLogin(userObj);
    }
    else {

      this._toaster.warning(this._commanService.MANDATORYMESSAGE);
    }
  }
  noOfAttempts: number = 0;
  maxAttempts: number = 5;
  FirstOTP: any = ""
  showSkip: any = false;
  ModelPwdExpiry: any = "";
  pwdExpiryDays: any = "";
  async GetLogin(userObj) {


    if (this.capt == this.capvalue) {
      this.loaderService.display(true);
      sessionStorage.setItem("LoginUser", userObj.UserName);

      await this._commanService.GetAccessToken(userObj.UserName);

      const HTTPOPTIONS_ASSET = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
      };
      debugger
      this._http.post(this._commanService.BASE_URL_ASSET + 'user/Validate', userObj, HTTPOPTIONS_ASSET).
        subscribe(result => {
          this.supportingList = result;
          debugger

          if (this.supportingList.sts == "200") {

            this.noOfAttempts = 0;
            debugger
            this.pwdExpiryDays = parseInt(this.supportingList.userDetails[0].PasswordExpiry);
            if (this.supportingList.userDetails.length > 0 && this.supportingList.userDetails[0].defaultPage != "") {

              sessionStorage.setItem("IS_AUTH", "true");

              var offset = new Date().toString().match(/([-\+][0-9]+)\s/)[1];

              sessionStorage.setItem('Web_Version', this.supportingList.webVersion);
              sessionStorage.setItem('showFooter', this.supportingList.showFooter);
              sessionStorage.setItem('USER_TIMEZONE', offset + '');
              sessionStorage.setItem('Get_ReportStatus', this.supportingList.userDetails[0].createReport);
              sessionStorage.setItem('LOGINUSERID', this.supportingList.userDetails[0].userID);
              sessionStorage.setItem('LOGIN_USER_EMAIL_ID', this.supportingList.userDetails[0].userMailId);
              sessionStorage.setItem('CLINETID', this.supportingList.userDetails[0].clientID);
              sessionStorage.setItem('USER_NAME', this.supportingList.userDetails[0].UserName);
              sessionStorage.setItem('DEFAULTPASSWORD', this.supportingList.userDetails[0].defaultPassword);
              sessionStorage.setItem('DEFAULT_LATITUDE', this.supportingList.userDetails[0].latitude);
              sessionStorage.setItem('DEFAULT_LONGITUDE', this.supportingList.userDetails[0].longitude);
              sessionStorage.setItem('USER_TYPE', this.supportingList.userDetails[0].userType);
              sessionStorage.setItem('USER_DEVICES', JSON.stringify(this.supportingList.userDevices));
              sessionStorage.setItem('USER_SENSORS', JSON.stringify(this.supportingList.userSensors));
              sessionStorage.setItem('Client_Feature', JSON.stringify(this.supportingList.clientFeatures));
              sessionStorage.setItem('NonAccess_Feature',JSON.stringify(this.supportingList.noAccessclientFeatures));
              sessionStorage.setItem("DEFAULT_PAGE", this.supportingList.userDetails[0].defaultPage);
              sessionStorage.setItem("USER_PREF", this.supportingList.userDetails[0].userPref);
              sessionStorage.setItem('ALERT_TYPES', JSON.stringify(this.supportingList.alertstype));
              sessionStorage.setItem('Client_AppName', this.supportingList.userDetails[0].AppName);
              sessionStorage.setItem('Client_ListView', this.supportingList.userDetails[0].listView);
              sessionStorage.setItem('MQTT_PubTopic', this.supportingList.userDetails[0].mqttPubTopic);
              sessionStorage.setItem('hasMQTT', this.supportingList.userDetails[0].hasMQTT);
              sessionStorage.setItem('Client_Domain', this.supportingList.userDetails[0].domain);
              sessionStorage.setItem('Sensor_UoM', JSON.stringify(this.supportingList.UoMList));
              sessionStorage.setItem('MathFunctions', JSON.stringify(this.supportingList.mathFunctions));
              sessionStorage.setItem('User_SuperAdmin', this.supportingList.userDetails[0].isSuperAdmin);
              sessionStorage.setItem('countryCodeList', JSON.stringify(this.supportingList.countryCodeList));



              sessionStorage.setItem('iotUserMailIds', JSON.stringify(this.supportingList.iotUserMailIds));


              sessionStorage.setItem("devMaintenance", this.supportingList.userDetails[0].devMaintenance);
              sessionStorage.setItem("GenMaint", this.supportingList.userDetails[0].GenMaint);
              sessionStorage.setItem("IoTMaint", this.supportingList.userDetails[0].IoTMaint);
              sessionStorage.setItem("Tickets", this.supportingList.userDetails[0].Tickets);
              sessionStorage.setItem("hasUserManagement", this.supportingList.userDetails[0].hasUserManagement);
              sessionStorage.setItem("hasCddRegionReport", this.supportingList.userDetails[0].cddRegionReport);
              sessionStorage.setItem("hasAuditReport", this.supportingList.userDetails[0].auditReport);


              sessionStorage.setItem("ReportCharts", this.supportingList.userDetails[0].ReportCharts);
              sessionStorage.setItem("ReportLogs", this.supportingList.userDetails[0].ReportLogs);
              sessionStorage.setItem("ReportpdfTemplate", this.supportingList.userDetails[0].pdfTemplate);


              sessionStorage.setItem('User_HWTypes', JSON.stringify(this.supportingList.userModel));
              sessionStorage.setItem('Regions', JSON.stringify(this.supportingList.regions));
              sessionStorage.setItem('operational_Status', JSON.stringify(this.supportingList.operationalStatus));

              sessionStorage.setItem('User_MobileNo', this.supportingList.userDetails[0].mobileNo);

              if (this.supportingList.userDetails[0].imagePath != undefined && this.supportingList.userDetails[0].imagePath != "") {
                sessionStorage.setItem('client_UserImage', this.supportingList.userDetails[0].imagePath);
              } else {
                sessionStorage.setItem('client_UserImage', "assets/Images/user_login_black.png");
              }

              if (this.supportingList.userDetails[0].BGPath != "") {
                sessionStorage.setItem('BGimage', this.supportingList.userDetails[0].BGPath);
              } else {
                sessionStorage.setItem('BGimage', "https://iotadmin.iotsolution.net/FTP_Sensorcnt/ib/default_footer.png");
              }

              sessionStorage.setItem("hasIoTController", this.supportingList.userDetails[0].hasIoTController);
              sessionStorage.setItem("isResellar", this.supportingList.userDetails[0].isResellar);

              debugger


              let logReq = {
                "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
                "module": "Login",
                "actionPerformed": "Login into web portal"
              }

              this._commanService.logUpdate(logReq);

              this.loaderService.display(false)
              debugger
              if (parseInt(this.pwdExpiryDays) == 0 && this.pwdExpiryDays.trim !== "" && this.pwdExpiryDays != null && this.pwdExpiryDays != undefined) {
                this.ModelPwdExpiry = "Password Expired";
                this.modalChangePswd1.show();
              }
              else
                if (parseInt(this.pwdExpiryDays) < 10 &&  this.pwdExpiryDays.trim !== "" && this.pwdExpiryDays != null && this.pwdExpiryDays != undefined) {
                  this.showSkip = true;
                  this.ModelPwdExpiry = "Password Expire's in " + this.pwdExpiryDays + " days";
                  this.modalChangePswd1.show();
                }
                else if (!this.supportingList.userDetails[0].passwordStatus) {
                  this.ChangePswdModal.show();
                }
                else {
                  var parameters = this.supportingList.userDetails[0].defaultPage.split('/');
                  this._router.navigate(['pages', parameters[0], parameters[1]]);

                }

            }
          }
          else {
            this.noOfAttempts += 1;
            this.loaderService.display(false)
            if (this.supportingList.sts == "400") {
              this._toaster.warning(this.supportingList.msg)
            }
          }
        }, error => {
          this.noOfAttempts += 1;
          this._toaster.warning("Invalid Credentials");//error.error.type
          this.loaderService.display(false)
        });
      // }
    }
    else {
      this._toaster.warning('Invalid Captcha');
    }
  }


  tempStatus: any = "";
  async ForgotPassword(username: any) {

    if (this.loginObj.UserName != undefined && this.loginObj.UserName != '' && this.loginObj.UserName != null) {

      await this._commanService.GetAccessToken(this.loginObj.UserName);


      this.requestedUserID = "";
      this.requestedUserName = "";
      this.isDisabled = false;
      this.isSend = false;
      this.OTPvalue = "";

      this.tempStatus = 1;

      if (username === undefined) {
        this._toaster.warning("Please Enter E-mail address");
      } else {

        const HTTPOPTIONS_ASSET = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
        };
        var obj = { "UserName": username };
        this._http.post(this._commanService.BASE_URL_ASSET + 'user/ForgetPasswordV2', obj, HTTPOPTIONS_ASSET).subscribe(result => {
          ;
          this.responseList = result;

          if (this.responseList.sts == "200") {
            this._toaster.success(this.responseList.msg);
            this.noOfAttempts = 0;
            this.ResetModal.show();
          }
          else {
            this._toaster.warning(this.responseList.msg);
          }
        }, error => {
          this._toaster.warning("Please Enter valid E-mail address");
        });
      }
    }
    else {
      this._toaster.warning("Please Enter valid E-mail address");
    }

  }

  onItemChange(item: any) {

    this.isDisabled = false;
    this.tempStatus = 2;
    this.selectedRadioItem = item;
    this.isSend = false;
  }
  capvalue: any = "";
  capt: any = "";

  randomString(length: any) {
    var randomChars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      this.capvalue = result
    }
    return result;
  }


  SendOTP() {

    var obj = {};

    if (this.tempStatus == 1) {
      obj = {
        "Name": this.selectedRadioItem.user,
        "MailId": this.selectedRadioItem.name,
        "MobileNo": "",
        "UserId": this.requestedUserID,
        "domain": this.userDomain
      }
    }
    else {
      if (this.selectedRadioItem.value == "Email") {
        obj = {
          "Name": this.selectedRadioItem.user,
          "MailId": this.selectedRadioItem.name,
          "MobileNo": "",
          "UserId": this.requestedUserID,
          "domain": this.userDomain
        }
      }
      else {
        obj = {
          "MailId": "",
          "MobileNo": this.selectedRadioItem.name,
          "UserId": this.requestedUserID,
          "domain": this.userDomain
        }
      }
    }

    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    this._http.post(this._commanService.BASE_URL_ASSET + 'user/GenerateCode', obj, HTTPOPTIONS_ASSET).subscribe(result => {
      this.responseList = result;
      if (this.responseList.sts == "200") {
        this.isSend = true;
        this.showMsg = this.responseList.msg;
        this.isDisabled = true;
      }

    });
  }


  booleanFlag: boolean = false;

  VerifyOTP(OTPvalue) {


    this.booleanFlag = this.verifyOtpValidation(OTPvalue);
    if (this.booleanFlag) {
      var obj = {
        "UserId": this.requestedUserID,
        "OTP": OTPvalue
      }
      const HTTPOPTIONS_ASSET = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

      };
      this._http.post(this._commanService.BASE_URL_ASSET + 'user/VerifyCode', obj, HTTPOPTIONS_ASSET).subscribe(result => {

        this.responseList = result;
        if (this.responseList.sts != "400") {
          this.isFormDisabled = true;
          this.resetObj = new Resetobj();
          this.OtpModal.hide();
          this.ResetModal.show();
        } else {
          this._toaster.warning("Invalid OTP");
        }
      }, error => {
        this._toaster.warning(error.error.Message);
      });
    }
  }

  pasteCaptcha() {
    if (this.loginObj.UserName.toLowerCase() == "support@ideabytesiot.com") {
      //capvalue
      this.capt = this.capvalue;

    }

  }

  verifyOtpValidation(otpValue): any {
    // 
    if (otpValue == "") {
      this._toaster.warning("Please Enter OTP");
      return false;
    }
    else {
      return true;
    }
  }

  saveResetPwd(isForm: boolean, obj: any) {

    if (isForm) {

      if (this.OTPvalue != '' && this.OTPvalue != undefined && this.OTPvalue != null) {

        if (obj.Password && !String(obj.Password).match(this._commanService.STRONGPSWD_REGX)) {
          this._toaster.warning("Please Enter Valid Password");
          return false;
        }
        if (obj.Password != obj.ConfirmPassword) {
          this._toaster.warning("Passwords do not match");
          return false;
        }

        var requestObj = {
          "UOTP": this.OTPvalue,
          "password": obj.Password
        }
        const HTTPOPTIONS_ASSET = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

        };

        this._http.post(this._commanService.BASE_URL_ASSET + 'user/ResetPasswordV2', requestObj, HTTPOPTIONS_ASSET).subscribe(result => {
          this.responseList = result;

          if (this.responseList.sts != "400") {


            this._toaster.success("Password updated successfully.");

            this.ResetModal.hide();

            let logReq = {
              "userMailID": this.loginObj.UserName,
              "module": "ForgotPassword",
              "actionPerformed": "User has been reset the Password"
            }

            this._commanService.logUpdate(logReq);

          } else {
            this._toaster.warning(this.responseList.msg);
          }
        });

      } else {
        this._toaster.warning(this._commanService.MANDATORYMESSAGE);

      }
    }

  }



  allowNumericsOnly(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  changePswdResponse: any;
  chngobj = new ChangeDefaultPassword;
  oldPassword: any = ""

  saveChangePwd1(obj) {
    debugger


    if (this.oldPassword == "" || this.oldPassword === undefined ||
      obj.password == "" || obj.password === undefined ||
      obj.confirmPassword == "" || obj.confirmPassword === undefined) {
      this._toaster.warning(this._commanService.MANDATORYMESSAGE);
      return false;
    } else {
      if (this.oldPassword == "" || this.oldPassword === undefined) {
        this._toaster.warning("Please current password");
        return false;
      }
      if (obj.password == "" || obj.password === undefined) {
        this._toaster.warning("Please enter password");
        return false;
      } if (obj.password && !String(obj.password).match(this._commanService.STRONGPSWD_REGX)) {
        this._toaster.warning("Please enter valid password");
        return false;
      }
      if (obj.confirmPassword == "" || obj.confirmPassword === undefined) {
        this._toaster.warning("Please Re-enter Password");
        return false;
      }
      if (obj.password != obj.confirmPassword) {
        this._toaster.warning("Passwords do not match");
        return false;
      }

      this.userManagementService.updateUserPwdV2(obj.password, this.oldPassword).subscribe(result => {
        debugger
        this.changePswdResponse = result;
        if (this.changePswdResponse.sts == "200") {

          this._toaster.success("Updated successfully.");

          // let logReq = {
          //   "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
          //   "module": "User Profile",
          //   "actionPerformed": "Password has been updated for - " + this.usermanagementobj.name
          // }

          // this._commanService.logUpdate(logReq);

        } else {
          this._toaster.warning(this.changePswdResponse.msg);
        }
      });
    }
  }
  saveChangePwd(obj) {

    if (obj.password == "" || obj.password === undefined ||
      obj.confirmPassword == "" || obj.confirmPassword === undefined) {
      this._toaster.warning(this._commanService.MANDATORYMESSAGE);
      return false;
    } else {
      if (obj.password == "" || obj.password === undefined) {
        this._toaster.warning("Please Enter Password");
        return false;
      } if (obj.password && !String(obj.password).match(this._commanService.STRONGPSWD_REGX)) {
        this._toaster.warning("Please Enter Valid Password");
        return false;
      }
      if (obj.confirmPassword == "" || obj.confirmPassword === undefined) {
        this._toaster.warning("Please Re-Enter Password");
        return false;
      }
      if (obj.password != obj.confirmPassword) {
        this._toaster.warning("Password is mismatch");
        return false;
      }

      debugger

      var uMobileNo = sessionStorage.getItem("User_MobileNo")

      this.clientService.ChangeDefaultPassword2(obj.password, uMobileNo, this.FirstOTP).subscribe(result => {

        this.changePswdResponse = result;

        if (this.changePswdResponse.sts == "200") {
          var parameter = sessionStorage.getItem('DEFAULT_PAGE');
          let parameters = parameter.split("/")
          return this._router.navigate(['pages', parameters[0], parameters[1]]);
        } else {
          this._toaster.warning(this.changePswdResponse.msg);
        }
      });
    }
  }
}

export class Loginobj {
  public UserName: string;
  public Password: string;
}

export class Resetobj {
  public ClientId: string;
  public UserId: string;
  public UserName: string;
  public Password: string;
  public ConfirmPassword: string;
}

export class ChangeDefaultPassword {
  public userID: string;
  public password: string;
  public confirmPassword: string;
  public clientID: string;
}

