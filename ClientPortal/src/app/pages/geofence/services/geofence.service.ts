import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {

  [x: string]: any;
  assetUrl: string;
  jioUrl: string;
  constructor(private http: HttpClient,
    private commanService: IdeaBService) {
    this.assetUrl = commanService.BASE_URL_ASSET;
  }


  savePolygon(data: string, loc: string, latLongs: any, geofennceType: string, geofenceID: string, saveMode:string) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var dataParameters: any = JSON.stringify({ "geofenceID": geofenceID, "geofenceName": data, "geoLocation": loc, "fenceCoOrdinates": { "coOrdinates": latLongs }, "shapeType": geofennceType, "clientID": sessionStorage.getItem("CLINETID"), "userID": sessionStorage.getItem("LOGINUSERID"), "saveMode":saveMode });
    return this.http.post(this.assetUrl + 'Geofence/InsertPolygon', dataParameters, HTTPOPTIONS_ASSET);
  }

  saveGeofence(data: string, loc: string, _latitude: any, _longitude: any, radius: string, geofennceType: string, geofenceID: string,saveMode:string) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var dataParameters: any = JSON.stringify({ "geofenceID": geofenceID, "geofenceName": data, "geoLocation": loc, "latitude": _latitude, "longitude": _longitude, "radius": radius, "shapeType": geofennceType, "clientID": sessionStorage.getItem("CLINETID"), "userID": sessionStorage.getItem("LOGINUSERID"),"saveMode":saveMode});
    return this.http.post(this.assetUrl + 'Geofence/InsertGeofence', dataParameters, HTTPOPTIONS_ASSET);
  }

  deleteGeofenceforJiomotive(RequestList: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    let j = RequestList.jioGeofenceID.replace(/["]/g, "");
    let k = RequestList.siteAdmin.replace(/["]/g, "");

    const Delete_httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.commanService.JIOTOKENID }),
      body: RequestList
    };
    return this.http.delete(this.jioUrl + 'geofence/users/' + k + '/regions/' + j, Delete_httpOptions);
  }

  deleteGeofenceDetails(geofence_id: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var dataParameters: any = JSON.stringify({ "geofenceID": geofence_id,"userID":sessionStorage.getItem("LOGINUSERID") })
    //let j = RequestList.geofenceID.replace(/["]/g, "");
    return this.http.post(this.assetUrl + 'Geofence/Delete', dataParameters, HTTPOPTIONS_ASSET);

  }

  GetGeofences(ClientID: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    // alert( sessionStorage.getItem('ASSETTL_TOKEN'));
    var dataParameters: any = JSON.stringify({ "clientID": ClientID ,"userID": this.commanService.getLoginUserID()})
    return this.http.post(this.assetUrl + 'Geofence/GetGeofenceMaster', dataParameters, HTTPOPTIONS_ASSET);
  }

  GetPolygonGeofencesDetails(ClientID: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var dataParameters: any = JSON.stringify({ "clientID": ClientID, "userID": this.commanService.getLoginUserID() })
    return this.http.post(this.assetUrl + 'Geofence/GetGeofenceMasterAssigned', dataParameters, HTTPOPTIONS_ASSET);
  }

  getAssignunAssignTrackers(geofenceID: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var dataParameters: any = JSON.stringify({ "geofenceID": geofenceID, "clientID": this.commanService.getClientID(), "userID": this.commanService.getLoginUserID() });
    return this.http.post(this.assetUrl + 'Geofence/AssignedUnassignedAssets', dataParameters, HTTPOPTIONS_ASSET);
  }

  // assignGeofence(inputData: any, imeiNo: string) {
  //   var Topic: any = { "tpc": "jioiot/svca/tracker/" + imeiNo + "/UC/rev/cmd" }

  //   console.log(Topic.tpc);
  //   console.log(sessionStorage.getItem('JIO_TOKEN'));

  //   var httpOptionsNew: any = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json', 'Topic-Info': Topic,
  //       "Access-Control-Allow-Methods": "POST",
  //       'Authorization': "Bearer" + sessionStorage.getItem('JIO_TOKEN')
  //     })

  //   };
  //   return this.http.post(this.jioUrl + 'cats-services/v1.0/api/publish', inputData, httpOptionsNew);
  // }

  assignGeofenceAssTl(inputData: any) {
     this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    return this.http.post(this.assetUrl + 'Geofence/InsertAssingedGeofences', inputData, HTTPOPTIONS_ASSET);
  }

}

