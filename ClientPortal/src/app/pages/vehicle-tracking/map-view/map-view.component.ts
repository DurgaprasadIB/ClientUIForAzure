import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
//import { Column, GridOption, Formatter, FieldType, OnEventArgs, AngularGridInstance, GridOdataService, Statistic } from 'angular-slickgrid';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs/Rx';

import MarkerClusterer from '@google/markerclusterer'

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';

import { TrackingService } from '../../tracking/services/tracking.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  @ViewChild('mapDivVehicle') gmapElementVehicle: any;
  map: google.maps.Map;
  vehicleListData: any = [];
  isLoadStatus: string = "";

  constructor(
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService,
    private translate: TranslateService
  ) { }


  dataset: any[] = [];
  supportDataset: any = [];

  isMoving: boolean;
  isIdle: boolean;
  isStopped: boolean;
  isNoGps: boolean;
  isNoPolling: boolean;
  isAll: boolean;

  //Hour Time

  hourorMin: Number;
  calspd: Number;
  defaultHoursorMintsofNopolling: Number;

  //Global Search Arrays
  GlobalmovingArrary: any = [];
  GlobalidleArrary: any = [];
  GlobalstoppedArrary: any = [];
  GlobalnoGpsArrary: any = [];
  GlobalnoPollingArrary: any = [];
  GlobalallVehicleLst: any = [];

  selectedTime: string = '';
  private timer;
  private sub: Subscription;
  supportingList: any = [];

  //For Index and Count
  VehiclemovingCntindex = 0;
  VehicleidleCntindex = 0;
  VehiclestoppedCntindex = 0;
  VehiclenoGpsCntindex = 0;
  VehiclenoPollingCntindex = 0;
  VehicleAllCntindex = 0;

  sessionData: any = [];
  sessionIMEIList: any = [];
  sessionDeviceTypeList: any = [];

  markerCluster: any;
  markersArray: any;
  mapViewObj = new MapView();

  imagePathUrl: string;

  isTimer: boolean;

  pagLst: any = [];

  //For Vehicle
  movingArrary: any = [];
  idleArrary: any = [];
  stoppedArrary: any = [];
  noGpsArrary: any = [];
  noPollingArrary: any = [];
  allVehicleLst: any = [];
  previousVehicleArray: any = [];

  //for checkbox filter
  isShowAllStatus: boolean;
  isShowStatus: boolean;
  checkBoxListArray: any = [];
  checkedListArray: any = [];

  alertSelectOneVehicle: any

  //Types
  processing = true;
  status = { text: 'processing...', class: 'alert alert-danger' };

  SearchInputValue: string = "";
  DateFormat: string;
  jQueryTable: any;
  isFooter: boolean = true;
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

    this.imagePathUrl = "./assets/Images/stop.png";

    this.alertSelectOneVehicle = this.translate.instant('alertSelectOneVehicle');

    this.updateVehicleData();
    this.TimerTick();

    var lat = this._commanService.getDefaultLat();
    var lon = this._commanService.getDefaultLng()
    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lon));
    this.map = new google.maps.Map(this.gmapElementVehicle.nativeElement,
      {
        center: centerLatLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy'
      }
    );

    var that = this;
    $('#vehMapTable tbody ').on('click', 'td', function () {
      //debugger;
      var Index = this.cellIndex
      if (Index == 0) {
        var data = $(this).parent();
        this.jQueryTable = $('#vehMapTable').DataTable();
        var data = this.jQueryTable.row(data).data();

        if (data[0] != "") {
          let deviceno = data[1];
          that.supportDataset.forEach(element => {

            if (element.imi == deviceno) {
              //debugger
              if (element.isChecked == false) {

                console.log("Before check: " + that.checkBoxListArray.length);

                element.isChecked = true;
                var had = false;
                that.checkBoxListArray.forEach(ele => {
                  if (ele.imi == element.imi) {
                    had = true;
                  }
                });

                that.checkedListArray.forEach(chkel => {
                  if (chkel.imi == element.imi) {
                    chkel.isChecked = true;
                  }
                });

                if (!had) {
                  that.checkBoxListArray.push(element);
                }
                console.log("Before check: " + that.checkBoxListArray.length);

              } else if (element.isChecked == true) {
                element.isChecked = false;
                console.log("Before uncheck: " + that.checkBoxListArray.length);
                for (var i = 0; i < that.checkBoxListArray.length; i++) {
                  if (that.checkBoxListArray[i].imi == element.imi) {
                    //debugger
                    that.checkBoxListArray[i].isChecked = false;

                    that.checkedListArray.forEach(chkel => {
                      if (chkel.imi == element.imi) {
                        chkel.isChecked = false;
                      }
                    });
                    that.checkBoxListArray.splice(i, 1);
                    //that.checkedListArray.splice(i, 1);
                  }
                }
                console.log("after uncheck: " + that.checkBoxListArray.length);
              }
            }
          });
        }
      }
    });


  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  TimerTick() {
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
      this.onLoadMapViewData();
    }
  }

  updateVehicleData() {
    this.mapViewObj.userId = sessionStorage.getItem("LOGINUSERID");
    this.mapViewObj.userType = sessionStorage.getItem("USER_TYPE");
    this._trackingService.getUserDevices(this.mapViewObj).subscribe(
      result => {

        this.vehicleListData = result;
        this.vehicleListData = this.vehicleListData.userVLAssets;
        sessionStorage.setItem("ASSETS_TYPES_VEHICLE", JSON.stringify(this.vehicleListData));

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
          sessionStorage.setItem("VEHICLE_TOTALDATA", JSON.stringify(this.supportingList));
        }
      }, error => {
        this.displaySpinner(false);
      });
  }

  reqLive: any;
  onLoadMapViewData() {
    ////debugger

    this.isLoadStatus = "timer";
    this.displaySpinner(true);
    this.mapViewObj = this.getVehicleSessionData();
    
    this.reqLive = this._trackingService.getVehicleTrackerLiveData(this.mapViewObj).subscribe(result => {
      
      if (this.reqLive !== undefined && !this.reqLive.isStopped) {
        this.pagLst = [];
        this.pagLst = result;
        this.pagLst = this.pagLst.evd == null ? [] : this.pagLst.evd;
        this.VehicleTableData();
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

  VehicleTableData() {
    //debugger
    this.dataset = [];
    this.movingArrary = [];
    this.idleArrary = [];
    this.stoppedArrary = [];
    this.noGpsArrary = [];
    this.noPollingArrary = [];
    this.allVehicleLst = [];

    //For Search
    this.GlobalmovingArrary = [];
    this.GlobalidleArrary = [];
    this.GlobalstoppedArrary = [];
    this.GlobalnoGpsArrary = [];
    this.GlobalnoPollingArrary = [];
    this.GlobalallVehicleLst = [];

    //For Index and Count
    this.VehiclemovingCntindex = 0;
    this.VehicleidleCntindex = 0;
    this.VehiclestoppedCntindex = 0;
    this.VehiclenoPollingCntindex = 0;
    this.VehiclenoGpsCntindex = 0;
    this.VehicleAllCntindex = 0;


    var vehicleDataList = JSON.parse(sessionStorage.getItem("VEHICLE_TOTALDATA"));
    ////debugger;

    try {
      for (let j = 0; j < vehicleDataList.length; j++) { //session data

        for (let i = 0; i < this.pagLst.length; i++) { //api data

          var vehicleDataLst = this.pagLst[i];

          if (vehicleDataLst.imi == vehicleDataList[j].imi) {

            let Ignitionsts = vehicleDataLst.igs == "1" ? "ON" : "OFF";
            let IgnitionStatus = vehicleDataLst.pos == "1" ? "ON" : "OFF";
            var responseDate = this._commanService.epochUTCtoDateWithTimeZone(Number(vehicleDataLst.epochTms), vehicleDataLst.imi);
            var curenntDate = new Date();
            var hourDifference = Math.abs(responseDate.getTime() - curenntDate.getTime());
            var latlng;
            if (Number(vehicleDataLst.lat) != 0 && Number(vehicleDataLst.lon) != 0) {
              latlng = new google.maps.LatLng(Number(vehicleDataLst.lat), Number(vehicleDataLst.lon));
            }
            else latlng = "";

            var hours = this._commanService.CalculateTimeStamp(hourDifference); //hourDifference / 1000 / 3600;

            vehicleDataList[j].imi = vehicleDataLst.imi;
            vehicleDataList[j].vldvt = vehicleDataList[j].vldvt;
            vehicleDataList[j].imi = vehicleDataList[j].imi;
            vehicleDataList[j].regNo = vehicleDataList[j].regNo;
            vehicleDataList[j].vlIgnition = Ignitionsts;
            vehicleDataList[j].vlspeed = vehicleDataLst.spd;
            vehicleDataList[j].vlgps = IgnitionStatus;
            vehicleDataList[j].tms = this._commanService.epochUTCtoDateTimeWithTimeZone(vehicleDataLst.epochTms, vehicleDataLst.imi);
            //this._commanService.DateConvert(vehicleDataLst.tms)
            vehicleDataList[j].vlliveTrack = vehicleDataLst.imi;
            vehicleDataList[j].vlhours = hours;
            vehicleDataList[j].vlpos = vehicleDataLst.pos;
            vehicleDataList[j].vlLatLng = latlng;
            vehicleDataList[j].isChecked = false;
            vehicleDataList[j].DefaultTimeInMnts = this.hourorMin;
            vehicleDataList[j].DefaultSpeed = this.calspd;
          }
        }//Inner For Loop End
      } //Main For Loop End
    } catch (e) {
      e = null;
    }
    sessionStorage.setItem("VEHICLE_TOTALDATA", JSON.stringify(vehicleDataList));
    var result = vehicleDataList;
    this.supportingList = [];
    try {
      for (let k = 0; k < result.length; k++) {
        var checkStatus = false;
        console.log("checked : " + this.checkBoxListArray.length);
        this.checkBoxListArray.forEach(chkele => {
          if (chkele.imi == result[k].imi) {
            checkStatus = chkele.isChecked;
          }
        });

        //NoPolling
        if (result[k].vlhours >= this.hourorMin) {
          this.noPollingArrary[this.VehiclenoPollingCntindex] = {
            id: Number(result[k].imi),
            vldvt: result[k].vldvt,
            imi: result[k].imi,
            regNo: result[k].regNo,
            vlIgnition: "OFF", //result[k].vlIgnition,
            vlspeed: "0", //result[k].vlspeed,
            vlgps: "OFF", //result[k].vlgps,
            tms: result[k].tms,
            vlLatLng: result[k].vlLatLng,
            isChecked: checkStatus,//result[k].isChecked,
            vlliveTrack: "",
            vlhours: result[k].vlhours,
            vlpos: "",//result[k].vlpos,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd

          }
          this.VehiclenoPollingCntindex++;

        }

        //Moving 
        else if (Number(result[k].vlspeed) >= this.calspd && result[k].vlIgnition == "ON" &&
          result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
          this.movingArrary[this.VehiclemovingCntindex] = {
            id: Number(result[k].imi),
            vldvt: result[k].vldvt,
            regNo: result[k].regNo,
            imi: result[k].imi,
            //connected:"",
            vlIgnition: result[k].vlIgnition,
            vlspeed: result[k].vlspeed,
            vlgps: result[k].vlgps,
            tms: result[k].tms,
            vlLatLng: result[k].vlLatLng,
            isChecked: checkStatus,//result[k].isChecked,
            vlliveTrack: result[k].imi,
            vlhours: result[k].vlhours,
            vlpos: result[k].vlpos,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd
          }
          this.VehiclemovingCntindex++

        }
        //Idle
        else if (Number(result[k].vlspeed) < this.calspd && result[k].vlIgnition == "ON" &&
          result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
          this.idleArrary[this.VehicleidleCntindex] = {
            id: Number(result[k].imi),
            vldvt: result[k].vldvt,
            regNo: result[k].regNo,
            imi: result[k].imi,
            //connected:"",
            vlIgnition: result[k].vlIgnition,
            vlspeed: result[k].vlspeed,
            vlgps: result[k].vlgps,
            tms: result[k].tms,
            vlLatLng: result[k].vlLatLng,
            isChecked: checkStatus,//result[k].isChecked,
            vlliveTrack: result[k].imi,
            vlhours: result[k].vlhours,
            vlpos: result[k].vlpos,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd
          }
          this.VehicleidleCntindex++;

        }
        //Stopping Number(result[k].vlspeed) == 0 &&
        else if (result[k].vlIgnition == "OFF" &&
          result[k].vlhours < this.hourorMin &&
          result[k].vlpos == "1") {
          this.stoppedArrary[this.VehiclestoppedCntindex] = {
            id: Number(result[k].imi),
            vldvt: result[k].vldvt,
            regNo: result[k].regNo,
            imi: result[k].imi,
            //connected:"",
            vlIgnition: result[k].vlIgnition,
            vlspeed: result[k].vlspeed,
            vlgps: result[k].vlgps,
            tms: result[k].tms,
            vlLatLng: result[k].vlLatLng,
            isChecked: checkStatus,//result[k].isChecked,
            vlliveTrack: result[k].imi,
            vlhours: result[k].vlhours,
            vlpos: result[k].vlpos,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd
          }
          this.VehiclestoppedCntindex++;
        }
        //NoGps

        else if (result[k].vlpos != "1" && result[k].vlhours < this.hourorMin) {
          this.noGpsArrary[this.VehiclenoGpsCntindex] = {
            id: Number(result[k].imi),
            vldvt: result[k].vldvt,
            regNo: result[k].regNo,
            imi: result[k].imi,
            //connected:"",
            vlIgnition: result[k].vlIgnition,
            vlspeed: result[k].vlspeed,
            vlgps: result[k].vlgps,
            tms: result[k].tms,
            vlLatLng: result[k].vlLatLng,
            isChecked: checkStatus,//result[k].isChecked,
            vlliveTrack: result[k].imi,
            vlhours: result[k].vlhours,
            vlpos: result[k].vlpos,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd
          }
          this.VehiclenoGpsCntindex++;


        }

        //All
        ////debugger
        this.dataset[this.VehicleAllCntindex] = {
          id: Number(result[k].imi),
          vldvt: result[k].vldvt,
          regNo: result[k].regNo,
          imi: result[k].imi,
          //connected:"",
          vlIgnition: result[k].vlhours > this.hourorMin ? "OFF" : result[k].vlIgnition,
          vlspeed: result[k].vlhours > this.hourorMin ? "0" : result[k].vlspeed,
          vlgps: result[k].vlhours > this.hourorMin ? "OFF" : result[k].vlgps,
          tms: result[k].tms,
          vlLatLng: result[k].vlLatLng,
          isChecked: checkStatus,//result[k].isChecked,
          vlliveTrack: result[k].vlhours > this.hourorMin ? "" : result[k].imi,
          vlhours: result[k].vlhours,
          vlpos: result[k].vlhours > this.hourorMin ? "" : result[k].vlpos,
          DefaultTimeInMnts: this.hourorMin,
          DefaultSpeed: this.calspd
        }
        this.VehicleAllCntindex++;
      }
    } catch (e) {
      e = null;
    }
    this.supportDataset = this.dataset;
    try {
      if (this.isMoving) {
        this.dataset = [];
        if (this.checkedListArray.length > 0 && this.movingArrary.length > 0) {
          this.checkedListArray.forEach(element => {
            this.supportDataset.forEach(ele => {
              if (element.imi == ele.imi) {
                element.id = ele.id,
                  element.imi = ele.imi,
                  element.vlIgnition = ele.vlIgnition,
                  element.vlspeed = ele.vlspeed,
                  element.vlgps = ele.vlgps,
                  element.vlhours = ele.vlhours,
                  element.vlpos = ele.vlpos,
                  element.vlLatLng = ele.vlLatLng,
                  element.tms = ele.tms,
                  element.DefaultTimeInMnts = this.hourorMin,
                  element.DefaultSpeed = this.calspd,
                  this.dataset.push(element);
              }
            });
          });
        }
        else {
          this.dataset = this.movingArrary;
        }
        this.AddMarkersToMap(this.dataset);
      }

      if (this.isIdle) {
        this.dataset = [];
        if (this.checkedListArray.length > 0 && this.idleArrary.length > 0) {
          this.checkedListArray.forEach(element => {
            this.supportDataset.forEach(ele => {
              if (element.imi == ele.imi) {
                element.id = ele.id,
                  element.imi = ele.imi,
                  element.vlIgnition = ele.vlIgnition,
                  element.vlspeed = ele.vlspeed,
                  element.vlgps = ele.vlgps,
                  element.vlhours = ele.vlhours,
                  element.vlpos = ele.vlpos,
                  element.vlLatLng = ele.vlLatLng,
                  element.tms = ele.tms,
                  element.DefaultTimeInMnts = this.hourorMin,
                  element.DefaultSpeed = this.calspd,
                  this.dataset.push(element);
              }
            });
          });
        }
        else {
          this.dataset = this.idleArrary;
        }
        this.AddMarkersToMap(this.dataset);
      }

      if (this.isStopped) {
        this.dataset = [];
        if (this.checkedListArray.length > 0 && this.stoppedArrary.length > 0) {
          this.checkedListArray.forEach(element => {
            this.supportDataset.forEach(ele => {
              if (element.imi == ele.imi) {
                element.id = ele.id,
                  element.imi = ele.imi,
                  element.vlIgnition = ele.vlIgnition,
                  element.vlspeed = ele.vlspeed,
                  element.vlgps = ele.vlgps,
                  element.vlhours = ele.vlhours,
                  element.vlpos = ele.vlpos,
                  element.vlLatLng = ele.vlLatLng,
                  element.tms = ele.tms,
                  element.DefaultTimeInMnts = this.hourorMin,
                  element.DefaultSpeed = this.calspd,
                  this.dataset.push(element);
              }
            });
          });
        }
        else {
          this.dataset = this.stoppedArrary;
        }
        this.AddMarkersToMap(this.dataset);
      }

      if (this.isNoPolling) {
        this.dataset = [];
        if (this.checkedListArray.length > 0 && this.noPollingArrary.length > 0) {
          this.checkedListArray.forEach(element => {
            this.supportDataset.forEach(ele => {
              if (element.imi == ele.imi) {
                element.id = ele.id;
                element.imi = ele.imi;
                element.vlIgnition = "OFF";// ele.vlIgnition,
                element.vlspeed = "0";//ele.vlspeed,
                element.vlgps = "OFF"; //ele.vlgps,
                element.vlhours = ele.vlhours;
                element.vlpos = ""; //ele.vlpos,
                element.vlLatLng = ele.vlLatLng;
                element.tms = ele.tms;
                element.vlliveTrack = "";
                element.DefaultTimeInMnts = this.hourorMin;
                element.DefaultSpeed = this.calspd;
                this.dataset.push(element);
              }
            });
          });
        }
        else {
          this.dataset = this.noPollingArrary;
        }
        this.AddMarkersToMap(this.dataset);
      }

      if (this.isNoGps) {
        this.dataset = [];
        if (this.checkedListArray.length > 0 && this.noGpsArrary.length > 0) {
          this.checkedListArray.forEach(element => {
            this.supportDataset.forEach(ele => {
              if (element.imi == ele.imi) {
                element.id = ele.id,
                  element.imi = ele.imi,
                  element.vlIgnition = ele.vlIgnition,
                  element.vlspeed = ele.vlspeed,
                  element.vlgps = ele.vlgps,
                  element.vlhours = ele.vlhours,
                  element.vlpos = ele.vlpos,
                  element.vlLatLng = ele.vlLatLng,
                  element.tms = ele.tms,
                  element.DefaultTimeInMnts = this.hourorMin,
                  element.DefaultSpeed = this.calspd,

                  this.dataset.push(element);
              }
            });
          });
        }
        else {
          this.dataset = this.noGpsArrary;
        }
        this.AddMarkersToMap(this.dataset);
      }

      if (this.isAll) {
        this.dataset = [];
        if (this.checkedListArray.length > 0 && this.supportDataset.length > 0) {
          this.checkedListArray.forEach(element => {
            this.supportDataset.forEach(ele => {
              if (element.imi == ele.imi) {
                element.id = ele.id,
                  element.imi = ele.imi,
                  element.vlIgnition = ele.vlhours > this.hourorMin ? "OFF" : ele.vlIgnition,
                  element.vlspeed = ele.vlhours > this.hourorMin ? "0" : ele.vlspeed,
                  element.vlgps = ele.vlhours > this.hourorMin ? "OFF" : ele.vlgps,
                  element.vlhours = ele.vlhours,
                  element.vlpos = ele.vlhours > this.hourorMin ? "" : ele.vlpos,
                  element.vlLatLng = ele.vlLatLng,
                  element.tms = ele.tms,
                  element.DefaultTimeInMnts = this.hourorMin,
                  element.DefaultSpeed = this.calspd,
                  this.dataset.push(element);
              }
            });
          });
        }
        else {
          this.dataset = this.supportDataset;
        }
        this.AddMarkersToMap(this.dataset);
      }
    } catch (e) {
      e = null;
    }
    const nameInput = document.getElementById('jqueryDTSearchInput') as HTMLInputElement;
    if (nameInput != null && nameInput.value != "") {
      this.SearchInputValue = nameInput.value;
    } else {
      this.SearchInputValue = "";
    }

    if (this.dataset.length > 0) {
      this.isShowStatus = true;
    } else {
      this.isShowStatus = false;
    }

    this.BindTableData(this.dataset);
    this.displaySpinner(false);
  }

  ispageLoad: boolean = true;
  BindTableData(ds: any) {

    if (this.isNoPolling) {
      this.isShowStatus = false;
    }

    var data = [];
    ds.forEach(element => {
      data.push([
        isCheckBoxIsChekedVehicle(element),
        element.imi,
        element.vldvt,
        element.regNo,
        VehicleStatusImg(element)
        ,
        element.tms
      ])
    });

    if (data.length > 0) {
      this.isFooter = true;
    } else {
      this.isFooter = false;
    }

    var table1 = $('#vehMapTable').DataTable();
    var order = table1.order();
    $('#vehMapTable').DataTable().destroy();

    this.jQueryTable = $('#vehMapTable').DataTable({
      "paging": false,
      "info": false,
      "order": [], "sort": [],
      searching: this.isFooter,
      'columnDefs': [{
        'targets': [0, 4], /* column index */
        'orderable': false, /* true or false */
      }]
    });

    this.jQueryTable.clear().rows.add(data).draw().
      columns(1).visible(false);


    if (this.ispageLoad) {
      this.ispageLoad = false;
    } else {

      if (order.length > 0) {
        this.jQueryTable.order([order[0][0], order[0][1]]).draw();
      }
    }

    jQuery('.dataTable').wrap('<div id="wrapperDiv" style="height:auto;max-height:380px;overflow-y:auto;" (scroll)=' + scroll() + '/>');

    if (this.SearchInputValue != "") {
      this.jQueryTable.search(this.SearchInputValue).draw();
    }

    this._loaderService.display(false);
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
    //var latLongArray: any = [];
    arrayList.forEach(element => {

      this.displaySpinner(false);
      if (element.imi != "" && element.tms != "" && element.vlLatLng != "") {

        if (element.vlLatLng.lat != null && element.vlLatLng.lng != null) {

          if (Number(element.vlLatLng.lat) != 0 && Number(element.vlLatLng.lng) != 0) {

            if (element.vlLatLng.lat > 0 && element.vlLatLng.lng > 0) {
              var latlng = new google.maps.LatLng(Number(element.vlLatLng.lat), Number(element.vlLatLng.lng))
              element.vlLatLng = latlng;
            }


            var vehicleimage = ""
            var VehicleMovingImg = "./assets/Images/runing.png";
            var VehicleStopImg = "./assets/Images/stop.png";
            var VehicleIdleImg = "./assets/Images/idle.png";
            var VehicleNopollingImg = "./assets/Images/nopoll.png";
            var VehicleNoGpsImg = "./assets/Images/nogps.png";
            var speed = Number(element.vlspeed);
            //Moving
            if (speed >= this.calspd && element.vlIgnition == "ON" &&
              element.vlhours < this.hourorMin && element.vlpos == "1") {
              vehicleimage = VehicleMovingImg;
            }
            //Idle
            if (speed < this.calspd && element.vlIgnition == "ON" &&
              element.vlhours < this.hourorMin && element.vlpos == "1") {
              vehicleimage = VehicleIdleImg;
            }
            //Stopped speed == 0 &&
            if (element.vlIgnition == "OFF" && element.vlhours < this.hourorMin && element.vlpos == "1") {
              vehicleimage = VehicleStopImg;
            }
            //NoGps
            if (element.vlhours < this.hourorMin && element.vlpos != "1") {
              vehicleimage = VehicleNoGpsImg;
            }
            //NoPolling
            if (element.vlhours >= this.hourorMin) {
              vehicleimage = VehicleNopollingImg;
            }


            // element.sts = element.tms //datePipe.transform(element.tms, 'dd/MM/yyyy hh:mm a');
            //alert(element.LatLng.lat());
            //var ingn = element.Ignition = true ? 'On' : 'Off';

            var strdata = '<div  id="iw-container">' +
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
            //alert(element.imageUrl);
            if (arrayList.length == 1) {
              var point = new google.maps.LatLng(Number(element.vlLatLng.lat()), Number(element.vlLatLng.lng()));
              this.map.panTo(point);
            }

            var marker = new google.maps.Marker({
              position: element.vlLatLng,
              map: this.map,
              title: element.vldvt,
              icon: vehicleimage,
              zIndex: 3
            });
            //debugger

            this.attachMarker(marker, strdata);
            this.markersArray.push(marker);

            if (this.isLoadStatus != "timer") {
              bounds.extend(marker.getPosition());
              this.map.fitBounds(bounds);
            }
          }
        }
      }
    });


    // 	var centerlatLngs = new google.maps.LatLng(center.latitude,center.longitude);
    // 	this.map.setCenter(centerlatLngs);

    if (this.markersArray.length > 0) {

      this.markerCluster = new MarkerClusterer(this.map, this.markersArray, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }

  }

  getTimerData(time) {
    this.onLoadMapViewData();
  }

  ngOnDestroy() {
    if(this.reqLive){
      this.reqLive.unsubscribe();
    }
    if (this.isTimer) {
      this.sub.unsubscribe();
    }
  }

  selectChangeHandler(event: any) {

    this.selectedTime = event.target.value;
    if (this.selectedTime == "00") {
      this.sub.unsubscribe();

      if(this.reqLive){
        this.reqLive.unsubscribe();
      }

    }
    else {
      this.sub.unsubscribe();
      this.timer = Observable.timer(0, Number(this.selectedTime) * 1000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
  }

  getShowAllVehicleStatus() {

    if (this.isMoving) {
      this.ShowAllVehicle(this.movingArrary);
    }
    if (this.isIdle) {
      this.ShowAllVehicle(this.idleArrary);
    }
    if (this.isStopped) {
      this.ShowAllVehicle(this.stoppedArrary);
    }
    if (this.isNoGps) {
      this.ShowAllVehicle(this.noGpsArrary);
    }
    if (this.isNoPolling) {
      this.ShowAllVehicle(this.noPollingArrary);
    }
    if (this.isAll) {
      this.ShowAllVehicle(this.supportDataset);
    }
  }

  ShowVehhicle() {

    this.isLoadStatus = "show";

    if (this.checkBoxListArray.length > 0) {
      this.checkedListArray = [];
      this.supportDataset.forEach(element => {
        this.checkBoxListArray.forEach(ele => {
          if (element.imi == ele.imi) {
            element.isChecked = true;
            this.checkedListArray.push(element);
          }
        });

      });
      this.isShowAllStatus = true;
      this.dataset = [];
      this.dataset = this.checkBoxListArray;
      this.AddMarkersToMap(this.checkBoxListArray);

      if (this.dataset.length > 0) {
        this.isShowStatus = true;
      } else {
        this.isShowStatus = false;
      }

      this.BindTableData(this.dataset);
    }
    else {
      if (this.checkBoxListArray.length <= 0) {
        this._toaster.warning(this.alertSelectOneVehicle, '', { timeOut: 1000 });
      }
    }

  }

  ShowAllVehicle(arrayCheckBox: any) {
    ////debugger
    //this.dataset = [];
    this.isLoadStatus = "showall";
    this.checkBoxListArray = [];
    try {
      this.supportDataset.forEach(element => {
        this.checkedListArray.forEach(ele => {
          if (element.imi == ele.imi) {
            element.isChecked = false;
          }
        });
      });
    } catch (e) {
      e = null;
    }
    this.isShowAllStatus = false;
    this.checkedListArray = [];
    try {
      //Moving
      if (this.isMoving) {
        this.movingArrary.forEach(ele => {
          ele.isChecked = false;
        });
        this.dataset = this.movingArrary;
        this.AddMarkersToMap(this.dataset);

      }
      //Idle
      else if (this.isIdle) {
        this.idleArrary.forEach(ele => {
          ele.isChecked = false;
        });
        this.dataset = this.idleArrary;
        this.AddMarkersToMap(this.dataset);
      }
      //NoPolling
      else if (this.isNoPolling) {
        this.noPollingArrary.forEach(ele => {
          ele.isChecked = false;
        });
        this.dataset = this.noPollingArrary;
        this.AddMarkersToMap(this.dataset);
      }
      //Stopped
      else if (this.isStopped) {
        this.stoppedArrary.forEach(ele => {
          ele.isChecked = false;
        });
        this.dataset = this.stoppedArrary;
        this.AddMarkersToMap(this.dataset);

      }
      //NoGps
      else if (this.isNoGps) {
        this.noGpsArrary.forEach(ele => {
          ele.isChecked = false;
        });
        this.dataset = this.noGpsArrary;
        this.AddMarkersToMap(this.dataset);
      }
      //All
      else if (this.isAll) {
        this.dataset = arrayCheckBox;
        this.AddMarkersToMap(this.dataset);
      }
    } catch (e) {
      e = null;
    }

    if (this.dataset.length > 0) {
      this.isShowStatus = true;
    } else {
      this.isShowStatus = false;
    }
    this.BindTableData(this.dataset);

  }

  onMovingVehicles() {

    this.clearCheckBox();
    this.isMoving = true;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.movingArrary;
    this.ShowAllVehicle(this.movingArrary);
    this.AddMarkersToMap(this.movingArrary);
    this.SearchInputValue = "";
  }

  onIdleVehicles() {
    this.clearCheckBox();
    this.isMoving = false;
    this.isIdle = true;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.idleArrary;
    this.ShowAllVehicle(this.idleArrary);
    this.AddMarkersToMap(this.idleArrary);
    this.SearchInputValue = "";
  }

  onStoppedVehicles() {
    this.clearCheckBox();
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = true;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.stoppedArrary;
    this.ShowAllVehicle(this.stoppedArrary);
    this.AddMarkersToMap(this.stoppedArrary);
    this.SearchInputValue = "";
  }

  onNoGpsVehicles() {
    this.clearCheckBox();
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = true;
    this.isNoPolling = false;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.noGpsArrary;
    this.ShowAllVehicle(this.noGpsArrary);
    this.AddMarkersToMap(this.noGpsArrary);
    this.SearchInputValue = "";
  }

  onNoPollingVehicles() {

    this.clearCheckBox();
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = true;
    this.isAll = false;
    this.dataset = [];
    this.dataset = this.noPollingArrary;
    this.ShowAllVehicle(this.noPollingArrary);
    this.AddMarkersToMap(this.noPollingArrary);
    this.SearchInputValue = "";
  }

  onAllVehicles() {
    this.clearCheckBox();
    this.isMoving = false;
    this.isIdle = false;
    this.isStopped = false;
    this.isNoGps = false;
    this.isNoPolling = false;
    this.isAll = true;
    this.dataset = [];
    this.dataset = this.supportDataset;
    this.ShowAllVehicle(this.supportDataset);
    this.AddMarkersToMap(this.supportDataset);
    this.SearchInputValue = "";
  }

  clearCheckBox() {
    this.checkBoxListArray.forEach(element => {
      element.isChecked = false;
    });
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

  scollPos() {
    alert('raised')
  }
}


function isCheckBoxIsChekedVehicle(dataContext) {
  if (dataContext.vlhours < dataContext.DefaultTimeInMnts && dataContext.vlLatLng != "") {
    if (dataContext.vlLatLng.lat != null && dataContext.vlLatLng.lng != null) {
      if (dataContext.vlLatLng.lat != 0 && dataContext.vlLatLng.lng != 0) {
        if (dataContext.isChecked) {
          return `<input type="checkbox" checked  [(ngModal)]="dataContext.isChecked" style="cursor:pointer;width:22px;height:22px"/>`
        }
        else {
          return `<input type="checkbox" [(ngModal)]="dataContext.isChecked"  style="cursor:pointer;width:22px;height:22px"/>`
        }
      }
      else return "";
    }
    else return "";
  }
  else return "";
}

function VehicleStatusImg(dataContext) {
  var ignimage = ""
  var VehicleMovingImg = "./assets/Images/runing.png";
  var VehicleStopImg = "./assets/Images/stop.png";
  var VehicleIdleImg = "./assets/Images/idle.png";
  var VehicleNopollingImg = "./assets/Images/nopoll.png";
  var VehicleNoGpsImg = "./assets/Images/nogps.png";
  var speed = Number(dataContext.vlspeed);
  var hour = dataContext.DefaultTimeInMnts//10
  var calspd = dataContext.DefaultSpeed//5;
  //Nopolling
  if (dataContext.vlhours >= hour) {
    ignimage = VehicleNopollingImg;

  }
  //Moving
  else if (speed >= calspd && dataContext.vlIgnition == "ON" && dataContext.vlhours < hour && dataContext.vlpos == "1") {
    ignimage = VehicleMovingImg;
  }
  //Idle
  else if (speed < calspd && dataContext.vlIgnition == "ON" && dataContext.vlhours < hour && dataContext.vlpos == "1") {
    ignimage = VehicleIdleImg;
  }
  //Stopped speed == 0 &&
  else if (dataContext.vlIgnition == "OFF" && dataContext.vlhours < hour && dataContext.vlpos == "1") {
    ignimage = VehicleStopImg;
  }
  //NoGps
  else if (dataContext.vlhours < hour && dataContext.vlpos != "1") {
    ignimage = VehicleNoGpsImg;
  }
  // //NoPolling
  // if (dataContext.vlhours > hour) {
  //   ignimage = VehicleNopollingImg;
  // }
  return `<img src='${ignimage}' title="" style="cursor:pointer" alt="Trulli">`

}

function gpsOnFormatter(vlpos) {
  return vlpos == "ON"
    ?
    `<img src="./assets/Images/GpsOn.svg" title="Gps On" style="cursor:pointer" alt="Trulli" width="20" height="20">`
    :
    `<img src="./assets/Images/GpsOff.svg" title="Gps Off" style="cursor:pointer" alt="Trulli" width="20" height="20">`
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

function scroll() {
  debugger
  // var div =document.getElementById("#wrapperDiv");
  // alert(document.getElementById("#wrapperDiv").scrollTop);

}

export class MapView {
  public tkn: string;
  public evnt: string;
  public divType: string;
  public IMEI: string;
  public userId: string;
  public userType: string;
}
