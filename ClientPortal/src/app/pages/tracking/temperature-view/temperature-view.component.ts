import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { TrackingService } from '../services/tracking.service';
import { LoaderService } from 'src/app/services/loader.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ToastrService } from 'ngx-toastr';


// declare var jsPDF: any;

@Component({
  selector: 'app-temperature-view',
  templateUrl: './temperature-view.component.html',
  styleUrls: ['./temperature-view.component.css']
})
export class TemperatureViewComponent implements OnInit {

  @ViewChild('modalTrend') modalTrend: any;

  constructor(private router: Router,
    private _toaster: ToastrService,
    private _commanService: IdeaBService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService,) { }


  hasRules: boolean;
  hasSurv: boolean = false;
  hasChart: boolean = false;
  // isMultipleHW: boolean;


  trendChart: any;
  userHwTypes: any;
  TrendValues: any;
  sensorUoM: any;
  // selectHW: any = "";
  respTempLiveData: any;
  respTempLiveFilterData: any;
  SensorRules: any;
  trendResponse: any;
  TrendName: any;
  clientFeatures: any;

  hasMap: boolean = false;
  hasTemp: boolean = false;
  hasDBpin: boolean = false;
  hasEnergy: boolean = false;

  ngOnInit() {


    // this.userHwTypes = [];
    // var userHW: any;
    // userHW = JSON.parse(sessionStorage.getItem('User_HWTypes'));

    // var HW: any;
    // userHW.forEach(hw => {
    //   HW = []

    //   HW.id = hw;
    //   HW.name = hw.split('_')[0];

    //   this.userHwTypes.push(HW);
    // });

    // if (this.userHwTypes !== undefined) {
    //   if (this.userHwTypes.length == 1) {
    //     this.isMultipleHW = false;
    //   }
    //   else {
    //     this.isMultipleHW = true;
    //   }

    //   this.selectHW = this.userHwTypes[0].id;



    // }


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
      if (fe.featureId.toUpperCase() == 'E05A7A69-7B97-4A1C-B105-9C036C43C3C9') {
        this.hasEnergy = true;
      }
      if (fe.featureId.toUpperCase() == '7429106C-8341-458D-BB7D-196DAAC6E8C2') {
        this.hasTemp = true;
      }
    });

    this.hasDBpin = false;
    this.loadData();
    this.deviceId = [];

    this.deviceState = [];

    this.deviceState.push({
      state: "Good", colorCode: "green"
    },
      {
        state: "Warning", colorCode: "orange"
      }, {
      state: "Critical", colorCode: "red"
    })
  }


  // htmlToPdf() {
  //   const doc = new jsPDF('letter')
  //   const ta = document.getElementById('pdfSink');
  //   doc.fromHTML(ta, 0, 0);
  //   doc.save('demo.pdf')
  // }

  selectedState: any = []
  deviceIdList: any = []
  FilteredDeviceIdList: any = []
  deviceId: any = []
  deviceState: any = []
  devicesensor: any = []
  selectedSensorIdList: any = []
  regionList: any = []

  loadData() {
    var obj: any;

    obj = {}

    //obj.shortCode = this.selectHW;
    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');

    this.deviceIdList = [];
    this.respTempLiveData = [];
    this.displaysensors();
    this._loaderService.display(true);
    this._trackingService.getliveTemperature(obj).subscribe(result => {
      this._loaderService.display(false);
      this.respTempLiveData = result;

      var resp: any = [];

      this.regionList = [];
      const UniqueRegions = Array.from(new Set(this.respTempLiveData.map(item => item.regionId)));
      UniqueRegions.forEach(region => {
        this.regionList.push({ regionId: region });
      })

      this.respTempLiveData.forEach(dev => {
        debugger
        //this.devicesensor.push({sensorId: dev.sensorId, sensorName: dev.sensorName})
        if (resp.length > 0) {
          var ls = resp.filter(g => g.deviceId == dev.deviceId);
          if (ls.length == 0) {
            resp.push({ deviceId: dev.deviceId, deviceName: dev.deviceName })
            //this.regionList.push({ regionId: dev.regionId })
          }
        }
        else {
          resp.push({ deviceId: dev.deviceId, deviceName: dev.deviceName })
        }

      });
      this.deviceIdList = resp;
      this.FilteredDeviceIdList = this.deviceIdList;

      if (this.deviceId.length !== 0) {
        this.displayDevice();
      }
      else {
        this.respTempLiveFilterData = this.respTempLiveData
      }
      this.loadregions();
    });

  }
  selectedsensors: any;
  SensorList: any;

  displaysensors() {
    this.devicesensor = [];


    var snrs: any;


    snrs = []
    snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));


    this.SensorList = [];


    // var snr = snrs.filter(g => g.shortCode == this.modelId);

    snrs.forEach(s => {
      var obj: any = [];
      //s.sensorTypeId !== "6"
      if (s.sensorTypeId !== "7" && s.sensorTypeId !== "17" && s.key !== "deviceId" && s.key !== "tms") {
        obj.sensorId = s.sensorTypeId;

        obj.sensorName = s.keyName;

        obj.mathFunctions = s.mathFunctions;

        this.SensorList.push(obj);
      }
    });

    // this.devicesensor.push(
    //   {
    //     sensorId: "temp",
    //     sensorName: "Temperature"
    //   },
    //   {
    //     sensorId: "hum",
    //     sensorName: "Humidity"
    //   }
    // );
  }
  changeselectedSensor() {

    debugger

    if ((this.selectedRegion != null && this.selectedRegion != '')
      && (this.deviceId != null && this.deviceId != '')) {
      this.respTempLiveFilterData = this.respTempLiveData.filter(gr => gr.regionId == this.selectedRegion
        && gr.deviceId == this.deviceId);
    }
    else
      if ((this.selectedRegion != null && this.selectedRegion != '')
        && (this.deviceId == null || this.deviceId == '')) {
        this.respTempLiveFilterData = this.respTempLiveData.filter(gr => gr.regionId == this.selectedRegion);
      }
      else
        if ((this.selectedRegion == null || this.selectedRegion == '')
          && (this.deviceId == null || this.deviceId == '')) {
          this.respTempLiveFilterData = this.respTempLiveData;
        }


    if (this.selectedState != null && this.selectedState != '' && this.selectedState != undefined) {

      this.respTempLiveFilterData = this.respTempLiveFilterData.filter(gr => gr.colorCode == this.selectedState);

    }
    if (this.selectedSensorIdList != null && this.selectedSensorIdList != '' && this.selectedSensorIdList != undefined) {
      debugger
      var filterdetails = [];
      this.respTempLiveFilterData.forEach(item => {
        this.selectedSensorIdList.forEach(itemsen => {
          debugger
          if (item.sensorKeyId == itemsen) {
            filterdetails.push(item);
          }
        })
      })
      debugger
      this.respTempLiveFilterData = filterdetails
    }
  }
  displayDevice() {
    this.selectedState = []
    this.selectedSensorIdList = []

    if (this.deviceId !== null) {
      var shortCode = this.deviceId.split('_')[0] + '_';
      this.respTempLiveFilterData = this.respTempLiveData.filter(gr => gr.deviceId == this.deviceId
        && gr.shortCode == shortCode);
    }
    else {
      // this.respTempLiveFilterData = this.respTempLiveData
      this.changeRegion();
    }
  }

  clientRegions: any = []
  selectedRegion: any

  loadregions() {


    var cRegions = JSON.parse(sessionStorage.getItem('Regions'));

    this.clientRegions = []


    cRegions.forEach(cR => {

      debugger
      var reg = this.regionList.filter(g => g.regionId == cR.regionId);

      if (reg.length > 0)
        this.clientRegions.push({
          regionId: cR.regionId,
          regionName: cR.regionName,
          regionLat: cR.regionLat,
          regionLng: cR.regionLng
        })


    });




  }

  changeRegion() {
    debugger
    this.deviceId = []
    this.selectedState = []
    this.selectedSensorIdList = []
    //this.devicesensor = [];
    var deviceIdLst = [];
    if (this.selectedRegion != null && this.selectedRegion != '' && this.selectedRegion != undefined) {

      this.respTempLiveFilterData = this.respTempLiveData.filter(gr => gr.regionId == this.selectedRegion);
      // this._toaster.success(this.selectedRegion);
      this.respTempLiveFilterData.forEach(dev => {
        var exist = deviceIdLst.filter(gr => gr.deviceId == dev.deviceId)
        if (exist.length == 0) {
          deviceIdLst.push({ deviceId: dev.deviceId, deviceName: dev.deviceName })
        }
        // if(dev.sensorId.includes("temp")){
        //   var sensorExist = this.devicesensor.filter(gr => gr.sensorName == "Temperature")
        //   if(sensorExist == 0){
        //     this.devicesensor.push({
        //       sensorId: "temp",
        //       sensorName: "Temperature"
        //     })
        //   }
        // }
        // else if(dev.sensorId.includes("hum")){
        //   var sensorExist = this.devicesensor.filter(gr => gr.sensorName == "Humidity")
        //   if(sensorExist == 0){
        //     this.devicesensor.push({
        //       sensorId: "hum",
        //       sensorName: "Humidity"
        //     })
        //   }
        // }
      });
      this.FilteredDeviceIdList = deviceIdLst
      // this.FilteredDeviceIdList = this.respTempLiveFilterData.filter((value, index, array) => array.indexOf(value) === index);
    }
    else {
      this.respTempLiveFilterData = this.respTempLiveData;
      this.FilteredDeviceIdList = this.deviceIdList;
    }
  }

  changeState() {

    this.selectedSensorIdList = []
    if ((this.selectedRegion != null && this.selectedRegion != '')
      && (this.deviceId != null && this.deviceId != '')) {
      this.respTempLiveFilterData = this.respTempLiveData.filter(gr => gr.regionId == this.selectedRegion
        && gr.deviceId == this.deviceId);
    }
    else
      if ((this.selectedRegion != null && this.selectedRegion != '')
        && (this.deviceId == null || this.deviceId == '')) {
        this.respTempLiveFilterData = this.respTempLiveData.filter(gr => gr.regionId == this.selectedRegion);
      }
      else
        if ((this.selectedRegion == null || this.selectedRegion == '')
          && (this.deviceId == null || this.deviceId == '')) {
          this.respTempLiveFilterData = this.respTempLiveData;
        }


    if (this.selectedState != null && this.selectedState != '' && this.selectedState != undefined) {

      this.respTempLiveFilterData = this.respTempLiveFilterData.filter(gr => gr.colorCode == this.selectedState);

    }
    // else {

    //   if (this.deviceId != '' && this.deviceId != null && this.deviceId != undefined) {
    //     this.displayDevice()
    //   }
    //   else {
    //     this.changeRegion();
    //   }
    // }
  }


  showTrend(deviceId: any, sensorId: any, deviceName: any) {

    var obj: any;

    obj = {};

    obj.deviceId = deviceId;
    obj.sensorId = sensorId;
    obj.frDate = "24";


    this.modalTrend.show();
    this.trendResponse = [];

    this.hasRules = false;
    this.TrendName = deviceName

    this.TrendValues = [];
    if (this.trendChart) { this.trendChart.dispose(); }

    this._trackingService.getTrend(obj).subscribe(result => {



      this._loaderService.display(false);
      this.trendResponse = result;

      if (this.trendResponse.trend.length > 0) {

        this.TrendName = deviceName + " : " + this.trendResponse.title

        this.TrendValues = [];

        this.trendResponse.trend.forEach(e => {
          var STime = +e.sensorTime;
          var SVal = +e.sensorValue;


          var obj: any = {};

          obj.date = STime;
          obj.value = SVal;

          this.TrendValues.push(obj)
        });

        this.SensorRules = this.trendResponse.ruleDetails



        if (this.trendChart) { this.trendChart.dispose(); }

        this.ploatTrendChart()

      }



    });

  }

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
    valueAxis.title.text = "°C";
    valueAxis.title.rotation = 0;
    valueAxis.title.align = "center";
    valueAxis.title.valign = "top";
    valueAxis.title.dy = 120;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }
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

  changeView(path: any) {
    sessionStorage.setItem("USER_PREF", "");

    this._commanService.ActionType = path;

    if (path == "live") {
      if (sessionStorage.getItem('Client_ListView') == "1") {
        this.router.navigateByUrl('/pages/tracking/LiveView')
      }
      else
        if (sessionStorage.getItem('Client_ListView') == "0") {
          this.router.navigateByUrl('/pages/tracking/ListView')
        }

      // this.router.navigateByUrl('/pages/tracking/LiveView')
    } else
      if (path == "pin") {

        this.router.navigateByUrl('/pages/tracking/AnalyticsView')
      } else
        if (path == "map") {

          this.router.navigateByUrl('/pages/tracking/Map')
        }
        else
          if (path == "chart") {
            this.router.navigateByUrl('/pages/tracking/SensorView')
          }
          else if(path == "energy"){
            this.router.navigateByUrl('/pages/tracking/EnergyView')
          }

  }

}
