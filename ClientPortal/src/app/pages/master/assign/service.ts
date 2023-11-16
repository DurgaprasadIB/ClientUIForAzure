import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}


@Injectable({
  providedIn: 'root'
})
export class AssignService {


  assetUrl: string;
  constructor(private http: HttpClient, private _commonService: IdeaBService) {
    this.assetUrl = _commonService.BASE_URL_ASSET;
  }

  CheckDevice(obj: any) {
     this._commonService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this._commonService.ReAssetToken
      })

    };
    return this.http.post(this.assetUrl + 'Sensor/CheckDevice', obj, HTTPOPTIONS_ASSET);

  }

  getAssignUnassignedTracker(inputData: any): any {
    // debugger;
     this._commonService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this._commonService.ReAssetToken
      })

    };
    inputData.clientId = this._commonService.getClientID();
    return this.http.post(this.assetUrl + 'Master/GetAssignUnAssignTracker', inputData, HTTPOPTIONS_ASSET);
  }

  getAssignedTracker(inputData: any): any {
    // debugger;
     this._commonService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this._commonService.ReAssetToken
      })

    };
    return this.http.post(this.assetUrl + 'Sensor/AssignedSensor', inputData, HTTPOPTIONS_ASSET);
  }


  getUserDetails(): any {
    debugger;
     this._commonService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this._commonService.ReAssetToken
      })

    };
    var inputData = { "clientId": this._commonService.getClientID(), "loginID": this._commonService.getLoginUserID() }
    return this.http.post(this.assetUrl + 'User/details', inputData, HTTPOPTIONS_ASSET);
  }

  getUserAndFreeSensorDetails(): any {
    debugger;
     this._commonService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this._commonService.ReAssetToken
      })

    };
    var inputData = { "clientId": this._commonService.getClientID(), "loginID": this._commonService.getLoginUserID() }
    return this.http.post(this.assetUrl + 'Sensor/unAssignedSensor', inputData, HTTPOPTIONS_ASSET);
  }


  insertAssingedTracker(inputData: any): any {
    debugger
    // inputData.clientId= this._commonService.getClientID();
     this._commonService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this._commonService.ReAssetToken
      })
    };
    // inputData.clientId= this._commonService.getClientID();

    return this.http.post(this.assetUrl + 'Sensor/AssignSensor', inputData, HTTPOPTIONS_ASSET);
  }

}
