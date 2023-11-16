import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsermanagementService } from './service/usermanagement.service';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usermanagement } from '../models/Usermanagement';
import { ToastrService } from 'ngx-toastr';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { LoaderService } from 'src/app/services/loader.service';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'; 5
//import { debug } from 'util';
declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { ClientService } from '../../setup/Service/client.service';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { debug } from 'util';
import { RolemanagementService } from '../rolemanagement/service/rolemanagement.service';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  @Output() userAction = new EventEmitter();

  dataset: any;
  rowData: any;
  alertWarning: any;
  responselist: any = [];
  userlist: any = [];
  usermanagementobj = new Usermanagement();
  userRoles: any = [];
  rolsList: any;
  u_Id: string;
  isData: any;
  isDeleteShow: boolean = false;
  isResetPasswordShow: boolean = false;
  isLastUser: boolean = false;
  isPasswordShow: boolean = true;
  strongPswd_regx = this.cmnService.STRONGPSWD_REGX;
  ResponseList: any = [];
  isOpen: boolean = false;
  supportLst: any;
  gridObj: any;
  filterAryList: any = [];
  newFilterAryList: any = [];
  usertype: string;
  disabled: boolean = false;
  isShowFooter: boolean = false;
  showUserManagement: boolean = false;
  showroleManagement: boolean = false;
  editUser: boolean = false;

  defaultFeature: any = "";
  defaultFeatureId: any = "";// "671d8cd6-88b8-47bb-bea2-40e103ac0ce4";
  createReport: boolean = false;
  sms: boolean = false;
  email: boolean = false;
  notif: boolean = false;
  nrSMS: boolean = false;
  userActive: boolean = false;
  cbcritical: boolean = false;
  cbwarning: boolean = false;
  cbgood: boolean = false;

  @ViewChild('Modalbtn') modalClient: ElementRef;
  @ViewChild('modalRoot') modalRootPopUp: any;
  @ViewChild('modalResetPswd') modalresetpwd: any;
  @ViewChild('UserSearch') userSearch: ElementRef;
  @ViewChild("E1") e1: ElementRef;
  @ViewChild("E2") e2: ElementRef;
  @ViewChild('E3') pwd: ElementRef;
  @ViewChild('E3') repwd: ElementRef;


  reEnterPassword: any = "";
  userNotDeleted: any = "";

  itemArray: any;
  defaultFeatures: any = [];

  radioItems = [1, 2];
  model = { options: '1' };
  radioMaping: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private cmnService: IdeaBService,
    private userManagementService: UsermanagementService,
    private loaderService: LoaderService,
    private roleService: RolemanagementService,
    public translate: TranslateService

  ) {

    //this.usermanagementobj.locationCheck=="0"

  }

  bgImage: any;
  countryCodeList: any;
  showUnverifyUser: boolean = false;
  ngOnInit() {

    sessionStorage.setItem('liveScreen', "user");
    this.bgImage = sessionStorage.getItem('BGimage');
    this.showUserManagement = true;
    this.countryCodeList = [];
    this.countryCodeList = JSON.parse(sessionStorage.getItem('countryCodeList'));
    debugger

    this.selectRoleAlert = this.translate.instant('UsmselectRole');
    this.timeZoneAlert = this.translate.instant('UsmselectTime');
    this.alertGeofence1 = this.translate.instant('UsmalertGeofence');
    this.alertName1 = this.translate.instant('UsmalertName');
    this.selectRoleAlert1 = this.translate.instant('UsmselectRole');
    this.timeZoneAlert = this.translate.instant('UsmselectTime');
    this.alertState1 = this.translate.instant('UsmalertState');
    this.dateformat1 = this.translate.instant('UsmalertDate');
    this.alertGeofence1 = this.translate.instant('UsmalertGeofence');
    this.alertInvalidName1 = this.translate.instant('UsmalertInvalidName');
    this.selectCountry = this.translate.instant('UsmtoasterScountry');
    this.enterUserContact = this.translate.instant('UsmtoasterContact');
    this.enterEmailId = this.translate.instant('UsmtoasterEmailId');
    this.invalidEmailId = this.translate.instant('UsminValidEmailId');
    this.enterPassword = this.translate.instant("UsmtoasterPassword");
    this.reEnterConfirmPassword = this.translate.instant('UsmreEnterToasterPassword');
    this.toasterValidPassword = this.translate.instant('UsmtoasterValidPassword');
    this.passwordMisMatch = this.translate.instant('UsmtoasterPasswordMisMatch');
    this.selectGeofence = this.translate.instant('UsmtoasterSelectGeofence');
    this.selectGeofenceAndLocation = this.translate.instant('UsmselectLocationOrGeofence');
    this.reEnterPassword = this.translate.instant('UsmresetReenterPassword')
    this.userNotDeleted = this.translate.instant('UsmuserNotDeleted');


    //this.LocationChange(event);
    //  this.usermanagementobj.locationCheck=="0"


    this.loadUserData();
  }

  getFeatures(role: any) {
    debugger
    this.itemArray = []



    this.roleService.getUserRoleFeature(role.roleId).subscribe(result => {

      debugger
      this.itemArray = Object.assign([], result);
      this.createReport = false;
      this.showReportPermission = false;
      this.defaultFeatures = [];
      this.itemArray.siteFeatures.forEach(element => {
        if (element.Checked == true) {
          this.defaultFeatures.push({ "userFeatureId": element.value, "name": element.text });
          if (element.value == "2e4f4847-aded-4e07-96db-c0134f105cf0") {
            this.showReportPermission =  true;
          }
        }
        
        if(this.showReportPermission == true){
          if (role.reportPermission) {
            this.createReport = (role.reportPermission == "1") ? true : false;
          }
          else {
            var roleDetails = this.rolsList.filter(gr => gr.roleId == role.roleId);
            this.createReport = (roleDetails[0].reportPermission == "1") ? true : false;
          }
        }
        
      });
    }, error => {
      this.defaultFeatures = [];
    }


    );
  }

  goRole() {
    this.router.navigateByUrl('/pages/master/rolemanagement')
  }

  loadUserData() {
    this.loaderService.display(true);
    this.dataBindTable();
  }


  dataBindTable() {

    this.dataset = [];
    this.isShowFooter = false;
    $('#userTable').dataTable().fnDestroy();
    this.userManagementService.getUserData().subscribe(data => {
      debugger
      this.loaderService.display(false);
      this.supportLst = data;
      if (this.supportLst !== undefined) {
        this.rolsList = this.supportLst.userRoles;
      }
      this.dataset = this.filterAryList = this.supportLst.userData;
      this.filterAryList = [];

      var loginId = sessionStorage.getItem("LOGINUSERID");

      this.supportLst.userData.forEach(ele => {


        //sms
        if (ele.sms == "1") {
          ele.sms = true;
        }
        else {
          ele.sms = false;
        }

        //email
        if (ele.email == "1") {
          ele.email = true;
        }
        else {
          ele.email = false;
        }

        //notification
        if (ele.notif == "1") {
          ele.notif = true;
        }
        else {
          ele.notif = false;
        }

        //NR alerts
        if (ele.srSMS == "1") {
          ele.srSMS = true;
        }
        else {
          ele.srSMS = false;
        }

        if (ele.userstatus == "1") {
          ele.userstatus = "Active";
        }
        else {
          ele.userstatus = "Inactive";
        }
        //warning and critical
        if (ele.cbcritical == "1") {
          ele.cbcritical = true;
        }
        else {
          ele.cbcritical = false;
        }

        if (ele.cbwarning == "1") {
          ele.cbwarning = true;
        }
        else {
          ele.cbwarning = false;
        }
        if (ele.cbgood == "1") {
          ele.cbgood = true;
        }
        else {
          ele.cbgood = false;
        }

        if (loginId.toLocaleLowerCase() == ele.userID.toLocaleLowerCase()) {
          ele.self = true;
        }
        else {
          ele.self = false;
        }

        this.filterAryList.push(ele);

      });

      if (this.filterAryList.length > 0) {
        this.isShowFooter = true;
      }
      this.tableRefreshData();
    }, error => {
      this.loaderService.display(false);
      this.tableRefreshData();
      this.toastr.warning(error.error.Message);
    });
  }

  tableRefreshData() {
    setTimeout(() => {
      $('#userTable').DataTable({
        paging: this.isShowFooter,
        info: this.isShowFooter,
        "ordering": true,
        columnDefs: [
          {
            orderable: false, targets: "no-sort"
          }
        ]
        //  sort:false,
        //  aoColumns:  [  { "sType": "string-case" },{},{},{},{},{},{} ],
      });
      jQuery('.dataTable').wrap('<div style="overflow-y:auto;" />');
    });
  }

  odataQuery = '';
  conditionBasedGrid: boolean = false;
  conditionBasedGrid1: boolean = false;

  filteredData: any;

  onCloseModal() {
    //  
    this.usermanagementobj = new Usermanagement();
  }

  searchFilter: boolean = false;


  result: boolean = false;
  selectRoleAlert: any
  timeZoneAlert: any
  dateformat1: any
  alertGeofence1: any
  saveNewUser(isForm: any, usermanagementobj) {

    debugger

    usermanagementobj.userID = this.u_Id;
    if (usermanagementobj.userID == "" || usermanagementobj.userID == undefined) {
      usermanagementobj.userID = "";
      usermanagementobj.SaveMode = "Create";
    }
    else {

      usermanagementobj.userID = this.u_Id;
      usermanagementobj.SaveMode = "Modify";

      if (usermanagementobj.roleId == "" ||
        usermanagementobj.roleId === undefined ||
        usermanagementobj.roleId == null) {
        this.toastr.warning(this.selectRoleAlert);
        return false;
      }
    }
    usermanagementobj.userName = usermanagementobj.mailId;

    this.result = this.checkValidations(usermanagementobj);

    if (this.result) {
      if (usermanagementobj.SaveMode == "Create") {
        if (usermanagementobj.password == "" || usermanagementobj.password === undefined) {
          this.toastr.warning(this.enterPassword);
          return false;
        }
        if (usermanagementobj.confirmPassword == "" || usermanagementobj.confirmPassword === undefined) {
          this.toastr.warning(this.reEnterConfirmPassword);
          return false;
        }
        if (usermanagementobj.password && !String(usermanagementobj.password).match(this.strongPswd_regx)) {
          this.toastr.warning(this.toasterValidPassword);
          return false;
        }
        if (usermanagementobj.password != usermanagementobj.confirmPassword) {
          this.toastr.warning(this.passwordMisMatch);
          return false;
        }

      }

      usermanagementobj.sms = (this.sms) ? "1" : "0";
      usermanagementobj.email = (this.email) ? "1" : "0";
      usermanagementobj.notif = (this.notif) ? "1" : "0";
      usermanagementobj.nrSMS = (this.nrSMS) ? "1" : "0";
      usermanagementobj.cbWarning = (this.cbwarning) ? "1" : "0";
      usermanagementobj.cbCritical = (this.cbcritical) ? "1" : "0";
      usermanagementobj.cbGood = (this.cbgood) ? "1" : "0";
      usermanagementobj.userStatus = (this.userActive) ? "1" : "0";
      usermanagementobj.createReport = (this.createReport) ? "1" : "0";

      this.loaderService.display(true);
      this.ResponseList = [];


      this.userManagementService.SaveUser(usermanagementobj).subscribe(data => {

        this.ResponseList = data;
        if (this.ResponseList.sts == "200") {

          this.searchFilter = false;

          if (usermanagementobj.SaveMode == "Create") {
            this.toastr.success("User " + usermanagementobj.name + " " + usermanagementobj.lastname + " has been created");
          }
          else {
            this.toastr.success("User " + usermanagementobj.name + " " + usermanagementobj.lastname + " has been updated");

          }
          debugger
          this.formatLogUpdate(usermanagementobj.SaveMode == "Create" ? "created" : "updated");
          this.modalRootPopUp.hide();

          this.loaderService.display(false);
          this.loadUserData();

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
  formatLogUpdate(action: string) {

    let roleObj = this.rolsList.find(x => x.roleId == this.usermanagementobj.roleId);
    let prefer = this.defaultFeatures.find(x => x.userFeatureId == this.usermanagementobj.userPref);
    let formatedString = "First Name: " + this.usermanagementobj.name +
      ", Last Name: " + this.usermanagementobj.lastname +
      ", Email ID: " + this.usermanagementobj.mailId +
      ", Phone Number: " + this.usermanagementobj.mobileNumber +
      ", Role: " + roleObj.roleName +
      ", IsSMS: " + this.sms +
      ", IsEmail: " + this.email +
      ", IsNRSMS: " + this.nrSMS +
      ", IsNotification: " + this.notif +
      ", Preference: " + prefer.name +
      ", IsActive: " + this.userActive;
    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "User Management",
      "actionPerformed": "User has been " + action + ". User info -" + formatedString
    }

    this.cmnService.logUpdate(logReq);
  }

  editmailid: any;
  resetmobilenumber: any;
  userpassword: any;
  isImage: any = "";
  removeImage1: any = "";
  isEmailVerified: boolean = false;
  isMobileVerified: boolean = false;
  isEmailUnverified:boolean = false;
  removePathFromServer: any = "";
  removebuttonName:any = "";
  showReportPermission:boolean = false;
  OpenModal(status: string) {

    
    //this.radioMaping="0"
    this.isImage = "";
    this.removeImage1 = "";
    this.removePathFromServer = "";
    this.sms = false;
    this.email = false;
    this.notif = false;
    this.nrSMS = false;
    this.cbcritical = false;
    this.cbwarning = false;
    this.cbgood = false;
    this.signupOTP = "";

    if (status == 'Create') {
      this.isEmailVerified = false;
      this.isMobileVerified = false;
      this.otpSent = false;
      this.u_Id = "";
      this.usermanagementobj = new Usermanagement();
      this.isResetPasswordShow = false;
      this.isLastUser = false;
      this.isDeleteShow = false;
      this.isPasswordShow = true;
      this.showUnverifyUser = false;

      this.userActive = true;
      // this.usertype = "New User";
      this.usertype = "Create user";//this.translate.instant('UsmNewUser');
      this.radioMaping = "0"
      this.disabled = false;
      this.e1.nativeElement.style.borderLeft = "";
      this.e2.nativeElement.style.borderLeft = "";

      this.NotbasedOnFileValidate = true;
      this.basedOnFileValidate = false;
    }
    else {

      this.isMobileVerified = true;
      this.isEmailVerified = true;
      
      this.otpSent = true;
      this.basedOnFileValidate = false;

      this.modalRootPopUp.show();
      var statusSplit = status.split("~");

      this.u_Id = statusSplit[0];
      this.isPasswordShow = false;
      this.isDeleteShow = true;
      //this.usertype = "Edit User";
      this.usertype = this.translate.instant('UsmEdit User');
      this.disabled = true;
      this.usermanagementobj = new Usermanagement();

      this.e1.nativeElement.style.borderLeft = "";
      this.e2.nativeElement.style.borderLeft = "";
      debugger
      var role: any = []
      role.roleId = statusSplit[2];
      if (sessionStorage.getItem("LoginUser") == "support@ideabytesiot.com") {
        this.showUnverifyUser = true;
      }
      else {
        this.showUnverifyUser = false;
      }
      this.getFeatures(role);

    }
    this.rolsList = this.supportLst.userRoles;
    if (this.u_Id != "") {
      this.loaderService.display(true);

      this.isData = [];
      this.userManagementService.getUserById(this.u_Id).subscribe(result => {
        debugger
        this.isData = result;

        this.NotbasedOnFileValidate = true;

        // 
        this.usermanagementobj = this.isData.userData[0];
        this.editmailid = this.usermanagementobj.mailId;
        if (this.usermanagementobj.canResetPwd == "False") {
          this.isResetPasswordShow = false;
        }
        else {
          this.isResetPasswordShow = true;
        }
        if (this.usermanagementobj.isLastUser == "1") {
          this.isLastUser = true;
        }
        else {
          this.isLastUser = false;
        }
        //if()password ConfirmPassword
        this.usermanagementobj.mobileNumber = this.usermanagementobj.mobileNumber;
        this.userpassword = this.usermanagementobj.password;
        //this.usermanagementobj.ConfirmPassword = this.usermanagementobj.ConfirmPassword;
        this.resetmobilenumber = this.usermanagementobj.mobileNumber;
        this.usermanagementobj.roleName = this.usermanagementobj.roleId == "" ? null : this.usermanagementobj.roleId;
        //this.isDeleteShow = true;
        this.sms = (this.isData.userData[0].sms == "1") ? true : false;
        this.email = (this.isData.userData[0].email == "1") ? true : false;
        this.notif = (this.isData.userData[0].notif == "1") ? true : false;
        this.nrSMS = (this.isData.userData[0].nrSMS == "1") ? true : false;
        this.cbgood = (this.isData.userData[0].cbGood == "1") ? true : false;
        this.cbcritical = (this.isData.userData[0].cbCritical == "1") ? true : false;
        this.cbwarning = (this.isData.userData[0].cbWarning == "1") ? true : false;
        this.createReport = (this.isData.userData[0].createReport == "1") ? true : false;
        this.usermanagementobj.cCode = this.isData.userData[0].countryCode;
        this.isEmailUnverified = (this.isData.userData[0].emailIdVerified == "1") ? true : false;
        //this.userActive = (this.isData.userData[0].userstatus == "1") ? true : false;
        this.userActive = (this.isData.userData[0].userstatus == "1") ? true : false;
        this.removebuttonName = this.userActive == true ? "Deactivate" : "Activate"
        
        this.editUser = true;
        this.loaderService.display(false);
      });

    }
    else {
      this.editUser = false;
      this.usermanagementobj = new Usermanagement();
      this.loaderService.display(false);
    }
    this.modalClient.nativeElement.click();
  }

  closemodal() {

    this.usermanagementobj = new Usermanagement();
    this.modalRootPopUp.hide();
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

  openResetPwd() {

    this.usermanagementobj.ResetConfirmPassword = "";
    this.usermanagementobj.ResetPassword = "";

    this.modalresetpwd.show()
  }

  saveResetPwd(isvalid: boolean, obj) {



    if (isvalid) {
      obj.password = obj.ResetPassword;
      obj.ConfirmPassword = obj.ResetConfirmPassword;
      if (obj.password == "" || obj.password == undefined) {
        this.toastr.warning(this.enterPassword);
        return false;
      }
      if (obj.password && !String(obj.password).match(this.cmnService.STRONGPSWD_REGX)) {
        this.toastr.warning(this.toasterValidPassword);
        return false;
      }
      if (obj.ConfirmPassword == "" || obj.ConfirmPassword == undefined) {
        this.toastr.warning(this.reEnterPassword);
        return false;
      }
      if (obj.password != obj.ConfirmPassword) {
        this.toastr.warning(this.passwordMisMatch);
        return false;
      }
      obj.ConfirmPassword = "";
      obj.userID = this.u_Id;
      obj.SaveMode = "Modify";
      obj.mobileNumber = this.resetmobilenumber;
      this.loaderService.display(true);
      this.ResponseList = [];
      this.userManagementService.SaveUserReset(obj).subscribe(result => {
        this.ResponseList = result;

        if (this.ResponseList.sts == "200") {
          this.toastr.success(this.ResponseList.msg);
          this.searchFilter = false;

          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "User Management",
            "actionPerformed": "Reset Password has been completed for " + this.usermanagementobj.name
          }

          this.cmnService.logUpdate(logReq);
          this.modalresetpwd.hide();
        }
        else {
          this.toastr.warning(this.ResponseList.msg);
        }
        this.loaderService.display(false);
      });
    }
    else {
      this.pwdValidations(obj);

      this.loaderService.display(false);
      // this.toastr.warning(this.cmnService.MANDATORYMESSAGE);
    }
  }
  pwdval: any
  reenterpwd: any

  pwdValidations(obj) {


    this.pwdval = this.translate.instant('Usmenterresetpwd');
    this.reenterpwd = this.translate.instant('UsmreEnterToasterPassword');

    obj.password = obj.ResetPassword;
    obj.ConfirmPassword = obj.ResetConfirmPassword;
    if (obj.password == "" || obj.password == undefined) {
      this.toastr.warning(this.pwdval);
      return false;
    }
    if (obj.ConfirmPassword == "" || obj.ConfirmPassword == undefined) {
      this.toastr.warning(this.reenterpwd);
      return false;
    }
  }

  deletealert1: any;
  DeleteUser(userStatus:any,unverifyUser:any) {
    this.deletealert1 = this.translate.instant('Usmdeletealert');

    var u_Id = this.usermanagementobj.userID;

    var respTkt: any
    //getting tickets
    if(u_Id != " "){
      this.userManagementService.deleteUserDetails(u_Id,userStatus,unverifyUser).subscribe(result => {
        this.ResponseList = result;
        if (this.ResponseList.sts == "200") {

          $('#userTable').dataTable().fnDestroy();
          this.toastr.success(this.ResponseList.msg);
          this.modalRootPopUp.hide();
          this.searchFilter = false;
          this.conditionBasedGrid = true;

          this.dataBindTable();

        }
        else {
          this.toastr.warning(this.ResponseList.msg);

        }
        this.loaderService.display(false);
      })
    }
    else{
      return false;
    }
    // if (u_Id != " ") {
    //   Swal({
    //     title: '<div class="row"><div class="col-md-12" style="font-size:small;">Please change or close tickets / devices assigned before removing user.</div><div class="col-md-12" style="font-size:medium;padding-top: 2%;"> Are you sure to delete the user ?</div></div>',
    //     type: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     cancelButtonText: this.translate.instant('Cancel'),
    //     confirmButtonText: this.translate.instant('SwalYes')
    //   }).then((deletealert1) => {
    //     if (deletealert1.value) {
    //       this.loaderService.display(true);
    //       this.ResponseList = [];
    //       this.userManagementService.deleteUserDetails(u_Id).subscribe(result => {
    //         this.ResponseList = result;
    //         if (this.ResponseList.sts == "200") {

    //           $('#userTable').dataTable().fnDestroy();
    //           this.toastr.success(this.ResponseList.msg);
    //           this.modalRootPopUp.hide();
    //           this.searchFilter = false;
    //           this.conditionBasedGrid = true;

    //           this.dataBindTable();

    //         }
    //         else {
    //           this.toastr.warning(this.ResponseList.msg);

    //         }
    //         this.loaderService.display(false);
    //       }),
    //         error => {
    //           this.toastr.warning("User Not Deleted");
    //           this.loaderService.display(false);
    //         }
    //     }

    //   });


    // }
    // else {
    //   return false;
    // }


    return false;

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
  alertState1: any
  selectRoleAlert1: any
  alertName1: any
  alertInvalidName1: any
  selectCountry: any = ""
  enterUserContact: any = ""
  enterEmailId: any = ""
  invalidEmailId: any = ""
  enterPassword: any = ""
  reEnterConfirmPassword: any = ""
  toasterValidPassword: any = ""
  passwordMisMatch: any = ""
  selectGeofence: any = ""
  selectGeofenceAndLocation: any = "";

  checkValidations(usermanagementobj) {


    if (usermanagementobj.name == "" ||
      usermanagementobj.name === undefined ||
      usermanagementobj.name == null) {
      this.toastr.warning("Please enter First Name");
      return false;
    }

    if (usermanagementobj.name.match(/^[0-9 ]+$/g) || usermanagementobj.name.match(/^[ ]+$/g)) {
      this.usermanagementobj.name = "";
      this.toastr.warning("First Name " + this.translate.instant('NumericSpacesValidation'));
      return false;
    }

    if (!this.cmnService.nameLengthCheck(usermanagementobj.name)) {
      // this.toastr.warning(this.cmnService.nameLengthCheckText);
      this.toastr.warning("First Name Maxlength Exceed")
      return false;
    }

    if (usermanagementobj.name.startsWith("0") || usermanagementobj.name.startsWith("1") ||
      usermanagementobj.name.startsWith("2") || usermanagementobj.name.startsWith("3") ||
      usermanagementobj.name.startsWith("4") || usermanagementobj.name.startsWith("5") ||
      usermanagementobj.name.startsWith("6") || usermanagementobj.name.startsWith("7")
      || usermanagementobj.name.startsWith("8") || usermanagementobj.name.startsWith("9")) {
      //  this.usermanagementobj.name = "";
      this.toastr.warning("First Name " + this.translate.instant('UsmtitleName'));
      return false;
    }

    debugger

    if (usermanagementobj.SaveMode != "Modify") {

      if (usermanagementobj.mobileNumber == "" ||
        usermanagementobj.mobileNumber === undefined ||
        usermanagementobj.mobileNumber == null) {
        this.toastr.warning("Please enter Phone Number");
        return false;
      }

      debugger
      if (usermanagementobj.mailId == "" ||
        usermanagementobj.mailId === undefined ||
        usermanagementobj.mailId == null) {
        // this.toastr.warning("Please enter Email ID");
        // return false;
      }
      else {
        if (!this.cmnService.EmailID_REGX.test(usermanagementobj.mailId)) {
          this.toastr.warning(this.invalidEmailId);
          return false;
        }
      }
    }

    if (usermanagementobj.SaveMode != "Modify") {
      if (usermanagementobj.password == "" || usermanagementobj.password === undefined || usermanagementobj.password == null) {
        this.toastr.warning(this.enterPassword);
        return false;
      }
      if (usermanagementobj.confirmPassword == "" || usermanagementobj.confirmPassword === undefined || usermanagementobj.confirmPassword == null) {
        this.toastr.warning(this.reEnterConfirmPassword);
        return false;
      }
      if (usermanagementobj.password && !String(usermanagementobj.password).match(this.strongPswd_regx)) {
        this.toastr.warning('Invalid password please follow criteria');
        return false;
      }
      if (usermanagementobj.password != usermanagementobj.confirmPassword) {
        this.toastr.warning('Confirm Password should match with Password');
        return false;
      }
    }

    if (usermanagementobj.roleId == "" || usermanagementobj.roleId === undefined || usermanagementobj.roleId == null) {
      this.toastr.warning(this.selectRoleAlert1);
      return false;
    }

    if (!this.cmnService.AcceptFirstChar_REGX.test(usermanagementobj.name)) {
      this.toastr.warning(this.alertInvalidName1);
      return false;
    }

    if (usermanagementobj.SaveMode != "Modify") {
      // if (!this.cmnService.EmailID_REGX.test(usermanagementobj.mailId)) {
      //   this.toastr.warning(this.invalidEmailId);
      //   return false;
      // }
      if (usermanagementobj.c_Code == "" && usermanagementobj.c_Code == undefined) {
        this.toastr.warning('Please select country code');//Please enter User Contact
        return false;
      }
      if (usermanagementobj.mobileNumber == "" && usermanagementobj.mobileNumber == undefined) {
        this.toastr.warning(this.enterUserContact);//Please enter User Contact
        return false;
      }
      // if (usermanagementobj.mailId != "" && usermanagementobj.mailId !== undefined) {
      //   if (!this.cmnService.EmailID_REGX.test(usermanagementobj.mailId)) {
      //     this.toastr.warning(this.invalidEmailId);
      //     return false;
      //   }
      // }
    }

    if (usermanagementobj.userPref == "" || usermanagementobj.userPref == undefined) {

      this.toastr.warning('Please select Preference');
      return false;

    }
    return true;
  }

  checkMobileNo: boolean = false;
  checkMobileNumber(ContactNo): boolean {
    //
    if (ContactNo != undefined && ContactNo != "undefined") {
      if (ContactNo.startsWith("6") || ContactNo.startsWith("7") || ContactNo.startsWith("8") || ContactNo.startsWith("9")) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  basedOnFileValidate: boolean = false;
  NotbasedOnFileValidate: boolean = false;



  pasteName(event, name) {
    if (!this.cmnService.pasteEvent(event, name)) {
      return false;
    }
  }

  spacesCheckedForUserName(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //    this.usermanagementobj.name = "";
    //    this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //    return false;
    //  }
  }


}
