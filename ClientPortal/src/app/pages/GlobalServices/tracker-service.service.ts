import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { IdeaBService } from './ideab.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TrackerServiceService {


  constructor(private atpService: IdeaBService,
    private http: HttpClient) { }
  getTrackerDetailData(tracker: any) {
     debugger
     this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Tracker/Details', tracker, HTTPOPTIONS_ASSET);
  }

  saveTrackerData(jsondata) {
   debugger
     this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Tracker/Create', jsondata, HTTPOPTIONS_ASSET)
  }

  deleteTrackerById(trackerdtl: any) {
    //debugger
     this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Tracker/Remove', trackerdtl, HTTPOPTIONS_ASSET);
  }
  getImsINumber(trackerdtl: any) {
     this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Tracker/GetIMSI', trackerdtl, HTTPOPTIONS_ASSET);
  }
}
