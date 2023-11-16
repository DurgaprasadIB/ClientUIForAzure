import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { IdeaBService } from './ideab.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class DeviceDataService {
  constructor(private atpService: IdeaBService,
    private http: HttpClient) { }

  getWhiteListedDeviceDetails() {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };
    var jsonData;
    jsonData = {

    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetWhiteListedDevices', jsonData, HTTPOPTIONS_ASSET);
  }

  getIoTControllers() {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };
    var jsonData;
    jsonData = {

    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/getIoTControllers', jsonData, HTTPOPTIONS_ASSET);
  }

  GetDataFormat(shortCode: any, clientDB: any) {

    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.atpService.ReAssetToken })
    };

    var jsonData;
    jsonData = {
      "shortCode": shortCode,
      "clientDB": clientDB
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetDataFormat', jsonData, HTTPOPTIONS_ASSET)

  }

  deleteDevice(deviceId: string) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = { "DeviceId": deviceId }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/Remove', JsonObj, HTTPOPTIONS_ASSET);

  }

  saveIotControl(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };



    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/saveIotControl', obj, HTTPOPTIONS_ASSET);
  }

  saveSubClient(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/AddSubClient', obj, HTTPOPTIONS_ASSET);
  }

  GetSubClient(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetSubClient', obj, HTTPOPTIONS_ASSET);
  }

  onBoardDevice(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };

    var JsonObj = {
      "DeviceName": obj.deviceName, "ferquency": obj.frequency,
      "DeviceId": obj.deviceId, "loginId": obj.loginId,
      "mqttPubTopic": obj.mqttPubTopic,
      "latitude": obj.deviceLat, "logitude": obj.deviceLng,
      "regionId": obj.regionId, "isActive": obj.devActive,
      "alertDay": obj.alertDay, "nextDate": obj.nextDate,
      "lastDate": obj.lastDate, "iotcontroller": obj.iotCtrl,
      "alertCount": obj.alertCount,
      "subClientId": obj.subClientId
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/onBoardDevice', JsonObj, HTTPOPTIONS_ASSET);
  }

  deviceMaintenance(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };

    var JsonObj = {
      "DeviceId": obj.deviceId, "loginId": obj.loginId,
      "alertDay": obj.alertDay, "nextDate": obj.nextDate,
      "lastDate": obj.lastDate, "remarks": obj.Remarks,
      "instruction": obj.instruction, "maintainFrequency": obj.frequency,
      "astInstructions": obj.astInstructions, "assignId": obj.assignId
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/devMaintenance', JsonObj, HTTPOPTIONS_ASSET);
  }

  ticketUpdate(obj: any) {
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));

    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.atpService.ReAssetToken
      })
    };

    var JsonObj = {
      "ticketId": obj.ticketId,
      "remarks": obj.remarks,
      "status": obj.status,
      "astInstructions": obj.astInstructions,
      "userId": obj.loginId
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/UpdateTicket', JsonObj, HTTPOPTIONS_ASSET);

  }

  NIdeviceMaintenance(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };

    var JsonObj = {
      "assetId": obj.assetId, "installedDate": obj.installedDate,
      "DeviceId": obj.deviceId, "loginId": obj.loginId,
      "alertDay": obj.alertDay, "nextDate": obj.nextDate,
      "lastDate": obj.lastDate, "remarks": obj.Remarks,
      "instruction": obj.instruction, "regionId": obj.regionId,
      "mobileNo": obj.mobileNo, "mailIds": obj.mailIds,
      "cmobileNo": obj.CmobileNo, "cmailIds": obj.CmailIds,
      "assetName": obj.assetName, "assetDetails": obj.assetDetails,
      "status": "0", "frequency": obj.frequency, "astInstructions": obj.astInstructions
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/NIdevMaintenance', JsonObj, HTTPOPTIONS_ASSET);
  }

  createRegion(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };

    var JsonObj = {
      "regionName": obj.regionName, "regionLat": obj.regionLat,
      "regionLng": obj.regionLng, "regionId": obj.regionId
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/createRegion', JsonObj, HTTPOPTIONS_ASSET);
  }

  getRegion(obj: any) {
    debugger

    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })
    };

    var JsonObj = {
      "loginId": obj.loginId,
      "regionId": obj.regionId
    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/getRegion', JsonObj, HTTPOPTIONS_ASSET);
  }

  getonBoardDevice(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "loginId": obj.loginId,
      "shortCode": obj.shortCode,
      "regionId": obj.regionId
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/Details', JsonObj, HTTPOPTIONS_ASSET);
  }

  deviceWithsubClient(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "loginId": obj.loginId
    }

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/deviceWithsubClient', JsonObj, HTTPOPTIONS_ASSET);
  }


  updateCustomerSHexpDates(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/updateCustomerSHexpDates', obj, HTTPOPTIONS_ASSET);
  }


  getbitwiseDataFormat(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "shortCode": obj.shortCode
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetBitWiseDataFormat', JsonObj, HTTPOPTIONS_ASSET);
  }

  getTickets(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "loginId": obj.loginId,
      "ticketId": obj.ticketId
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetAssetMaintenance', JsonObj, HTTPOPTIONS_ASSET);
  }

  getAssets(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "loginId": obj.loginId,
      "assetId": obj.assetsId
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetAssetMaintenance', JsonObj, HTTPOPTIONS_ASSET);
  }

  getInstructions(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "deviceId": obj.deviceId,
      "assetId": obj.assetId,
      "ticketId": obj.ticketId
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetInstructions', JsonObj, HTTPOPTIONS_ASSET);
  }

  ackTicket(deviceId: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "deviceId": deviceId
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/update_ackData', JsonObj, HTTPOPTIONS_ASSET);
  }

  getDeviceUser(deviceId: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "DeviceId": deviceId
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetDeviceUser', JsonObj, HTTPOPTIONS_ASSET);
  }

  getAccTickets(obj: any) {
    debugger
    this.atpService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.atpService.ReAssetToken
      })

    };

    var JsonObj = {
      "loginId": obj.loginId,
      "ticketId": obj.ticketId,
      "status": obj.status,
      "assetLst": obj.assetList,
      "deviceLst": obj.deviceList,
      "frDate": obj.frDate,
      "toDate": obj.toDate
    }
    return this.http.post(this.atpService.BASE_URL_ASSET + 'Sensor/GetTickets', JsonObj, HTTPOPTIONS_ASSET);
  }
}