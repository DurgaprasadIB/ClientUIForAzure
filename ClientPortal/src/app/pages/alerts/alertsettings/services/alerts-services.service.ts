import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from 'src/app/pages/GlobalServices/ideab.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsServicesService {

  constructor(private _http: HttpClient,
    private commanService: IdeaBService) { }

  saveAlertData(alertSetting) {

    //debugger

     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    return this._http.post(this.commanService.BASE_URL_ASSET + "Alert/create",
      alertSetting, HTTPOPTIONS_ASSET);
  }

  updateAlert(obj) {

  //debugger
   this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
  const HTTPOPTIONS_ASSET = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.commanService.ReAssetToken
    })
  };

  obj.userId=this.commanService.getLoginUserID();

  // var jsonData = { "userId": this.commanService.getLoginUserID() };
  return this._http.post(this.commanService.BASE_URL_ASSET + "Alert/update", obj, HTTPOPTIONS_ASSET);
  }


  AlertDetails() {
    //debugger
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = { "userId": this.commanService.getLoginUserID() };
    return this._http.post(this.commanService.BASE_URL_ASSET + "Alert/Details", jsonData, HTTPOPTIONS_ASSET);
  }


}
