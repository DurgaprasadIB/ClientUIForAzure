import { Injectable } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  constructor(
    private _http: HttpClient,
    private _commanService: IdeaBService
  ) { }


  getSensorInLive(shortCode: any) {
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };
    var obj = { "loginId": this._commanService.getLoginUserID(), "shortCode": shortCode }
    return this._http.post(this._commanService.BASE_URL_ASSET + 'Sensor/ShowInLive', obj, HTTPOPTIONS_ASSET)

  }

  updateSensorInLive(obj: any) {
    debugger
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };
    var jsonData = {
      "loginId": this._commanService.getLoginUserID(),
      "SSL": obj
    }
    return this._http.post(this._commanService.BASE_URL_ASSET + 'Sensor/updateSSL', jsonData, HTTPOPTIONS_ASSET)

  }

  getliveTemperature(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    // return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/liveTemperature', obj, HTTPOPTIONS_ASSET)
    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/liveTemperatureHumidity', obj, HTTPOPTIONS_ASSET)

  }
  getEnergyView(obj: any){
    debugger
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    // return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/liveTemperature', obj, HTTPOPTIONS_ASSET)
    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/EnergyView', obj, HTTPOPTIONS_ASSET)

  }
  getEnergyConsumptionDetails(obj: any){
    debugger
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };
    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/GetEnergyData', obj, HTTPOPTIONS_ASSET)

  }

  getTrend(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/Trend', obj, HTTPOPTIONS_ASSET)

  }

  getTrendRDS(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/RDSTrend', obj, HTTPOPTIONS_ASSET)

  }
  setTrend(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Sensor/setTrend', obj, HTTPOPTIONS_ASSET)

  }

  corsTestAPI() {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    var obj: any = [];

    return this._http.post('https://adminiot.iotsolution.net/summaryAPI2/api/Info/Clients', obj, HTTPOPTIONS_ASSET)

  }

  sendMqttCmd(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };


    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/MqttCmd', obj, HTTPOPTIONS_ASSET)

  }

  getStatsforDB(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };


    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/getStatsforDB', obj, HTTPOPTIONS_ASSET)

  }

  getrcTrend(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/rcTrend', obj, HTTPOPTIONS_ASSET)

  }

  getrcTrendOnlyValue(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/rcTrendOnlyValue', obj, HTTPOPTIONS_ASSET)

  }

  getMultiTrend(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()


    return this._http.post(this._commanService.BASE_URL_ASSET + 'Live/MultiTrend', obj, HTTPOPTIONS_ASSET)

  }

  getPDF(obj: any) {
    debugger
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Report/ExportPDF', obj, HTTPOPTIONS_ASSET)

  }

  getEnergyConsumptionPDF(obj: any) {
    debugger
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };

    obj.loginId = this._commanService.getLoginUserID()

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Report/ExportConsumptionPDF', obj, HTTPOPTIONS_ASSET)

  }

  getTrackerLiveData(jsondata) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };
    jsondata.evnt = "GPS";
    return this._http.post(this._commanService.BASE_URL_ASSET + 'tracker/live', jsondata, HTTPOPTIONS_ASSET)
  }



  getSensorLiveData(obj: any) {
    // debugger
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    //debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "loginId": obj.loginId, "timezone": obj.timezone, "shortCode": obj.hwType }

    //return this._http.post(this._commanService.BASE_URL_ASSET + 'live/info', jsondata, HTTPOPTIONS_ASSET)
    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/infoV2', jsondata, HTTPOPTIONS_ASSET)
  }
  

  getTileSensorLiveData(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    //debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "deviceName": obj.device, "tileSensor": obj.tileSensor }

    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/tileSensorLive', jsondata, HTTPOPTIONS_ASSET)
  }

  getSensorLiveDataPVR(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    //debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "loginId": obj.loginId, "timezone": obj.timezone, "shortCode": obj.hwType }

    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/InfoPVR', jsondata, HTTPOPTIONS_ASSET)
  }

  getSensorLiveDataByDevices(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "deviceList": obj.deviceList, "loginId": obj.loginId, "timezone": obj.timezone, "shortCode": obj.hwType }
    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/stateInfo', jsondata, HTTPOPTIONS_ASSET)
  }

  getSensorLiveDataByDevicesPVR(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "deviceList": obj.deviceList, "loginId": obj.loginId, "timezone": obj.timezone, "shortCode": obj.hwType }
    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/stateInfoPVR', jsondata, HTTPOPTIONS_ASSET)
  }
  getSensorLiveMoreData(deviceId: string, sensorid: string) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "name": deviceId, "loginId": this._commanService.getLoginUserID(), "deviceId": sensorid }
    //
    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/MoreInfo', jsondata, HTTPOPTIONS_ASSET)
  }

  getDeviceLocation(deviceId: string) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "deviceId": deviceId }
    //
    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/GetDeviceLocation', jsondata, HTTPOPTIONS_ASSET)
  }


  getSensorLiveMoreDataPVR(deviceId: string) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    var jsondata = { "name": deviceId, "loginId": this._commanService.getLoginUserID() }

    return this._http.post(this._commanService.BASE_URL_ASSET + 'live/MoreInfoPVR', jsondata, HTTPOPTIONS_ASSET)
  }
  UpdateSensorSP(obj: any) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };

    return this._http.post(this._commanService.BASE_URL_ASSET + 'Sensor/UpdateSensorSP', obj, HTTPOPTIONS_ASSET)
  }
  getVehicleTrackerLiveData(jsondata) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // //debugger;
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    jsondata.evnt = "EV";
    return this._http.post(this._commanService.BASE_URL_ASSET + 'tracker/VehicleLive', jsondata, HTTPOPTIONS_ASSET)
  }


  getVehicleTrackerHistoryData(jsondata) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    jsondata.evnt = "EV";
    return this._http.post(this._commanService.BASE_URL_ASSET + 'tracker/History', jsondata, HTTPOPTIONS_ASSET)
  }


  getPersonalTrackerHistoryData(jsondata) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };
    //jsondata.evnt = "EV";
    return this._http.post(this._commanService.BASE_URL_ASSET + 'tracker/PTrackHistory', jsondata, HTTPOPTIONS_ASSET)
  }

  getalertLiveData(jsondata) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };
    return this._http.post(this._commanService.BASE_URL_ASSET + 'Report/GetAlertCount', jsondata, HTTPOPTIONS_ASSET)
  }


  getUserDevices(jsondata) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })

    };
    return this._http.post(this._commanService.BASE_URL_ASSET + 'User/updatedDevices', jsondata, HTTPOPTIONS_ASSET)
  }

  getOccupiedNotOccupiedList() {
    var jsonData = {
      "userId": this._commanService.getLoginUserID(),
      "clientId": this._commanService.getClientID()
    };

    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));

    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };

    return this._http.post(this._commanService.BASE_URL_ASSET + 'FMSGuestManagement/Occupiedstatus', jsonData, HTTPOPTIONS_ASSET)
  }
}
