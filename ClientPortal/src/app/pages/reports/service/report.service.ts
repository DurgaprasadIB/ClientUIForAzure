import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { TripReportCode, TravelReportCode, StopReportCode, IdleReportCode, GeoAlertReportCode, AlertReportCode, EngineOnOffReportCode, EngineSumReportCode } from 'src/assets/GlobalStatic';

import { DatePipe } from '@angular/common';
import { DaySumReportType, DaySumReportCode } from 'src/assets/GlobalStatic';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ResponseType } from '@angular/http';
const datePipe = new DatePipe('en-US');

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient, private toastr: ToastrService, private commanService: IdeaBService, private translate: TranslateService) { }

  GetAssetDetails() {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })

    };
    var jsonData = { "loginID": this.commanService.getLoginUserID() };
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Tracker/NonNPeople', jsonData, httpOptions)

  }

  DDMMYYYtoMMDDYYYY(date) {

    if (date != "" && date !== undefined) {
      var frmDate2 = date.split('/');
      return frmDate2[1] + "/" + frmDate2[0] + "/" + frmDate2[2];
    }
  }

  secondsToHHMMSS(totalsecs) {
    var date = new Date(null);
    date.setSeconds(Number(totalsecs));
    return date.toISOString().substr(11, 8);
  }

  secondsToHH(sec) {
    return (Number(sec) / 3600).toFixed(0);
  }

  secondsToDDHHMMSS(totalsecs) {

    var date = new Date(null);
    date.setSeconds(Number(totalsecs));
    return date.toISOString().substr(11, 8);
  }

  metersToKMs(mtrs) {
    return (Number(mtrs) / 1000).toFixed(2);
  }

  dateToMMDDYYYYHHMMSS(sysDate) {
    // 
    var d = new Date(sysDate);
    var time = this.formatAMPM(d);
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + " " + time;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var strTime = hours + ':' + minutes + ":" + seconds + ' ' + ampm;
    return strTime;
  }

  // dateToMMDDYYYY(sysDate) {
  //   var d = new Date(sysDate)
  //   return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
  //   // return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
  // }

  dateToDDMMYYYY(sysDate) {
    var d = new Date(sysDate)
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
  }
  dateToDDMMYY(date){
    var d = new Date(date)
    return d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0') + '/' + d.getFullYear().toString().slice(-2)
  }
  formatDate(date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
  
    return `${day}/${month}/${year}`;
  }
  dateToYYYYMMDDHHMM(sysDate) {
    var d = new Date(sysDate)

    var mm: any = ""
    var dd: any = ""
    var hr: any = ""
    var min: any = ""

    mm = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

    hr = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();

    return (d.getFullYear()) + '-' + mm + '-' + dd + ' ' + hr + ":" + min
    // return  dd + '-' + mm + '-' + (d.getFullYear()) + ' ' + hr + ":" + min

  }

  dateToMM(sysDate) {
    var d = new Date(sysDate)

    var mm: any = ""

    mm = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);

    return mm
    // return  dd + '-' + mm + '-' + (d.getFullYear()) + ' ' + hr + ":" + min

  }

  dateToNext6thMonth(sysDate) {
    var d = new Date(sysDate)

    var mm: any = ""
    var dd: any = ""
    var hr: any = ""
    var min: any = ""

    mm = (d.getMonth() + 7) < 10 ? '0' + (d.getMonth() + 7) : (d.getMonth() + 7);
    dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

    hr = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();

    return mm
    // return  dd + '-' + mm + '-' + (d.getFullYear()) + ' ' + hr + ":" + min

  }

  dateToNext3rdMonth(sysDate) {
    var d = new Date(sysDate)
    var mm: any = ""
    mm = (d.getMonth() + 4) < 10 ? '0' + (d.getMonth() + 4) : (d.getMonth() + 4);

    return mm

  }


  dateToNext9thMonth(sysDate) {
    var d = new Date(sysDate)
    var mm: any = ""
    mm = (d.getMonth() + 10) < 10 ? '0' + (d.getMonth() + 10) : (d.getMonth() + 10);

    return mm
  }

  dateToDD(sysDate) {
    var d = new Date(sysDate)


    var dd: any = ""

    dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

    return dd

  }


  todateYYYYMMDDHHMM(sysDate) {
    var d = new Date(sysDate)

    var mm: any = ""
    var dd: any = ""
    var hr: any = ""
    var min: any = ""

    mm = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

    hr = '23';
    min = '59';

    return (d.getFullYear()) + '-' + mm + '-' + dd + ' ' + hr + ":" + min
  }

  todateYYYYMMDD(sysDate) {
    var d = new Date(sysDate)

    var mm: any = ""
    var dd: any = ""

    mm = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();


    return (d.getFullYear()) + '-' + mm + '-' + dd
  }


  CompareDates(FromDate, ToDate) {
    try {

      var currentFromDate = FromDate;
      var newFromDate = currentFromDate.split('/');
      var Fromtime = newFromDate[2].split(' ');

      var Fhours = Fromtime[1].split(":");
      var Fhrs = Fhours[0];
      var Fampm = Fromtime[2];
      if (Fampm == "AM") {
        if (Fhrs == "12") {
          Fhrs = "00";
        }
      } else {
        if (Fhrs < 12) {
          Fhrs = parseInt(Fhrs) + 12;
        }
      }

      currentFromDate = Fromtime[1] + "-" + newFromDate[0] + "-" + newFromDate[0] + "T" + Fhrs + ":" + Fhours[1] + ":00.000Z";
      var iso8601 = currentFromDate,
        parts = iso8601.slice(0, -1).split(/[\-T:]/)//,
      //dateObject;

      parts[1] -= 1;
      var dateObject = new Date(Date.UTC.apply(undefined, parts));


      var currentToDate = ToDate;
      var newToDate = currentToDate.split('/');
      var Totime = newToDate[2].split(' ');

      var Thours = Totime[1].split(":");
      var Thrs = Thours[0];
      var Tampm = Totime[2];
      if (Tampm == "AM") {
        if (Thrs == "12") {
          Thrs = "00";
        }
      } else {
        if (Thrs < 12) {
          Thrs = parseInt(Thrs) + 12;
        }
      }

      currentToDate = Totime[1] + "-" + newToDate[0] + "-" + newToDate[0] + "T" + Thrs + ":" + Thours[1] + ":00.000Z";
      var iso86012 = currentToDate,
        parts1 = iso86012.slice(0, -1).split(/[\-T:]/)//,
      //dateObject1;

      parts1[1] -= 1;
      var dateObject1 = new Date(Date.UTC.apply(undefined, parts1));


      var DateFrom = Fromtime[0] + "-" + newFromDate[0] + "-" + newFromDate[1] + " " + Fhrs + ":" + Fhours[1] + ":00.000";
      var DateTo = Totime[0] + "-" + newToDate[0] + "-" + newToDate[1] + " " + Thrs + ":" + Thours[1] + ":00.000";
      var Fromnow = new Date(Date.parse(DateFrom));
      var Tonow = new Date(Date.parse(DateTo));

      var now = new Date();
      var now_utc = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

      if (Fromnow.getTime() > now_utc.getTime()) {
        this.toastr.warning(this.translate.instant('FromdateshouldbelessthanTodate'), '', { timeOut: 1000 });
        return false;
      } else if (Tonow.getTime() > now_utc.getTime()) {
        this.toastr.warning(this.translate.instant('ToDateGreaterFromdate'), '', { timeOut: 1000 });
        return false;
      }
      else if (Fromnow.getTime() < Tonow.getTime()) {
        return true;
      } else {
        this.toastr.warning(this.translate.instant('ToDateGreaterFromdate'), '', { timeOut: 1000 });
        return false;
      }
    } catch (e) {
      e = null;
    }
  }

  DateDifference(FromDate, ToDate) {
    try {


      var Fromnow = new Date(Date.parse(FromDate));
      var Tonow = new Date(Date.parse(ToDate));


      var diff: any;

      diff = Tonow.getTime() - Fromnow.getTime();

      diff = diff / 1000;//to seconds
      diff = diff / 60;//to minutes
      diff = diff / 60;//to hours
      diff = diff / 24;//to days

      return diff;



    } catch (e) {
      e = null;
    }
  }

  GetVehicleSummaryData(obj, selectionType) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    this.tripanalysis.imei = obj.vehicleSelect;
    this.tripanalysis.vRtc = DaySumReportCode;
    //this.tripanalysis.sts = (new Date(obj.fromDate).getTime() / 1000).toString();
    //this.tripanalysis.ets = (new Date(obj.toDate).getTime() / 1000).toString();
    this.tripanalysis.sts = this.commanService.getEpochTimeWithMinusTimeZone(obj.fromDate, obj.vehicleSelect);
    this.tripanalysis.ets = this.commanService.getEpochTimeWithMinusTimeZone(obj.toDate, obj.vehicleSelect);

    this.tripanalysis.daywise = selectionType;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetReport', this.tripanalysis, httpOptions)

  }
  saveAlertData(alertSetting) {

    //

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    return this.http.post(this.commanService.BASE_URL_ASSET + "Alert/create",
      alertSetting, HTTPOPTIONS_ASSET);
  }

  updateAlert(obj) {

    //
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    obj.userId = this.commanService.getLoginUserID();

    // var jsonData = { "userId": this.commanService.getLoginUserID() };
    return this.http.post(this.commanService.BASE_URL_ASSET + "Alert/update", obj, HTTPOPTIONS_ASSET);
  }


  AlertDetails() {
    //
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = { "userId": this.commanService.getLoginUserID() };
    return this.http.post(this.commanService.BASE_URL_ASSET + "Alert/Details", jsonData, HTTPOPTIONS_ASSET);
  }

  updateCause(obj: any, uploadAttchment: any) {
    //
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };
    debugger
    let headers = new HttpHeaders();
    let params = new HttpParams();
    const formData: FormData = new FormData();


    formData.append('causeId', obj.causeId);
    formData.append('comment', obj.comment);
    formData.append('loginId', this.commanService.getLoginUserID());
    formData.append('operationalStatus', obj.operationalStatus);
    formData.append('rootCause', obj.rootCause);

    formData.append('correctiveAction', obj.correctiveAction);
    formData.append('preventionAction',obj.preventionAction);
    formData.append('TargetCompletionDate',obj.TargetCompletionDate);
    for (let i = 0; i < uploadAttchment.length; i++) {
      formData.append('attachment', uploadAttchment[i], uploadAttchment[i].name);
    }


    return this.http.post(this.commanService.BASE_URL_ASSET + 'Alert/updateCause', formData);
  }


  GetAlertCause(causeId: any, download :any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = { "causeId": causeId, "loginId": this.commanService.getLoginUserID(), "download": download };
    return this.http.post(this.commanService.BASE_URL_ASSET + "Alert/GetAlertCause", jsonData, HTTPOPTIONS_ASSET);


  }

  GetAlertReportConfig(){
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = {"loginId": this.commanService.getLoginUserID()};
    return this.http.post(this.commanService.BASE_URL_ASSET + "Alert/GetAlertReportConfig", jsonData, HTTPOPTIONS_ASSET);

  }

  updatePDFtemplate(templateId: any) {
    //
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = { "templateId": templateId };
    return this.http.post(this.commanService.BASE_URL_ASSET + "Report/pdfTemplate", jsonData, HTTPOPTIONS_ASSET);
  }

  getPDFtemplate() {
    //
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = [];
    return this.http.post(this.commanService.BASE_URL_ASSET + "Report/getPDFTemplate", jsonData, HTTPOPTIONS_ASSET);
  }


  saveLogReport(jsonData: any) {
    //

    jsonData.loginId = this.commanService.getLoginUserID()

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };


    return this.http.post(this.commanService.BASE_URL_ASSET + "Report/saveLogReport", jsonData, HTTPOPTIONS_ASSET);
  }


  VideoFiles() {
    //
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = { "userId": this.commanService.getLoginUserID() };
    return this.http.post(this.commanService.BASE_URL_ASSET + "Report/VideoFiles", jsonData, HTTPOPTIONS_ASSET);
  }

  ImageFiles() {
    //
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.commanService.ReAssetToken
      })
    };

    var jsonData = { "userId": this.commanService.getLoginUserID(), "Domain": sessionStorage.getItem("Client_Domain") };
    return this.http.post(this.commanService.BASE_URL_ASSET + "Report/ImageFiles", jsonData, HTTPOPTIONS_ASSET);
  }

  GetIdealDetails(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));

    const _ASSETtoken = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };


    this.tripanalysis.imei = obj.vehicleSelect;
    this.tripanalysis.vRtc = IdleReportCode;
    //this.tripanalysis.sts = (new Date(obj.fromDate).getTime() / 1000).toString();
    //this.tripanalysis.ets = (new Date(obj.toDate).getTime() / 1000).toString();
    this.tripanalysis.sts = this.commanService.getEpochTimeWithMinusTimeZone(obj.fromDate, obj.vehicleSelect);
    this.tripanalysis.ets = this.commanService.getEpochTimeWithMinusTimeZone(obj.toDate, obj.vehicleSelect);
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetReport', this.tripanalysis, _ASSETtoken);
  }

  GetStopageDetails(obj) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    this.tripanalysis.imei = obj.vehicleSelect;
    this.tripanalysis.vRtc = StopReportCode;
    // this.tripanalysis.sts = (new Date(obj.fromDate).getTime() / 1000).toString();
    // this.tripanalysis.ets = (new Date(obj.toDate).getTime() / 1000).toString();
    this.tripanalysis.sts = this.commanService.getEpochTimeWithMinusTimeZone(obj.fromDate, obj.vehicleSelect);
    this.tripanalysis.ets = this.commanService.getEpochTimeWithMinusTimeZone(obj.toDate, obj.vehicleSelect);

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetReport', this.tripanalysis, HTTPOPTIONS_ASSET)

  }

  GetEngineOnOff(obj) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));

    const _ASSETtoken = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };


    this.tripanalysis.imei = obj.imeis;
    this.tripanalysis.vRtc = EngineOnOffReportCode;
    //this.tripanalysis.sts = (new Date(obj.sts).getTime() / 1000).toString();
    //this.tripanalysis.ets = (new Date(obj.ets).getTime() / 1000).toString();
    this.tripanalysis.sts = this.commanService.getEpochTimeWithMinusTimeZone(obj.sts, obj.imeis);
    this.tripanalysis.ets = this.commanService.getEpochTimeWithMinusTimeZone(obj.ets, obj.imeis);
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetReport', this.tripanalysis, _ASSETtoken);
  }

  GetEngineRunSummary(obj) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));

    const _ASSETtoken = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };


    this.tripanalysis.imei = obj.imeis;
    this.tripanalysis.vRtc = EngineSumReportCode;
    //this.tripanalysis.sts = (new Date(obj.sts).getTime() / 1000).toString();
    //this.tripanalysis.ets = (new Date(obj.ets).getTime() / 1000).toString();
    this.tripanalysis.sts = this.commanService.getEpochTimeWithMinusTimeZone(obj.sts, obj.imeis);
    this.tripanalysis.ets = this.commanService.getEpochTimeWithMinusTimeZone(obj.ets, obj.imeis);
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetReport', this.tripanalysis, _ASSETtoken);

  }

  tripanalysis = new TripAnalysis();
  tripDetails(obj) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const _ASSETtoken = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    this.tripanalysis.ets = obj.ets;
    this.tripanalysis.imei = obj.imies;
    this.tripanalysis.sts = obj.sts;
    this.tripanalysis.vRtc = TripReportCode;
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetTrip', this.tripanalysis, _ASSETtoken)
  }

  travelSummary(obj) {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));

    const _ASSETtoken = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };
    this.tripanalysis = new TripAnalysis();
    this.tripanalysis.imei = obj.imeis;
    this.tripanalysis.vRtc = TravelReportCode;
    //this.tripanalysis.sts = (new Date(obj.sts).getTime() / 1000).toString();
    //this.tripanalysis.ets = (new Date(obj.ets).getTime() / 1000).toString();
    this.tripanalysis.sts = this.commanService.getEpochTimeWithMinusTimeZone(obj.sts, obj.imeis);
    this.tripanalysis.ets = this.commanService.getEpochTimeWithMinusTimeZone(obj.ets, obj.imeis);
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetReport', this.tripanalysis, _ASSETtoken)
  }

  alert = new TripAnalysis();
  GetAlertDetails(obj) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();

    console.log(obj);
    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/Alerts', obj, httpOptions)
  }

  GetDeviceData(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/RawdataChart', obj, httpOptions)
  }

  SaveCustonReport(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/CustomReport', obj, httpOptions)
  }
  SaveAlertCustonReport(obj) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/AlertReport', obj, httpOptions)
  }
  
  SaveTHreport(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/SaveTHreport', obj, httpOptions)
  }

  GetSavedReport(reportId: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any = {};

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;
    obj.reportId = reportId;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetSavedReports', obj, httpOptions)
  }

  GetReportFromDates(obj: any) {
    debugger
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };


    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/getReportsBetweenDates', obj, httpOptions)
  }

  GetLogReports() {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any = {};

    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetLogReports', obj, httpOptions)
  }

  GetReportPDF(reportId: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any = {};

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;
    obj.reportId = reportId;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetReportPDF', obj, httpOptions)
  }

  GetOnDemandReport(reportId: any) {


    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any
    obj = {}
    obj.reportId = reportId

    var resp = this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetOnDemandReport', obj, httpOptions)

    return resp;
  }
  OnDemandReportSts(reportId: any) {


    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any
    obj = {}
    obj.reportId = reportId

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/OnDemandReportCheck', obj, httpOptions)


  }


  GetPinnedReport() {
    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any = {};

    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;



    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetPinnedReport', obj, httpOptions)
  }

  PintoDashboard(reportId: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any = {};

    obj.reportId = reportId;
    obj.loginId = this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/PintoDashboard', obj, httpOptions)
  }

  GenerateReport(reportId: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any = {};

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;
    obj.reportId = reportId;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/RuleBaseMultiReport', obj, httpOptions)
  }

  ShowReport(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    // var obj: any = {};

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.loginId = this.commanService.getLoginUserID();// this.commanService.LOGINUSERID;
    // obj.reportId = reportId;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/showReport', obj, httpOptions)
  }

  RemoveSavedReports(reportId: any) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any = {};

    obj.reportId = reportId;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/RemoveSavedReports', obj, httpOptions)
  }


  GetExcData(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/ExReport', obj, httpOptions)
  }

  GetExcHrData(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/ExHrReport', obj, httpOptions)
  }

  GetSensorChart() {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var JsonObj: any = {}

    JsonObj.loginId = this.commanService.getLoginUserID();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'live/SensorInfo', JsonObj, httpOptions)
  }

  GeofenceEntryExit = new TripAnalysis();
  GetGeofenceAlertDetails(obj, timeZone) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    this.GeofenceEntryExit.imei = obj.imei;
    this.GeofenceEntryExit.sts = this.commanService.getEpochTimeWithMinusTimeZone(obj.fromDate, timeZone);
    this.GeofenceEntryExit.ets = this.commanService.getEpochTimeWithMinusTimeZone(obj.toDate, timeZone);
    this.GeofenceEntryExit.gid = obj.geofenceSelect;

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/GetGeofenceAlerts', this.GeofenceEntryExit, httpOptions)
  }

  GetSiteMonitoringData(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    this.tripanalysis.imei = obj.vehicleSelect;
    this.tripanalysis.vRtc = DaySumReportCode;
    this.tripanalysis.sts = (new Date(obj.fromDate).getTime() / 1000).toString();
    this.tripanalysis.ets = (new Date(obj.toDate).getTime() / 1000).toString();

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/Sitemonitoring', this.tripanalysis, httpOptions)
  }

  GetLogDetails(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    obj.loginId = this.commanService.getLoginUserID();
    let path = obj.userId == undefined ? 'User/GetDeviceLogs' : 'User/GetUserLogs';

    return this.http.post(this.commanService.BASE_URL_ASSET + path, obj, httpOptions)


  }

  GetLogReportDetails(obj) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };


    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.loginId = this.commanService.getLoginUserID();
    let path = obj.logType == 1 ? 'User/GetDeviceLogs' : 'User/GetUserLogs';

    return this.http.post(this.commanService.BASE_URL_ASSET + path, obj, httpOptions)


  }

  DeleteLogReport(reportId) {

    this.commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.commanService.ReAssetToken })
    };

    var obj: any
    obj = {}
    obj.reportId = reportId

    return this.http.post(this.commanService.BASE_URL_ASSET + 'Report/DeleteLogReport', obj, httpOptions)


  }

}
export class TripAnalysis {
  public ets: any;
  public imei: Array<string> = [];
  public sts: any;
  public tkn: string;
  public vRtc: string;
  public gid: Array<string> = [];
  public daywise: string;
}
