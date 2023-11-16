import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from 'src/app/pages/GlobalServices/ideab.service';

@Injectable({
  providedIn: 'root'
})
export class RolemanagementService {
  constructor(private http: HttpClient,
    private comman: IdeaBService) {
  }

  InsertRole(jsondata) {

    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.comman.ReAssetToken
      })

    };
    jsondata.loginUserID = this.comman.getLoginUserID();
    jsondata.clientID = this.comman.getClientID();
    return this.http.post(this.comman.BASE_URL_ASSET + 'Role/create', jsondata, HTTPOPTIONS_ASSET)
  }


  getRoles(role_id: string) {

     this.comman.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.comman.ReAssetToken
      })
    };
    var jsonData = {
      "clientID": this.comman.getClientID(),
      "loginUserID": this.comman.getLoginUserID(),
      "roleID": role_id
    };
    return this.http.post(this.comman.BASE_URL_ASSET + 'Role/details', jsonData, HTTPOPTIONS_ASSET)
  }

  getRoleFeature(role_id: string) {
     this.comman.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.comman.ReAssetToken
      })

    };
    var jsonData = {
      "clientID": this.comman.getClientID(),
      "loginUserID": this.comman.getLoginUserID(),
      "roleID": role_id
    };
    return this.http.post(this.comman.BASE_URL_ASSET + 'Role/roleFeature', jsonData, HTTPOPTIONS_ASSET)
  }

  getUserRoleFeature(role_id: string) {
     this.comman.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.comman.ReAssetToken
      })

    };
    var jsonData = {
      "clientID": this.comman.getClientID(),
      "loginUserID": this.comman.getLoginUserID(),
      "roleID": role_id
    };
    return this.http.post(this.comman.BASE_URL_ASSET + 'Role/userRoleFeature', jsonData, HTTPOPTIONS_ASSET)
  }

  createRoleFeature(jsondata) {
     this.comman.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.comman.ReAssetToken
      })

    };
    jsondata.loginUserID = this.comman.getLoginUserID();
    jsondata.clientID = this.comman.getClientID();

    return this.http.post(this.comman.BASE_URL_ASSET + 'Role/CreateRoleFeature', jsondata, HTTPOPTIONS_ASSET)
  }

  deleteRoleDetails(role_id: string) {
     this.comman.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.comman.ReAssetToken
      })

    };
    var jsonData = {
      "loginUserID": this.comman.getLoginUserID(),
      "clientID": this.comman.getClientID(),
      "roleID": role_id
    };

    return this.http.post(this.comman.BASE_URL_ASSET + 'Role/remove', jsonData, HTTPOPTIONS_ASSET)
  }
}
