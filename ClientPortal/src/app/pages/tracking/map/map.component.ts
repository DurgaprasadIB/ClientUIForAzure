import { Component, OnInit, ViewChild } from '@angular/core';

import MarkerClusterer from '@google/markerclusterer'
import { Router } from '@angular/router';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { TrackingService } from '../services/tracking.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private router: Router,
    private _commanService: IdeaBService,
    private _trackingService: TrackingService) { }


  @ViewChild('mapDiv') gmapElement: any;

  map: google.maps.Map;

  markerCluster: any;
  markersArray: any;
  userHwTypes: any;
  isMultipleHW: boolean;
  selectHW: any;

  userDevices: any;
  userRegions: any;

  sessionData: any = [];
  clientFeatures: any;

  hasChart: boolean = false;
  hasSurv: boolean = false;
  hasMap: boolean = false;
  hasTemp: boolean = false;
  hasDBpin: boolean = false;


  LiveCntindex = 0;
  GoodCntindex = 0;
  WarnCntindex = 0;
  CriticalCntindex = 0;
  DeviceAllCntindex = 0;

  liveSensor: any;
  goodSensor: any;
  warningSensor: any;
  criticalSensor: any;

  pagLst: any;
  reqLive: any;
  userTimeZone: any;
  hasEnergy: boolean = false;
  ngOnInit() {

    this.hasSurv = false;
    this.hasChart = false;


    this.userTimeZone = sessionStorage.getItem('USER_TIMEZONE');

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


    var lat = "17.4330175";// this._commanService.getDefaultLat();
    var lon = "78.3728449";// this._commanService.getDefaultLng()

    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lon));
    this.map = new google.maps.Map(this.gmapElement.nativeElement,
      {
        center: centerLatLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy'
      }
    );


    this.getDevices();
  }

  LoadSensorSummaryData() {


    //this.deviceInsightsobj = this.getVehicleSessionData();

    this.pagLst = [];
    var obj: any = [];

    obj.loginId = this._commanService.getLoginUserID();
    obj.timezone = this.userTimeZone;

    this.reqLive = this._trackingService.getSensorLiveData(obj).subscribe(result => {

      if (this.reqLive !== undefined) {
        this.pagLst = result;

        this.pagLst = this.pagLst.live == null ? [] : this.pagLst.live;

        this.BindTableData(result);


      }
    })


  }

  BindTableData(ds: any) {

    //$('#newSnrTable').dataTable().fnDestroy();

    this.DeviceAllCntindex = ds.total;


    this.LiveCntindex = ds.Polling.length;
    this.liveSensor = [];
    this.liveSensor = ds.Polling;

    this.GoodCntindex = ds.good.length;
    this.goodSensor = [];
    this.goodSensor = ds.good;

    this.WarnCntindex = ds.warning.length;
    this.warningSensor = [];
    this.warningSensor = ds.warning;

    this.CriticalCntindex = ds.critical.length;
    this.criticalSensor = [];
    this.criticalSensor = ds.critical;



    this.bindDevices();
  }

  getDevices() {

    this.LoadSensorSummaryData();

  }

  bindDevices() {

    this.userDevices = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    var totalRegions: any = []

    totalRegions = JSON.parse(sessionStorage.getItem("Regions"));

    debugger
    //
    //regionId
    this.userRegions = []

    totalRegions.forEach(reg => {
      //
      this.userDevices.forEach(uD => {
        //
        if (uD.regionId == reg.regionId) {
          this.userRegions.push(reg);
        }
      });
    });

    debugger
    var arrayList: any;

    arrayList = [];

    var markerInfo: any
    var regionDevs: any
    debugger
    this.userRegions.forEach(reg => {
      regionDevs = [];

      regionDevs = this.userDevices.filter(g => g.regionId == reg.regionId);

      markerInfo = {};

      markerInfo.lat = reg.regionLat;// "17.4330275";
      markerInfo.lng = reg.regionLng;// "78.3728549";
      markerInfo.devName = reg.regionName;//"Dev1";

      var critical: any = 0;
      var warning: any = 0;
      var good: any = 0;
      var live: any = 0;



      regionDevs.forEach(rDev => {
        critical += this.criticalSensor.filter(g => g == rDev.sensorId).length;
        warning += this.warningSensor.filter(g => g == rDev.sensorId).length;
        good += this.goodSensor.filter(g => g == rDev.sensorId).length;
        live += this.liveSensor.filter(g => g == rDev.sensorId).length;
      });

      markerInfo.critical = critical
      markerInfo.warning = warning
      markerInfo.good = good
      markerInfo.total = regionDevs.length;
      markerInfo.live = live;

      arrayList.push(markerInfo);


    });

    //non regions Devices
    regionDevs = [];

    regionDevs = this.userDevices.filter(g => g.regionId == "" || g.regionId == undefined);

    regionDevs.forEach(reg => {


      markerInfo = {};
      markerInfo.lat = reg.latitude;// "17.4330275";
      markerInfo.lng = reg.logitude;// "78.3728549";
      markerInfo.devName = reg.deviceName;//"Dev1";
      markerInfo.total = 'Single';

      markerInfo.critical = this.criticalSensor.filter(g => g == reg.sensorId).length;
      markerInfo.warning = this.warningSensor.filter(g => g == reg.sensorId).length;
      markerInfo.good = this.goodSensor.filter(g => g == reg.sensorId).length;

      arrayList.push(markerInfo);

    });

    this.AddMarkersToMap(arrayList);
  }

  changeView(path: any) {
    sessionStorage.setItem("USER_PREF", "");


    if (path == "live") {
      if (sessionStorage.getItem('Client_ListView') == "1") {
        this.router.navigateByUrl('/pages/tracking/LiveView')
      }
      else
        if (sessionStorage.getItem('Client_ListView') == "0") {
          this.router.navigateByUrl('/pages/tracking/ListView')
        }

      //this.router.navigateByUrl('/pages/tracking/LiveView')
    } else if (path == "chart") {


      this.router.navigateByUrl('/pages/tracking/SensorView')

    } else
      if (path == "pin") {

        this.router.navigateByUrl('/pages/tracking/AnalyticsView')
      } else
        if (path == "temp") {

          this.router.navigateByUrl('/pages/tracking/TempView')
        }
        else if (path == "image") {
          this.router.navigateByUrl('/pages/reports/images')
        }
        else if(path == "energy"){
          this.router.navigateByUrl('/pages/tracking/EnergyView')
        }
  }

  AddMarkersToMap(arrayList: any) {

    var finalArr: any = [];



    finalArr = arrayList.filter((value, index, array) =>
      !array.filter((v, i) => JSON.stringify(value) == JSON.stringify(v) && i < index).length);



    if (this.markersArray) {
      for (var i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray.length = 0;
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
          this.map.setZoom(17);
          var point = new google.maps.LatLng(Number(element.LatLng.lat()), Number(element.LatLng.lng()));
          this.map.panTo(point);
        }
        else {
          this.map.setZoom(12);
        }

        //
        var marker = new google.maps.Marker(
          {
            position: element.LatLng,
            map: this.map,
            title: element.devName,
            icon: this.createCanMarker(element.total, element.critical, element.warning, element.good, element.devName, element.live),
            zIndex: 3
          }
        );


        bounds.extend(marker.getPosition());
        //this.attachMarker(marker, strdata);
        this.markersArray.push(marker);
        this.map.fitBounds(bounds);
      }

    });


    // var centerlatLngs = new google.maps.LatLng(element.lat, center.longitude);
    // this.map.setCenter(centerlatLngs);

    if (this.markersArray.length > 0) {

      // Cluster Marker
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

  createCanMarker(count, critical, warning, good, name, live) {

    var canvas = document.createElement("canvas");

    var NR: Number = 0

    debugger
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

}


