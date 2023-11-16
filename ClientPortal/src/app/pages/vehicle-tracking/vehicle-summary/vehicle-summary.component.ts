import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Column, GridOption, Formatter, FieldType, Statistic, GridOdataService, AngularGridInstance } from 'angular-slickgrid';
import { Observable, Subscription } from 'rxjs/Rx';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../../tracking/services/tracking.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SessionupdateService } from '../../GlobalServices/sessionupdate.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';

@Component({
  selector: 'app-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  styleUrls: ['./vehicle-summary.component.css']
})
export class VehicleSummaryComponent implements OnInit, OnDestroy {
  // @ViewChild(DataTable) dataTable: DataTable;
  jioToken: string;
  gridCount: any = 0;
  DateFormat: string;
  isShowFooter: boolean = false;
  constructor(
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService,
    private ref: ChangeDetectorRef,
    private _loaderService: LoaderService,
    private _UpdatingSessionStorage: SessionupdateService,
    private translate: TranslateService
  ) {

  }

  trackerInsightsobj = new TrackerInsights();
  dataset: any[] = [];
  supportDataset: any = [];

  isMoving: boolean;
  isIdle: boolean;
  isStopped: boolean;
  isNoGps: boolean;
  isNoPolling: boolean;
  isAll: boolean;

  selectedTime: string = '';
  private timer;
  private sub: Subscription;

  sessionData: any = [];
  sessionIMEIList: any = [];
  sessionDeviceTypeList: any = [];

  supportingList: any = [];
  vehicleListData: any = [];
  curenntDate: any;
  processing = true;

  status = { text: 'processing...', class: 'alert alert-danger' };

  //For Vehicle
  movingArrary: any = [];
  idleArrary: any = [];
  stoppedArrary: any = [];
  noGpsArrary: any = [];
  noPollingArrary: any = [];
  allVehicleLst: any = [];
  isTimer: boolean;

  //For Index and Count
  VehiclemovingCntindex = 0;
  VehicleidleCntindex = 0;
  VehiclestoppedCntindex = 0;
  VehiclenoGpsCntindex = 0;
  VehiclenoPollingCntindex = 0;
  VehicleAllCntindex = 0;

  //Hour Time

  hourorMin: Number;
  calspd: Number;
  defaultHoursorMintsofNopolling: Number;

  //For Pagination
  pagLst: any = [];

  ignitionImageOn: string;
  ignitionImageOff: string;

  SearchInputValue: string = "";

  ngOnInit() {
    this.DateFormat = "(" + this._commanService.getDateFormat() + ")";
    this.hourorMin = this._commanService.NOPOLLINGHOURSTIME; //24; for no polling time
    this.calspd = this._commanService.VEHICLESPEEDLIMIT; //5; for vehicle speed
    this.defaultHoursorMintsofNopolling = this._commanService.DEFAULTNOPOLLINGTIME; //For Default No Polling Time
    this.isTimer = false;
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = true;

    this.ignitionImageOn = "./assets/Images/IgnitionOn.svg";
    this.ignitionImageOff = "./assets/Images/IgnitionOff.svg";

    //this.updateVehicleData();

    this.timerTick();

  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  timerTick() {
    ////debugger;
    const nameInput = document.getElementById('vehicleddlTimer') as HTMLInputElement;
    if (Number(nameInput.value) != 0) {
      if (this.isTimer) {
        this.sub.unsubscribe();
        this.isTimer = true;
        this.timer = Observable.timer(0, Number(nameInput.value) * 1000);
        this.sub = this.timer.subscribe(N => this.getTimerData(N));
      }
      else {
        this.isTimer = true;
        this.timer = Observable.timer(0, Number(nameInput.value) * 1000);
        this.sub = this.timer.subscribe(N => this.getTimerData(N));
      }

    }
    else {
      this.onLoadVehicleSummaryData();
    }
  }

  reqLive: any;
  onLoadVehicleSummaryData() {
    debugger

    this.displaySpinner(true);
    this.trackerInsightsobj = this.getVehicleSessionData();
    this.pagLst = [];
    this.reqLive = this._trackingService.getSensorLiveData(this.trackerInsightsobj).subscribe(result => {
      debugger;
      if (this.reqLive !== undefined ) {
        this.pagLst = result;
        this.pagLst = this.pagLst.live == null ? [] : this.pagLst.live;
        //this.VehicleTableData();
        this.BindTableData(result);
      }
    }, error => {
      this.VehicleTableData();
    })
  }

  getVehicleSessionData() {

    this.sessionDeviceTypeList = [];
    this.sessionIMEIList = [];
    this.sessionData = [];
    this.sessionData = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));
    this.sessionData.forEach(element => {
      this.sessionDeviceTypeList.push(element.assetType);
      this.sessionIMEIList.push(element.deviceNo);
    });
    this.trackerInsightsobj.divType = this.remove_duplicates(this.sessionDeviceTypeList).toString();
    this.trackerInsightsobj.IMEI = this.sessionIMEIList.toString();
    return this.trackerInsightsobj
  }

  remove_duplicates(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    arr = [];
    for (let key in obj) {
      arr.push(key);
    }
    return arr;
  }

  updateVehicleData() {
    var jsonData = {
      "userId": sessionStorage.getItem("LOGINUSERID"),
      "userType": sessionStorage.getItem("USER_TYPE")
    }
    this._trackingService.getUserDevices(jsonData).subscribe(
      result => {

        this.vehicleListData = result;
        this.vehicleListData = this.vehicleListData.userVLAssets;
        sessionStorage.setItem("ASSETS_TYPES_VEHICLE", JSON.stringify(this.vehicleListData));
        var vehicledata = sessionStorage.getItem("SENSOR_TOTALDATA");
        for (let i = 0; i < this.vehicleListData.length; i++) {
          this.supportingList[i] = {
            id: Number(this.vehicleListData[i].deviceNo),
            imi: this.vehicleListData[i].deviceNo,
            vldvt: this.vehicleListData[i].assetNo,
            regNo: this.vehicleListData[i].regNo,
            vlIgnition: "",
            vlspeed: "",
            vlgps: "",
            tms: "",
            vlliveTrack: "",
            vlhours: this.defaultHoursorMintsofNopolling,
            vlpos: "",
            vlLatLng: "",
            isChecked: false,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd
          }
          sessionStorage.setItem("SENSOR_TOTALDATA", JSON.stringify(this.supportingList));
        }
      });
  }

  VehicleTableData() {

    this.dataset = [];
    this.movingArrary = [];
    this.idleArrary = [];
    this.stoppedArrary = [];
    this.noGpsArrary = [];
    this.noPollingArrary = [];
    this.allVehicleLst = [];


    //For Index
    this.VehiclemovingCntindex = 0;
    this.VehicleidleCntindex = 0;
    this.VehiclestoppedCntindex = 0;
    this.VehiclenoPollingCntindex = 0;
    this.VehiclenoGpsCntindex = 0;
    this.VehicleAllCntindex = 0;

    ////debugger

    var vehicleDataList = JSON.parse(sessionStorage.getItem("SENSOR_TOTALDATA"));
    try {
      for (let j = 0; j < vehicleDataList.length; j++) {
        for (let i = 0; i < this.pagLst.length; i++) {

          var vehicleDataLst = this.pagLst[i];//.ext[0];

          if (vehicleDataLst.imi == vehicleDataList[j].imi) {

            let Ignitionsts = vehicleDataLst.igs == "1" ? "ON" : "OFF";

            let IgnitionStatus = vehicleDataLst.pos == "1" || vehicleDataLst.pos == "A" ? "ON" : "OFF";

            var responseDate = this._commanService.epochUTCtoDateWithTimeZone(Number(vehicleDataLst.epochTms), vehicleDataLst.imi);

            var curenntDate = new Date();

            var hourDifference = Math.abs(responseDate.getTime() - curenntDate.getTime());

            var latlng;

            if (Number(vehicleDataLst.lat) != 0 && Number(vehicleDataLst.lon) != 0) {
              latlng = new google.maps.LatLng(Number(vehicleDataLst.lat), Number(vehicleDataLst.lon));
            }
            else latlng = "";

            ////debugger
            var hours = this._commanService.CalculateTimeStamp(hourDifference); //hourDifference / 1000 / 3600;

            vehicleDataList[j].imi = Number(vehicleDataLst.imi);
            vehicleDataList[j].vldvt = vehicleDataList[j].vldvt;
            vehicleDataList[j].imi = vehicleDataList[j].imi;
            vehicleDataList[j].regNo = vehicleDataList[j].regNo;
            vehicleDataList[j].vlIgnition = Ignitionsts;
            vehicleDataList[j].vlspeed = vehicleDataLst.spd;
            vehicleDataList[j].vlgps = IgnitionStatus;
            vehicleDataList[j].tms = this._commanService.epochUTCtoDateTimeWithTimeZone(vehicleDataLst.epochTms, vehicleDataList[j].imi);
            //this._commanService.DateConvert(vehicleDataLst.tms);
            vehicleDataList[j].vlliveTrack = vehicleDataLst.imi;
            vehicleDataList[j].vlhours = hours;
            vehicleDataList[j].vlLatLng = latlng;
            vehicleDataList[j].vlpos = vehicleDataLst.pos;
            vehicleDataList[j].DefaultTimeInMnts = this.hourorMin;
            vehicleDataList[j].DefaultSpeed = this.calspd;
          }

        }//Inner For Loop End

      } //Main For Loop End
    } catch (e) {
      e = null;
    }
    sessionStorage.setItem("SENSOR_TOTALDATA", JSON.stringify(vehicleDataList));
    var result = vehicleDataList;
    this.supportDataset = [];
    ////debugger
    // try {
    //   for (let k = 0; k < result.length; k++) {
    //     //NoPolling
    //     if (result[k].vlhours >= this.hourorMin) {
    //       this.noPollingArrary[this.VehiclenoPollingCntindex] = {
    //         id: Number(result[k].imi),
    //         vldvt: result[k].vldvt,
    //         imi: result[k].imi,
    //         regNo: result[k].regNo,
    //         vlIgnition: "OFF", //result[k].vlIgnition,
    //         vlspeed: "0", //result[k].vlspeed,
    //         vlgps: "OFF", //result[k].vlgps,
    //         tms: result[k].tms,
    //         vlliveTrack: "", //result[k].imi,
    //         vlhours: result[k].vlhours,
    //         vlLatLng: result[k].vlLatLng,
    //         vlpos: result[k].vlpos,
    //         isChecked: false,
    //         DefaultTimeInMnts: this.hourorMin,
    //         DefaultSpeed: this.calspd
    //       }
    //       this.VehiclenoPollingCntindex++;
    //     }

    //     //NoGps
    //     else if (result[k].vlpos != "1" && result[k].vlhours < this.hourorMin) {
    //       this.noGpsArrary[this.VehiclenoGpsCntindex] = {
    //         id: Number(result[k].imi),
    //         vldvt: result[k].vldvt,
    //         imi: result[k].imi,
    //         regNo: result[k].regNo,
    //         vlIgnition: result[k].vlIgnition,
    //         vlspeed: result[k].vlspeed,
    //         vlgps: result[k].vlgps,
    //         tms: result[k].tms,
    //         vlliveTrack: result[k].imi,
    //         vlhours: result[k].vlhours,
    //         vlLatLng: result[k].vlLatLng,
    //         vlpos: result[k].vlpos,
    //         DefaultTimeInMnts: this.hourorMin,
    //         DefaultSpeed: this.calspd
    //       }
    //       this.VehiclenoGpsCntindex++;

    //     }
    //     //Stopping Number(result[k].vlspeed) == 0 && 
    //     else if (result[k].vlIgnition == "OFF" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
    //       this.stoppedArrary[this.VehiclestoppedCntindex] = {
    //         id: Number(result[k].imi),
    //         vldvt: result[k].vldvt,
    //         imi: result[k].imi,
    //         regNo: result[k].regNo,
    //         vlIgnition: result[k].vlIgnition,
    //         vlspeed: result[k].vlspeed,
    //         vlgps: result[k].vlgps,
    //         tms: result[k].tms,
    //         vlliveTrack: result[k].imi,
    //         vlhours: result[k].vlhours,
    //         vlLatLng: result[k].vlLatLng,
    //         vlpos: result[k].vlpos,
    //         DefaultTimeInMnts: this.hourorMin,
    //         DefaultSpeed: this.calspd
    //       }
    //       this.VehiclestoppedCntindex++;
    //     }
    //     //Moving 
    //     else if (Number(result[k].vlspeed) >= this.calspd && result[k].vlIgnition == "ON" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
    //       this.movingArrary[this.VehiclemovingCntindex] = {
    //         id: Number(result[k].imi),
    //         vldvt: result[k].vldvt,
    //         imi: result[k].imi,
    //         regNo: result[k].regNo,
    //         vlIgnition: result[k].vlIgnition,
    //         vlspeed: result[k].vlspeed,
    //         vlgps: result[k].vlgps,
    //         tms: result[k].tms,
    //         vlliveTrack: result[k].imi,
    //         vlhours: result[k].vlhours,
    //         vlLatLng: result[k].vlLatLng,
    //         vlpos: result[k].vlpos,
    //         DefaultTimeInMnts: this.hourorMin,
    //         DefaultSpeed: this.calspd
    //       }
    //       this.VehiclemovingCntindex++

    //     }
    //     //Idle
    //     else if (Number(result[k].vlspeed) < this.calspd && result[k].vlIgnition == "ON" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
    //       this.idleArrary[this.VehicleidleCntindex] = {
    //         id: Number(result[k].imi),
    //         vldvt: result[k].vldvt,
    //         imi: result[k].imi,
    //         regNo: result[k].regNo,
    //         vlIgnition: result[k].vlIgnition,
    //         vlspeed: result[k].vlspeed,
    //         vlgps: result[k].vlgps,
    //         tms: result[k].tms,
    //         vlliveTrack: result[k].imi,
    //         vlLatLng: result[k].vlLatLng,
    //         vlhours: result[k].vlhours,
    //         vlpos: result[k].vlpos,
    //         DefaultTimeInMnts: this.hourorMin,
    //         DefaultSpeed: this.calspd
    //       }
    //       this.VehicleidleCntindex++;

    //     }
    //     //All
    //     this.supportDataset[this.VehicleAllCntindex] = {
    //       id: Number(result[k].imi),
    //       vldvt: result[k].vldvt,
    //       imi: result[k].imi,
    //       regNo: result[k].regNo,
    //       vlIgnition: result[k].vlhours > this.hourorMin ? "OFF" : result[k].vlIgnition,
    //       vlspeed: result[k].vlhours > this.hourorMin ? "0" : result[k].vlspeed,
    //       vlgps: result[k].vlhours > this.hourorMin ? "OFF" : result[k].vlgps,
    //       tms: result[k].tms,
    //       vlliveTrack: result[k].vlhours > this.hourorMin ? "" : result[k].imi,
    //       vlhours: result[k].vlhours,
    //       vlLatLng: result[k].vlLatLng,
    //       vlpos: result[k].vlpos,
    //       DefaultTimeInMnts: this.hourorMin,
    //       DefaultSpeed: this.calspd
    //     }
    //     this.VehicleAllCntindex++;
    //   }
    // } catch (e) {
    //   e = null;
    // }
    // if (this.isMoving) {
    //   this.dataset = this.movingArrary
    // }
    // if (this.isIdle) {
    //   this.dataset = this.idleArrary
    // }
    // if (this.isNoPolling) {
    //   this.dataset = this.noPollingArrary;
    // }
    // if (this.isStopped) {
    //   this.dataset = this.stoppedArrary
    // }
    // if (this.isNoGps) {
    //   this.dataset = this.noGpsArrary;
    // }
    // if (this.isAll) {
    //   this.dataset = this.supportDataset;
    // }

    const nameInput = document.getElementById('jqueryDTSearchInput') as HTMLInputElement;
    if (nameInput != null && nameInput.value != "") {
      this.SearchInputValue = nameInput.value;
    } else {
      this.SearchInputValue = "";
    }

    this.BindTableData(this.dataset);

    this.displaySpinner(false);

  }

  BindTableData(ds: any) {
    debugger;

    var data = [];
    ds.live.forEach(element => {
      data.push([
        element.deviceNo,
        element.value,
        element.time
      ])
    });


    if (ds.length > 0) {
      this.isShowFooter = true;
    } else {
      this.isShowFooter = false;
    }

    var table1 = $('#snrSumTable').DataTable();
    var pageNo = table1.page.info().page;
    var pagelen = table1.page.info().pages;
    var pageSize = table1.page.len();
    var order = table1.order();
    debugger

    $('#snrSumTable').DataTable().destroy();

    var table = $('#snrSumTable').DataTable({
      "order": [], "sort": [],
      'columnDefs': [{
        'targets': [1, 2], /* column index */
        'orderable': false, /* true or false */
      }],
      searching: this.isShowFooter,
      paging: this.isShowFooter,
      info: this.isShowFooter,
      "pageLength": pageSize,
    });

    table.clear().rows.add(data).order([order[0][0], order[0][1]]).draw();

    try {
      if (pagelen > pageNo) {
        $('#snrSumTable').dataTable().fnPageChange(pageNo);
      }
    } catch (e) {
      e = null;
    }

    jQuery('.dataTable').wrap('<div style="height:55vh;overflow-y:auto;" />');


    if (this.SearchInputValue != "") {
      table.search(this.SearchInputValue).draw();
    }

    this._loaderService.display(false);
  }

  onMovingVehicles() {

    this.isMoving = true;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.movingArrary;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onIdleVehicles() {
    this.isMoving = false;
    this.isIdle = true;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.idleArrary;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onStoppedVehicles() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = true;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.stoppedArrary;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onNoGpsVehicles() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = true;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.noGpsArrary;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onNoPollingVehicles() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = true;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.noPollingArrary;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onAllVehicles() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = true;
    this.dataset = [];
    this.dataset = this.supportDataset;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  selectChangeHandler(event: any) {
    this.selectedTime = event.target.value;
    if (this.selectedTime == "00") {
      this.sub.unsubscribe();
    }
    else {
      this.sub.unsubscribe();
      this.timer = Observable.timer(0, Number(this.selectedTime) * 1000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
  }

  getTimerData(time) {
    this.onLoadVehicleSummaryData();
  }

  ngOnDestroy() {
    if (this.reqLive){
      this.reqLive.unsubscribe();
    }
    if (this.isTimer) {
      this.sub.unsubscribe();
    }
  }

}

function VehicleredirectToLiveMap(dataContext) {
  if (dataContext.vlLatLng != "") {
    if (dataContext.vlLatLng.lat != null && dataContext.vlLatLng.lng != null) {
      if (dataContext.vlLatLng.lat != 0 && dataContext.vlLatLng.lng != 0) {
        return (dataContext.vlhours < dataContext.DefaultTimeInMnts && dataContext.vlpos == "1") ? ` <a href="/Navnext/#/pages/VehicleTracking/LiveTrack?TrackerNo=${dataContext.vlliveTrack}"> <img src="./assets/Images/Map.svg"  title='Redirect to Live Track' height='20' width='20'></a>` : ""
      }
      else {
        return "";
      }

    }
  }
  else return "";

}

function gpsFormatter(gps) {

  return gps == "ON"
    ?
    `<img src="./assets/Images/GpsOn.svg" title="Gps On" style="cursor:pointer" alt="Trulli" width="20" height="20">`
    :
    `<img src="./assets/Images/GpsOff.svg" title="Gps Off" style="cursor:pointer" alt="Trulli" width="20" height="20">`

}

function VehicleStatusImg(dataContext) {
  var ignimage = ""
  var VehicleMovingImg = "./assets/Images/runing.png";
  var VehicleStopImg = "./assets/Images/stop.png";
  var VehicleIdleImg = "./assets/Images/idle.png";
  var VehicleNopollingImg = "./assets/Images/nopoll.png";
  var VehicleNoGpsImg = "./assets/Images/nogps.png";
  var speed = Number(dataContext.vlspeed);
  var hour = dataContext.DefaultTimeInMnts; //10;
  var calspd = dataContext.DefaultSpeed //5;
  try {
    //Nopolling
    if (dataContext.vlhours >= hour) {
      ignimage = VehicleNopollingImg;

    }
    //NoGps
    else if (dataContext.vlhours < hour && dataContext.vlpos != "1") {
      ignimage = VehicleNoGpsImg;
    }
    //Stopping speed == 0 &&
    else if (dataContext.vlIgnition == "OFF" && dataContext.vlhours < hour && dataContext.vlpos == "1") {
      ignimage = VehicleStopImg;
    }
    //Moving
    else if (speed >= calspd && dataContext.vlIgnition == "ON" && dataContext.vlhours < hour && dataContext.vlpos == "1") {
      ignimage = VehicleMovingImg;
    }
    //Idle
    else if (speed < calspd && dataContext.vlIgnition == "ON" && dataContext.vlhours < hour && dataContext.vlpos == "1") {
      ignimage = VehicleIdleImg;
    }
  } catch (e) {
    e = null;
  }
  return `<img src='${ignimage}' title="" style="cursor:pointer" alt="Trulli"  >`

}

function IgnitionOnStatus(igs) {
  var ignimage = ""
  var ignitionImageOn = "./assets/Images/IgnitionOn.svg";
  var ignitionImageOff = "./assets/Images/IgnitionOff.svg";
  var text = ""

  if (igs == "ON") {
    text = "Ignition On"
    ignimage = ignitionImageOn;
  }
  else {
    text = "Ignition Off"
    ignimage = ignitionImageOff;
  }

  return `<img src='${ignimage}' title='${text}' style="cursor:pointer" alt="Trulli" width="20" height="20">`

}
export class TrackerInsights {

  public evnt: string;
  public divType: string;
  public IMEI: string;
  public userId: string;
  public userType: string;

}
