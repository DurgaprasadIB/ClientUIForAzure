import { Component, OnInit, ViewChild, ChangeDetectorRef, enableProdMode } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs/Rx';

import MarkerClusterer from '@google/markerclusterer'
import { DatePipe } from '@angular/common';

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { TrackingService } from '../../tracking/services/tracking.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SessionupdateService } from '../../GlobalServices/sessionupdate.service';
const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-site-dashboard',
  templateUrl: './site-dashboard.component.html',
  styleUrls: ['./site-dashboard.component.css']
})
export class SiteDashboardComponent implements OnInit {

  constructor(private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService,
    private ref: ChangeDetectorRef,
    private _UpdatingSessionStorage: SessionupdateService,
    private _loaderService: LoaderService) {
  }

  @ViewChild('mapDiv') gmapElement: any;
  map: google.maps.Map;
  ResultApiData: any = [];
  OccupiedApiData: any = [];
  NotOccupiedApiData: any = [];
  VehicleMovingCnt = 0;
  VehicleIdleCnt = 0;
  VehicleStopCnt = 0;
  VehicleNogpsCnt = 0;
  VehicleNoPollCnt = 0;
  VehicletotalCnt = 0;
  OccupiedCnt = 0;
  NotOccupiedCnt = 0;
  isFMS: any;
  isNotFMS: any;

  sessionData: any = [];
  sessionIMEIList: any = [];
  sessionDeviceTypeList: any = [];
  markerCluster: any;
  markersArray: any;
  mapViewObj = new MapView();
  imagePathUrl: string;
  PeopleImageUrl: string;
  isTimer: boolean;
  isAvailble: boolean;

  //For Alert
  TamperCnt: any = 0;
  TamperRestoreCnt: any = 0;
  SOSCnt: any = 0;
  OverSpeedCnt: any = 0;
  GeofenceCnt: any = 0;
  TripCnt: any = 0;
  RouteDeviatedCnt: any = 0;
  IgnitionCnt: any = 0;
  alertData: any = {};

  //For Vehicle
  dataset: any = [];
  movingArrary: any = [];
  idleArrary: any = [];
  stoppedArrary: any = [];
  noGpsArrary: any = [];
  noPollingArrary: any = [];
  previousVehicleArray: any = [];
  occupiedArray: any = [];
  notOccupiedArray: any = [];

  isMoving = false;
  isIdle = false;
  isStopped = false;
  isNoGps = false;
  isNoPolling = false;
  isAll = true;
  isNotOccupied = false;
  isOccupied = false;

  selectedTime: string = '';
  private timer;
  private sub: Subscription;
  timerValue: any;
  supportingList: any = [];

  processing = true;
  status = { text: 'processing...', class: 'alert alert-danger' };

  //Hour Time
  hourorMin: Number;
  calspd: Number;
  defaultHoursorMintsofNopolling: Number;


  VehicleMovingImg = "./assets/Images/runing.png";
  VehicleStopImg = "./assets/Images/stop.png";
  VehicleIdleImg = "./assets/Images/idle.png";
  VehicleNopollingImg = "./assets/Images/nopoll.png";
  VehicleNoGpsImg = "./assets/Images/nogps.png";

  ngOnInit() {
debugger
    this.isNotFMS = true;
    this.isFMS = false;
    var isFleetModule = sessionStorage.getItem("IS_FMS_REQUEST");
    if (isFleetModule == "1") {
      this.isFMS = true;
      this.isNotFMS = false;
    }

    this.hourorMin = this._commanService.NOPOLLINGHOURSTIME; //24; for no polling time
    this.calspd = this._commanService.VEHICLESPEEDLIMIT; //5; for vehicle speed
    this.defaultHoursorMintsofNopolling = this._commanService.DEFAULTNOPOLLINGTIME; //For Default No Polling Time

    this.timerValue = this._commanService.DASHBOARDTIMER; //Dashboard Timer

    this.ResultApiData = [];
    this.OccupiedApiData = [];
    this.NotOccupiedApiData = [];
    var lat = this._commanService.getDefaultLat();
    var lng = this._commanService.getDefaultLng();
    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lng));
    var mapProp = {
      center: centerLatLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    this.getVehicleSessionData();

    var vehicledata = sessionStorage.getItem("VEHICLE_TOTALDATA");
    if (vehicledata == null) {
      for (let i = 0; i < this.sessionData.length; i++) {
        this.supportingList[i] = {
          imi: this.sessionData[i].deviceNo,
          vldvt: this.sessionData[i].assetNo,
          vlIgnition: "",
          vlspeed: "",
          vlgps: "",
          tms: "",
          vlliveTrack: "",
          vlhours: this.defaultHoursorMintsofNopolling,
          vlpos: "",
          vlLatLng: "",
          imgPath: ""
        }
      }
      sessionStorage.setItem("VEHICLE_TOTALDATA", JSON.stringify(this.supportingList));
    }

    //this.onLoadMapViewData();

    // if (this.timerValue > 0) {
    //   this.isTimer = true;
    //   this.timer = Observable.timer(0, Number(this.timerValue) * 1000);
    //   this.sub = this.timer.subscribe(N => this.getTimerData(N));
    // }

  }

  ngOnDestroy() {
    if (this.isTimer) {
      this.sub.unsubscribe();
    }
  }
  getTimerData(time) {
    //this._UpdatingSessionStorage.sessionUpdate();
    this.onLoadMapViewData();
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  onLoadMapViewData() {
    this.displaySpinner(true);
    //debugger;
    this.BindAlertCount();
    this.BindVehCount();
  }

  BindAlertCount() {
    //debugger;

    var ReqData = { "imei": this.mapViewObj.IMEI };

    this._trackingService.getalertLiveData(ReqData).subscribe(result => {
      this.alertData = result;
      this.TamperCnt = this.alertData.Tamper;
      this.TamperRestoreCnt = this.alertData.TamperRestore;
      this.SOSCnt = this.alertData.SOS;
      this.OverSpeedCnt = this.alertData.OverSpeed;
      this.GeofenceCnt = this.alertData.Geofence;
      this.TripCnt = this.alertData.Trip;
      this.RouteDeviatedCnt = this.alertData.RouteDeviated;
      this.IgnitionCnt = this.alertData.Ignition;
    });
  }

  BindVehCount() {
    // //debugger;

    this.mapViewObj = this.getVehicleSessionData();
    this._trackingService.getVehicleTrackerLiveData(this.mapViewObj).subscribe(result => {
      // //debugger;
      this.ResultApiData = result;
      this.ResultApiData = this.ResultApiData.evd == null ? [] : this.ResultApiData.evd;
      this.VehicleTableData();
    }, error => {
      this.displaySpinner(false);
      //this._toaster.warning(error.error.Message);
    });
  }

  OccNotOccResultlist: any;
  OccupiedNotOccupiedVehData() {
    this._trackingService.getOccupiedNotOccupiedList().subscribe(result => {
      //debugger;
      this.OccNotOccResultlist = result;
      this.OccupiedCnt = this.OccNotOccResultlist.OccupiedCount;
      this.NotOccupiedCnt = this.OccNotOccResultlist.NotOccupiedCount;
      this.BindOccupiedData(this.OccNotOccResultlist.OccupiedList);
      this.BindNotOccupiedData(this.OccNotOccResultlist.NotOccupiedList);
    }, error => {
      this.displaySpinner(false);
    });
  }

  BindOccupiedData(list: any): any {
    //debugger;
    this.occupiedArray = [];
    try {
      list.forEach(element => {
        this.dataset.forEach(TtlDataEle => {
          //debugger
          if (TtlDataEle.imi == element.imei) {
            var dt = {
              id: TtlDataEle.id,
              vldvt: TtlDataEle.vldvt,
              imi: TtlDataEle.imi,
              vlIgnition: TtlDataEle.vlIgnition,
              vlspeed: TtlDataEle.vlspeed,
              vlgps: TtlDataEle.vlgps,
              tms: TtlDataEle.tms,
              vlLatLng: TtlDataEle.vlLatLng,
              vlliveTrack: TtlDataEle.imi,
              vlhours: TtlDataEle.vlhours,
              vlpos: TtlDataEle.vlpos,
              occStatus: true,
              bookingID: element.bookingID,
              //guestName: element.guestName,
              DriverName: element.driverName,
              imgPath: TtlDataEle.imgPath
            };

            this.occupiedArray.push(dt);
          }
        });
      });
    } catch (e) {
      e = null;
    }
  }

  BindNotOccupiedData(list: any): any {
    //debugger;
    this.notOccupiedArray = [];
    try {
      list.forEach(element => {

        this.dataset.forEach(TtlDataEle => {
          //debugger
          if (TtlDataEle.imi == element.imei) {
            this.notOccupiedArray.push(TtlDataEle);
          }
        });
      });
    } catch (e) {
      e = null;
    }
  }

  VehicleTableData() {
    this.dataset = [];
    this.movingArrary = [];
    this.movingArrary = [];
    this.idleArrary = [];
    this.stoppedArrary = [];
    this.noGpsArrary = [];
    this.noPollingArrary = [];

    this.VehicleMovingCnt = 0;
    this.VehicleIdleCnt = 0;
    this.VehicleStopCnt = 0;
    this.VehicleNogpsCnt = 0;
    this.VehicleNoPollCnt = 0;
    this.VehicletotalCnt = 0;
    //debugger;
    var vehicleDataList = JSON.parse(sessionStorage.getItem("VEHICLE_TOTALDATA"));

    for (let j = 0; j < vehicleDataList.length; j++) { //session data

      for (let i = 0; i < this.ResultApiData.length; i++) { //api data

        if (this.ResultApiData[i].imi == vehicleDataList[j].imi) {

          var vehicleDataLst = this.ResultApiData[i].ext[0];

          let Ignitionsts = vehicleDataLst.ign == "1" ? "ON" : "OFF";
          let IgnitionStatus = vehicleDataLst.pos == "1" || vehicleDataLst.pos == "A" ? "ON" : "OFF";
          var responseDate = this._commanService.epochUTCtoDateWithTimeZone(Number(this.ResultApiData[i].epochTms), this.ResultApiData[i].imi)
          var curenntDate = new Date();
          var hourDifference = Math.abs(responseDate.getTime() - curenntDate.getTime());

          var latlng;
          if (Number(vehicleDataLst.lat) != 0 && Number(vehicleDataLst.lon) != 0) {
            latlng = new google.maps.LatLng(Number(vehicleDataLst.lat), Number(vehicleDataLst.lon));
          }
          else latlng = "";

          var hours = this._commanService.CalculateTimeStamp(hourDifference); //hourDifference / 1000 / 3600;
          vehicleDataList[j].imi = Number(this.ResultApiData[i].imi),
            vehicleDataList[j].vldvt = vehicleDataList[j].vldvt,
            vehicleDataList[j].vlIgnition = Ignitionsts,
            vehicleDataList[j].vlspeed = vehicleDataLst.spd,
            vehicleDataList[j].vlgps = IgnitionStatus,
            vehicleDataList[j].tms = datePipe.transform(this.ResultApiData[i].tms, 'dd/MM/yyyy hh:mm:ss a');//this.pagLst[i].tms,
          vehicleDataList[j].vlliveTrack = this.ResultApiData[i].imi,
            vehicleDataList[j].vlhours = hours,
            vehicleDataList[j].vlpos = vehicleDataLst.pos,
            vehicleDataList[j].vlLatLng = latlng
        }

      }//Inner For Loop End

    } //Main For Loop End
    //debugger;
    sessionStorage.setItem("VEHICLE_TOTALDATA", JSON.stringify(vehicleDataList));
    var result = vehicleDataList;
    for (let k = 0; k < result.length; k++) {

      var img;
      //NoPolling
      if (result[k].vlhours >= this.hourorMin) {
        ////debugger;
        this.noPollingArrary[this.VehicleNoPollCnt] = {
          id: Number(result[k].imi),
          vldvt: result[k].vldvt,
          imi: result[k].imi,
          vlIgnition: result[k].vlIgnition,
          vlspeed: result[k].vlspeed,
          vlgps: result[k].vlgps,
          tms: result[k].tms,
          vlLatLng: result[k].vlLatLng,
          vlliveTrack: result[k].imi,
          vlhours: result[k].vlhours,
          vlpos: result[k].vlpos,
          occStatus: false,
          imgPath: this.VehicleNopollingImg
        }
        img = this.VehicleNopollingImg;
        this.VehicleNoPollCnt++;
      }

      //Moving 
      else if (Number(result[k].vlspeed) >= this.calspd && result[k].vlIgnition == "ON" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
        //debugger;
        this.movingArrary[this.VehicleMovingCnt] = {
          id: Number(result[k].imi),
          vldvt: result[k].vldvt,
          imi: result[k].imi,
          //connected:"",
          vlIgnition: result[k].vlIgnition,
          vlspeed: result[k].vlspeed,
          vlgps: result[k].vlgps,
          tms: result[k].tms,
          vlLatLng: result[k].vlLatLng,
          vlliveTrack: result[k].imi,
          vlhours: result[k].vlhours,
          vlpos: result[k].vlpos,
          occStatus: false,
          imgPath: this.VehicleMovingImg
        }
        img = this.VehicleMovingImg;
        this.VehicleMovingCnt++
      }
      //Idle
      else if (Number(result[k].vlspeed) < this.calspd && result[k].vlIgnition == "ON" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
        //debugger;
        this.idleArrary[this.VehicleIdleCnt] = {
          id: Number(result[k].imi),
          vldvt: result[k].vldvt,
          imi: result[k].imi,
          vlIgnition: result[k].vlIgnition,
          vlspeed: result[k].vlspeed,
          vlgps: result[k].vlgps,
          tms: result[k].tms,
          vlLatLng: result[k].vlLatLng,
          vlliveTrack: result[k].imi,
          vlhours: result[k].vlhours,
          vlpos: result[k].vlpos,
          occStatus: false,
          imgPath: this.VehicleIdleImg
        }
        img = this.VehicleIdleImg;
        this.VehicleIdleCnt++;
      }
      //Stopping Number(result[k].vlspeed) == 0 &&
      else if (result[k].vlIgnition == "OFF" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
        //debugger;
        this.stoppedArrary[this.VehicleStopCnt] = {
          id: Number(result[k].imi),
          vldvt: result[k].vldvt,
          imi: result[k].imi,
          vlIgnition: result[k].vlIgnition,
          vlspeed: result[k].vlspeed,
          vlgps: result[k].vlgps,
          tms: result[k].tms,
          vlLatLng: result[k].vlLatLng,
          vlliveTrack: result[k].imi,
          vlhours: result[k].vlhours,
          vlpos: result[k].vlpos,
          occStatus: false,
          imgPath: this.VehicleStopImg
        }
        img = this.VehicleStopImg;
        this.VehicleStopCnt++;
      }
      //NoGps

      else if (result[k].vlpos != "1" && result[k].vlhours < this.hourorMin) {
        //debugger;
        this.noGpsArrary[this.VehicleNogpsCnt] = {
          id: Number(result[k].imi),
          vldvt: result[k].vldvt,
          imi: result[k].imi,
          vlIgnition: result[k].vlIgnition,
          vlspeed: result[k].vlspeed,
          vlgps: result[k].vlgps,
          tms: result[k].tms,
          vlLatLng: result[k].vlLatLng,
          vlliveTrack: result[k].imi,
          vlhours: result[k].vlhours,
          vlpos: result[k].vlpos,
          occStatus: false,
          imgPath: this.VehicleNoGpsImg
        }
        img = this.VehicleNoGpsImg;
        this.VehicleNogpsCnt++;
      }

      //All
      this.dataset[k] = {
        id: Number(result[k].imi),
        vldvt: result[k].vldvt,
        imi: result[k].imi,
        vlIgnition: result[k].vlIgnition,
        vlspeed: result[k].vlspeed,
        vlgps: result[k].vlgps,
        tms: result[k].tms,
        vlLatLng: result[k].vlLatLng,
        vlliveTrack: result[k].imi,
        vlhours: result[k].vlhours,
        vlpos: result[k].vlpos,
        occStatus: false,
        imgPath: img
      }

      this.VehicletotalCnt++;
    }

    this.OccupiedNotOccupiedVehData();

    if (this.isMoving) {
      this.AddMarkersToMap(this.movingArrary);
    }

    else if (this.isIdle) {
      this.AddMarkersToMap(this.idleArrary);
    }
    else if (this.isStopped) {
      this.AddMarkersToMap(this.stoppedArrary);
    }
    else if (this.isNoPolling) {
      this.AddMarkersToMap(this.noPollingArrary);
    }
    else if (this.isNoGps) {
      this.AddMarkersToMap(this.noGpsArrary);
    }
    else if (this.isAll) {
      this.AddMarkersToMap(this.dataset);
    }
    else if (this.isOccupied) {
      this.AddMarkersToMap(this.occupiedArray);
    }
    else if (this.isNotOccupied) {
      this.AddMarkersToMap(this.notOccupiedArray);
    }
  }

  onMoving() {
    this.isMoving = true;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.isNotOccupied = false;
    this.isOccupied = false;
    this.AddMarkersToMap(this.movingArrary);
  }
  onIdle() {

    this.isMoving = false;
    this.isIdle = true;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.isNotOccupied = false;
    this.isOccupied = false;
    this.AddMarkersToMap(this.idleArrary);

  }
  onStop() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = true;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.isNotOccupied = false;
    this.isOccupied = false;
    this.AddMarkersToMap(this.stoppedArrary);
  }
  onNoGPS() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = true;
    this.isNoPolling = false;
    this.isAll = false;
    this.isNotOccupied = false;
    this.isOccupied = false;
    this.AddMarkersToMap(this.noGpsArrary);
  }
  onNoPOll() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = true;
    this.isAll = false;
    this.isNotOccupied = false;
    this.isOccupied = false;
    this.AddMarkersToMap(this.noPollingArrary);
  }
  onTotal() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = true;
    this.isNotOccupied = false;
    this.isOccupied = false;
    this.AddMarkersToMap(this.dataset);
  }

  onOccupied() {
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.isNotOccupied = false;
    this.isOccupied = true;
    this.AddMarkersToMap(this.occupiedArray);
  }

  onNotOccupied() {

    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.isNotOccupied = true;
    this.isOccupied = false;
    this.AddMarkersToMap(this.notOccupiedArray);
  }

  AddMarkersToMap(arrayList: any) {

    if (this.markerCluster != null) {
      // Clears all clusters and markers from the clusterer.
      this.markerCluster.clearMarkers();
    }

    if (this.markersArray) {
      for (var i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray.length = 0;
    }
    this.markersArray = [];
    var bounds = new google.maps.LatLngBounds();
    arrayList.forEach(element => {

      if (element.imi != "" && element.tms != "" && element.vlLatLng != "") {

        if (element.vlLatLng.lat != null && element.vlLatLng.lng != null) {
          if (Number(element.vlLatLng.lat) != 0 && Number(element.vlLatLng.lng) != 0) {

            if (element.vlLatLng.lat > 0 && element.vlLatLng.lng > 0) {
              var latlng = new google.maps.LatLng(Number(element.vlLatLng.lat), Number(element.vlLatLng.lng))
              element.vlLatLng = latlng;
            }
            //debugger
            var strdata = "";
            if (element.occStatus == true) {
              strdata = '<div  id="iw-container">' +
                '<div class="iw-title">' + element.vldvt + '</div>' +
                '<div class="iw-content">' +
                '<table><tr><td>' + "Speed " + '</td><td>:</td><td>' + element.vlspeed + '&nbsp;(kmph)</td></tr>' +
                '<tr><td>' + "Time " + '</td><td>:</td><td>' + element.tms + '</td></tr>' +
                '<tr><td>' + "Driver Name " + '</td><td>:</td><td>' + element.DriverName + '</td></tr>' +
                '<tr><td>' + "Booking ID " + '</td><td>:</td><td>' + element.bookingID + '</td></tr>' +
                '<tr><td style="vertical-align:top">' + "Location " + '</td><td style="vertical-align:top">:</td><td>' + '<a style="color:blue" href="http://maps.google.com/?q=' + element.vlLatLng.lat() + ',' + element.vlLatLng.lng() + '" target="_blank"> View on Google Maps' + '</td></tr>' +
                '<tr><td></td><td></td><td align="left">' + '<a style="color:blue" href="/Navnext/#/pages/VehicleTracking/LiveTrack?TrackerNo=' + element.imi + '">' + "Live" + '</a>  | ' +
                ' <a style="color:blue" href="/Navnext/#/pages/VehicleTracking/TripHistory?TrackerNo=' + element.imi + '">&nbsp;' + "History" + '</a></td></tr></table>' +
                '</div>' +
                '<div class="iw-bottom-gradient" style="display:none"></div>' +
                '</div>';
            }
            else {
              strdata = '<div  id="iw-container">' +
                '<div class="iw-title">' + element.vldvt + '</div>' +
                '<div class="iw-content">' +
                '<table><tr><td>' + "Speed " + '</td><td>:</td><td>' + element.vlspeed + '&nbsp;(kmph)</td></tr>' +
                '<tr><td>' + "Time " + '</td><td>:</td><td>' + element.tms + '</td></tr>' +
                '<tr><td style="vertical-align:top">' + "Location " + '</td><td style="vertical-align:top">:</td><td>' + '<a style="color:blue" href="http://maps.google.com/?q=' + element.vlLatLng.lat() + ',' + element.vlLatLng.lng() + '" target="_blank"> View on Google Maps' + '</td></tr>' +
                '<tr><td></td><td></td><td align="left">' + '<a style="color:blue" href="/Navnext/#/pages/VehicleTracking/LiveTrack?TrackerNo=' + element.imi + '">' + "Live" + '</a>  | ' +
                ' <a style="color:blue" href="/Navnext/#/pages/VehicleTracking/TripHistory?TrackerNo=' + element.imi + '">&nbsp;' + "History" + '</a></td></tr></table>' +
                '</div>' +
                '<div class="iw-bottom-gradient" style="display:none"></div>' +
                '</div>';
            }

            if (arrayList.length == 1) {
              var point = new google.maps.LatLng(Number(element.vlLatLng.lat()), Number(element.vlLatLng.lng()));
              this.map.panTo(point);
            }

            var marker = new google.maps.Marker({
              position: element.vlLatLng,
              map: this.map,
              title: element.vldvt,
              icon: element.imgPath,
              zIndex: 3
            });
            bounds.extend(marker.getPosition());
            this.attachMarker(marker, strdata);
            this.markersArray.push(marker);
            this.map.fitBounds(bounds);
          }
        }

      }

    });

    if (this.markersArray.length > 0) {

      this.markerCluster = new MarkerClusterer(this.map, this.markersArray, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }

  }
  attachMarker(marker, indx) {

    var infowindow = new google.maps.InfoWindow(
      {
        content: indx,
      });
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(this.map, marker);
    });

    google.maps.event.addListener(infowindow, 'domready', function () {

      var iwOuter = $('.gm-style-iw');
      var iwBackground = iwOuter.prev();

      // Removes background shadow DIV
      iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

      // Removes white background DIV
      iwBackground.children(':nth-child(4)').css({ 'display': 'none' });

      // Moves the infowindow 115px to the right.
      iwOuter.parent().parent().css({ left: '0px' });

      // Moves the shadow of the arrow 76px to the left margin.
      iwBackground.children(':nth-child(1)').attr('style', function (i, s) { return s + 'left: 126px !important;' });

      // Moves the arrow 76px to the left margin.
      iwBackground.children(':nth-child(3)').attr('style', function (i, s) { return s + 'left: 126px !important;' });

      // Changes the desired tail shadow color.
      iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1' });

      // Reference to the div that groups the close button elements.
      //var iwCloseBtn = iwOuter.next();

      //// Apply the desired effect to the close button
      //iwCloseBtn.css({ opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9' });

      // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
      if ($('.iw-content').height() < 140) {
        $('.iw-bottom-gradient').css({ display: 'none' });
      }

      var iwCloseBtn = iwOuter.next();

      // Apply the desired effect to the close button
      iwCloseBtn.css({
        opacity: '1', // by default the close button has an opacity of 0.7
        right: '45px', top: '3px', // button repositioning
        border: '2px solid #48b5e9', // increasing button border and new color
        'border-radius': '13px', // circular effect
        'box-shadow': '0 0 5px #3990B9', // 3D effect to highlight the button
        width: '17px',
        height: '17px'
      });

      // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
      iwCloseBtn.mouseout(function () {
        $(this).css({ opacity: '1' });
      });
    });
  } //Markerend

  getVehicleSessionData() {

    this.sessionDeviceTypeList = [];
    this.sessionIMEIList = [];
    this.sessionData = [];
    this.sessionData = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));
    this.sessionData.forEach(element => {
      this.sessionDeviceTypeList.push(element.assetType);
      this.sessionIMEIList.push(element.deviceNo);
    });

    this.mapViewObj.divType = this.remove_duplicates(this.sessionDeviceTypeList).toString();
    this.mapViewObj.IMEI = this.sessionIMEIList.toString();
    return this.mapViewObj
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
}

export class MapView {

  public tkn: string;
  public evnt: string;
  public divType: string;
  public IMEI: string;

}
