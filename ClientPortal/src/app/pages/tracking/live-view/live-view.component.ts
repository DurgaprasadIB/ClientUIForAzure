import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../../tracking/services/tracking.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SessionupdateService } from '../../GlobalServices/sessionupdate.service';
import { TranslateService } from '@ngx-translate/core';
import * as apexChart from '../../../../js/apexChart.min.js';
import { UiSwitchModule } from 'ngx-toggle-switch';
import Swal from 'sweetalert2'
import MarkerClusterer from '@google/markerclusterer'

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { ReportService } from '../../reports/service/report.service';
import { ExportExcelService } from '../../GlobalServices/export-excel.service';
import { debug } from 'util';
import { Router } from '@angular/router';


import * as Paho from "paho-mqtt";
import { analyzeAndValidateNgModules } from '@angular/compiler';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { debounceTime } from 'rxjs-compat/operator/debounceTime';
import { cos } from '@amcharts/amcharts4/.internal/core/utils/Math';
import { registerContentQuery } from '@angular/core/src/render3/instructions';
import { ExportToCsv } from 'export-to-csv';
import { InfoWindow } from '@ngui/map';



@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit, OnDestroy {
  @ViewChild('modalTrend') modalTrend: any;
  @ViewChild('modalLiveSensor') modalLiveSensor: any;
  @ViewChild('modalAllSensor') modalAllSensor: any;
  @ViewChild('modalMap') modalMap: any;

  @ViewChild('modelmapTrack') modelmapTrack: any; //Modal
  @ViewChild('mapDivVehicle') mapDevTrack: any; //MAP

  @ViewChild('mapDivSummary') gmapSummary: any;

  map: google.maps.Map;
  mapSummary: google.maps.Map;
  mapDeviceTrack: google.maps.Map;
  markerOnMap: google.maps.Marker;


  //vehicleMarker: any = new SlidingMarker();
  //

  gridCount: any = 0;
  DateFormat: string;
  isShowFooter: boolean = false;
  constructor(
    private router: Router,
    private _detailService: ReportService,
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService,
    private _UpdatingSessionStorage: SessionupdateService,
    private _exportExcel: ExportExcelService,
    private translate: TranslateService
  ) {

  }

  MapViewName: any = "";
  markerIcon: any;
  pageStart: Number = 0
  pageStartView: Number = 0
  pageEnd: Number = 0
  pageCount: Number = 0
  SensorreportCntindex: number = 0;
  pageStartDisable: boolean = false;
  pageEndDisable: boolean = false;

  MQTTdeviceTopic: any = "";

  // selectHW: any;
  hasRules: boolean;
  hasChart: boolean = false;
  hasSurv: boolean = false;
  hasMap: boolean = false;
  hasTemp: boolean = false;
  hasEnergy: boolean = false;
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
  userPref: any = "";
  deviceTime: any = "";
  period: any;
  periodRange: any;
  periodRangeFilter: any;
  moreInfoResp: any = []
  isListDetails: boolean;
  listView: boolean;
  showTrendDownload: boolean;
  selectedTime: string = '';
  private timer;
  private sub: Subscription;

  //showMore: boolean = false;
  sessionData: any = [];
  sessionDeviceList: any = [];
  sessionDeviceTypeList: any = [];

  nr24Trend: any = []

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

  isMapLoaded: boolean = false;

  clientRegions: any = []
  // userHwTypes: any;
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

  markerArray: any = []
  //isTrendPlot: boolean = false;

  maxDate: any = Date;
  bgImage: any;

  isLiveLoaded: any;
  perPage: any
  devStsChartPeriod: any
  devStsSelect: any
  totalRows: any;


  selectedState: any;
  stateSelectedList: any = []

  polyPath: any[] = null
  polyLineArray: any = []
  polyLine: any = new google.maps.Polyline({ strokeColor: '#488FCC', strokeOpacity: 0.8, strokeWeight: 6 });
  bounds: any = new google.maps.LatLngBounds();



  ngOnInit() {

    // var rp: any
    // this._trackingService.corsTestAPI().subscribe(result => {
    //   rp = result;
    //   
    //   this._toaster.success(rp);
    // });
    this.pageStart = 0
    this.pageStartView = 1
    this.pageCount = 5

    this.pageStartDisable = true;
    this.pageEndDisable = true;

    this.pageEnd = Number(this.pageStart) + Number(this.pageCount);

    this.isMapLoaded = false;

    if (sessionStorage.getItem('Client_ListView') == "0") {
      this.router.navigateByUrl('/pages/tracking/ListView')
    }

    this.markerIcon = {
      url: 'https://cdn-0.emojis.wiki/emoji-pics/microsoft/blue-circle-microsoft.png',
      scaledSize: new google.maps.Size(10, 10),
    }



    this.MapViewName = "Map";

    var lat = 16.857611;// this._commanService.getDefaultLat();
    var lon = 81.928128;// this._commanService.getDefaultLng()



    this.hasSurv = false;
    this.hasChart = false;

    this.clientFeatures = {};
    debugger
    this.clientFeatures = JSON.parse(sessionStorage.getItem('Client_Feature'));

    this.clientFeatures.forEach(fe => {
      if (fe.featureId.toUpperCase() == '830FB9BE-C04F-477E-AE5E-4CB76EDB7D12') {
        this.hasSurv = true;
      }
      if (fe.featureId.toUpperCase() == '6F5B60E3-1473-45B2-86DF-91EF6612D1F4') {
        this.hasChart = true;
      }
      
      if (fe.featureId.toUpperCase() == 'E05A7A69-7B97-4A1C-B105-9C036C43C3C9') {
        this.hasEnergy = true;
      }
      if (fe.featureId.toUpperCase() == 'EBCC9638-4053-42E0-B523-1EF204F8936C') {
        this.hasMap = true;
      }
      if (fe.featureId.toUpperCase() == '7429106C-8341-458D-BB7D-196DAAC6E8C2') {
        this.hasTemp = true;
      }
    });


    const flightPlanCoordinates = [
      { lat: 16.858027, lng: 81.927645, temp1: 25 },
      { lat: 16.857308, lng: 81.927163, temp1: 25.5 },
      { lat: 16.856564, lng: 81.926760, temp1: 26 },
      { lat: 16.856882, lng: 81.925869, temp1: 26.5 },
      { lat: 16.857513, lng: 81.924081, temp1: 27 },
      { lat: 16.858491, lng: 81.924719, temp1: 27 },
      { lat: 16.860122, lng: 81.925656, temp1: 27 },
      { lat: 16.861344, lng: 81.926125, temp1: 28 },
      { lat: 16.861991, lng: 81.926117, temp1: 28.5 },
      { lat: 16.862374, lng: 81.925396, temp1: 29 },
      { lat: 16.862656, lng: 81.923792, temp1: 30 },
      { lat: 16.863167, lng: 81.920919, temp1: 30 },
      { lat: 16.863743, lng: 81.918541, temp1: 30.2 },
      { lat: 16.864062, lng: 81.916897, temp1: 30.5 },
      { lat: 16.864638, lng: 81.914853, temp1: 30.5 },
      { lat: 16.864919, lng: 81.913049, temp1: 30.5 },
      { lat: 16.865188, lng: 81.911900, temp1: 30.5 },
      { lat: 16.864382, lng: 81.910363, temp1: 30.5 },
      { lat: 16.863385, lng: 81.908372, temp1: 30 },
      { lat: 16.863295, lng: 81.906248, temp1: 30 },
      { lat: 16.863231, lng: 81.904190, temp1: 30 },
      { lat: 16.863027, lng: 81.901330, temp1: 30 },
      { lat: 16.863052, lng: 81.899563, temp1: 30 },
      { lat: 16.863366, lng: 81.898879, temp1: 30 },
      { lat: 16.863757, lng: 81.898244, temp1: 30 },
      { lat: 16.864077, lng: 81.897133, temp1: 29 },
      { lat: 16.864732, lng: 81.895613, temp1: 29 },
      { lat: 16.865252, lng: 81.894535, temp1: 29 },
      { lat: 16.865556, lng: 81.893650, temp1: 28 },
      { lat: 16.865132, lng: 81.893349, temp1: 28 },
      { lat: 16.864421, lng: 81.892689, temp1: 27 },
      { lat: 16.863901, lng: 81.892263, temp1: 27.5 },
      { lat: 16.863533, lng: 81.891336, temp1: 27.4 },
      { lat: 16.863150, lng: 81.890942, temp1: 24 },
      { lat: 16.863102, lng: 81.889867, temp1: 24.8 },
      { lat: 16.863096, lng: 81.889094, temp1: 24.3 },
      { lat: 16.862864, lng: 81.888240, temp1: 24 },
      { lat: 16.862375, lng: 81.886258, temp1: 24 },
      { lat: 16.861975, lng: 81.884110, temp1: 25 },
      { lat: 16.861578, lng: 81.880384, temp1: 26 },
      { lat: 16.861204, lng: 81.878071, temp1: 26.5 },
      { lat: 16.860925, lng: 81.875808, temp1: 27 },
      { lat: 16.860981, lng: 81.872962, temp1: 27 },
      { lat: 16.860901, lng: 81.872654, temp1: 27 },
      { lat: 16.860813, lng: 81.872381, temp1: 27.5 },
      { lat: 16.860788, lng: 81.871320, temp1: 27 },
      { lat: 16.860732, lng: 81.870580, temp1: 26.5 },
      { lat: 16.860323, lng: 81.869001, temp1: 26.5 },
      { lat: 16.859868, lng: 81.866914, temp1: 26.1 },
      { lat: 16.859646, lng: 81.864706, temp1: 26 },
      { lat: 16.858837, lng: 81.863100, temp1: 25.7 },
      { lat: 16.858887, lng: 81.862313, temp1: 25.6 },
      { lat: 16.858953, lng: 81.861558, temp1: 25.5 },
      { lat: 16.859368, lng: 81.861373, temp1: 25 },
      { lat: 16.859534, lng: 81.860834, temp1: 24.9 },
      { lat: 16.859848, lng: 81.859931, temp1: 24 },
      { lat: 16.860025, lng: 81.859878, temp1: 24 }
    ];



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

    if (sessionStorage.getItem("User_SuperAdmin") == "SuperAdmin") {
      this.isSuperAdmin = true;
    }
    else {
      this.isSuperAdmin = false;
    }

    this.timerTick();
    //paging
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


    //device status period
    this.devStsChartPeriod = [];

    this.devStsChartPeriod.push(
      {
        pId: 12,
        periodText: 'Last 12 Hours'
      },
      {
        pId: 24,
        periodText: 'Last 24 Hours'
      },
      {
        pId: 72,
        periodText: 'Last 3 Days'
      },
      {
        pId: 168,
        periodText: 'Last 1 Week'
      },
      {
        pId: 240,
        periodText: 'Last 10 Days'
      }
    );


    this.devStsSelect = [];

    this.devStsSelect.push(
      {
        pId: 1,
        periodText: 'Good'
      },
      {
        pId: 2,
        periodText: 'Warning'
      },
      {
        pId: 3,
        periodText: 'Critical'
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
        //21600
        pId: 7200,
        pVal: '6 Hrs'
      },
      {
        pId: 86400,
        pVal: '1 Day'
      }
    );




  }

  loadSummaryMap() {
    var lat = 17.4330175;// this._commanService.getDefaultLat();
    var lon = 78.3728449;// this._commanService.getDefaultLng()

    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lon));


    this.mapSummary = new google.maps.Map(this.gmapSummary.nativeElement,
      {
        center: centerLatLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy',
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
      }
    );
  }

  changeDevState(selected: any) {

    if (this.stateSelectedList.length == this.devStsSelect.length) {
      this.selectedState = "All";
    }
    else {

      if (this.stateSelectedList.length == 1) {
        this.selectedState = selected[0].periodText;
      }
      else
        if (this.stateSelectedList.length == 2) {
          this.selectedState = selected[0].periodText.substring(0, 4) + "..," +
            selected[1].periodText.substring(0, 4) + "..";
        }
    }

    this.updateStateSeries();
  }

  loadregions() {
    // if (this.clientRegions.length == 0) {
    //   //regions detils
    //   var lat = 16.857611;// this._commanService.getDefaultLat();
    //   var lon = 81.928128;// this._commanService.getDefaultLng()

    //   this.map = new google.maps.Map(this.gmapRegions.nativeElement,
    //     {
    //       zoom: 10,
    //       center: new google.maps.LatLng(Number(lat), Number(lon)),
    //       mapTypeId: google.maps.MapTypeId.ROADMAP,
    //       gestureHandling: 'greedy',
    //       streetViewControl: false,
    //       mapTypeControl: false,
    //       zoomControl: false,
    //     })
    // }

    // var bounds = new google.maps.LatLngBounds();

    var cRegions = JSON.parse(sessionStorage.getItem('Regions'));

    this.clientRegions = []

    this.originalResp.liveDetails.forEach(orr => {

      orr.live.forEach(l => {

        cRegions.forEach(cR => {

          if (l.regionId == cR.regionId) {
            debugger
            var cnt = this.clientRegions.filter(r => r.regionId == cR.regionId)

            if (cnt.length == 0) {
              this.clientRegions.push({
                regionId: l.regionId,
                regionName: cR.regionName,
                regionLat: cR.regionLat,
                regionLng: cR.regionLng
              })
            }
          }
        });
      });
    })

    if (!this.isMapLoaded) {

      this.loadSummaryMap();
    }


    // for (let m = 0; m < this.markerArray.length; m++) {
    //   this.markerArray[m].setMap(null)
    // }
    // this.markerArray = [];

    // this.clientRegions.forEach(reg => {
    //   var mk = new google.maps.Marker({
    //     position: new google.maps.LatLng(Number(reg.regionLat), Number(reg.regionLng)),
    //     map: this.map,
    //     title: reg.regionName,
    //     icon: this.markerIcon
    //   });

    //   this.markerArray.push(mk);
    //   bounds.extend(mk.getPosition());
    // });

    // this.map.fitBounds(bounds);

  }

  devStateIP: any;
  selectedDevStatPeriod: any

  changeDevStPeriod(period: any) {
    this.stateSelectedList = []

    // this.get24Status();
  }
  prevDeviceStatus: any = []

  xVl: any = []
  nrAr: any = []
  reportingAr: any = []
  goodAr: any = []
  warningAr: any = []
  criticalAr: any = []

  get24Status() {

    this.devStateIP = {}

    this.devStateIP.userId = this._commanService.getLoginUserID();
    this.devStateIP.regionId = this.selectedRegion;
    this.devStateIP.period = 12;

    if (this.selectedDevStatPeriod !== '' && this.selectedDevStatPeriod !== null && this.selectedDevStatPeriod !== undefined) {
      this.devStateIP.period = this.selectedDevStatPeriod
    }


    this.prevDeviceStatus = []
    var totaldev: any = 0


    this._trackingService.getStatsforDB(this.devStateIP).subscribe(result => {

      this.prevDeviceStatus = result;


      this.xVl = []
      this.nrAr = []
      this.reportingAr = []
      this.goodAr = []
      this.warningAr = []
      this.criticalAr = []

      this.prevDeviceStatus.deviceDetails.forEach(item => {
        this.xVl.push(item._time)
        this.nrAr.push(item.notReporting)
        this.reportingAr.push(item.reporting)
        this.goodAr.push(item.good)
        this.warningAr.push(item.warning)
        this.criticalAr.push(item.critical)
      });

      totaldev = this.prevDeviceStatus.total;

      var axisTick = 0
      if (Number(totaldev) >= 200) {
        axisTick = 20;
      }
      else
        if (Number(totaldev) > 100 && Number(totaldev) < 200) {
          axisTick = 10;
        }
        else
          if (Number(totaldev) > 50 && Number(totaldev) <= 100) {
            axisTick = 5;
          }
          else
            if (Number(totaldev) > 10 && Number(totaldev) <= 50) {
              axisTick = 5;
            }
            else {
              axisTick = Number(totaldev);
            }


      // axisTick = 50;
      // this._toaster.success(totaldev + ' and axis tick ' + axisTick);

      var options = {
        chart: {
          type: 'bar',
          height: 200,
          width: 400,
          toolbar: {
            show: true,
            tools: {
              download: false,
              selection: true,
              zoom: true,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: true
            },
          }
        },
        series: [{
          name: 'Not reproting',
          data: []
        }, {
          name: 'Reporting',
          data: []
        }, {
          name: 'Good',
          data: []
        }, {
          name: 'Warning',
          data: []
        }, {
          name: 'Critical',
          data: []
        }],
        colors: ['#7F8E96', '#5BC0DB', '#00A65A', '#e7c219', '#e01f26'],
        legend: {
          position: 'top',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          // show: true,
          // width: 2,
          colors: ['transparent']
        },
        xaxis: {
          // categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          categories: this.xVl
        },
        yaxis: {
          title: {
            text: 'No.of Devices'
          },
          min: 0,
          max: Number(totaldev),
          tickAmount: Number(axisTick)// 10// Number(totaldev)
        },
        fill: {
          opacity: 1
        }
        ,
        noData: {
          text: 'Loading...'
        }
      };

      var chart = new apexChart(document.querySelector('#devicePrevStatusChart'), options);
      chart.render();



      chart.updateSeries([{
        name: 'Not reporting',
        data: this.nrAr
      }, {
        name: 'Reporting',
        data: this.reportingAr
      }, {
        name: 'Good',
        data: []// this.goodAr
      }, {
        name: 'Warning',
        data: []//this.warningAr
      }, {
        name: 'Critical',
        data: []// this.criticalAr
      }]);
    });
  }

  userDevices: any;

  bindDevices() {

    this.userDevices = JSON.parse(sessionStorage.getItem("USER_DEVICES"));



    var totalRegions: any = []

    totalRegions = JSON.parse(sessionStorage.getItem("Regions"));


    var arrayList: any;

    arrayList = [];

    var markerInfo: any
    var regionDevs: any

    var userRegions: any = []

    this.clientRegions.forEach(reg => {
      //
      this.userDevices.forEach(uD => {
        //
        if (uD.regionId == reg.regionId) {

          // userRegions.push(reg);
          userRegions.push({
            regionId: reg.regionId,
            regionName: reg.regionName,
            deviceName: uD.deviceName,
            latitude: reg.regionLat,
            logitude: reg.regionLng
          });
        }
      });
    });


    if (!this.isMapLoaded) {

      this.isMapLoaded = true;

      if (this.selectedRegion != null && this.selectedRegion != '' && this.selectedRegion != undefined) {


        userRegions = this.userDevices.filter(g => g.regionId == this.selectedRegion);

        userRegions.forEach(reg => {
          regionDevs = [];

          regionDevs = userRegions.filter(g => g.regionId == reg.regionId);

          markerInfo = {};

          markerInfo.lat = reg.latitude;;// "17.4330275";
          markerInfo.lng = reg.logitude;// "78.3728549";
          markerInfo.devName = reg.regionName;//"Dev1";
          markerInfo.regionId = reg.regionId;

          var critical: any = 0;
          var warning: any = 0;
          var good: any = 0;
          var live: any = 0;



          regionDevs.forEach(rDev => {
            critical += this.criticalSensor.filter(g => g == rDev.sensorId).length;
            warning += this.warningSensor.filter(g => g == rDev.sensorId).length;
            good += this.goodSensor.filter(g => g == rDev.sensorId).length;
            live += this.pollingSensor.filter(g => g == rDev.sensorId).length;
          });

          markerInfo.critical = critical
          markerInfo.warning = warning
          markerInfo.good = good
          markerInfo.total = regionDevs.length;
          markerInfo.live = live;

          arrayList.push(markerInfo);


        });
      }
      else {

        userRegions.forEach(reg => {
          regionDevs = [];

          regionDevs = this.userDevices.filter(g => g.regionId == reg.regionId);

          markerInfo = {};

          markerInfo.lat = reg.latitude;// "17.4330275";
          markerInfo.lng = reg.logitude;// "78.3728549";
          markerInfo.devName = reg.regionName;//"Dev1";
          markerInfo.regionId = reg.regionId;

          var critical: any = 0;
          var warning: any = 0;
          var good: any = 0;
          var live: any = 0;



          regionDevs.forEach(rDev => {
            critical += this.criticalSensor.filter(g => g == rDev.sensorId).length;
            warning += this.warningSensor.filter(g => g == rDev.sensorId).length;
            good += this.goodSensor.filter(g => g == rDev.sensorId).length;
            live += this.pollingSensor.filter(g => g == rDev.sensorId).length;
          });

          markerInfo.critical = critical
          markerInfo.warning = warning
          markerInfo.good = good
          markerInfo.total = regionDevs.length;
          markerInfo.live = live;

          arrayList.push(markerInfo);

          var bounds = new google.maps.LatLngBounds();
          this.mapSummary.fitBounds(bounds);

        });

      }

      //non regions Devices
      regionDevs = [];

      regionDevs = this.userDevices.filter(g => g.regionId == "" || g.regionId == undefined);

      regionDevs.forEach(reg => {


        markerInfo = {};
        markerInfo.lat = reg.latitude;// "17.4330275";
        markerInfo.lng = reg.logitude;// "78.3728549";
        markerInfo.devName = reg.deviceName;//"Dev1";
        markerInfo.regionId = reg.regionId;

        markerInfo.total = 'Single';

        markerInfo.critical = this.criticalSensor.filter(g => g == reg.sensorId).length;
        markerInfo.warning = this.warningSensor.filter(g => g == reg.sensorId).length;
        markerInfo.good = this.goodSensor.filter(g => g == reg.sensorId).length;


        arrayList.push(markerInfo);


      });

      this.AddMarkersToMap(arrayList);
    }
  }


  markerCluster: any;
  markersArray: any;

  AddMarkersToMap(arrayList: any) {

    var finalArr: any = [];

    

    finalArr = arrayList.filter((value, index, array) =>
      !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);


    if (this.markersArray) {
      if (this.markersArray.length > 0) {
        for (var i = 0; i < this.markersArray.length; i++) {
          this.markersArray[i].setMap(null);
        }
      }
    }


    this.markersArray = [];
    var bounds = new google.maps.LatLngBounds();

    finalArr.forEach(element => {

      if (element.devName != "" && element.lat != "" && element.lng != "") {

        var latlng = new google.maps.LatLng(Number(element.lat), Number(element.lng))
        element.LatLng = latlng;



        var strdata = '<div  id="iw-container">' +
          '<div class="iw-title">' + element.devName + '</div>' +
          '<div class="iw-content">' +
          '<table><tr><td>' + "Time " + '</td><td>:</td><td>' + '</td></tr></table>' +
          //'<tr><td style="vertical-align:top">' + "Location " + '</td><td style="vertical-align:top">:</td><td>' + '<a style="color:blue" href="http://maps.google.com/?q=' + element.lat + ',' + element.lng + '" target="_blank"> View on Google Maps' + '</td></tr></table>' +
          '</div>' +
          '<div class="iw-bottom-gradient" style="display:none"></div>' +
          '</div>';
        //alert(element.imageUrl);

        if (finalArr.length == 1) {
          this.mapSummary.setZoom(17);
          var point = new google.maps.LatLng(Number(element.LatLng.lat()), Number(element.LatLng.lng()));
          this.mapSummary.panTo(point);
        }
        else {
          this.mapSummary.setZoom(12);
        }

        //
        var marker = new google.maps.Marker(
          {
            position: element.LatLng,
            map: this.mapSummary,
            title: element.devName,
            icon: this.createCanMarker(element.total, element.critical, element.warning, element.good, element.devName, element.live),
            zIndex: 3
          }
        );

        marker.addListener("click", () => {

          var reg: any = {}

          reg.regionId = element.regionId;
          this.selectedRegion = element.regionId;
          this.changeRegion(reg)
          // this._toaster.success(element.regionId);

        });


        bounds.extend(marker.getPosition());
        //this.attachMarker(marker, strdata);
        this.markersArray.push(marker);
        this.mapSummary.fitBounds(bounds);
      }

    });


    // var centerlatLngs = new google.maps.LatLng(element.lat, center.longitude);
    // this.map.setCenter(centerlatLngs);

    if (this.markersArray.length > 0) {

      // Cluster Marker
      this.markerCluster = new MarkerClusterer(this.mapSummary, this.markersArray, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }

  }

  clearMap() {
    this.polyLineArray.map(element => {
      element.setMap(null);
    })
    this.removeMarkerOnMap();
  }

  createCanMarker(count, critical, warning, good, name, live) {

    var canvas = document.createElement("canvas");

    var NR: Number = 0


    NR = Number(count) - live;// (Number(critical) + Number(warning) + Number(good))

    if (count != 'Single') {
      canvas.width = 50;
      canvas.height = 100;

      var ctx = canvas.getContext("2d");

      //Critical Count 
      ctx.fillStyle = 'rgba(224, 31, 38, 1)';
      ctx.fillRect(20, 15, 10, 15);

      //Warning Count 
      ctx.fillStyle = 'rgba(231, 194, 25, 1)';
      ctx.fillRect(20, 30, 10, 15);

      //Good Count 
      ctx.fillStyle = 'rgba(0, 166, 90, 1)';
      ctx.fillRect(20, 45, 10, 15);

      //NR Count 
      ctx.fillStyle = 'rgba(117, 144, 161, 1)';
      ctx.fillRect(20, 60, 10, 15);

      //Live Count 
      ctx.fillStyle = 'rgba(52,198,235, 1)';
      ctx.fillRect(20, 75, 10, 15);

      ctx.font = "15px helvetica";
      ctx.fillStyle = 'rgba(250,250,250, 1)';
      ctx.fillRect(0, 15, 20, 15);
      ctx.fillStyle = 'rgba(0,0,0, 1)';
      ctx.fillText(critical, 2, 28)

      ctx.font = "15px helvetica";
      ctx.fillStyle = 'rgba(250,250,250, 1)';
      ctx.fillRect(0, 30, 20, 15);
      ctx.fillStyle = 'rgba(0,0,0, 1)';
      ctx.fillText(warning, 2, 43)

      ctx.font = "15px helvetica";
      ctx.fillStyle = 'rgba(250,250,250, 1)';
      ctx.fillRect(0, 45, 20, 15);
      ctx.fillStyle = 'rgba(0,0,0, 1)';
      ctx.fillText(good, 2, 58)

      ctx.font = "15px helvetica";
      ctx.fillStyle = 'rgba(250,250,250, 1)';
      ctx.fillRect(0, 60, 20, 15);
      ctx.fillStyle = 'rgba(0,0,0, 1)';
      ctx.fillText(NR + '', 2, 73)

      ctx.font = "15px helvetica";
      ctx.fillStyle = 'rgba(250,250,250, 1)';
      ctx.fillRect(0, 75, 20, 15);
      ctx.fillStyle = 'rgba(0,0,0, 1)';
      ctx.fillText(live + '', 2, 88)

    }
    else {

      var width = 20;
      var height = 20;
      var radius = 13;

      canvas.width = width;
      canvas.height = height;

      ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, width, height);

      // background is critical
      if (critical == 1) {
        ctx.fillStyle = "rgba(224, 31, 38, 1)";
      }
      else
        if (warning == 1) {
          ctx.fillStyle = "rgba(231, 194, 25, 1)";
        } else
          if (good == 1) {
            ctx.fillStyle = "rgba(0, 166, 90, 1)";
          } else
            if (live == 1) {
              ctx.fillStyle = "rgba(0, 205, 220, 1)";
            }
            else {
              ctx.fillStyle = "rgba(117, 144, 161, 1)";
            }


      // border is black
      ctx.strokeStyle = "rgba(0,0,0,1)";

      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(width - radius, 0);
      ctx.quadraticCurveTo(width, 0, width, radius);
      ctx.lineTo(width, height - radius);
      ctx.quadraticCurveTo(width, height, width - radius, height);
      ctx.lineTo(radius, height);
      ctx.quadraticCurveTo(0, height, 0, height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
    }

    return canvas.toDataURL();

  }


  updateStateSeries() {
    var options = {
      chart: {
        type: 'bar',
        height: 200,
        width: 400,
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: true
          },
        }
      },
      series: [{
        name: 'Not reproting',
        data: []
      }, {
        name: 'Reporting',
        data: []
      }, {
        name: 'Good',
        data: []
      }, {
        name: 'Warning',
        data: []
      }, {
        name: 'Critical',
        data: []
      }],
      colors: ['#7F8E96', '#5BC0DB', '#00A65A', '#e7c219', '#e01f26'],
      legend: {
        position: 'top',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        // show: true,
        // width: 2,
        colors: ['transparent']
      },
      xaxis: {
        // categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: this.xVl
      },
      yaxis: {
        title: {
          text: 'No.of Devices'
        },
        min: 0,
        max: Number(this.prevDeviceStatus.total),
        tickAmount: Number(this.prevDeviceStatus.total)
      },
      fill: {
        opacity: 1
      }
      ,
      noData: {
        text: 'Loading...'
      }
    };

    var chart = new apexChart(document.querySelector('#devicePrevStatusChart'), options);
    chart.render();


    var _goodArr: any = []
    var _warningArr: any = []
    var _criticalArr: any = []



    if (this.stateSelectedList.length == 0) {
      _goodArr = []
      _warningArr = []
      _criticalArr = []
    }
    else if (this.stateSelectedList.length > 0) {
      if (this.selectedState.toLowerCase().includes('goo')) {
        _goodArr = this.goodAr;
      }
      if (this.selectedState.toLowerCase().includes('war')) {
        _warningArr = this.warningAr;
      }
      if (this.selectedState.toLowerCase().includes('cri')) {
        _criticalArr = this.criticalAr;
      }
      if (this.selectedState.toLowerCase() == 'all') {
        _goodArr = this.goodAr;
        _warningArr = this.warningAr;
        _criticalArr = this.criticalAr;
      }
    }

    chart.updateSeries([{
      name: 'Not reproting',
      data: this.nrAr
    }, {
      name: 'Reproting',
      data: this.reportingAr
    }, {
      name: 'Good',
      data: _goodArr
    }, {
      name: 'Warning',
      data: _warningArr
    }, {
      name: 'Critical',
      data: _criticalArr
    }]);
  }

  selectedRegion: any
  regionDevice: any

  changeRegion(region: any) {

    

    this.isMapLoaded = false;

    if (this.selectedRegion != null && this.selectedRegion != '' && this.selectedRegion != undefined) {


      // for (let m = 0; m < this.markerArray.length; m++) {
      //   this.markerArray[m].setMap(null)
      // }
      // this.markerArray = [];
      // var point = new google.maps.LatLng(Number(region.regionLat), Number(region.regionLng))


      // var mk = new google.maps.Marker({
      //   position: point,
      //   map: this.map,
      //   title: region.regionName,
      //   icon: this.markerIcon
      // });

      // this.markerArray.push(mk);

      // this.map.panTo(point);


      this.regionDevice = []
      this.originalResp.liveDetails.forEach(orr => {

        orr.live.forEach(l => {
          if (l.regionId == region.regionId) {
            this.regionDevice.push(l.deviceId)
          }
        });
      })

      this.filterTable(this.regionDevice);

      this.stateSelectedList = [];

      // this.get24Status();
    }
    else {
      this.filterTable("all");


      this.loadregions();

    }

    // this.BindTableData(this.originalResp);
    this.bindDevices();
  }


  ploatDeviceStatus(Reporting: any, NotReporting: any) {
    //
    var options = {
      series: [],
      labels: ['Reporting', 'Not-Reporting'],
      chart: {
        width: 200,
        type: 'donut',
        events: {
          click: (event, chartContext, config) => {
            //

            var innerTextArr = event.currentTarget.innerText.split('\n')

            if (innerTextArr[2].includes('Not-Reporting')) {
              this.nrSensor();
            }
            else
              if (innerTextArr[2].includes('Reporting')) {
                this.LiveSensor();
              }
          }
        }
      },
      fill: {
        type: 'gradient',
      },
      colors: ['#5BC0DB', '#7F8E96'],
      plotOptions: {
        pie: {


          dataLabels: {
            // offset: 20,

          },
          donut: {
            size: '55%',
            textAnchor: 'top',
            labels: {
              show: true,
              name: {
                fontSize: '10px'
              },
              value: {
                fontSize: '25px',
                offsetY: 1
              },
              total: {
                showAlways: false,
                show: true,
                color: '#000',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      dataLabels: {
        style: {
          fontSize: '9px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          // colors: ['#5BC0DB', '#7F8E96'],
          colors: ['#FFF'],
        },
        dropShadow: {
          enabled: true,
        },
        formatter: function (val) {
          return Math.round((val / 100) * total);
        },
      },
      legend: {
        // show: false
        position: 'top',
        fontSize: '8px',
      },
      noData: {
        text: 'Loading...'
      }
    };

    var chart = new apexChart(document.querySelector('#deviceStatusChart'), options);
    chart.render();

    var Rc = +Reporting;
    this.SensorreportCntindex = Rc
    var NRc = +NotReporting;
    var total = Rc + NRc;

    chart.updateSeries([Rc, NRc]);

    // chart = new apexChart(document.querySelector('#deviceStatusChart'), options);
    // chart.render();

  }


  resetPaging() {
    this.pageStart = 0
    this.pageStartView = 1

    this.pageEnd = Number(this.pageStart) + Number(this.pageCount);

    this.pageStartDisable = true;

    this.bindListViewTable();
  }


  ploatexChart() {



    var options = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };

    var chart = new apexChart(document.querySelector('#chartId'), options);
    chart.render();

  }

  GetCenterFromDegrees(latLongs: any) {

    if (latLongs.length == 0) {
      return false;
    }
    var num_coords = latLongs.length;

    var X = 0.0;
    var Y = 0.0;
    var Z = 0.0;


    for (let i = 0; i < latLongs.length; i++) {
      var lat = latLongs[i].lat * Math.PI / 180;
      var lon = latLongs[i].lng * Math.PI / 180;

      var a = Math.cos(lat) * Math.cos(lon);
      var b = Math.cos(lat) * Math.sin(lon);
      var c = Math.sin(lat);

      X += a;
      Y += b;
      Z += c;
    }

    X /= num_coords;
    Y /= num_coords;
    Z /= num_coords;

    var lon = Math.atan2(Y, X);
    var hyp = Math.sqrt(X * X + Y * Y);
    var lat = Math.atan2(Z, hyp);

    var newX = (lat * 180 / Math.PI);
    var newY = (lon * 180 / Math.PI);

    return new Array(newX, newY);
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

  loadPeriodRange(pollingFreq: any) {
    this.periodRangeFilter = [];

    var starting = +pollingFreq;

    this.periodRange.forEach(p => {
      var frequency = Number(p.pId) / 60;
      if (frequency >= starting) {
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

    // console.warn("Initializing MQTT");

    // // Create a client instance
    // //this.mqttClient = new Paho.Client("soldier.cloudmqtt.com", Number(36226), "clientId");
    // // this.mqttClient = new Paho.Client("mqttnew.iotsolution.net", Number(8000), "clientId");
    // this.mqttClient = new Paho.Client("mqtt.ppm-rs.com", Number(8083), "clientId123");
    // //// set callback handlers
    // this.mqttClient.onConnectionLost = (responseObject) => {


    //   if (responseObject.errorCode !== 0) {
    //     this.mqttConnected = false;

    //     //alert("Lost connection Please reload.");
    //     console.error("[MQTT] Connection Lost:" + responseObject.errorMessage);

    //   }
    // };

    // this.mqttClient.onMessageArrived = (message) => {



    //   // auto-scroll to bottom
    //   //jQuery('#vr-output').animate({ scrollTop: $('#vr-output').get(0).scrollHeight }, 500);
    // }


  }

  command(deviceId: any, sensor: any, val: any, valStat: any) {


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

        if (valStat == true) {
          newStatus = "0";
        }
        else {
          newStatus = "1";
        }

        this.mqttCMDval = true;
      }

    if (sensor == "devStat") {
      cmd = '{"deviceId":"' + deviceId + '","device":"' + newStatus + '"}'
    }
    else {
      cmd = '{"deviceId":"' + deviceId + '","' + sensor + '":"' + newStatus + '"}'
    }

    this.sendCommand(cmd);

  }


  commandVal(deviceId: any, sensor: any, range: any, cmd: any) {




    var newStatus: any
    // var cmd: any;

    var min: number;
    var max: number;
    if (range != null && range != undefined && range != "") {
      min = +range[0];
      max = +range[1];
    }

    if (cmd == "" || cmd == undefined || cmd == null) {
      this._toaster.warning('please set value');
    }
    else {

      var val = +cmd;

      if (val >= min && val <= max) {
        sensor = sensor.replace(' ', '');

        //alert(sensor);

        //if (sensor.toLowerCase() == "setpoint") {
        cmd = '{"deviceId":"' + deviceId + '","' + sensor + '":' + val + '}'
        // }


        this.sendCommand(cmd);
      }
      else {
        this._toaster.warning('please set value within the range only');
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

        // if (this.MQTTdeviceTopic == undefined || this.MQTTdeviceTopic == "") {
        message.destinationName = sessionStorage.getItem("MQTT_PubTopic"); //"dx_in";
        // }
        // else {
        //   message.destinationName = this.MQTTdeviceTopic; //"dx_in";
        // }


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
      else {
        this.timerTick();
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

    // dtRange = []
    // dtRange.dtId = "360"
    // dtRange.dtName = "Last 15 Days"

    // this.DateRangeList.push(dtRange);

    // dtRange = []
    // dtRange.dtId = "custom"
    // dtRange.dtName = "Custom Dates"

    // this.DateRangeList.push(dtRange);

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
      // obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.fromDate);
      // obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.toDate);


      obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.fromDate[0]);
      obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.deviceInsightsobj.fromDate[1]);
    }
    else {
      obj.frDate = this.selectedRange;
    }

    this._trackingService.getTrend(obj).subscribe(result => {

    });
  }

  saveShowLiveSnsr() {
    //
    this.LiveSensorResp

    var resp: any;

    resp = [];

    this._trackingService.updateSensorInLive(this.LiveSensorResp).subscribe(result => {
      //

      resp = result

      if (resp.sts == "200") {
        this._toaster.success(resp.msg + ", Changes will effect soon");

        this.modalLiveSensor.hide();
      }
      else {
        this._toaster.warning(resp.msg);
      }

    });
  }

  openSensorShow() {



    var snsr: any

    snsr = [];

    this.LiveSensorResp = [];

    this._trackingService.getSensorInLive("").subscribe(result => {


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

      this.modalLiveSensor.show();
    });



  }

  loadSensorTypes() {

    this.SensorList = {}
    this.SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.SensorList = this.SensorList.filter(g => g.key !== "tms");
  }

  changeView(view) {
    debugger

    
    this._commanService.ActionType = view;

    if (view == "List") {
      this.listView = true;
    }
    if (view == "listDetails") {
      this.isListDetails = true;
      this.isShowFooter = false;
      this.timerTick();
    }
    else if (view == "chart") {
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
          else if(view == "energy"){
            this.router.navigateByUrl('/pages/tracking/EnergyView')
          }
  }




  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  timerTick() {

    if (this.isTimer) {
      this.sub.unsubscribe();
      this.isTimer = true;
      this.timer = Observable.timer(0, Number(3) * 10000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
    else {
      this.isTimer = true;
      this.timer = Observable.timer(0, Number(3) * 10000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }

  }

  originalResp: any = []
  solutions: any = []
  devIds: any = []

  filterTable(deviceList: any) {


    debugger

    if (deviceList == "all") {
      this.pagLst = this.originalResp;

      this.pagLst = this.pagLst.live == null ? [] : this.pagLst.live;

      this.BindTableData(this.originalResp);

      // this.loadregions();

      // this.get24Status();
    }
    else {
      this.devIds = deviceList;

      var temp: any = {}

      this.solutions = []

      for (let sl = 0; sl < this.originalResp.liveDetails.length; sl++) {
        this.solutions.push(this.originalResp.liveDetails[sl].solution);
      }

      var solutionDev: any = []

      temp.sts = this.originalResp.sts;
      temp.fromDate = this.originalResp.fromDate;
      temp.toDate = this.originalResp.toDate;
      temp.liveDetails = [];
      temp.total = this.originalResp.total;
      temp.hiddendCount = this.originalResp.hiddendCount;
      temp.Polling = this.originalResp.Polling;
      temp.NR = this.originalResp.NR;
      temp.good = this.originalResp.good;
      temp.warning = this.originalResp.warning;
      temp.critical = this.originalResp.critical;
      temp.rcTemp = this.originalResp.rcTemp;
      temp.mbdb = this.originalResp.mbdb;

      var liveDList: any = []
      for (let sli = 0; sli < this.solutions.length; sli++) {
        this.originalResp.liveDetails.forEach(orr => {
          solutionDev = []

          var livD: any = {}
          if (orr.solution == this.solutions[sli]) {
            var idx = -1
            for (let di = 0; di < this.devIds.length; di++) {

              var l = orr.live.filter(item => item.deviceId == this.devIds[di]);

              if (l.length > 0) {
                idx += 1;

                solutionDev.push(
                  {
                    index: idx,// l[0].index,
                    deviceId: l[0].deviceId,
                    status: l[0].status,
                    snsrValueList: l[0].snsrValueList,
                    // snsr: l[0].snsr,
                    // snsrVal: l[0].snsrVal,
                    sensorTime: l[0].sensorTime,
                    LastUpdated: l[0].LastUpdated,
                  }
                );
              }
            }
          }

          livD.live = []
          if (solutionDev.length > 0) {

            livD.solution = orr.solution;
            livD.live = solutionDev;

            liveDList.push(livD);
          }

        });
      }


      temp.liveDetails = liveDList;

      this.pagLst = temp;

      this.pagLst = this.pagLst.live == null ? [] : this.pagLst.live;

      this.BindTableData(temp);
    }
  }

  reqLive: any;
  onLoadSensorSummaryData(devices: any) {


    this.displaySpinner(true);
    //this.deviceInsightsobj = this.getVehicleSessionData();

    this.pagLst = [];
    var obj: any = [];

    // if (this.selectHW !== undefined) {
    //   obj.hwType = this.selectHW;
    // }

    obj.loginId = this._commanService.getLoginUserID();
    obj.timezone = this.userTimeZone;


    //
    
    if (devices === "" || devices == "all") {

      this.reqLive = this._trackingService.getSensorLiveData(obj).subscribe(result => {
        //;
        if (this.reqLive !== undefined) {

          this.originalResp = result;

          this.pagLst = result;

          this.pagLst = this.pagLst.live == null ? [] : this.pagLst.live;

          if (this.selectedRegion == null || this.selectedRegion == '' || this.selectedRegion == undefined) {
            this.loadregions();
          }


          this.filter();
        }
      }, error => {
        this.VehicleTableData();
      })
    }




    // else {
    //   // //
    //   obj.deviceList = devices;

    //   this.reqLive = this._trackingService.getSensorLiveDataByDevices(obj).subscribe(result => {
    //     //;
    //     if (this.reqLive !== undefined) {
    //       this.pagLst = result;
    //       this.pagLst = this.pagLst.live == null ? [] : this.pagLst.live;
    //       //this.VehicleTableData();
    //       this.BindTableData(result);
    //     }
    //   }, error => {
    //     this.VehicleTableData();
    //   })
    // }
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



    // if (this.selectHW == "" || this.selectHW == undefined || this.selectHW == null) {
    //   this.selectHW = this.userHwTypes[0].id
    // }
    // this.onLoadSensorSummaryData("");
    //this.timerTick();
    this.stateType = "All"
    this.isTimer = false;
    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = true;
    this.isNR = false;
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

  _snVals: any = []
  snNames: any = []
  dataVals: any = []

  BindTableData(ds: any) {



    if (this.stateType.toLowerCase() == "all" && (this.selectedRegion == '' || this.selectedRegion == null || this.selectedRegion == undefined)) {
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

      this.ploatDeviceStatus(this.SensorLiveCntindex, this.SensorNrCntindex);
    }


    var data = [];
    this.snNames = [];
    this._snVals = [];

    this.dataVals = []
    
    this.dataVals = ds.liveDetails;

    this.bindListViewTable();

    this.isShowFooter = false;

    // this._loaderService.display(false);

    this.bindDevices();
  }

  bindListViewTable() {

    //
    this._snVals = [];


    var dataIndx: any



    for (let idx = 0; idx < this.dataVals.length; idx++) {

      dataIndx = {}

      dataIndx.solution = this.dataVals[idx].solution;
      dataIndx.live = [];

      this.totalRows = this.dataVals[idx].live.length;


      for (let lIdx = Number(this.pageStart); lIdx < Number(this.dataVals[idx].live.length); lIdx++) {
        dataIndx.live.push(this.dataVals[idx].live[lIdx]);
      }


      if (this.dataVals[idx].live.length < Number(this.pageEnd)) {
        this.pageEndDisable = true;
      }
      else {
        this.pageEndDisable = false;
      }

      this._snVals.push(dataIndx);

    }


    var userModles: any = {};

    userModles = JSON.parse(sessionStorage.getItem('User_HWTypes'));

    var m: any = []
    this._snVals.forEach(sn => {

      m = userModles.filter(r => r.modelId == sn.solution + '_')

      if (m.length > 0) {
        sn.solution = m[0].modelName;
      }
    });


    var SUoM: any


    var SessionUoM: any = {};

    SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));

    this._SessionUoM = {};

    this._SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));

    var indx = 0;

    
    this._snVals.forEach(sv => {

      sv.live.forEach(live => {
        
        indx = 0;
        live.snsrValueList.forEach(u => {

          
          if (u.UoM != null && u.UoM != undefined && u.UoM != "") {

            if (!isNaN(u.UoM)) {
              u.UoM = SessionUoM.filter(g => g.uomId == u.UoM)[0].symbol;
            }

          }

          indx += 1;
        });

      });
    });


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
        obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.fromDate[0]);
        obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.deviceInsightsobj.fromDate[1]);
      }
      else {
        obj.frDate = this.selectedRange;
      }

      this.trendResponse = [];

      this.TrendValues = []
      this.SensorRules = [];

      this.showTrendDownload = false;

      this._trackingService.getTrend(obj).subscribe(result => {



        this._loaderService.display(false);
        this.showTrendDownload = true;
        this.trendResponse = result;


        this.TrendName = this.showMoreDevice;// + " : " + this.trendResponse.title

        if (this.trendResponse.trend.length > 0) {
          this.sensorId = this.trendResponse.trend[0].sensorName;

          this.TrendName += " : " + this.trendResponse.title
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

            this.TrendValues.push(obj)
          });

          this.SensorRules = this.trendResponse.ruleDetails



          if (this.trendChart) { this.trendChart.dispose(); }

          this.ploatTrendChart()

        }
        else {
          this.TrendName += " : " + this.sensorId;
        }



      });

    }
    else {

      // this._loaderService.display(false);
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


      if (this.deviceInsightsobj.fromDate[0] == undefined || this.deviceInsightsobj.fromDate[0] == "") {
        return false;
      }
      // if (this.deviceInsightsobj.toDate == undefined || this.deviceInsightsobj.toDate == "") {
      //   return false;
      // }
    }

    return true;

  }

  trendChart: any;
  rctrendChart: any;

  ploatTrendChart() {

    this.trendChart = am4core.create("trendChart", am4charts.XYChart);


    this.trendChart.data = this.TrendValues;


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
    // valueAxis.title.fontWeight = 600;

    //valueAxis.renderer.grid.template.disabled = true;

    let series = this.trendChart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    series.tensionX = 1;
    series.stroke = am4core.color("#7092BE");

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

      //

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
        if (pb.minVal < 0) {
          range.value = +pb.maxVal;
          range.endValue = +pb.minVal;
        }
        else {
          range.value = +pb.minVal;
          range.endValue = +pb.maxVal;
        }
      }
      else
        if (pb.minVal < 0) {
          if (pb.minAssign == ">=" || pb.minAssign == ">") {

            range.value = +pb.minVal * 10000;
            range.endValue = +pb.minVal;
          }
          else
            if (pb.minAssign == "<=" || pb.minAssign == "<") {
              range.value = +pb.minVal;
            }
        }
        else {
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
        }
    });

  }


  async downloadData(reportType: any) {


    this._loaderService.display(true);

    if (reportType == "csv" || reportType == "excel" || reportType == "pdf") {
      this.Exportdataset = [];
      var csvData: any = []

      var sensorNamewithUoM = "";

      this.trendResponse.trend.forEach(element => {
        this.Exportdataset.push([
          element._sensorTime,
          element.sensorValue
        ])

        sensorNamewithUoM = element.sensorName + ' ' + element.uom;

        csvData.push(
          {
            deviceId: element.deviceId,
            sensorTime: element._sensorTime,
            [element.sensorName + ' ' + element.uom]: element.sensorValue
          }
        )
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
        pdfobj.columns = 'Date/Time (IST),' + this.trendResponse.trend[0].sensorName + ' ( ' + this.sensorUoM + ' )';
        pdfobj.data = this.Exportdataset;
        pdfobj.sensorName = this.trendResponse.trend[0].sensorName;//"";
        pdfobj.interval = this.period;
        var resp: any = []

          //console.log(pdfobj);


          //await this._trackingService.getPDF(pdfobj).subscribe(result => {
          //resp = result;
          ;
        resp = await this.getData(pdfobj);
        ;




        if (resp.msg.toLowerCase().includes('object reference not set')) {
          this._toaster.warning("Server is busy please Re-Login");
        }
        else {
          if (resp && resp.sts == "200") {
            // window.location.href = resp.msg;
            window.open(resp.msg, '_bank');
          }
          else {
            this._toaster.warning(resp.msg);
          }
        }
        this._loaderService.display(false);
        //});
      }
      else
        if (reportType == "excel") {
          var fileName = this.TrendName.split(':')[0] + '_' + this.trendResponse.title + '_';
          var headerText = [this.trendResponse.title]
          var columnKeys = [
            { key: '_sensorTime', width: 40 },
            { key: 'sensorValue', width: 50 }
          ];
          var columnHeaders = ["Time", "Value"]
          this._exportExcel.exportExcelFile(fileName, headerText, columnKeys, columnHeaders, this.Exportdataset, frDate, toDate)
        }
        else
          if (reportType == "csv") {
            var _fileName = this.TrendName.split(':')[0] + '_' + this.trendResponse.title;

            //test
            const options = {
              filename: _fileName,
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalSeparator: '.',
              showLabels: true,
              showTitle: false,
              useTextFile: false,
              useBom: true,
              useKeysAsHeaders: true

            };

            const csvExporter = new ExportToCsv(options);

            csvExporter.generateCsv(csvData);

            this._loaderService.display(false);

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
          obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.deviceInsightsobj.fromDate[0]);
          obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.deviceInsightsobj.fromDate[1]);
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



          if (resp.msg.toLowerCase().includes('object reference not set')) {
            this._toaster.warning("Server is busy please Re-Login");
          }
          else {
            if (resp.sts == "200") {
              // window.location.href = resp.msg;
              window.open(resp.msg, '_bank');
            }
            else {
              this._toaster.warning(resp.msg);
            }
          }
          this._loaderService.display(false);
          // this._loaderService.display(false);
        });


      }


  }

  async getData(pdfobj) {
    ;
    return new Promise(async (resolve, reject) => {
      await this._trackingService.getPDF(pdfobj).subscribe(result => {
        ;
        resolve(result);
      }, error => {
        ;
        resolve({})
      });
      ;
    })
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

  // imageArrow: any
  // vehicleIcon: any
  showMapOpen: boolean = false;
  deviceOnMap: any = ""
  showOnMap(deviceId: string) {

    this.mapDeviceTrack = new google.maps.Map(this.mapDevTrack.nativeElement, {
      center: { lat: 16.857611, lng: 81.928128 },
      zoom: 8
    })

    this.polyLine = new google.maps.Polyline({ strokeColor: '#488FCC', strokeOpacity: 0.8, strokeWeight: 6 });
    this.polyPath = null;


    this.modelmapTrack.show();
    //

    this.deviceOnMap = deviceId;

    this.trackOnMap();

    this.showMapOpen = true;
  }

  _latlong: any = "";
  _latitude: any = "";
  sameLatLong: boolean = false;

  trackOnMap() {
    var resp: any = {}

    this.clearMap()


    this._trackingService.getDeviceLocation(this.deviceOnMap).subscribe(result => {

      //

      resp = result;

      if (this._latitude == "") {
        // this._latitude = resp.latitude;
        sessionStorage.setItem("latitude", resp.latitude);
        sessionStorage.setItem("longitude", resp.longitude);
        sessionStorage.setItem("_counter", "1");
        this.sameLatLong = false;
      }
      else {
        // this._latitude = Number(sessionStorage.getItem("_latitude"));// + 0.000100;
        // sessionStorage.setItem("_latitude", this._latitude);
        sessionStorage.setItem("_counter", (Number(sessionStorage.getItem("_counter")) + 1 + ""));

        if (Number(resp.latitude) == Number(sessionStorage.getItem("latitude"))
          && Number(resp.longitude) == Number(sessionStorage.getItem("longitude"))) {
          this.sameLatLong = true;
        }
        else {
          this.sameLatLong = false;
        }


        sessionStorage.setItem("latitude", resp.latitude);
        sessionStorage.setItem("longitude", resp.longitude);
      }


      if (!this.sameLatLong) {
        var location: any = {}

        location.latitude = resp.latitude;
        location.longitude = resp.longitude;

        this.markerOnMap = new google.maps.Marker({
          position: { lat: Number(location.latitude), lng: Number(location.longitude) },
          map: this.mapDeviceTrack,
          title: resp.deviceName,
          icon: {
            url: '..\\assets\\Images\\bike.png',
            scaledSize: new google.maps.Size(20, 40)
          }
        })

        const markerPosition = this.markerOnMap.getPosition();

        //
        if (Number(sessionStorage.getItem("_counter")) % 3 == 0 || Number(sessionStorage.getItem("_counter")) == 1) {
          this.mapDeviceTrack.panTo(markerPosition);

          this.mapDeviceTrack.setZoom(15);
        }

        let point: any = new google.maps.LatLng(location.latitude, location.longitude);
        this.polyPath = this.polyLine.getPath()
        this.polyPath.push(point);
        this.polyLine.setMap(this.mapDeviceTrack);
        this.polyLineArray.push(this.polyLine);

      }

    });

  }




  popupClose(event) {
    ;
    console.log(event);

    this.showMapOpen = false;

  }

  removeMarkerOnMap() {
    //
    if (this.markerOnMap !== undefined) {
      this.markerOnMap.setMap(null);
    }
  }

  showMoreDetails(deviceId: string) {

    // this.modalMap.show();



    this.sessionData = JSON.parse(sessionStorage.getItem("USER_DEVICES"));
    //var deviceDetails = this.sessionData.filter(g => g.deviceName == deviceId.substring(0, deviceId.length - 1));
    var deviceDetails = this.sessionData.filter(g => g.deviceName == deviceId);
    this.loadPeriodRange(deviceDetails[0].frequency);

    this.hasMqtt = false;
    this.showMoreOpen = false;

    if (sessionStorage.getItem("hasMQTT") == "1") {
      this.hasMqtt = true;
      // if (!this.mqttConnected) {
      //   this.initializeMQTT();
      //   this.connectMQTT();
      // }
    }


    this.getMoreDetails(deviceId);

  }

  getMapTrend() { }

  dFdDetails: any;

  _SessionUoM: any;

  getMoreDetails(deviceId: string) {


    deviceId = deviceId.split('#')[0];
    this.moreInfoResp = []
    this.cmdVal = "";

    this.dFdDetails = [];

    this._trackingService.getSensorLiveMoreData(deviceId, this.deviceId).subscribe(result => {

      var data;

      data = result;

      this.moreInfoResp = data;

      this.showMoreDevice = this.moreInfoResp.live[0].deviceNo;

      this.deviceTime = this.moreInfoResp.live[0].time;
      this.MQTTdeviceTopic = this.moreInfoResp.mqttPubTopic;

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
        if (snType.length > 0) {
          this.moreInfoResp.live[indx].sensorType = snType[0].sensorType;
          this.moreInfoResp.live[indx].dFdtype = false;
          if (this.moreInfoResp.live[indx].dfdDetails.length > 0) {

            this.moreInfoResp.live[indx].dFdtype = true;
          }
        }
        indx += 1;
      });



      if (!this.showMoreOpen) {
        this.modalAllSensor.show();
        this.showMoreOpen = true;
      }
    });
  }

  setdFdCommand(dFd: any, dvd: any) {

    var cmd = '{"deviceId":"' + dvd.deviceId + '","' + dvd.snsrId + '":"' + dFd.pos + '"}'

    this.sendCommand(cmd);
  }

  closeMoreDetails() {

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
      this.timer = Observable.timer(0, Number(this.selectedTime) * 1000);
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

    this.filter();
  }
  warningList() {
    this.stateType = "warning";
    this.isGood = false;
    this.isWarning = true;
    this.isCritical = false;
    this.islive = false;
    this.isNR = false;
    this.isAll = false;

    this.filter();
  }

  criticalList() {
    this.stateType = "critical";

    this.isGood = false;
    this.isWarning = false;
    this.isCritical = true;
    this.islive = false;
    this.isNR = false;
    this.isAll = false;

    this.filter();
  }
  LiveSensor() {
    this.stateType = "live";

    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = true;
    this.isNR = false;
    this.isAll = false;

    this.filter();
  }
  AllSensor() {
    this.stateType = "All";

    this.isAll = true;
    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = false;
    this.isNR = false;


    this.filter();
  }
  nrSensor() {
    this.stateType = "nr";

    this.isGood = false;
    this.isWarning = false;
    this.isCritical = false;
    this.islive = false;
    this.isNR = true;
    this.isAll = false;
    this.filter();
  }

  getTimerData(time) {
    
    if (this.showMoreOpen) {
      this.getMoreDetails(this.showMoreDevice);
    }
    else if (this.showMapOpen) {
      this.trackOnMap();
    }
    else {
      this.onLoadSensorSummaryData("all");
    }
  }

  filter() {

    if (this.stateType.toLowerCase() == "live") {
      this.filterTable(this.pollingSensor);
    }
    else if (this.stateType.toLowerCase() == "nr") {
      this.filterTable(this.NRSensor);
    }
    else if (this.stateType.toLowerCase() == "good") {
      this.filterTable(this.goodSensor);
    }
    else if (this.stateType.toLowerCase() == "warning") {
      this.filterTable(this.warningSensor);
    }
    else if (this.stateType == "critical") {
      this.filterTable(this.criticalSensor);
    }
    else if ((this.stateType == "All" || this.stateType == "") && (this.selectedRegion == null || this.selectedRegion == undefined || this.selectedRegion == '')) {
      this.filterTable("all");

      // this.loadregions();
    }
    else if (this.selectedRegion !== null) {

      this.filterTable(this.regionDevice);
    }
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

