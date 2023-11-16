import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { analyzeAndValidateNgModules, debugOutputAstAsTypeScript } from '@angular/compiler';
import { stringFilterCondition } from 'angular-slickgrid/app/modules/angular-slickgrid/filter-conditions/stringFilterCondition';

@Injectable({
  providedIn: 'root'
})
export class CraneMoniterServiceService {

  constructor(private http: HttpClient,
    private commanService: IdeaBService) { }

  getVehicleDetails(sensorID) {

    var json = {
      "sensorID": sensorID,
      "userID": this.commanService.getLoginUserID()
    }

     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    // const HTTPOPTIONS_ASSET = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': "Bearer " +  this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    //   })
    // };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/Vehicles',
      json, HTTPOPTIONS_ASSET);
  }

  getSliLiveData(selectImIs) {

    //  debugger

    var json = {
      "IMEI": selectImIs,
      "divType": "JioIot",
      "evnt": "EV"
      // "tkn": sessionStorage.getItem("JIO_TOKEN")
    }

     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    // const HTTPOPTIONS_ASSET = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': "Bearer " +  this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    //   })
    // };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/SLIMonitor',
      json, HTTPOPTIONS_ASSET);
  }
  getSliHistoryData(imeis, fromDate, toDate) {

    //debugger

     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    // const HTTPOPTIONS_ASSET = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': "Bearer " +  this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'))
    //   })
    // };

    var json = {
      "IMEI": imeis,
      "divType": "JioIot",
      "evnt": "EV",
      "frd": fromDate,
      "tod": toDate
      // "tkn": sessionStorage.getItem("JIO_TOKEN")
    }
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/SLIHistory',
      json, HTTPOPTIONS_ASSET);

  }

}
