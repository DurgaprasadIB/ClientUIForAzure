import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../reports/service/report.service';
import { ExportExcelService } from '../../GlobalServices/export-excel.service';
import { SessionupdateService } from '../../GlobalServices/sessionupdate.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TrackingService } from '../services/tracking.service';
import { ToastrService } from 'ngx-toastr';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { Observable, Subscription } from 'rxjs/Rx';
import Swal from 'sweetalert2'

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { debug } from 'util';

import * as Paho from "paho-mqtt";
import { analyzeAndValidateNgModules, ElementSchemaRegistry } from '@angular/compiler';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
  selector: 'app-list-view-temp',
  templateUrl: './list-view-temp.component.html',
  styleUrls: ['./list-view-temp.component.css']
})
export class ListViewTempComponent implements OnInit, OnDestroy {
  @ViewChild('modalTrend') modalTrend: any;
  @ViewChild('modalLiveSensor') modalLiveSensor: any;
  @ViewChild('modalAllSensor') modalAllSensor: any;

  //

  gridCount: any = 0;
  DateFormat: string;
  isShowFooter: boolean = false;

  // tileDevice: any = ""
  opDevice: any = ""

  tileSnr1: any = ""
  tileSnr2: any = ""
  tileSnr3: any = ""

  tileOn1: boolean = false;
  tileOn2: boolean = false;
  tileOn3: boolean = false;

  callRCTtrend: boolean = false;

  constructor(
    private router: Router,
    private _detailService: ReportService,
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService,
    private _UpdatingSessionStorage: SessionupdateService,
    private _exportExcel: ExportExcelService
  ) {

  }

  MQTTdeviceTopic: any = "";

  selectHW: any;
  hasRules: boolean;
  hasChart: boolean = false;
  hasSurv: boolean = false;
  hasMap: boolean = false;
  hasTemp: boolean = false;
  hasDBpin: boolean = false;

  pageStart: Number = 0
  pageStartView: Number = 0
  pageEnd: Number = 0
  pageCount: Number = 0

  pageStartDisable: boolean = false;
  pageEndDisable: boolean = false;

  showSPconfig: boolean = false;
  showSPconfigIcon: boolean = false;

  isSuperAdmin: boolean = false;

  cmdVal: string;
  userTimeZone: any;
  dataset: any[] = [];
  supportDataset: any = [];
  dateRange: any;
  deviceId: any = "";
  chartNote: any = "";
  DateRangeList: any = [];
  selectedRange: any = "";
  TrendName: any = "";
  TrendValues: any = [];
  SensorRules: any = [];
  Exportdataset: any = [];
  isGood: boolean;
  isWarning: boolean;
  isCritical: boolean;
  islive: boolean;
  isNR: boolean;
  isAll: boolean;
  mqttCMDval: boolean;
  bothSN: boolean;
  onlyNSN: boolean;

  rcDevid: any = "";
  rcDevName: any = "";
  RoomTempId: any = "";
  CoilTempId: any = "";
  rcTrendSName1: any = "";
  rcTrendSUoM1: any = "";
  rcTrendSName2: any = "";
  rcTrendSUoM2: any = "";
  RoomTempVal: any = "";
  CoilTempVal: any = "";
  RCTempVal: any = "";
  rcTrendResp: any;
  hasRCfv1: boolean = false;
  hasRCfv2: boolean = false;
  rcTrendTime: any;
  rcTrendS1: any;
  rcTrendS2: any;
  rcTrendS1Color: any;
  rcTrendS2Color: any;

  userPref: any = "";

  deviceTime: any = "";

  period: any;
  periodRange: any;
  periodRangeFilter: any;
  moreInfoResp: any = []
  isListDetails: boolean;
  mapView: boolean;
  listView: boolean;
  showTrendDownload: boolean;
  selectedTime: string = '';
  private timer;
  private sub: Subscription;

  //showMore: boolean = false;
  sessionData: any = [];
  sessionDeviceList: any = [];
  sessionDeviceTypeList: any = [];

  supportingList: any = [];
  deviceListData: any = [];
  curenntDate: any;
  processing = true;
  showMoreDevice: any = "";
  showMoreOpen: boolean = false;
  isDates: boolean = false;

  status = { text: 'processing...', class: 'alert alert-danger' };

  //For Vehicle
  movingArrary: any = [];
  idleArrary: any = [];
  stoppedArrary: any = [];
  noGpsArrary: any = [];
  noPollingArrary: any = [];
  allVehicleLst: any = [];
  isTimer: boolean;

  isMultipleHW: boolean;
  //For Index and Count
  SensorLiveCntindex = 0;
  SensorNrCntindex = 0;
  SensorGoodCntindex = 0;
  SensorWarnCntindex = 0;
  SensorCriticalCntindex = 0;
  DeviceAllCntindex = 0;

  pollingSensor: any;
  NRSensor: any;
  goodSensor: any;
  warningSensor: any;
  criticalSensor: any;

  userHwTypes: any;
  stateType: any = "";
  //Hour Time

  hourorMin: Number;
  calspd: Number;
  defaultHoursorMintsofNopolling: Number;

  //For Pagination
  pagLst: any = [];
  clientFeatures: any;
  LiveSensorResp: any = [];
  SensorList: any;
  DeviceList: any;
  sensorId: any;
  sensorKey: any;
  sensorUoM: any;
  SearchInputValue: string = "";
  trendResponse: any = [];
  deviceInsightsobj = new DeviceInsights();

  //isTrendPlot: boolean = false;
  perPage: any

  maxDate: any = Date;
  bgImage: any;

  isLiveLoaded: any;

  ngOnInit() {


    this.pageStart = 0
    this.pageStartView = 1
    this.pageCount = 5

    this.pageStartDisable = true;
    this.pageEndDisable = true;

    this.pageEnd = Number(this.pageStart) + Number(this.pageCount);

    if (sessionStorage.getItem('Client_ListView') == "1") {
      this.router.navigateByUrl('/pages/tracking/LiveView')
    }

    // ;
    // this.isMultipleHW = false;

    // this._loaderService.display(false);
    // if (sessionStorage.getItem('liveScreen') === null) {
    //   sessionStorage.setItem('liveScreen', "live");
    //   //window.location.reload();
    // }
    // else
    //   if (sessionStorage.getItem('liveScreen') != null && sessionStorage.getItem('liveScreen') != "live") {
    //     sessionStorage.setItem('liveScreen', "live");

    //     this._loaderService.display(true);
    //     window.location.reload();
    //   }

    this.hasSurv = false;
    this.hasChart = false;

    this.tileDevice = "";
    this.opDevice = "-";
    this.tileSnr1 = "-"
    this.tileSnr2 = "-"
    this.tileSnr3 = "-"

    this.clientFeatures = {};
    this.clientFeatures = JSON.parse(sessionStorage.getItem('Client_Feature'));

    this.clientFeatures.forEach(fe => {
      if (fe.featureId.toUpperCase() == '830FB9BE-C04F-477E-AE5E-4CB76EDB7D12') {
        this.hasSurv = true;
      }
      if (fe.featureId.toUpperCase() == '6F5B60E3-1473-45B2-86DF-91EF6612D1F4') {
        this.hasChart = true;
      }
      if (fe.featureId.toUpperCase() == 'E05A7A69-7B97-4A1C-B105-9C036C43C3C9') {
        this.hasDBpin = true;
      }
      if (fe.featureId.toUpperCase() == 'EBCC9638-4053-42E0-B523-1EF204F8936C') {
        this.hasMap = true;
      }
      if (fe.featureId.toUpperCase() == '7429106C-8341-458D-BB7D-196DAAC6E8C2') {
        this.hasTemp = true;
      }
    });


    this.hasDBpin = false;

    this.userHwTypes = [];
    var userHW: any;
    userHW = JSON.parse(sessionStorage.getItem('User_HWTypes'));

    var HW: any;
    userHW.forEach(hw => {
      HW = []

      HW.id = hw.modelId;
      HW.name = hw.modelName;

      this.userHwTypes.push(HW);
    });

    if (this.userHwTypes !== undefined) {
      if (this.userHwTypes.length == 1) {
        this.isMultipleHW = false;
      }
      else {
        this.isMultipleHW = true;
      }

      this.selectHW = this.userHwTypes[0].id;
    }

    this.userTimeZone = sessionStorage.getItem('USER_TIMEZONE');
    this.bgImage = sessionStorage.getItem('BGimage');
    this.DateFormat = "(" + this._commanService.getDateFormat() + ")";
    this.hourorMin = this._commanService.NOPOLLINGHOURSTIME; //24; for no polling time
    this.calspd = this._commanService.VEHICLESPEEDLIMIT; //5; for vehicle speed
    this.defaultHoursorMintsofNopolling = this._commanService.DEFAULTNOPOLLINGTIME; //For Default No Polling Time
    this.isTimer = false;
    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = false;
    this.isNR = false;
    this.isAll = true;
    this.mqttCMDval = false;

    this.mapView = false;
    this.listView = true;
    this.isListDetails = true;

    this.showTrendDownload = false;
    this.isDates = false;
    var currentDate = new Date();
    this.deviceInsightsobj.fromDate = ""
    this.deviceInsightsobj.toDate = ""
    this.maxDate = currentDate;


    this.loadDateRanges();

    this.stateType = "All";
    this.updatedeviceData();
    this.loadSensorTypes();

    this.userPref = sessionStorage.getItem("USER_PREF");

    this.showSPconfigIcon = false;
    this.showSPconfig = false;

    if (sessionStorage.getItem("hasUserManagement") == "1") {
      this.showSPconfigIcon = true;
    }

    if (sessionStorage.getItem("User_SuperAdmin") == "SuperAdmin") {
      this.isSuperAdmin = true;
    }
    else {
      this.isSuperAdmin = false;
    }


    this.plotRCalso = true;

    this.timerTick();


    this.perPage = [];

    this.perPage.push(
      {
        pCnt: 5,
        pVal: 'Show: 5'
      },
      {
        pCnt: 10,
        pVal: 'Show: 10'
      },
      {
        pCnt: 20,
        pVal: 'Show: 20'
      },
      {
        pCnt: 50,
        pVal: 'Show: 50'
      },
      {
        pCnt: 100,
        pVal: 'Show: 100'
      }
    );

    ////load Periods for trend
    this.periodRange = [];
    this.periodRange.push(
      {
        pId: 60,
        pVal: '1 min'
      },
      {
        pId: 300,
        pVal: '5 mins'
      },
      {
        pId: 600,
        pVal: '10 mins'
      },
      {
        pId: 900,
        pVal: '15 mins'
      },
      {
        pId: 1800,
        pVal: '30 mins'
      },
      {
        pId: 3600,
        pVal: '1 Hr'
      },
      {
        pId: 7200,
        pVal: '6 Hrs'
      },
      {
        pId: 86400,
        pVal: '1 Day'
      }
    );

  }




  loadPeriodRange(pollingFreq: any) {

    this.periodRangeFilter = [];

    var starting = +pollingFreq;

    this.periodRange.forEach(p => {
      if (p.pId >= starting) {
        this.periodRangeFilter.push(
          {
            pId: p.pId,
            pVal: p.pVal
          }
        )
      }
    });

  }

  mqttClient: any;
  mqttConnected: any;
  hasMqtt: boolean;


  public connectMQTT() {
    // connect the client

    this.mqttClient.connect({
      useSSL: true,
      // userName: "ibindia",
      // password: "IdeaBytes@1234",
      // userName: "admin",
      // password: "hivemq",
      // userName: "iyibvpxf",
      // password: "53a0OAlnvsck",
      onSuccess: () => {

        // alert('connected');

        this.mqttConnected = true;
        // Once a connection has been made, make a subscription and send a message.
        console.log("[MQTT] Connected");
        this.mqttClient.subscribe("World");
        //this.requestToRefresh.emit();
      }
    });
  }

  public initializeMQTT() {

    console.warn("Initializing MQTT");

    // Create a client instance

    this.mqttClient = new Paho.Client("mqtt.ppm-rs.com", Number(8083), "clientId123");
    // this.mqttClient = new Paho.Client("mqtt.ppm-rs.com", Number(8883), "clientId123");


    //// set callback handlers
    this.mqttClient.onConnectionLost = (responseObject) => {


      if (responseObject.errorCode !== 0) {
        this.mqttConnected = false;

        //alert("Lost connection Please reload.");
        console.error("[MQTT] Connection Lost:" + responseObject.errorMessage);

      }
    };

    this.mqttClient.onMessageArrived = (message) => {



      // auto-scroll to bottom
      //jQuery('#vr-output').animate({ scrollTop: $('#vr-output').get(0).scrollHeight }, 500);
    }


  }

  command(deviceId: any, sensor: any, val: any) {



    var newStatus: any
    var cmd: any;

    if (val.toLowerCase().includes('on')) {
      newStatus = "OFF"
    }
    else
      if (val.toLowerCase().includes('off')) {
        newStatus = "ON"
      }
      else {
        this.mqttCMDval = true;
      }


    if (sensor == "devStat") {
      cmd = '{"deviceId": "' + deviceId + '","device":"' + newStatus + '"}'
    }
    else {
      cmd = '{"deviceId": "' + deviceId + '","' + sensor + '": ' + newStatus + '}'
    }

    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "Dashboard",
      "actionPerformed": deviceId + '-' + sensor + '- ' + newStatus + " has been updated"
    }

    this._commanService.logUpdate(logReq);


    logReq["deviceId"] = deviceId;
    this._commanService.device_logUpdate(logReq);

    this.sendCommand(cmd);
  }


  commandVal(deviceId: any, sensor: any, range: any, cmdVal: any, name: any) {



    var newStatus: any
    var cmd: any;

    var min: number;
    var max: number;
    if (range != null && range != undefined && range != "") {
      min = +range[0];
      max = +range[1];
    }



    if (cmdVal == "" || cmdVal == undefined || cmdVal == null) {
      this._toaster.warning('please set value');
    }
    else {

      var isValid: boolean

      isValid = true;

      if (name.toLowerCase() == 'log interval') {
        var V: Number
        V = Number(cmdVal)

        if (Number(V) % 5 !== 0) {
          this._toaster.warning('Please enter multiples of 5 Only');
          isValid = false;

        }
        else {
          isValid = true;

        }
      }

      if (isValid) {
        if (cmdVal.includes('.')) { }
        else {
          cmdVal = cmdVal + ".0";
        }



        var val = +cmdVal;

        if (val >= min && val <= max) {
          sensor = sensor.replace(' ', '');

          //alert(sensor);

          //if (sensor.toLowerCase() == "setpoint") {
          cmd = '{"deviceId": "' + deviceId + '","' + sensor + '": ' + cmdVal + '}'
          // }

          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Dashboard",
            "actionPerformed": deviceId + '-' + name + '(' + range + ')- ' + cmdVal + " has been updated"
          }

          this._commanService.logUpdate(logReq);


          logReq["deviceId"] = deviceId;
          this._commanService.device_logUpdate(logReq);

          this.sendCommand(cmd);
        }
        else {
          this._toaster.warning('please set value within the range only');
        }
      }
    }
  }

  public sendCommand(cmd: any) {


    Swal({
      title: 'Would you like to place request?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes'
    }).then((result1) => {
      if (result1.value) {

        let message = new Paho.Message(cmd);



        if (this.MQTTdeviceTopic == undefined || this.MQTTdeviceTopic == "") {
          message.destinationName = sessionStorage.getItem("MQTT_PubTopic"); //"dx_in";
        }
        else {
          message.destinationName = this.MQTTdeviceTopic; //"dx_in";
        }

        if (this.mqttConnected) {
          this.mqttClient.send(message);
        }
        else {

          var obj: any = {};

          obj.topicName = message.destinationName;
          obj.command = cmd;

          this._trackingService.sendMqttCmd(obj).subscribe(result => {

          });
        }

        this._toaster.success("Request has been placed.");
      }
    });


  }


  loadDateRanges() {
    //Last 24 Hrs
    //Last 3 Days
    //Last 1 Week
    //Last 10 Days
    //Custom Dates

    this.DateRangeList = []

    var dtRange: any

    dtRange = []
    dtRange.dtId = "24"
    dtRange.dtName = "Last 24 Hrs"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "72"
    dtRange.dtName = "Last 3 Days"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "168"
    dtRange.dtName = "Last 1 Week"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "240"
    dtRange.dtName = "Last 10 Days"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "360"
    dtRange.dtName = "Last 15 Days"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "custom"
    dtRange.dtName = "Custom Dates"

    this.DateRangeList.push(dtRange);

  }

  checkDateRange(event: any) {

    this.selectedRange = event.dtId;

    if (event.dtId == "custom") {
      this.isDates = true;
    }
    else {
      this.isDates = false;
    }
  }
  modifiedLiveSens: any = [];
  checkChange(key: any) {
    //

    this.LiveSensorResp.forEach(element => {

      if (element.Skey == key.Skey && element.ShortCode == key.ShortCode) {

        if (element._ShowInLive) {
          element._ShowInLive = false;
        }
        else {
          element._ShowInLive = true;
        }
        if (this.modifiedLiveSens.indexOf(element) !== -1) {
          const index = this.modifiedLiveSens.indexOf(key, 0);
          this.modifiedLiveSens.splice(index, 1);
        } else {
          this.modifiedLiveSens.push(element);
        }
      }
    });

    //
  }

  modifiedPinTrendSens: any = [];
  checkPinTrendChange(key: any) {
    //

    this.LiveSensorResp.forEach(element => {

      if (element.Skey == key.Skey && element.ShortCode == key.ShortCode) {

        if (element.pinTrend) {
          element.pinTrend = false;
        }
        else {
          element.pinTrend = true;
        }

        if (this.modifiedPinTrendSens.indexOf(element) !== -1) {
          const index = this.modifiedPinTrendSens.indexOf(key, 0);
          this.modifiedPinTrendSens.splice(index, 1);
        } else {
          this.modifiedPinTrendSens.push(element);
        }
      }
    });

    //
  }
  modifiedPinTailSens: any = [];

  checkPinTile(key: any) {
    //

    this.LiveSensorResp.forEach(element => {

      if (element.Skey == key.Skey && element.ShortCode == key.ShortCode) {

        if (element.pinTile) {
          element.pinTile = false;
        }
        else {
          element.pinTile = true;
        }
        if (this.modifiedPinTailSens.indexOf(element) !== -1) {
          const index = this.modifiedPinTailSens.indexOf(key, 0);
          this.modifiedPinTailSens.splice(index, 1);
        } else {
          this.modifiedPinTailSens.push(element);
        }
      }
    });

    //
  }
  exportPdf() {
    //
    var obj: any;

    obj = []

    obj.deviceId = this.deviceId;//this.TrendName.split(":")[0];
    obj.sensorId = this.sensorKey;
    obj.reportType = "pdf";

    if (this.selectedRange == "custom") {
      obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.fromDate);
      obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.toDate);
    }
    else {
      obj.frDate = this.selectedRange;
    }

    this._trackingService.getTrend(obj).subscribe(result => {


    });
  }

  saveShowLiveSnsr() {
    //

    var resp: any;

    resp = [];

    this._trackingService.updateSensorInLive(this.LiveSensorResp).subscribe(result => {
      //

      resp = result

      if (resp.sts == "200") {
        this._toaster.success(resp.msg + ", Changes will effect soon");

        this.modalLiveSensor.hide();

        if (this.modifiedLiveSens.length > 0) {
          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Dashboard",
            "actionPerformed": this.selectHW + " - Show In Live sensors are updated"
          }

          this._commanService.logUpdate(logReq);
        }

        if (this.modifiedPinTrendSens.length > 0) {
          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Dashboard",
            "actionPerformed": this.selectHW + " - Pin Trend sensors are updated"
          }

          this._commanService.logUpdate(logReq);
        }

        if (this.modifiedPinTailSens.length > 0) {
          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Dashboard",
            "actionPerformed": this.selectHW + " - Pin To Tail sensors are updated"
          }

          this._commanService.logUpdate(logReq);
        }
      }
      else {
        this._toaster.warning(resp.msg);
      }

      this.getTileSensors();

    });
  }

  tileSensor: any = []
  getTileSensors() {


    if (this.LiveSensorResp.length == 0 || this.LiveSensorResp == null) {
      this.LiveSensorResp = [];

      this._trackingService.getSensorInLive(this.selectHW).subscribe(result => {

        var livesnr: any = []

        livesnr = result;

        var userHW: any;
        userHW = JSON.parse(sessionStorage.getItem('User_HWTypes'));

        userHW.forEach(hw => {


          livesnr = result;
          livesnr = livesnr.filter(r => r.ShortCode == hw.modelId);

          livesnr.forEach(lhw => {

            this.LiveSensorResp.push(lhw);
          });

          this.tileSensor = [];
          this.LiveSensorResp.forEach(ts => {
            if (ts.pinTile == true) {
              this.tileSensor.push(ts)
            }
          });
        });
      });

    }
    else {


      this.tileSensor = [];
      this.LiveSensorResp.forEach(ts => {
        if (ts.pinTile == true) {
          this.tileSensor.push(ts)
        }
      });
    }

  }

  openSensorShow() {

    var snsr: any

    snsr = [];

    this.LiveSensorResp = [];

    this._trackingService.getSensorInLive(this.selectHW).subscribe(result => {

      // this.LiveSensorResp = result;


      var livesnr: any = []

      livesnr = result;

      var userHW: any;
      userHW = JSON.parse(sessionStorage.getItem('User_HWTypes'));

      userHW.forEach(hw => {


        livesnr = result;
        livesnr = livesnr.filter(r => r.ShortCode == hw.modelId);

        livesnr.forEach(lhw => {

          this.LiveSensorResp.push(lhw);
        });
      });
      this.modifiedLiveSens = [];
      this.modifiedPinTrendSens = [];
      this.modifiedPinTailSens = [];
      this.modalLiveSensor.show();
    });



  }

  loadSensorTypes() {

    this.SensorList = {}
    this.SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.SensorList = this.SensorList.filter(g => g.key !== "tms");
  }

  changeView(view) {



    this._commanService.ActionType = view;
    if (view == "chart") {
      this.isShowFooter = false;
      this.isListDetails = false;

      //
      if (this.isTimer) {
        this.sub.unsubscribe();
      }

      this.router.navigateByUrl('/pages/tracking/SensorView')

    } else
      if (view == "temp") {
        //
        if (this.isTimer) {
          this.sub.unsubscribe();
        }

        this.router.navigateByUrl('/pages/tracking/TempView')
      }
      else if (view == "pin") {
        if (this.isTimer) {
          this.sub.unsubscribe();
        }
        this.isShowFooter = false;
        this.isListDetails = false;
        this.router.navigateByUrl('/pages/tracking/AnalyticsView')

      }
      else if (view == "video") {
        if (this.isTimer) {
          this.sub.unsubscribe();
        }
        this.isShowFooter = false;
        this.isListDetails = false;
        this.router.navigateByUrl('/pages/reports/videoRecordings')
      }
      else
        if (view == "image") {
          if (this.isTimer) {
            this.sub.unsubscribe();
          }
          this.isShowFooter = false;
          this.isListDetails = false;
          this.router.navigateByUrl('/pages/reports/images')

        } else
          if (view == "map") {
            if (this.isTimer) {
              this.sub.unsubscribe();
            }
            this.isShowFooter = false;
            this.isListDetails = false;
            this.router.navigateByUrl('/pages/tracking/Map')
          }

  }




  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  timerTick() {


    this.getTileSensors();

    if (this.isTimer) {
      this.sub.unsubscribe();
      this.isTimer = true;
      this.timer = Observable.timer(0, Number(60) * 1000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
    else {
      this.isTimer = true;
      this.timer = Observable.timer(0, Number(60) * 1000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }

  }

  plotRCalso: boolean = false;
  reqLive: any;
  onLoadSensorSummaryData(devices: any) {


    this.displaySpinner(true);
    //this.deviceInsightsobj = this.getVehicleSessionData();

    this.pagLst = [];
    var obj: any = [];

    if (this.selectHW !== undefined) {
      obj.hwType = this.selectHW;
    }

    obj.loginId = this._commanService.getLoginUserID();
    obj.timezone = this.userTimeZone;
    //
    if (devices === "") {

      this.reqLive = this._trackingService.getSensorLiveData(obj).subscribe(result => {


        if (this.reqLive !== undefined) {
          this.pagLst = result;


          var rTemp: boolean = false;
          var cTemp: boolean = false;

          this.RoomTempVal = "";
          this.CoilTempVal = "";
          this.RCTempVal = "";
          this.RoomTempId = "";
          this.CoilTempId = "";




          this.bothSN = false;
          this.onlyNSN = false;

          debugger
          
          if (this.pagLst.rcTemp.sensorId1 !== undefined &&
            this.pagLst.rcTemp.sensorId1 !== "" &&
            this.pagLst.rcTemp.sensorId1 !== null) {
            rTemp = true;
            this.RoomTempId = this.pagLst.rcTemp.sensorId1;
            // this.RoomTempVal = this.pagLst.rcTemp.sensorVal1;
            // this.RCTempVal = this.pagLst.rcTemp.sensorVal1;
            this.rcTrendSName1 = this.pagLst.rcTemp.snsr1Name;

            this.onlyNSN = true;

          }

          if (this.pagLst.rcTemp.sensorId2 !== undefined &&
            this.pagLst.rcTemp.sensorId2 !== "" &&
            this.pagLst.rcTemp.sensorId2 !== null) {
            cTemp = true;
            this.CoilTempId = this.pagLst.rcTemp.sensorId2;
            // this.CoilTempVal = this.pagLst.rcTemp.sensorVal2;
            // this.RCTempVal = this.pagLst.rcTemp.sensorVal2;


            this.onlyNSN = false;

            this.bothSN = true;
          }



          if (this.rcDevid == "" || this.rcDevid == undefined || this.rcDevid == null) {

            this.rcDevid = this.pagLst.rcTemp.deviceId;

            if (rTemp == true && cTemp == true) {
              this.bothSN = true;
            }
            else {
              this.onlyNSN = true;
            }

          }
          this.pagLst = this.pagLst.liveDetails == null ? [] : this.pagLst.liveDetails;

          debugger

          // if (this.plotRCalso) {

            this.plotRCTrend(this.rcDevid);

            this.plotRCalso = false;
          // }
          // else {
          //   this.getRCValues(this.rcDevid)
          // }

          this.BindTableData(result);

        }
      }, error => {
        this.VehicleTableData();
      })
    }
    else {
      // //
      obj.deviceList = devices;

      this.reqLive = this._trackingService.getSensorLiveDataByDevices(obj).subscribe(result => {
        //;
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
  }

  isRCLive: boolean = false;
  isRCLiveLoad: boolean = false;

  plotRCTrend(deviceId: any) {


    var obj: any
    obj = {}


    var deviceDetails: any;

    this.sessionData = JSON.parse(sessionStorage.getItem("USER_DEVICES"));


    if (deviceId == "") {
      obj.deviceId = this.rcDevid;
    }
    else {

      this.rcDevid = deviceId.split('#')[0];
    }


    deviceDetails = this.sessionData.filter(g => g.sensorId.toLowerCase() == this.rcDevid.toLowerCase());

    if (deviceDetails.length == 0) {
      deviceDetails = this.sessionData.filter(g => g.deviceName.toLowerCase() == this.rcDevid.toLowerCase());
    }

    obj.deviceId = deviceDetails[0].sensorId;
    this.rcDevName = deviceDetails[0].deviceName;
    // this.rcDevid = this.rcDevName;

    obj.sensorId = this.RoomTempId;

    if (obj.sensorId !== "") {
      if (this.CoilTempId != "") {
        obj.sensorId += ',' + this.CoilTempId;
      }
    }
    else {
      obj.sensorId = this.CoilTempId;
    }

    obj.period = "24";
    obj.shortCode = this.selectHW;

    var trend: any = [];

    this.isRCLive = true;
    this.isRCLiveLoad = false;


    this._trackingService.getrcTrend(obj).subscribe(result => {


      this.rcTrendTime = [];
      this.rcTrendS1 = [];
      this.rcTrendS2 = [];

      trend = result;

      this.rcTrendTime = trend.time;

      this.RCTempVal = trend.snsr1Val
      this.RoomTempVal = trend.snsr1Val

      if (this.bothSN == true) {
        this.CoilTempVal = trend.snsr2Val;
        this.rcTrendSName2 = trend.snsr2Name;
      }


      this.rcTrendSName1 = trend.snsr1Name;

      if (trend.snsr2 !== null &&
        trend.snsr2 !== "" &&
        trend.snsr2 !== undefined) {

        this.rcTrendS2 = trend.snsr2;
        this.rcTrendS2Color = trend.s2Color;

        if (this.rcTrendS2Color == null) {
          this.rcTrendS2Color = "#000"
        }
      }


      this.rcTrendS1 = trend.snsr1;

      this.rcTrendS1Color = trend.s1Color;

      if (this.rcTrendS1Color == null) {
        this.rcTrendS1Color = "#000"
      }


      var obj: any = {};
      this.rcTrendResp = [];

      var d: any = 0;

      if (this.rctrendChart) { this.rctrendChart.dispose(); }

      // this.RCTempVal = "";
      // this.RoomTempVal = "";
      // this.CoilTempVal = "";





      this.rcTrendSUoM1 = "";
      this.rcTrendSUoM2 = "";

      var SessionUoM: any = {};

      SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));
      var snrUoM: any = []

      if (trend.s2UoM !== '') {
        snrUoM = SessionUoM.filter(g => g.uomId == trend.s2UoM);

        this.rcTrendSUoM2 = snrUoM[0].symbol;
      }

      if (trend.s1UoM !== '') {
        snrUoM = SessionUoM.filter(g => g.uomId == trend.s1UoM);

        this.rcTrendSUoM1 = snrUoM[0].symbol;
      }

      if (this.rcTrendTime !== null) {

        this.hasRCfv1 = false;
        this.hasRCfv2 = false;

        for (let index = 0; index < this.rcTrendTime.length; index++) {

          this.isRCLive = true;

          try {
            obj = {};

            obj.date = 0;

            if (this.rcTrendTime[index].length == 10) {
              obj.date = +(this.rcTrendTime[index] + "000");
            }
            else {
              obj.date = +(this.rcTrendTime[index]);
            }

            obj.value1 = this.rcTrendS1[index];
            obj.value2 = this.rcTrendS2[index];

            var oobj: any = {};
            oobj.date = obj.date

            // if (obj.value1 == '12499421' && obj.value2 == '12499421') {
            // }
            // else
            //   if (obj.value1 == '12499421') {
            //     this.hasRCfv1 = true;
            //     oobj.value2 = this.rcTrendS2[index];
            //   }
            //   else
            //     if (obj.value2 == '12499421') {
            //       this.hasRCfv2 = true;
            //       oobj.value1 = this.rcTrendS1[index];
            //     }
            //     else {
            oobj.value1 = this.rcTrendS1[index];
            oobj.value2 = this.rcTrendS2[index];

            if (this.rcTrendS2.length > 0) {
              if (oobj.value1 == undefined || oobj.value2 == undefined) {
                break;
              }
            }
            // }

            this.rcTrendResp.push(oobj)

            // }
            // else {

            //   obj.value1 = this.rcTrendS1[index];
            //   obj.value2 = this.rcTrendS2[index];
            //   this.rcTrendResp.push(obj)
            // }
          }
          catch (error) {
            console.log(console.error())
          }
        }
      }
      else {

      }



      this.getPinnedTileSensorValues(this.rcDevid)
      this.ploatrcTrendChart();

    });


  }

  getRCValues(deviceId: any) {


    var obj: any
    obj = {}


    var deviceDetails: any;

    this.sessionData = JSON.parse(sessionStorage.getItem("USER_DEVICES"));


    if (deviceId == "") {
      obj.deviceId = this.rcDevid;
    }
    else {

      this.rcDevid = deviceId.split('#')[0];
    }


    deviceDetails = this.sessionData.filter(g => g.sensorId.toLowerCase() == this.rcDevid.toLowerCase());

    if (deviceDetails.length == 0) {
      deviceDetails = this.sessionData.filter(g => g.deviceName.toLowerCase() == this.rcDevid.toLowerCase());
    }

    obj.deviceId = deviceDetails[0].sensorId;
    this.rcDevName = deviceDetails[0].deviceName;
    // this.rcDevid = this.rcDevName;

    obj.sensorId = this.RoomTempId;

    if (obj.sensorId !== "") {
      if (this.CoilTempId != "") {
        obj.sensorId += ',' + this.CoilTempId;
      }
    }
    else {
      obj.sensorId = this.CoilTempId;
    }

    obj.period = "24";
    obj.shortCode = this.selectHW;

    var trend: any = [];

    this.isRCLive = true;
    this.isRCLiveLoad = false;

    this._trackingService.getrcTrendOnlyValue(obj).subscribe(result => {

      debugger
      trend = result;


      this.RCTempVal = trend.snsr1Val
      this.RoomTempVal = trend.snsr1Val

      if (this.bothSN == true) {
        this.CoilTempVal = trend.snsr2Val;
        this.rcTrendSName2 = trend.snsr2Name;
      }


      this.rcTrendSName1 = trend.snsr1Name;

      if (trend.snsr2 !== null &&
        trend.snsr2 !== "" &&
        trend.snsr2 !== undefined) {

        this.rcTrendS2 = trend.snsr2;
        this.rcTrendS2Color = trend.s2Color;

        if (this.rcTrendS2Color == null) {
          this.rcTrendS2Color = "#000"
        }
      }


      this.rcTrendS1 = trend.snsr1;

      this.rcTrendS1Color = trend.s1Color;

      if (this.rcTrendS1Color == null) {
        this.rcTrendS1Color = "#000"
      }




      this.rcTrendSUoM1 = "";
      this.rcTrendSUoM2 = "";

      var SessionUoM: any = {};

      SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));
      var snrUoM: any = []

      if (trend.s2UoM !== '') {
        snrUoM = SessionUoM.filter(g => g.uomId == trend.s2UoM);

        this.rcTrendSUoM2 = snrUoM[0].symbol;
      }

      if (trend.s1UoM !== '') {
        snrUoM = SessionUoM.filter(g => g.uomId == trend.s1UoM);

        this.rcTrendSUoM1 = snrUoM[0].symbol;
      }




      this.getPinnedTileSensorValues(this.rcDevid)

    });


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

  refreshData() {


    this.rcDevid = "";

    if (this.selectHW == "" || this.selectHW == undefined || this.selectHW == null) {
      this.selectHW = this.userHwTypes[0].id
    }

    // this.RoomTempVal = "";
    // this.CoilTempVal = "";
    // this.RCTempVal = "";
    // this.RoomTempId = "";
    // this.CoilTempId = "";
    this.TrendValues = [];

    this.LiveSensorResp = [];
    this.getTileSensors();

    // this.onLoadSensorSummaryData("");
    //this.timerTick();
    this.stateType = "All"
    this.isTimer = false;
    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = false;
    this.isNR = false;

    this.plotRCalso = true;

    this.getTimerData("N");

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
      "userID": sessionStorage.getItem("LOGINUSERID")
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

    this.SensorLiveCntindex = 0;
    this.SensorNrCntindex = 0;
    this.SensorGoodCntindex = 0;
    this.SensorWarnCntindex = 0;
    this.SensorCriticalCntindex = 0;
    this.DeviceAllCntindex = 0;

    //////

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

            //////
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
          }

        }//Inner For Loop End

      } //Main For Loop End
    } catch (e) {
      e = null;
    }
    sessionStorage.setItem("SENSOR_TOTALDATA", JSON.stringify(deviceDataList));
    var result = deviceDataList;
    this.supportDataset = [];

    const nameInput = document.getElementById('jqueryDTSearchInput') as HTMLInputElement;
    if (nameInput != null && nameInput.value != "") {
      this.SearchInputValue = nameInput.value;
    } else {
      this.SearchInputValue = "";
    }

    this.BindTableData(this.dataset);

    this.displaySpinner(false);

  }

  snVals: any = []
  snNames: any = []
  dataVals: any = []

  BindTableData(ds: any) {


    //$('#newSnrTable').dataTable().fnDestroy();
    if (this.stateType == "All") {
      this.DeviceAllCntindex = ds.total;


      this.SensorLiveCntindex = ds.Polling.length;
      this.pollingSensor = [];
      this.pollingSensor = ds.Polling;

      this.SensorNrCntindex = ds.NR.length;
      this.NRSensor = [];
      this.NRSensor = ds.NR;

      this.SensorGoodCntindex = ds.good.length;
      this.goodSensor = [];
      this.goodSensor = ds.good;

      this.SensorWarnCntindex = ds.warning.length;
      this.warningSensor = [];
      this.warningSensor = ds.warning;

      this.SensorCriticalCntindex = ds.critical.length;
      this.criticalSensor = [];
      this.criticalSensor = ds.critical;
    }


    var data = [];
    this.snNames = [];
    this.snVals = [];

    var i: number = 0;

    // ds.live.forEach(element => {

    //   // //;
    //   if (i == 0) {

    //     this.snNames = element.snsr;
    //     i += 1;
    //   }
    // });




    this.snVals = [];

    this.dataVals = []

    this.dataVals = ds.liveDetails;

    this.bindListViewTable();

    // this.snVals = ds.liveDetails;


    // var SUoM: any

    // var SessionUoM: any = {};

    // SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));

    // var indx = 0;

    // var sData = this.snVals;


    // this.snVals.forEach(sv => {

    //   sv.live.forEach(live => {


    //     indx = 0;
    //     live.snsrVal.forEach(u => {


    //       if (u.split('_')[0].includes('#')) {
    //         SUoM = u.split('_')[0].split('#')[1];

    //         if (SUoM != "" && SUoM != undefined) {

    //           var snrUoM = SessionUoM.filter(g => g.uomId == SUoM);

    //           var snr_ = live.snsrVal[indx].split("$")[1];
    //           var snrVal = live.snsrVal[indx].split("_$")[0].split('#')[0];
    //           snrVal += '#' + snrUoM[0].symbol + '_$' + snr_;

    //           live.snsrVal[indx] = snrVal;//.split('_')[0].split('#')[1] = snrUoM[0].symbol;
    //         }
    //       }

    //       indx += 1;
    //     });

    //   });
    // });





    // this.tileDevice = this.snVals[0].live[0].snsrVal[0].split('#')[0];


    this.isShowFooter = false;


    this._loaderService.display(false);


  }

  totalRows: any;


  bindListViewTable() {


    this.snVals = [];
    // this.snVals = ds.liveDetails;

    var dataIndx: any


    for (let idx = 0; idx < this.dataVals.length; idx++) {

      dataIndx = {}

      dataIndx.solution = this.dataVals[idx].solution;
      dataIndx.live = [];


      this.totalRows = this.dataVals[idx].live.length;

      if ((this.dataVals[idx].live.length > Number(this.pageEnd))
        ||
        (this.dataVals[idx].live.length < Number(this.pageEnd)) && (this.pageStart > 0)) {
        var innerIndex: Number
        innerIndex = 0;

        for (let lIdx = Number(this.pageStart); (lIdx < Number(this.pageEnd) && lIdx < Number(this.dataVals[idx].live.length)); lIdx++) {
          this.dataVals[idx].live[lIdx].index = innerIndex;
          dataIndx.live.push(this.dataVals[idx].live[lIdx]);
          innerIndex = Number(innerIndex) + 1;
        }

      } else {

        for (let lIdx = Number(this.pageStart); lIdx < Number(this.dataVals[idx].live.length); lIdx++) {
          dataIndx.live.push(this.dataVals[idx].live[lIdx]);
        }

      }

      if (this.dataVals[idx].live.length <= Number(this.pageEnd)) {
        this.pageEndDisable = true;
      }
      else {
        this.pageEndDisable = false;
      }

      this.snVals.push(dataIndx);
    }


    var userModles: any = {};

    userModles = JSON.parse(sessionStorage.getItem('User_HWTypes'));

    var m: any = []

    this.snVals.forEach(sn => {


      m = userModles.filter(r => r.modelId == sn.solution + '_')

      sn.solution = m[0].modelName;
    });

    var SUoM: any

    var SessionUoM: any = {};

    SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));

    var indx = 0;

    var sData = this.snVals;


    this.snVals.forEach(sv => {

      sv.live.forEach(live => {


        indx = 0;
        live.snsrVal.forEach(u => {


          if (u.split('_')[0].includes('#')) {
            SUoM = u.split('_')[0].split('#')[1];

            if (SUoM != "" && SUoM != undefined) {

              var snrUoM = SessionUoM.filter(g => g.uomId == SUoM);

              var snr_ = live.snsrVal[indx].split("$")[1];
              var snrVal = live.snsrVal[indx].split("_$")[0].split('#')[0];
              snrVal += '#' + snrUoM[0].symbol + '_$' + snr_;

              live.snsrVal[indx] = snrVal;//.split('_')[0].split('#')[1] = snrUoM[0].symbol;


            }
          }

          indx += 1;
        });

      });
    });

  }

  ShiftRecords(PageIndex: any) {

    if (PageIndex == '-1') {
      this.pageStart = Number(this.pageStart) - Number(this.pageCount);


    }
    else {

      this.pageStart = Number(this.pageStart) + Number(this.pageCount);
    }

    if (this.pageStart == 0) {
      this.pageStartDisable = true;
    }
    else {
      this.pageStartDisable = false;
    }

    this.pageEnd = Number(this.pageStart) + Number(this.pageCount);

    this.pageStartView = Number(this.pageStart) + 1;

    this.bindListViewTable();

  }

  resetPaging() {
    this.pageStart = 0
    this.pageStartView = 1
    this.pageEnd = Number(this.pageStart) + Number(this.pageCount);

    this.pageStartDisable = true;

    this.bindListViewTable();
  }

  getTrend() {


    this._loaderService.display(true);
    var validate: boolean;

    validate = this.checkValidation();
    if (validate) {
      var obj: any

      obj = {}


      obj.deviceId = this.deviceId;//this.TrendName.split(":")[0];
      obj.sensorId = this.sensorKey;
      obj.period = this.period;
      obj.timezone = this.userTimeZone;
      if (this.selectedRange == "custom") {
        obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.fromDate);
        obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.toDate);
      }
      else {
        obj.frDate = this.selectedRange;
      }

      this.trendResponse = [];

      this.TrendValues = []
      this.SensorRules = [];

      this.showTrendDownload = false;

      this.TrendValues = [];
      this._trackingService.getTrend(obj).subscribe(result => {



        this._loaderService.display(false);
        this.showTrendDownload = true;
        this.trendResponse = result;

        if (this.trendResponse.trend.length > 0) {
          this.sensorId = this.trendResponse.trend[0].sensorName;
          this.TrendName = this.showMoreDevice + " : " + this.trendResponse.title
          this.chartNote = this.trendResponse.note

          this.TrendValues = [];

          this.trendResponse.trend.forEach(e => {
            var STime = +e.sensorTime;
            var SVal = +e.sensorValue;

            // this.TrendValues.push([
            //   STime,
            //   SVal
            // ])
            var obj: any = {};

            obj.date = STime;
            obj.value = SVal;


            if (e.sensorValue.toLowerCase() !== 'fv') {
              this.TrendValues.push(obj);
            }
            else {
              var Nobj: any = {};
              Nobj.date = STime;
              this.TrendValues.push(Nobj);
            }

            // this.TrendValues.push(obj)
          });

          this.SensorRules = this.trendResponse.ruleDetails



          if (this.trendChart) { this.trendChart.dispose(); }

          this.ploatTrendChart()

        }



      });

    }
    else {

      this._loaderService.display(false);
      this._toaster.warning("Invalid Entry");

    }
  }

  checkValidation() {

    //

    if (this.sensorKey == undefined || this.sensorKey == "") {
      return false
    }

    if (this.selectedRange == undefined || this.selectedRange == "") {
      return false
    }
    if (this.selectedRange == "custom") {
      if (this.deviceInsightsobj.fromDate == undefined || this.deviceInsightsobj.fromDate == "") {
        return false;
      }
      if (this.deviceInsightsobj.toDate == undefined || this.deviceInsightsobj.toDate == "") {
        return false;
      }
    }

    return true;

  }

  trendChart: any;
  rctrendChart: any;

  ploatTrendChart() {

    this.trendChart = am4core.create("trendChart", am4charts.XYChart);


    this.trendChart.data = this.TrendValues;

    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []

    this.trendChart.data.forEach(d => {

      val1.push(Number(d.value));
    });

    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();


    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    let dateAxis = this.trendChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;


    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = this.sensorUoM;//"Something";
    valueAxis.title.rotation = 0;
    valueAxis.title.align = "center";
    valueAxis.title.valign = "top";
    valueAxis.title.dy = 120;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }
    // valueAxis.strictMinMax = true;
    // valueAxis.title.fontWeight = 600;

    //valueAxis.renderer.grid.template.disabled = true;

    let series = this.trendChart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 1.5;
    series.tensionX = 1;
    // series.connect = false;

    this.trendChart.cursor = new am4charts.XYCursor();
    this.trendChart.cursor.xAxis = dateAxis;

    // let scrollbarX = new am4core.Scrollbar();
    // scrollbarX.marginBottom = 20;
    // this.trendChart2.scrollbarX = scrollbarX;

    var title = this.trendChart.titles.create();
    //title.text = this.sensorId + " " + this.sensorUoM;//deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range


    this.hasRules = false;

    this.SensorRules.forEach(pb => {

      this.hasRules = true;

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#F8CBAD");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#C5E0B4");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#FFE699");
        }


      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {
          // minY = +pb.minVal;
          // maxY = +pb.minVal * 10000;
          range.value = +pb.minVal;
          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {
            // minY = 0;
            // maxY = +pb.minVal;

            // range.value =+pb.minVal;
            range.endValue = +pb.minVal;
          }

    });

  }


  ploatrcTrendChart() {

    if (this.bothSN == true) {
      this.rctrendChart = am4core.create("trendBRCChart", am4charts.XYChart);
    }
    else {
      this.rctrendChart = am4core.create("trendRCChart", am4charts.XYChart);
    }

    var trendMin1: any = 0
    var trendMax1: any = 0


    var trendMin2: any = 0
    var trendMax2: any = 0

    this.rctrendChart.data = this.rcTrendResp;

    var val1: any = []
    var val2: any = []




    if (this.bothSN == true) {
      this.rctrendChart.data.forEach(d => {
        val1.push(Number(d.value1));
        val2.push(Number(d.value2));
      });

      trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
      trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

      trendMin2 = val2.reduce((a, b) => Math.min(a, b));//.Min();
      trendMax2 = val2.reduce((a, b) => Math.max(a, b));//.Max();

      if (trendMin1 >= trendMin2) {
        trendMin1 = trendMin2
      }

      if (trendMax1 <= trendMax2) {
        trendMax1 = trendMax2
      }


    }
    else {
      this.rctrendChart.data.forEach(d => {
        val1.push(Number(d.value1));
      });

      trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
      trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

    }



    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    this.rctrendChart.height = 100;

    let dateAxis = this.rctrendChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;


    let valueAxis = this.rctrendChart.yAxes.push(new am4charts.ValueAxis());
    //valueAxis.title.text = this.sensorUoM;//"Something";
    valueAxis.title.rotation = 0;
    valueAxis.title.align = "center";
    valueAxis.title.valign = "top";
    valueAxis.title.dy = 60;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 18;
    // valueAxis.title.fontWeight = 600;

    //valueAxis.renderer.grid.template.disabled = true;


    let series = this.rctrendChart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value1";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.stroke = am4core.color("#004d87");
    series.strokeWidth = 2;
    series.name = this.rcTrendSName1;

    // series.connect = false;

    if (this.bothSN == true) {
      series = this.rctrendChart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value2";
      series.tooltipText = "{valueY}";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.fillOpacity = 0.5;
      series.stroke = am4core.color("#ff036c");
      series.strokeWidth = 2;
      series.name = this.rcTrendSName2;

      // series.connect = false;

    }



    this.rctrendChart.cursor = new am4charts.XYCursor();
    this.rctrendChart.cursor.xAxis = dateAxis;

    this.rctrendChart.legend = new am4charts.Legend();
    this.rctrendChart.legend.position = "top"
    this.rctrendChart.legend.position = "right"
    this.rctrendChart.legend.labels.template.text = "[bold {color}]{name}[/]";


  }

  downloadData(reportType: any) {


    if (reportType == "excel" || reportType == "pdf") {
      this.Exportdataset = [];

      this.trendResponse.report.forEach(element => {
        this.Exportdataset.push([
          element.sensorValue,
          element._sensorTime
        ])
      });


      var frDate = this.trendResponse.frTime;
      var toDate = this.trendResponse.toTime;

      if (reportType == "pdf") {
        var pdfobj: any

        pdfobj = {};

        pdfobj.clientLogo = sessionStorage.getItem('logoImage');
        pdfobj.reportName = this.trendResponse.title;
        pdfobj.fromTime = frDate;
        pdfobj.toTime = toDate;
        pdfobj.deviceName = this.TrendName.split(':')[0];
        pdfobj.columns = 'Value(' + this.sensorUoM + '),Time(IST)';
        pdfobj.data = this.Exportdataset;
        pdfobj.interval = this.period;

        var resp: any = []

        //console.log(pdfobj);

        this._loaderService.display(true);

        this._trackingService.getPDF(pdfobj).subscribe(result => {
          resp = result;

          if (resp.sts == "200") {
            // window.location.href = resp.msg;
            window.open(resp.msg, '_bank');
          }
          else {
            this._toaster.warning(resp.msg);
          }

          this._loaderService.display(false);
        });
      }
      else
        if (reportType == "excel") {
          var fileName = this.TrendName.split(':')[0] + '_' + this.trendResponse.title + '_';
          var headerText = [this.trendResponse.title]
          var columnKeys = [
            { key: 'sensorValue', width: 50 },
            { key: '_sensorTime', width: 40 }
          ];
          var columnHeaders = ["Value", "Time"]
          this._exportExcel.exportExcelFile(fileName, headerText, columnKeys, columnHeaders, this.Exportdataset, frDate, toDate)
        }
    }
    else
      if (reportType == "pdff") {

        var obj: any

        obj = {}


        obj.deviceId = this.deviceId;//this.TrendName.split(":")[0];
        obj.sensorId = this.sensorKey;

        obj.reportType = reportType;

        if (this.selectedRange == "custom") {
          obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.fromDate);
          obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.toDate);
        }
        else {
          obj.frDate = this.selectedRange;
        }



        this.trendResponse = [];

        this.TrendValues = []


        //

        var resp: any = []


        this._loaderService.display(true);

        this._trackingService.getTrend(obj).subscribe(result => {
          resp = result;

          if (resp.sts == "200") {
            // window.location.href = resp.msg;
            window.open(resp.msg, '_bank');
          }
          else {
            this._toaster.warning(resp.msg);
          }

          this._loaderService.display(false);
        });


      }
  }

  showTrend(deviceId: any, sensor: any, uom: any, sensorName: any) {


    this.deviceId = deviceId;
    this.sensorUoM = uom; this.SensorList[0].UoM
    this.deviceInsightsobj.SensorId = this.SensorList[0].key
    this.sensorId = sensorName;
    this.sensorKey = sensor// this.SensorList[0].key
    this.dateRange = this.DateRangeList[0].dtId
    this.selectedRange = this.DateRangeList[0].dtId
    this.modalTrend.show();
    this.isDates = false;

    this._loaderService.display(true);
    this.getTrend();
  }

  showSPsConfig() {
    this.showSPconfig = (this.showSPconfig) ? false : true;
  }

  checkRange(_min, _max) {



    var m1: Number = 0
    var m2: Number = 0

    m1 = Number(_min)
    m2 = Number(_max)

    if (isNaN(+m1) || isNaN(+m2)) {
      return false;
    }
    else {
      if (m1 < m2) {
        return true;
      }
      else {
        return false;
      }
    }

  }

  spConfig(deviceId, sensorId, MinVal, MaxVal) {

    var valid: boolean

    valid = this.checkRange(MinVal, MaxVal);

    if (valid) {
      var obj: any = {}

      obj.deviceId = deviceId;
      obj.sensorId = sensorId;
      obj.range = MinVal + "," + MaxVal;

      var result: any
      this._trackingService.UpdateSensorSP(obj).subscribe(resp => {
        result = resp;

        if (result.sts == "200") {
          this._toaster.success("Setpoint range has been updated");
          this.getMoreDetails(this.showMoreDevice);
        }
        else {
          this._toaster.warning("Setpoint range not updated");
        }
      });
    }
    else {
      this._toaster.warning("Invalid setpoint range");
    }

  }

  showMoreDetails(deviceId: string) {

    this.showSPconfig = false;

    this.sessionData = JSON.parse(sessionStorage.getItem("USER_DEVICES"));
    var deviceDetails = this.sessionData.filter(g => g.sensorId !== deviceId);
    this.loadPeriodRange(deviceDetails[0].frequency);


    this.hasMqtt = false;

    if (sessionStorage.getItem("hasMQTT") == "1") {
      this.hasMqtt = true;

      if (!this.mqttConnected) {
        // this.initializeMQTT();
        // this.connectMQTT();
      }
    }

    this.deviceId = deviceDetails[0].sensorId;
    this.modalAllSensor.show();
    this.showMoreOpen = true;
    this.getMoreDetails(deviceId);

  }

  hasOP2: boolean = false;
  hasF2: boolean = false;

  dFdDetails: any;


  getMoreDetails(deviceId: string) {


    deviceId = deviceId.split('#')[0];
    this.moreInfoResp = []
    this.cmdVal = "";
    //this.deviceId = deviceId;

    this.dFdDetails = [];

    this._trackingService.getSensorLiveMoreDataPVR(deviceId).subscribe(result => {


      var data;

      data = result;

      this.moreInfoResp = data;

      this.showMoreDevice = this.moreInfoResp.live[0].deviceNo;

      this.deviceTime = this.moreInfoResp.live[0].time;
      this.MQTTdeviceTopic = this.moreInfoResp.mqttPubTopic;


      this.deviceId = this.moreInfoResp.live[0].deviceId;

      if (this.moreInfoResp.op2.length > 0) {
        this.hasOP2 = true;
      }
      else {
        this.hasOP2 = false;
      }


      if (this.moreInfoResp.fault2.length > 0) {
        this.hasF2 = true;
      }
      else {
        this.hasF2 = false;
      }

      var SessionUoM: any = {};

      SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));
      var indx = 0;
      this.moreInfoResp.live.forEach(u => {

        if (u.uom != "") {
          var snrUoM = SessionUoM.filter(g => g.uomId == u.uom);
          this.moreInfoResp.live[indx].uom = snrUoM[0].symbol;
        }



        var snType: any = {};
        snType = this.SensorList.filter(g => g.sensorTypeId == u.sensorType);


        this.moreInfoResp.live[indx].sensorType = snType[0].sensorType;

        this.moreInfoResp.live[indx].dFdtype = false;

        if (this.moreInfoResp.live[indx].dfdDetails.length > 0) {

          this.moreInfoResp.live[indx].dFdtype = true;
        }

        indx += 1;
      });


      indx = 0;
      this.moreInfoResp.setpoints.forEach(u => {

        if (u.uom != "") {
          var snrUoM = SessionUoM.filter(g => g.uomId == u.uom);
          this.moreInfoResp.setpoints[indx].uom = snrUoM[0].symbol;
        }



        var snType: any = {};
        snType = this.SensorList.filter(g => g.sensorTypeId == u.sensorType);


        this.moreInfoResp.setpoints[indx].sensorType = snType[0].sensorType;


        indx += 1;
      });

    });
  }

  setdFdCommand(dFd: any, snrId: any) {


    var cmd = '{"deviceId": "' + this.deviceId + '","' + snrId + '": ' + dFd.pos + '}'

    this.sendCommand(cmd);
  }

  closeMoreDetails() {
    // //
    this.modalAllSensor.hide();
    this.showMoreOpen = false;
  }

  closeSensorShow() {
    // //
    this.modalLiveSensor.hide();
  }

  bindMoreDatatoTable(data: any) {
    // //
    $('#snrSumTable').dataTable().fnDestroy();
    var table = $('#snrSumTable').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
    });
    table.clear().rows.add(data).draw();

  }


  selectChangeHandler(event: any) {
    this.selectedTime = event.target.value;
    if (this.selectedTime == "00") {
      this.sub.unsubscribe();
    }
    else {
      this.sub.unsubscribe();
      //this.timer = Observable.timer(0, Number(this.selectedTime) * 100000);
      this.timer = Observable.timer(0, Number(10) * 1000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
  }

  goodList() {
    this.stateType = "good";

    this.isGood = true;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = false;
    this.isNR = false;
    this.isAll = false;

    this.onLoadSensorSummaryData(this.goodSensor);
  }
  warningList() {
    this.stateType = "warning";
    this.isGood = false;
    this.isWarning = true;
    this.isCritical = false;
    this.islive = false;
    this.isNR = false;
    this.isAll = false;

    this.onLoadSensorSummaryData(this.warningSensor);
  }
  criticalList() {
    this.stateType = "critical";

    this.isGood = false;
    this.isWarning = false;
    this.isCritical = true;
    this.islive = false;
    this.isNR = false;
    this.isAll = false;

    this.onLoadSensorSummaryData(this.criticalSensor);
  }
  LiveSensor() {
    this.stateType = "live";

    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = true;
    this.isNR = false;
    this.isAll = false;

    this.onLoadSensorSummaryData(this.pollingSensor);
  }
  AllSensor() {
    this.stateType = "All";

    this.isAll = true;
    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = false;
    this.isNR = false;

    this.onLoadSensorSummaryData("");
  }
  nrSensor() {
    this.stateType = "nr";

    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = false;
    this.isNR = true;
    this.isAll = false;
    this.onLoadSensorSummaryData(this.NRSensor);
  }

  getTimerData(time) {


    if (this.showMoreOpen) {
      this.getMoreDetails(this.showMoreDevice);
    }
    if (this.stateType == "All") { this.onLoadSensorSummaryData(""); }
    else if (this.stateType == "Live") { this.onLoadSensorSummaryData(this.pollingSensor); }
    else if (this.stateType == "NR") { this.onLoadSensorSummaryData(this.NRSensor); }
    else if (this.stateType == "good") {
      this.onLoadSensorSummaryData(this.goodSensor);
    }
    else if (this.stateType == "warning") {
      this.onLoadSensorSummaryData(this.warningSensor);
    }
    else if (this.stateType == "critical") {
      this.onLoadSensorSummaryData(this.criticalSensor);
    }


    // this.getPinnedTileSensorValues(this.tileDevice)

  }


  tileDevice: any = "";
  tileDeviceShow: any = "";


  getPinnedTileSensorValues(deviId: any) {



    this.opDevice = deviId;
    this.tileSnr1 = '-';
    this.tileSnr2 = '-';
    this.tileSnr3 = '-';

    this.tileOn1 = false;
    this.tileOn2 = false;
    this.tileOn3 = false;


    if (this.tileSensor.length !== 0) {


      this.tileDevice = deviId;

      this.tileDeviceShow = this.tileDevice.split('#')[0];

      if (this.tileDeviceShow.length > 9) {
        this.tileDeviceShow = this.tileDeviceShow.substring(0, 8) + "..";
      }


      var obj: any = []

      obj.device = deviId;
      obj.tileSensor = this.tileSensor;



      this.dataVals

      this._trackingService.getTileSensorLiveData(obj).subscribe(result => {


        var resp: any = []

        resp = result;

        this.tileSnr1 = resp.live[0].sensorName;
        this.tileOn1 = false;

        if (resp.live[0].sensorValue == "1") {
          this.tileOn1 = true;
        }
        else
          if (resp.live[0].sensorValue == "0") {
            this.tileOn1 = false;
          }

        if (resp.live.length >= 2) {

          this.tileSnr2 = resp.live[1].sensorName;
          this.tileOn2 = false;

          if (resp.live[1].sensorValue == "1") {
            this.tileOn2 = true;
          }
          else
            if (resp.live[1].sensorValue == "0") {
              this.tileOn2 = false;
            }

        }


        if (resp.live.length == 3) {

          this.tileSnr3 = resp.live[2].sensorName;

          this.tileOn3 = false;

          if (resp.live[2].sensorValue == "1") {
            this.tileOn3 = true;
          }
          else
            if (resp.live[2].sensorValue == "0") {
              this.tileOn3 = false;
            }
        }


      });

    }

    // this.plotRCTrend(deviId)

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
  public fromDate: any;
  public toDate: any;
}


