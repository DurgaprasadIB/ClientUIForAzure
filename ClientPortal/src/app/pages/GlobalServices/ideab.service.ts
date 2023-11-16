import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
const datePipe = new DatePipe('en-US');

@Injectable({
  providedIn: 'root'
})

export class IdeaBService {

  HTTPOPTIONS_ASSET = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + sessionStorage.getItem('ACCESS_TOKEN') })

  };

  liveTrend: any;
  ActionType: string;
  BASE_URL_ASSET: string;
  BASE_URL_IOT: string;
  supportMail: string;
  contactNum: string;
  loginBottomLogo: string;
  contactWebURL: string;
  companyName: string;
  /* Common Messages Start */
  SAVEMESSAGE: string;
  ERRORMESSAGE: string;
  ERRORREMOVE: string;
  MANDATORYMESSAGE: string;
  REMOVEMESSAGE: string;
  UPDATEMESSAGE: string;
  /* Common Messages End */

  /* Regular Expression Start */
  STRONGPSWD_REGX: any;
  EmailID_REGX: any;
  ALPHA_REGX: any;
  MOBILE_REGX: any;
  ZIPCODE_REGX: any;
  LATLONG_REGX: any;
  NUMBERONLY_REGX: any;
  IOTSERVERERROR: any;
  pattern: any;
  /* Regular Expression End */
  JIOTOKENID: string;
  ALPHANUMERICS_REGX: any;
  DateComparision: any;
  AcceptFirstChar_REGX: any;
  AlphaNumericsWithSpaceMinus: any;
  // IMEI_REGX:any;

  VERSIONNUMBER: string;
  APPNAME: string;
  FEEDBACKQUEST: string;
  ClientLogoPath: string;
  ClientLoginBackGround: string;
  NOPOLLINGHOURSTIME: any;
  VEHICLESPEEDLIMIT: any;
  DEFAULTNOPOLLINGTIME: any;

  POIEXCELFORMAT: any
  GUESTEXCELFORMAT: any;
  FLIGHTEXCELFORMAT: any;
  ALERTTIMER: any;
  DASHBOARDTIMER: any;

  ReAssetToken: any;

  URL_CHANGE_PATH: string;

  nameLengthMin: number;
  nameLengthMax: number;

  nameLengthCheckText: string;
  RoleTitles: string;
  RoleDescription: string;

  tokenGetObj = {};

  responseList: any;
  AssetToken: any;
  encryptSecretKey = "ASSET^$%";

  constructor(
    private _http: HttpClient,
    public translate: TranslateService,
    private toastr: ToastrService
  ) {

    this.URL_CHANGE_PATH = "//"

    this.ALERTTIMER = 60;//For Alret Timer
    this.DASHBOARDTIMER = 60; //For Dashboard Timer

    this.NOPOLLINGHOURSTIME = 720; //For Nopolling 2 min    
    this.DEFAULTNOPOLLINGTIME = this.NOPOLLINGHOURSTIME + 1 //721; //For Default No Polling Time
    this.VEHICLESPEEDLIMIT = 5; // For Vehicle Speed Limit

    this.VERSIONNUMBER = "1.0.0";
    this.APPNAME = "Sensor Connect";

    this.supportMail = "support@ideabytesiot.com";
    this.contactNum = "Toll Free: +1 888-409-8057";
    this.loginBottomLogo = "./assets/Images/ib.png";
    this.contactWebURL = "http://ideabytes.com/"
    this.ClientLogoPath = "./assets/Images/IoTlogo.png";
    this.ClientLoginBackGround = "./assets/Images/login.png";
    this.companyName = "Ideabytes"
    //this.BASE_URL_ASSET = "https://adminiot.iotserver.live/gubba_API/api/";
    this.BASE_URL_ASSET = "http://localhost:50718/api/";
    //this.BASE_URL_ASSET = "https://adminiot.iiotsystem.online/kaldan_API/api/";
    // this.BASE_URL_ASSET = "https://adminiot.subzeroiot.com/demopvr_api/api/";
    // this.BASE_URL_ASSET = "https://adminiot.vlogdata.net/vlog_API/api/";
    // this.BASE_URL_ASSET = "https://adminiot.dgtrak.online/live_api/api/";
    // this.BASE_URL_ASSET = "https://adminiot.iotsolution.net/dodladairy_api/api/";


    this.SAVEMESSAGE = this.translate.instant('Savesuccess');
    this.ERRORMESSAGE = "Error in save";
    this.ERRORREMOVE = "Error in Remove";
    this.MANDATORYMESSAGE = "Enter all required fields";
    this.REMOVEMESSAGE = this.translate.instant('Removesuccess');
    this.UPDATEMESSAGE = this.translate.instant('Savesuccess');
    this.IOTSERVERERROR = this.translate.instant('OopsServerConnectivitywentwrong');
    this.DateComparision = this.translate.instant('FromdateshouldbelessthanTodate');

    this.FEEDBACKQUEST = "Feedback Request";

    this.STRONGPSWD_REGX = new RegExp(/^(?=.*\d+)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{6,15}$/);
    // should contain atleast one letter and atleast one numeric and must shoud be more than or equal to 6 digits

    this.EmailID_REGX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    this.ALPHA_REGX = /^[A-Za-z ]+$/;// allow alphabets and space
    //this.pattern = /^[a-zA-Z0-9_.-]*$/;   
    this.pattern = /^[a-zA-Z0-9]+(([_][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/;
    //this.pattern =/^[A-Za-z0-9]+$/
    this.MOBILE_REGX = /^[0]?[6789]\d{9}$/;
    this.ZIPCODE_REGX = /^[1-9][0-9]{5}$/;
    this.LATLONG_REGX = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
    //  this.NUMBERONLY_REGX = /^-?[0-9]+(\.[0-9]*){0,1}$/g;
    this.NUMBERONLY_REGX = /^-?[0-9]+(\[0-9]*){0,1}$/g;
    this.ALPHANUMERICS_REGX = /^[a-zA-Z0-9 ]+$/;
    this.AcceptFirstChar_REGX = /^[a-zA-Z][a-zA-Z0-9 ]+$/;
    // this.IMEI_REGX = /^[0-9]{14,15}$/;
    this.AlphaNumericsWithSpaceMinus = /^[a-zA-Z0-9- ]+$/;

    this.nameLengthMin = 1;
    this.nameLengthMax = 30;

    //this.nameLengthCheckText = "Name contain minimum 3 letters and maximum 30 letters."
    this.nameLengthCheckText = this.translate.instant('UsmnameLengthCheckText');
    this.RoleTitles = this.translate.instant('RoleTitles');
    this.RoleDescription = this.translate.instant('RoleDescription');
  }

  LOGINUSERID = this.getLoginUserID();
  CLINETID = this.getClientID();
  DEFAULTPASSWORD = this.getDefaultPassword();
  ADMINEMAILID = this.getAdminMailId();
  ADMINRMN = this.getAdminRmn();

  DATEFORMAT = this.getDateFormat();
  TIMEZONE = this.getTimeZone();

  getDeviceWiseTimeZone(imei) {
    ////debugger
    var timezone = 0;
    try {
      var vehList = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));
      vehList.forEach(element => {
        if (element.deviceNo == imei) {
          timezone = element.timeZone;
        }
      });
    } catch (e) {
      e = null;
    }
    return timezone;
  }

  getTimeZone() {
    return sessionStorage.getItem("TimeZone");
  }

  getDateFormat() {
    return sessionStorage.getItem("DateFormat");
  }

  getAdminMailId() {
    return sessionStorage.getItem("ADMIN_EMAIL_ID");
  }

  getAdminRmn() {
    return sessionStorage.getItem("ADMIN_RMN");
  }

  getLoginUserID() {
    return sessionStorage.getItem("LOGINUSERID");
  }

  getClientID() {
    return sessionStorage.getItem("CLINETID");
  }

  getDefaultPassword() {
    return sessionStorage.getItem("DEFAULTPASSWORD");
  }

  getDefaultLat() {
    return sessionStorage.getItem('DEFAULT_LATITUDE');
  }

  getDefaultLng() {
    return sessionStorage.getItem('DEFAULT_LONGITUDE');
  }

  CalculateTimeStamp(HoursorMin: any) {
    var time;
    // time = HoursorMin / 1000 / 3600; //For Hours
    time = HoursorMin / 1000 / 3600 * 60; //For Min
    return time;

  }

  encryptData(data) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  nameLengthCheck(txt: string) {
    if (txt.length >= this.nameLengthMin && txt.length <= this.nameLengthMax) {
      return true;
    } else {
      return false;
    }
  }

  async GetAccessToken(IPuserId: any) {


    var userId: any
    if (IPuserId === '' || IPuserId === undefined ||  IPuserId === '') {
      userId = sessionStorage.getItem("LoginUser");
    }
    else {
      userId = IPuserId;
    }


    var curenntDate = new Date();
    var milliseconds = Math.floor(curenntDate.getTime() / 1000);
    var Time = (Number(sessionStorage.getItem("ACCESS_TOKEN_EXPIRE_TIME")) == 0 || Number(sessionStorage.getItem("ACCESS_TOKEN_EXPIRE_TIME")) == null) ? milliseconds : Number(sessionStorage.getItem("ACCESS_TOKEN_EXPIRE_TIME"));
    var assetEx = new Date(Time * 1000);
    if (assetEx <= curenntDate) {
      this.responseList = await this.apiCalMethod(userId);
      //debugger
      if (this.responseList.sts == '200') {
        sessionStorage.setItem("ACCESS_TOKEN_EXPIRE_TIME", this.responseList.AccessExpire);
        sessionStorage.setItem("ACCESS_TOKEN", this.responseList.AccessToken);
        this.ReAssetToken = sessionStorage.getItem("ACCESS_TOKEN");
        return this.ReAssetToken;
      }
      else {
        sessionStorage.setItem("ACCESS_TOKEN", '401');
      }
    }
    else {
      this.ReAssetToken = sessionStorage.getItem("ACCESS_TOKEN");
      return this.ReAssetToken;

    }

  }

  async apiCalMethod(userId) {

    this.tokenGetObj = { "userID": userId }

    // this.tokenGetObj = { "userID": "Idea", "password": "Idea#123" }

    const response = await this._http.post(this.BASE_URL_ASSET + 'Login/GetTokenV2', this.tokenGetObj).toPromise();

    return response;
  }

  //fuelmonitoring, tempmonitoring and TripHistory , alerts, geofenceAlerts
  getEpochTimeWithMinusTimeZone(date, imei) {
    //return ((new Date(date).getTime() / 1000));
    //console.log(date);
    //console.log(Number(this.getDeviceWiseTimeZone(imei))+"===>dviceTimezone");
    //console.log((new Date(date).getTime() / 1000));    
    return ((new Date(date).getTime() / 1000));
  }

  //allScreens -- databinding
  DateConvert(datetime: any): any {
    //debugger
    var dt = new Date(datetime);
    dt.setMinutes(Number(this.getTimeZone()));
    //debugger
    var format = this.getDateFormat() + " hh:mm:ss a";
    return datePipe.transform(dt, format)
  }

  //appheader, fuelmonitoring, alertDetails,LiveTRack,MapView, TripHistory and VehSum
  //--databinding
  epochUTCtoDateTimeWithTimeZone(epochDate: any, imei: any): any {
    debugger

    var tz = Number(epochDate) + (Number(this.getDeviceWiseTimeZone(imei)) * 60);
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch

    d.setUTCSeconds(tz);

    var format = this.getDateFormat() + " hh:mm:ss a";
    //console.log(d);
    //console.log(d.toISOString());
    return datePipe.transform(d.toISOString(), format)
  }

  //charts, DistanceDetails and stoppedNodataDetails -- databinding
  epochUTCtoDateTimeNoTime(epochDate) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(Number(epochDate));
    return datePipe.transform(d, this.getDateFormat());
  }

  //Reports -- databinding
  epochUTCtoDateTime(epochDate) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(Number(epochDate));
    return datePipe.transform(d, this.getDateFormat() + " hh:mm:ss a");
  }

  //tracking modules -- databinding
  epochUTCtoDateWithTimeZone(epochDate, imei) {
    var tz = Number(epochDate) + (Number(this.getDeviceWiseTimeZone(imei)) * 60);
    return new Date(tz * 1000);
  }

  //TrackerManagement , doorSensorSummary and EngineRunSummary -- dataBiding
  DateConvertWithOutMin(datetime: any): any {
    ////debugger
    var dt = new Date(datetime);
    dt.setMinutes(dt.getMinutes());
    return datePipe.transform(dt, this.getDateFormat())
  }

  //FOR Iot Reports
  dateConversion(date1: any): any {
    ////debugger
    if (date1 == "") {
      return "";
    }
    else {
      var date = date1.split(" ");
      var date2 = date[0].split("/");
      var date3 = date2[0] + "/" + date2[1] + "/" + date2[2] + " " + date[1];
      var d1 = this.DateConvert(date3);
      var d3 = (date[2] == d1.substring(d1.length - 2, d1.length)) ? d1.substring(0, d1.length - 2) + " " + d1.substring(d1.length - 2, d1.length) : d1.substring(0, d1.length - 2) + " " + date[2]
      return d3;
    }
  }

  pasteEvent(event, name): any {

    if (event.match(/^[0-9]+$/g) || event.match(/^[ ]+$/g)) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (event.startsWith(" ")) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("SpacesValidation"));
      return false;
    }
    else if (event.length > 30) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("ExceedValidation"));
      return false;
    }
    else if (event.match(/^[a-zA-Z0-9 ]+$/)) {
      return true;
    }
    else {
      this.toastr.warning(this.translate.instant("specialCharacters"));
      return false;
    }
  }


  lng: string = "en";
  ChangeMapScript() {

    try {
      if (sessionStorage.getItem("language") != null)
        this.lng = sessionStorage.getItem("language");
    } catch (e) {
      e = null;
    }

    debugger
    //var isContain = false;
    try {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].id == "MapScript") {
          //isContain = true;
          //console.error('before ' + scripts[i].src);
          //debugger
          //scriptArr.push(scripts[i]);
          //scripts[i].src = dynamicScripts;
          document.getElementsByTagName('body')[0].removeChild(scripts[i]);
          //console.error('after ' + scripts[i].src);
          //this.DynamicLoadMapScript();
          // break;
        }
      }
    } catch (e) {
      e = null;
    }

    //if (!isContain) {
    this.DynamicLoadMapScript();
    //}

    // try {
    //   scriptArr.forEach(script => {
    //     document.getElementsByTagName('body')[0].removeChild(script);
    //   });

    // } catch (e) {
    //   e = null;
    // }

    //for (var i = 0; i < dynamicScripts.length; i++) {
    // try {
    //   let node = document.createElement('script');
    //   node.setAttribute('id', 'MapScript');
    //   node.src = dynamicScripts;
    //   node.type = 'text/javascript';
    //   node.async = true;
    //   node.defer = true;
    //   node.charset = 'utf-8';
    //   document.getElementsByTagName('body')[0].appendChild(node);
    // } catch (e) {
    //   console.log("map script load error " + e);
    //   e = null;
    // }
    //}
  }

  DynamicLoadMapScript() {

    try {
      if (sessionStorage.getItem("language") != null)
        this.lng = sessionStorage.getItem("language");
    } catch (e) {
      e = null;
    }
    const dynamicScripts = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAlMUA4urzqNM3xoI7SxUwTFAZ7Q13fiUc&libraries=geometry,drawing,places&language=" + this.lng;

    // for (var i = 0; i < dynamicScripts.length; i++) {
    try {
      let node = document.createElement('script');
      node.setAttribute('id', 'MapScript');
      node.src = dynamicScripts;//[i];
      node.type = 'text/javascript';
      node.async = true;
      node.defer = true;
      node.charset = 'utf-8';
      document.getElementsByTagName('body')[0].appendChild(node);
    } catch (e) {
      e = null;
    }
    //}
  }

  logUpdate(logReq) {

    // macaddress.one(function (err, mac) {
    //   console.log("Mac address for this host: %s", mac);  
    // });
    
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.ReAssetToken })
    };
    logReq["macAddress"] = "";
    logReq["appType"] = "web portal"
    const response = this._http.post(this.BASE_URL_ASSET + 'User/UserLogUpdate', logReq,httpOptions).toPromise();

    return response;
  }

  device_logUpdate(logReq) {

    // macaddress.one(function (err, mac) {
    //   console.log("Mac address for this host: %s", mac);  
    // });

    logReq["macAddress"] = "";
    logReq["appType"] = "web portal"
    const response = this._http.post(this.BASE_URL_ASSET + 'User/DeviceLogUpdate', logReq).toPromise();

    return response;
  }
}
