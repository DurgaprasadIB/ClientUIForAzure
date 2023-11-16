import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';

@Injectable({
  providedIn: 'root'
})
export class TrackerWhiteListService {

  constructor(
    private http: HttpClient,
    private commanService: IdeaBService
  ) { }


  getTrackerWhiteListDetails(trackerWhiteList: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'WhiteList/Details', trackerWhiteList, HTTPOPTIONS_ASSET)
  }

  createTrackeWhiteList(trackerWhiteList: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'WhiteList/Create', trackerWhiteList, HTTPOPTIONS_ASSET)
  }
  updateTrackeWhiteList(trackerWhiteList: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })

    };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'WhiteList/UpdateDetails', trackerWhiteList, HTTPOPTIONS_ASSET)
  }
  removeTrackeWhiteList(trackerWhiteList: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })

    };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'WhiteList/Remove', trackerWhiteList, HTTPOPTIONS_ASSET)
  }
}
