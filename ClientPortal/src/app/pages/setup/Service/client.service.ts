import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  HubLst: any = "";
  SnrLst: any = "";

  constructor(private http: HttpClient,
    private commanService: IdeaBService) { }


  checkDomainCreated(clientDB) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;

    jsonData = {
      "Domain": clientDB
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Client/DomainStatus', jsonData, HTTPOPTIONS_ASSET)

  }

  getHardwareTypes() {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };


    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/GetHardwareTypes', HTTPOPTIONS_ASSET)

  }

  getDataTypes() {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };


    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/DataTypes', HTTPOPTIONS_ASSET)

  }

  ClientProfile(jsondata, uploadLogo, uploadbgImage) {

    // debugger
    jsondata.Validity.month = jsondata.Validity.month.length == 1 ? "0" + jsondata.Validity.month : jsondata.Validity.month;
    jsondata.Validity.day = jsondata.Validity.day.length == 1 ? "0" + jsondata.Validity.day : jsondata.Validity.day;

    let headers = new HttpHeaders();
    let params = new HttpParams();
    const formData: FormData = new FormData();

    debugger

    for (let i = 0; i < uploadLogo.length; i++) {
      formData.append('uploadlogo', uploadLogo[i], uploadLogo[i].name);
    }
    for (let i = 0; i < uploadbgImage.length; i++) {
      formData.append('uploadbg', uploadbgImage[i], uploadbgImage[i].name);
    }

    formData.append('AppName', jsondata.AppName);
    formData.append('Address', jsondata.Address);
    formData.append('Address3', jsondata.Address3);
    formData.append('Address4', jsondata.Address4);
    formData.append('AliasName', jsondata.AliasName);
    formData.append('ClientID', jsondata.ClientID);
    formData.append('ClientName', jsondata.ClientName);
    formData.append('ContactPersonEmail', jsondata.ContactPersonEmail);
    formData.append('ContactPersonMobileNo', jsondata.ContactPersonMobileNo);
    formData.append('ContactPersonName', jsondata.ContactPersonName);
    //formData.append('DefaultMap', jsondata.DefaultMap);
    formData.append('ISDCode', jsondata.ISDCode);
    //formData.append('OfficeEmailID', jsondata.OfficeEmailID);
    formData.append('PhoneNumber', jsondata.PhoneNumber);
    //formData.append('RMNnumber', jsondata.RMNnumber);
    formData.append('SaveMode', jsondata.SaveMode);
    formData.append('Validity', jsondata.Validity.year + "-" + jsondata.Validity.month + "-" + jsondata.Validity.day);
    formData.append('Domain', jsondata.Domain);
    formData.append('ZipCode', jsondata.ZipCode);
    //formData.append('countryDateFormat', jsondata.countryDateFormat);
    //formData.append('countryTimeZone', jsondata.countryTimeZone);
    formData.append('LoginId', this.commanService.getLoginUserID());
    formData.append('IsActive', jsondata.IsActive);
    formData.append('hasLogoPath', jsondata.isUploadLogo);
    formData.append("removeLogo", jsondata.removeLogo);
    formData.append('hasbgPath', jsondata.isUploadbg);
    formData.append("removebgImage", jsondata.removebg);

    debugger;

    this.HubLst = "";
    this.SnrLst = "";

    jsondata.HubIds.forEach(element => {
      this.HubLst += element.HUB + ',';
    });


    jsondata.SensorIds.forEach(element => {
      this.SnrLst += element.sensorid + ',';
    });

    formData.append("HubIds", this.HubLst);
    formData.append("SensorIds", this.SnrLst);

    //  this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    // const HTTPOPTIONS_ASSET = {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    // };

    // jsondata.LoginId = this.commanService.getLoginUserID();
    //  return this.http.post(this.commanService.BASE_URL_ASSET + 'Client/create', jsondata, HTTPOPTIONS_ASSET)

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Client/create', formData)

  }

  addSensor(obj: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;
    debugger;
    jsonData = {
      "clientDB": obj.clientDB, "sensorId": obj.SensorId, "sensorIds": obj.SensorIDS, "dataFormat": obj.DataFormat, "sensorType": obj.SensorType, "modelNo": obj.ModelNo, "vendor": obj.Vendor,
      "isActive": obj.IsSensorActive, "dateOfDelivery": obj.Delivery
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/AddSensor', jsonData, HTTPOPTIONS_ASSET)

  }

  HWDataFormat(obj: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;
    debugger;
    jsonData = {
      "shortCode": obj.shortCode, "key": obj.dataKey, "keyName": obj.dataKeyName,
      "bool1": obj.bool1, "bool0": obj.bool0, "convertion": obj.Convertion,
      "uom": obj.UoM, "show": obj.showLive, "readWrite": obj.readWrite
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/AddKeyType', jsonData, HTTPOPTIONS_ASSET)

  }

  GetDataFormat(shortCode: any, sensorId: any, clientDB: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;
    jsonData = {
      "shortCode": shortCode,
      "sensorId": sensorId,
      "clientDB": clientDB
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/GetDataFormat', jsonData, HTTPOPTIONS_ASSET)

  }

  UpdateHWFormat(obj: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;
    debugger;


    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/UpdateHWFormat', obj, HTTPOPTIONS_ASSET)

  }

  addHub(obj: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;

    jsonData = {
      "clientDB": obj.clientDB, "hubId": obj.HubId, "hubIds": obj.SensorIDS, "hubCategory": obj.HubCategoryId, "modelNo": obj.ModelNo, "vendor": obj.Vendor,
      "isActive": obj.IsSensorActive, "dateOfDelivery": obj.Delivery
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/AddHub', jsonData, HTTPOPTIONS_ASSET)

  }

  addHardwaretype(obj: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;
    debugger
    jsonData = {
      "TypeValue": obj.HardwareName, "TypeName": obj.HardwareType,
      "shortCode": obj.ShortName, "uom": obj.UoM, "os": obj.OS,
      "ModelNo": obj.ModelNo, "Vendor": obj.Vendor,
      "savemode": obj.savemode
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/AddType', jsonData, HTTPOPTIONS_ASSET)

  }

  getClientSensor(clientDB) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;

    jsonData = {
      "clientDB": clientDB
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Sensor/GetSensors', jsonData, HTTPOPTIONS_ASSET)

  }

  getClientProfile(c_id, clientDB) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData;
    if (c_id == "") {
      jsonData = { "LoginId": this.commanService.getLoginUserID() };
    } else {
      jsonData = { "ClientID": c_id, "LoginId": this.commanService.getLoginUserID(), clientDB: clientDB };
    }
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Client/details', jsonData, HTTPOPTIONS_ASSET)
  }

  deleteClientProfile(c_id: string): any {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsonData = { "ClientID": c_id, "LoginId": this.commanService.getLoginUserID() };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Client/remove', jsonData, HTTPOPTIONS_ASSET)
  }

  saveSiteAdmin(jsondata) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    jsondata.LoginId = this.commanService.getLoginUserID();
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/SiteAdminCreate', jsondata, HTTPOPTIONS_ASSET)
  }

  getSiteAdminById(siteAdmin_id, clientDB) {

    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsonData = { siteAdminId: siteAdmin_id, loginId: this.commanService.getLoginUserID(), clientDB: clientDB };
    //debugger;
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/SiteAdminDetails', jsonData, HTTPOPTIONS_ASSET)
  }

  getAccess(client_id, site_id, ClientDB) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsondata = { siteID: site_id, clientID: client_id, loginID: this.commanService.getLoginUserID(), clientDB: ClientDB };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Master/access', jsondata, HTTPOPTIONS_ASSET)
  }


  AssignPermissions(client_id, site_id, features_List, defaultFeatureId, ClientDB) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsondata = {
      siteID: site_id, clientID: client_id,
      loginID: this.commanService.getLoginUserID(), featureIDs: features_List, defaultFeatureID: defaultFeatureId,
      clientDB: ClientDB
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Master/assign', jsondata, HTTPOPTIONS_ASSET)
  }

  ChangeDefaultPassword(password) {
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
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/updatePwd', jsonData, HTTPOPTIONS_ASSET)
  }

  ChangeDefaultPassword2(password, MobileNo, FirstOTP) {
    debugger;
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    var jsonData = {
      userID: this.commanService.getLoginUserID(),
      clientID: this.commanService.getClientID(),
      password: password,
      mobileNumber: MobileNo,
      OTP: FirstOTP
    }
    //debugger;
    return this.http.post(this.commanService.BASE_URL_ASSET + 'User/updatePwd', jsonData, HTTPOPTIONS_ASSET)
  }
  getStates_TimeZone(countryId) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var jsonData = {
      userID: this.commanService.getLoginUserID(),
      clientID: this.commanService.getClientID(),
      countryId: countryId
    }

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Client/StatesByCountry', jsonData, HTTPOPTIONS_ASSET)

  }
}
