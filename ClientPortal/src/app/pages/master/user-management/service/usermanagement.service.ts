import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IdeaBService } from 'src/app/pages/GlobalServices/ideab.service';
import { compileComponentFromMetadata } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {
  constructor(
    private http: HttpClient,
    private commanService: IdeaBService
  ) { }
  SaveUser(userobj) {

    debugger

    let headers = new HttpHeaders();
    let params = new HttpParams();
    const formData: FormData = new FormData();

    userobj.loginId = this.commanService.getLoginUserID()
    userobj.clientID = this.commanService.getClientID()

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    debugger
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/create', userobj, HTTPOPTIONS_ASSET)

  }

  updateUserProfile(userobj) {

    debugger

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };
    userobj.clientID = this.commanService.getClientID();
    userobj.loginId = this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/updateUser', userobj, HTTPOPTIONS_ASSET)

  }

  SaveUserReset(userobj) {

    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };
    userobj.clientID = this.commanService.getClientID();
    userobj.loginId = this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/ResetPassword', userobj, HTTPOPTIONS_ASSET)
  }

  SendVerifyMailIdCode(emailId) {

    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };

    var obj: any
    obj = {}

    obj.emailId = emailId;//this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/SendVerifyMailIdCode', obj, HTTPOPTIONS_ASSET)
  }

  EmailVerificationStatus(emailId) {

    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };

    var obj: any
    obj = {}

    obj.emailId = emailId;//this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/EmailVerificationStatus', obj, HTTPOPTIONS_ASSET)
  }

  SendSignUpOTP(mobileNo) {

    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };

    var obj: any
    obj = {}

    obj.mobileNo = mobileNo;//this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/SignupOTP', obj, HTTPOPTIONS_ASSET)
  }

  ValidateOTP(mobileNo,signupOTP) {

    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };

    var obj: any
    obj = {}

    obj.mobileNo = mobileNo;//this.commanService.getLoginUserID();
    obj.otp = signupOTP;//this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/VerifyMobileNo', obj, HTTPOPTIONS_ASSET)
  }

  checkuserPwd(userPwd) {
    debugger;
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsonData = {
      userID: this.commanService.getLoginUserID(),
      password: userPwd
    }
    //debugger;
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/CheckPwd', jsonData, HTTPOPTIONS_ASSET)

  }

  updateUserPwd(password) {
    debugger;
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsonData = {
      userID: this.commanService.getLoginUserID(),
      clientID: this.commanService.getClientID(),
      password: password

    }
    //debugger;
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/ResetPassword', jsonData, HTTPOPTIONS_ASSET)
  }

  updateUserPwdV2(password, oldPassword) {
    debugger;
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsonData = {
      userID: this.commanService.getLoginUserID(),
      password: password,
      oldpassword: oldPassword,
    }
    //debugger;
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/ChangePassword', jsonData, HTTPOPTIONS_ASSET)
  }

  loginId: string;
  clientID: any
  getUserData() {

    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };
    this.clientID = this.commanService.getClientID();
    this.loginId = this.commanService.getLoginUserID();
    var jsonData = { "loginId": this.loginId };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/details', jsonData, HTTPOPTIONS_ASSET)
  }

  getUserById(u_Id) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };
    this.clientID = this.commanService.getClientID();
    this.loginId = this.commanService.getLoginUserID();
    var jsonData = { "userID": u_Id, "loginId": this.loginId, "clientID": this.clientID };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/details', jsonData, HTTPOPTIONS_ASSET)
  }

  deleteUserDetails(u_Id: string, userStatus: string,unverifyUser: string): any {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };
    var jsonData = { "loginId": this.commanService.getLoginUserID(), "userID": u_Id, "changeUserStatus" :  userStatus, "unVerifyUser" : unverifyUser};
    //  var jsonData = { "userID": u_Id };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/remove', jsonData, HTTPOPTIONS_ASSET)
  }

  checkUserTickets(u_Id: string): any {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })

    };
    var jsonData = { "userID": u_Id };
    //  var jsonData = { "userID": u_Id };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/checkUserTickets', jsonData, HTTPOPTIONS_ASSET)
  }

}
