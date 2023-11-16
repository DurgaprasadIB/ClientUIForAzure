import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  selector: 'app-sensor-summary',
  templateUrl: './sensor-summary.component.html',
  styleUrls: ['./sensor-summary.component.css']
})
export class SensorSummaryComponent implements OnInit, OnDestroy {
  // @ViewChild(DataTable) dataTable: DataTable;

  @ViewChild('mapDiv') gmapElement: any;

  map: google.maps.Map;

  gridCount: any = 0;
  DateFormat: string;
  isShowFooter: boolean = false;
  constructor(
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService,
    private _UpdatingSessionStorage: SessionupdateService,
    private translate: TranslateService
  ) {

  }

  dataset: any[] = [];
  supportDataset: any = [];

  isMoving: boolean;
  isIdle: boolean;
  isStopped: boolean;
  isNoGps: boolean;
  isNoPolling: boolean;
  isAll: boolean;
  mapView: boolean;
  listView: boolean;

  selectedTime: string = '';
  private timer;
  private sub: Subscription;

  sessionData: any = [];
  sessionDeviceList: any = [];
  sessionDeviceTypeList: any = [];

  supportingList: any = [];
  deviceListData: any = [];
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

  deviceInsightsobj = new DeviceInsights();

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

    this.mapView = false;
    this.listView = true;

    this.updatedeviceData();

    this.timerTick();

  }

  changeView(view) {
    if (view == "Map") {
      this.mapView = true;
      this.listView = false;
      //
      //#03243B
    }
    if (view == "List") {
      this.mapView = false;
      this.listView = true;
    }
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  timerTick() {
    ////debugger;
    const nameInput = document.getElementById('deviceddlTimer') as HTMLInputElement;
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
    this.deviceInsightsobj = this.getVehicleSessionData();
    this.pagLst = [];
    this.reqLive = this._trackingService.getSensorLiveData(this.deviceInsightsobj).subscribe(result => {
      debugger;
      if (this.reqLive !== undefined) {
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

    this.sessionDeviceList = [];
    this.sessionData = [];
    this.sessionData = JSON.parse(sessionStorage.getItem("USER_DEVICES"));
    this.sessionData.forEach(element => {
      this.sessionDeviceList.push(element.sensorId);
    });
    this.deviceInsightsobj.SensorId = this.sessionDeviceList.toString();
    return this.deviceInsightsobj
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

  updatedeviceData() {
    var jsonData = {
      "userId": sessionStorage.getItem("LOGINUSERID"),
      "userType": sessionStorage.getItem("USER_TYPE")
    }
    this._trackingService.getUserDevices(jsonData).subscribe(
      result => {

        this.deviceListData = result;
        this.deviceListData = this.deviceListData;
        sessionStorage.setItem("USER_DEVICES", JSON.stringify(this.deviceListData));
        var deviceData = sessionStorage.getItem("SENSOR_TOTALDATA");
        for (let i = 0; i < this.deviceListData.length; i++) {
          this.supportingList[i] = {
            id: Number(this.deviceListData[i].sensorId),
            vldvt: this.deviceListData[i].deviceName
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

    var deviceDataList = JSON.parse(sessionStorage.getItem("SENSOR_TOTALDATA"));
    try {
      for (let j = 0; j < deviceDataList.length; j++) {
        for (let i = 0; i < this.pagLst.length; i++) {

          var deviceDataLst = this.pagLst[i];//.ext[0];

          if (deviceDataLst.imi == deviceDataList[j].imi) {

            let Ignitionsts = deviceDataLst.igs == "1" ? "ON" : "OFF";

            let IgnitionStatus = deviceDataLst.pos == "1" || deviceDataLst.pos == "A" ? "ON" : "OFF";

            var responseDate = this._commanService.epochUTCtoDateWithTimeZone(Number(deviceDataLst.epochTms), deviceDataLst.imi);

            var curenntDate = new Date();

            var hourDifference = Math.abs(responseDate.getTime() - curenntDate.getTime());

            var latlng;

            if (Number(deviceDataLst.lat) != 0 && Number(deviceDataLst.lon) != 0) {
              latlng = new google.maps.LatLng(Number(deviceDataLst.lat), Number(deviceDataLst.lon));
            }
            else latlng = "";

            ////debugger
            var hours = this._commanService.CalculateTimeStamp(hourDifference); //hourDifference / 1000 / 3600;

            deviceDataList[j].imi = Number(deviceDataLst.imi);
            deviceDataList[j].vldvt = deviceDataList[j].vldvt;
            deviceDataList[j].imi = deviceDataList[j].imi;
            deviceDataList[j].regNo = deviceDataList[j].regNo;
            deviceDataList[j].vlIgnition = Ignitionsts;
            deviceDataList[j].vlspeed = deviceDataLst.spd;
            deviceDataList[j].vlgps = IgnitionStatus;
            deviceDataList[j].tms = this._commanService.epochUTCtoDateTimeWithTimeZone(deviceDataLst.epochTms, deviceDataList[j].imi);
            //this._commanService.DateConvert(deviceDataLst.tms);
            deviceDataList[j].vlliveTrack = deviceDataLst.imi;
            deviceDataList[j].vlhours = hours;
            deviceDataList[j].vlLatLng = latlng;
            deviceDataList[j].vlpos = deviceDataLst.pos;
            deviceDataList[j].DefaultTimeInMnts = this.hourorMin;
            deviceDataList[j].DefaultSpeed = this.calspd;
          }

        }//Inner For Loop End

      } //Main For Loop End
    } catch (e) {
      e = null;
    }
    sessionStorage.setItem("SENSOR_TOTALDATA", JSON.stringify(deviceDataList));
    var result = deviceDataList;
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
        element.name,
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
    if (this.reqLive) {
      this.reqLive.unsubscribe();
    }
    if (this.isTimer) {
      this.sub.unsubscribe();
    }
  }

}

export class DeviceInsights {
  public SensorId: string;
}