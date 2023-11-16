import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Usermanagement } from '../models/Usermanagement';

import { ToastrService } from 'ngx-toastr';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/services/loader.service';
import { UsermanagementService } from '../user-management/service/usermanagement.service';
import { ChangeDefaultPassword } from 'src/app/jio-login/login/login.component';
import { RolemanagementService } from '../rolemanagement/service/rolemanagement.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  userdetailobj = new userdetailobj();
  isPasswordShow: boolean = true;
  ResponseList: any;
  isEmailVerified: boolean = false;
  isEmailVerifiedOrg: boolean = false;

  alertName1: any
  alertInvalidName1: any

  defaultFeatures: any;

  itemArray: any;

  usermanagementobj = new Usermanagement();

  isValidPwd: boolean;
  isInValidPwd: boolean;
  disabled: boolean = false;
  enterUserContact: any = ""
  enterEmailId: any = ""
  invalidEmailId: any = ""
  enterPassword: any = ""
  reEnterConfirmPassword: any = ""
  toasterValidPassword: any = ""
  passwordMisMatch: any = ""

  oldPassword: any = ""

  sms: boolean = false;
  email: boolean = false;
  notif: boolean = false;
  nrSMS: boolean = false

  cbwarning: boolean = false
  cbcritical: boolean = false
  cbgood: boolean = false

  nameLabel: boolean = false;
  nameLabelEdit: boolean = false;

  lastnameLabel: boolean = false;
  lastnameLabelEdit: boolean = false;

  mobileLabel: boolean = false;
  mobileLabelEdit: boolean = false;

  emailLabel: boolean = false;
  emailLabelEdit: boolean = false;

  isSuperAdmin: boolean = false;

  strongPswd_regx = this.cmnService.STRONGPSWD_REGX;


  u_Id: string;
  result: any;

  @ViewChild('modalChangePswd') modalChangePswd: any;

  constructor(
    private toastr: ToastrService,
    private cmnService: IdeaBService,
    public translate: TranslateService,
    private loaderService: LoaderService,
    private userManagementService: UsermanagementService,
    private roleService: RolemanagementService,) { }

  bgImage: any;


  ngOnInit() {

    sessionStorage.setItem('liveScreen', "user");
    this.bgImage = sessionStorage.getItem('BGimage');
    debugger

    this.isInValidPwd = true;
    this.getUserData();

    debugger

    if (sessionStorage.getItem("User_SuperAdmin").toLowerCase() == "superadmin") {
      this.isSuperAdmin = true;
    }
    else {
      this.isSuperAdmin = false;
    }


  }

  openRestPwd() {

    this.modalChangePswd.show();
  }

  userMailId: any = ""
  userMobileNo: any = ""

  getUserData() {

    var userData: any

    userData = []

    var userId: any = ""

    userId = this.cmnService.getLoginUserID();

    this.userManagementService.getUserById(userId).subscribe(result => {
      debugger
      userData = result;


      this.usermanagementobj = new Usermanagement();
      this.nameLabel = true;
      this.lastnameLabel = true;
      this.mobileLabel = true;
      this.emailLabel = true;
      this.disabled = true;
      this.usermanagementobj.name = userData.userData[0].name;
      this.usermanagementobj.lastname = userData.userData[0].lastname;
      this.usermanagementobj.mobileNumber = userData.userData[0].mobileNumber;
      this.userMobileNo = userData.userData[0].mobileNumber;
      this.usermanagementobj.mailId = userData.userData[0].mailId;
      this.userMailId = this.usermanagementobj.mailId;
      this.usermanagementobj.roleId = userData.userData[0].roleId;
      this.usermanagementobj.roleName = userData.userData[0].roleName;


      this.isEmailVerified = userData.userData[0].emailIdVerified == "1" ? true : false;
      this.isMobileVerified = userData.userData[0].mobileNoVerified == "1" ? true : false;
      this.isEmailVerifiedOrg = this.isEmailVerified
      this.isMobileVerifiedOrg = this.isMobileVerified

      if (this.isMobileVerified) {
        this.otpSent = true;
      }
      if (this.usermanagementobj.roleName == "" || this.usermanagementobj.roleName == undefined) {
        this.usermanagementobj.roleName = "Admin";
      }

      this.notif = userData.userData[0].notif == "1" ? true : false;
      this.sms = userData.userData[0].sms == "1" ? true : false;
      this.email = userData.userData[0].email == "1" ? true : false;
      this.nrSMS = userData.userData[0].nrSMS == "1" ? true : false;

      this.cbwarning = userData.userData[0].cbWarning == "1" ? true : false;
      this.cbcritical = userData.userData[0].cbCritical == "1" ? true : false;
      this.cbgood = userData.userData[0].cbGood == "1" ? true : false;

      this.usermanagementobj.userPref = userData.userData[0].userPref;

      this.getFeatures(userData.userData[0].roleId);
    });
  }

  checkEmailid() {
    debugger
    if (this.userMailId == this.usermanagementobj.mailId) {
      this.isEmailVerified = this.isEmailVerifiedOrg;//true;
    }
    else {
      this.isEmailVerified = false;
    }
  }

  checkMobileNo() {
    debugger
    if (this.userMobileNo == this.usermanagementobj.mobileNumber) {
      this.isMobileVerified = this.isMobileVerifiedOrg;//true;
    }
    else {
      this.isMobileVerified = false;
    }

    this.otpSent = false;
    if (this.isMobileVerified) {
      this.otpSent = true;
    }
  }

  verfiyMailId() {

    if (this.usermanagementobj.mailId == "" ||
      this.usermanagementobj.mailId === undefined ||
      this.usermanagementobj.mailId == null) {
      this.toastr.warning("Please enter Email ID");
    }
    else {

      this.loaderService.display(true);
      var resp: any
      this.userManagementService.SendVerifyMailIdCode(this.usermanagementobj.mailId).subscribe(result => {

        resp = result;

        this.loaderService.display(false);

        if (resp.sts == '200') {
          this.toastr.success(resp.msg, '', {
            timeOut: 5000,
          });
          var resp2: any;
          this.userManagementService.EmailVerificationStatus(this.usermanagementobj.mailId).subscribe(result2 => {
            resp2 = result;

            if (resp2.sts == '200') {
              this.isEmailVerified = true;
            }

          });

        }
      });
    }


  }

  verfiyMobile() {

    if (this.usermanagementobj.mobileNumber == "" ||
      this.usermanagementobj.mobileNumber === undefined ||
      this.usermanagementobj.mobileNumber == null) {
      this.toastr.warning("Please enter Mobile No");
    }
    else {

      this.loaderService.display(true);
      var resp: any
      this.userManagementService.SendSignUpOTP(this.usermanagementobj.mobileNumber).subscribe(result => {

        resp = result;

        this.loaderService.display(false);

        if (resp.sts == '200') {
          this.otpSent = true;
          this.toastr.success(resp.msg, '', {
            timeOut: 5000,
          });
        }
      });
    }


  }
  isMobileVerified: boolean = false;
  isMobileVerifiedOrg: boolean = false;

  otpSent: boolean = false;
  signupOTP: any
  verfiyOTP() {
    var resp2: any;
    this.userManagementService.ValidateOTP(this.usermanagementobj.mobileNumber, this.signupOTP).subscribe(result => {
      resp2 = result;

      if (resp2.sts == '200') {
        this.isMobileVerified = true;
        // this.otpSent = false;
      }
      else {
        this.toastr.warning('Invalid OTP');
        this.isMobileVerified = false;
      }

    });
  }

  getFeatures(roleId: any) {
    debugger
    this.itemArray = []
    this.roleService.getUserRoleFeature(roleId).subscribe(result => {

      debugger
      this.itemArray = Object.assign([], result);
      this.defaultFeatures = [];
      this.itemArray.siteFeatures.forEach(element => {
        this.defaultFeatures.push({ "userFeatureId": element.value, "name": element.text });
      });
    }, error => {
      this.defaultFeatures = [];
    }


    );
  }

  checkuserPwd() {

    var data: any
    data = []

    this.userManagementService.checkuserPwd(this.oldPassword).subscribe(result => {
      debugger
      data = result

      if (data.sts == "200") {
        //  this.disabled = false;
        this.isValidPwd = true;
        this.isInValidPwd = false;
      }
      else {
        this.isValidPwd = false;
        this.isInValidPwd = true;
        // this.disabled = true;
        this.toastr.warning("Invalid password");
      }
    })
  }

  phoneNumberValidate(event) {
    var keycode = event.which;
    if (!(event.shiftKey == false && (keycode == 40 || keycode == 41 || keycode == 45 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
      return false;
    }
    return true;
  }

  allowNumericsOnly(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  checkValidations(userdetailobj) {

    debugger;

    if (userdetailobj.name.match(/^[0-9 ]+$/g) || userdetailobj.name.match(/^[ ]+$/g)) {
      this.userdetailobj.name = "";
      this.toastr.warning(this.translate.instant('UsmName') + " " + this.translate.instant('NumericSpacesValidation'));
      return false;
    }

    if (userdetailobj.name == "" ||
      userdetailobj.name === undefined ||
      userdetailobj.name == null) {
      this.toastr.warning(this.alertName1);
      return false;
    }


    if (!this.cmnService.nameLengthCheck(userdetailobj.name)) {
      // this.toastr.warning(this.cmnService.nameLengthCheckText);
      this.toastr.warning(this.translate.instant('UsmnameLengthCheckText'))
      return false;
    }

    if (userdetailobj.name.startsWith("0") || userdetailobj.name.startsWith("1") ||
      userdetailobj.name.startsWith("2") || userdetailobj.name.startsWith("3") ||
      userdetailobj.name.startsWith("4") || userdetailobj.name.startsWith("5") ||
      userdetailobj.name.startsWith("6") || userdetailobj.name.startsWith("7")
      || userdetailobj.name.startsWith("8") || userdetailobj.name.startsWith("9")) {
      //  this.userdetailobj.name = "";
      this.toastr.warning(this.translate.instant('UsmName') + " " + this.translate.instant('UsmtitleName'));
      return false;
    }


    if (userdetailobj.mobileNumber == "" ||
      userdetailobj.mobileNumber === undefined ||
      userdetailobj.mobileNumber == null) {
      this.toastr.warning(this.enterUserContact);
      return false;
    }




    if (!this.cmnService.AcceptFirstChar_REGX.test(userdetailobj.name)) {
      this.toastr.warning(this.alertInvalidName1);
      return false;
    }


    if (userdetailobj.mobileNumber == "" && userdetailobj.mobileNumber == undefined) {
      this.toastr.warning(this.enterUserContact);//Please enter User Contact
      return false;
    }


    return true;
  }

  changeName() {
    this.nameLabel = false;
    this.nameLabelEdit = true;
  }

  changeLastName() {
    this.lastnameLabel = false;
    this.lastnameLabelEdit = true;
  }

  changeMobile() {
    this.mobileLabel = false;
    this.mobileLabelEdit = true;
  }

  changeUserid() {
    this.emailLabel = false;
    this.emailLabelEdit = true;
  }

  spacesCheckedForUserName(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //    this.usermanagementobj.name = "";
    //    this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //    return false;
    //  }
  }

  saveNewUser() {
    debugger

    this.result = this.checkValidations(this.usermanagementobj);

    if (this.result) {

      this.userdetailobj = new userdetailobj();

      this.loaderService.display(true);
      this.ResponseList = [];
      debugger
      this.userdetailobj.name = this.usermanagementobj.name;
      this.userdetailobj.lastname = this.usermanagementobj.lastname;
      this.userdetailobj.sms = this.sms == true ? '1' : '0';
      this.userdetailobj.email = this.email == true ? '1' : '0';
      this.userdetailobj.notif = this.notif == true ? '1' : '0';
      this.userdetailobj.nrSMS = this.nrSMS == true ? '1' : '0';

      this.userdetailobj.cbCritical = this.cbcritical == true ? '1' : '0';
      this.userdetailobj.cbWarning = this.cbwarning == true ? '1' : '0';
      this.userdetailobj.cbGood = this.cbgood == true ? '1' : '0';

      this.userdetailobj.UserId = this.cmnService.getLoginUserID();
      this.userdetailobj.MailId = this.usermanagementobj.mailId;
      this.userdetailobj.mobileNumber = this.usermanagementobj.mobileNumber;
      this.userdetailobj.userPref = this.usermanagementobj.userPref;
      this.userdetailobj.userPref = this.usermanagementobj.userPref;
      this.userdetailobj.userPref = this.usermanagementobj.userPref;
      this.userdetailobj.emailVerified = this.isEmailVerified == true ? "1" : "0";
      this.userdetailobj.mobileNoVerified = this.isMobileVerified == true ? "1" : "0";

      debugger
      this.userManagementService.SaveUser(this.userdetailobj).subscribe(data => {
        debugger
        this.ResponseList = data;
        if (this.ResponseList.sts == "200") {
          debugger

          this.formatLogUpdate(this.userdetailobj);
          this.toastr.success("Your profile has been updated!");
          this.loaderService.display(false);

          sessionStorage.setItem("USER_NAME", this.userdetailobj.name);

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
        else {
          this.loaderService.display(false);
          this.toastr.warning(this.ResponseList.msg);
        }
      },
        error => {
          this.loaderService.display(false);
          this.toastr.warning("Not Saved");
        });
    }
  }

  formatLogUpdate(obj) {
    let prefer = this.defaultFeatures.find(x => x.userFeatureId == this.usermanagementobj.userPref);

    let formatedString = ""

    let lName = "";

    if (this.usermanagementobj.lastname !== null && this.usermanagementobj.lastname !== "") {
      lName = ", Last Name: " + this.usermanagementobj.lastname;
    }

    formatedString = "First Name: " + this.usermanagementobj.name +
      lName +
      ", Email ID: " + this.usermanagementobj.mailId +
      ", Phone Number: " + this.usermanagementobj.mobileNumber +
      ", Role: " + this.usermanagementobj.roleName +
      ", IsSMS: " + this.sms +
      ", IsEmail: " + this.email +
      ", IsNotification: " + this.notif +
      ", NrSMS: " + this.nrSMS +
      ", Preference: " + prefer.name;
    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "User Profile",
      "actionPerformed": "User profile has been updated" + " -" + formatedString
    }

    this.cmnService.logUpdate(logReq);
  }

  pasteName(event, name) {
    if (!this.cmnService.pasteEvent(event, name)) {
      return false;
    }
  }



  changePswdResponse: any;
  chngobj = new ChangeDefaultPassword;

  saveChangePwd(obj) {
    debugger


    if (this.oldPassword == "" || this.oldPassword === undefined ||
      obj.password == "" || obj.password === undefined ||
      obj.confirmPassword == "" || obj.confirmPassword === undefined) {
      this.toastr.warning(this.cmnService.MANDATORYMESSAGE);
      return false;
    } else {
      if (this.oldPassword == "" || this.oldPassword === undefined) {
        this.toastr.warning("Please current password");
        return false;
      }
      if (obj.password == "" || obj.password === undefined) {
        this.toastr.warning("Please enter password");
        return false;
      } if (obj.password && !String(obj.password).match(this.cmnService.STRONGPSWD_REGX)) {
        this.toastr.warning("Please enter valid password");
        return false;
      }
      if (obj.confirmPassword == "" || obj.confirmPassword === undefined) {
        this.toastr.warning("Please Re-enter Password");
        return false;
      }
      if (obj.password != obj.confirmPassword) {
        this.toastr.warning("Passwords do not match");
        return false;
      }

      this.userManagementService.updateUserPwdV2(obj.password, this.oldPassword).subscribe(result => {
        debugger
        this.changePswdResponse = result;
        if (this.changePswdResponse.sts == "200") {

          this.toastr.success("Updated successfully.");

          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "User Profile",
            "actionPerformed": "Password has been updated for - " + this.usermanagementobj.name
          }

          this.cmnService.logUpdate(logReq);

        } else {
          this.toastr.warning(this.changePswdResponse.msg);
        }
      });
    }
  }
}

export class userdetailobj {

  public UserId: string;
  public mobileNumber: string;
  public name: string;
  public lastname: string;
  public password: string;
  public sms: string;
  public email: string;
  public notif: string;
  public userPref: string;
  public MailId: string;
  public emailVerified: string;
  public mobileNoVerified: string;
  public nrSMS: string;
  public cbWarning: string;
  public cbCritical: string;
  public cbGood: string;
}