import { Component, OnInit, ViewChild } from '@angular/core';
import { TrackingService } from '../services/tracking.service';
import { Subscription, Observable } from 'rxjs/Rx';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
declare var SlidingMarker: any;
import "../../../../js/SliddingMarker.js";
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GeofenceService } from '../../geofence/services/geofence.service';
declare var MapLabel: any;
import "../../../../js/maplabel.js";

const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-live-track',
  templateUrl: './live-track.component.html',
  styleUrls: ['./live-track.component.css']
})
export class LiveTrackComponent implements OnInit {

  //TrackingTypeList: TrackingItems[];

  constructor(private _LiveTrackService: TrackingService,
    private _commonService: IdeaBService,
    private _toastr: ToastrService,
    private _geofenceService: GeofenceService,
    private _route: ActivatedRoute) {
      // this.TrackingTypeList = [
    //   { Id: '1', TrackingType: 'People' },
    //   { Id: '2', TrackingType: 'Vehicle' },
    // ];
    // this.TrackingTyp = '1'; // Default People Selected
  }

  grofenceList: any = {};
  polygonList: any = {};
  grofenceList1: any = [];
  polygonList1: any = [];
  mapLabelArray: any = [];

  geofenceList: any = {};
  circleArray: any = [];
  polygnPathArray: any = [];
  resultlist: {} = {};
  marker: any;

  imageIcon: imageIcon;
  polyOptions: any = { strokeColor: '#488FCC', strokeOpacity: 0.8, strokeWeight: 6 }
  poly: any = new google.maps.Polyline(this.polyOptions);
  private sub: Subscription;
  @ViewChild('mapDiv') gmapElement: any;

  map: google.maps.Map;
  trackerList: any = [];
  selectedTracker: any;
  tripStartDate: any;
  response: any;
  markers: any = [];
  markerArray: any = [];
  markersArray: any = [];
  PolyArray: any = [];
  polyline: any;
  timer
  isPlayClicked: boolean = false;
  trackerName: any;
  trackerType: any;
  deviceNo: any;
  previousPoint: any;
  Polypath: any;
  requestedObj = {};
  [x: string]: any;
  isfirstCall: boolean = true;
  nrSelect: any = null;
  selectedTime: any = 10;
  LatestData: any;
  IgsStaus: string;
  SuportDataForVehicle: any;
  isShowRecordPeople: boolean = false;
  isShowListIcon: boolean = false;

  liveTrackObj = new TrackingItems();
  peopleListData: any = [];

  ignitionImageOff = "./assets/Images/IgnitionOff.svg";
  gpsImageOff = "./assets/Images/GpsOff.svg";
  ignitionImageOn = "./assets/Images/IgnitionOn.svg";
  gpsImageOn = "./assets/Images/GpsOn.svg";
  PeopleImageUrl = "./assets/Images/PeopleImg.svg";

  ignitionImage: any;
  gpsImage: any;
  sltShape: any;
  isTrack: boolean = true;

  loadScripts() {
    ////
    const dynamicScripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/marker-animate-unobtrusive/0.2.8/vendor/markerAnimate.js"
      , "https://cdnjs.cloudflare.com/ajax/libs/marker-animate-unobtrusive/0.2.8/SlidingMarker.min.js"
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  changeTracker(event: any) {
    if (event == undefined) {
      this.isShowListIcon = false;
      this.isShowRecordPeople = false;
      this.refreshMap();
      this._route.queryParams.subscribe((params) => {
        if (params["TrackerNo"] != null) {
          window.location.href = "#/pages/tracking/LiveTrack";
        }
      });
    }
    else {
      this._route.queryParams.subscribe((params) => {
        if (params["TrackerNo"] != null) {
          window.location.href = "#/pages/tracking/LiveTrack";
        }
      });
      this.isShowListIcon = false;
      this.isShowRecordPeople = false;
      this.refreshMap();

    }
    var lat = this._commonService.getDefaultLat();
    var lng = this._commonService.getDefaultLng();
    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lng));
    this.map.setCenter(centerLatLng);
    this.map.setZoom(12)
  }

  ngOnInit() {


    var lat = this._commonService.getDefaultLat();
    var lng = this._commonService.getDefaultLng();

    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lng));//new google.maps.LatLng(22.470701, 70.057732);
    var mapProp = {
      center: centerLatLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.LatestData = {};
    this.liveTrackObj.userId = sessionStorage.getItem("LOGINUSERID");
    this.liveTrackObj.userType = sessionStorage.getItem("USER_TYPE");
    this._LiveTrackService.getUserDevices(this.liveTrackObj).subscribe(
      result => {
        this.peopleListData = result;
        this.peopleListData = this.peopleListData.userPPLAssets;
        sessionStorage.setItem("ASSETS_TYPES_PEOPLE", JSON.stringify(this.peopleListData));
        this.peopleTrackData();
      }, error => {
        // this._toastr.warning(error.error.Message);
      })

    this.loadGeofences();

  }
  clearSelection(drawingManager: any, selectedShape: any) {
    this.loadGeofences();
    drawingManager.setOptions({
      drawingControl: true
    });
    if (selectedShape) {
      selectedShape.setMap(null);
    }
  }
  loadGeofences() {


    if (this.sltShape != null) {
      this.sltShape.setMap(null);
    }

    this.clearMap();

    var ClientID = this._commonService.getClientID();

    this._geofenceService.GetGeofences(ClientID)
      .subscribe(res => {

        //alert('Hi');
        this.resultList = res;

        if (this.resultList.status == "001") {


          this.grofenceList = this.resultList.geofence;
          this.polygonList = this.resultList.polygon;

          this.isRecordsCount = false;
          this.isGeofencesCount = false;
          this.isPolygonsCount = false;
          this.isNoRecords = false;



          if (this.grofenceList[0].geofenceName != "") {
            this.isGeofencesCount = true;
          }

          if (this.polygonList[0].geofenceName != "") {
            this.isPolygonsCount = true;
          }

          if (this.isGeofencesCount || this.isPolygonsCount) {
            this.isRecordsCount = true;
            this.isNoRecords = false;
          }
          else {
            this.isRecordsCount = false;
            this.isNoRecords = true;
          }



          // alert(this.isGeofencesCount);
          // alert(this.isPolygonsCount);
          // alert( this.isRecordsCount);
          // alert(this.isNoRecords);
          this.grofenceList1 = this.resultList.geofence;
          this.polygonList1 = this.resultList.polygon;
          // this.searchValue.nativeElement.value = "";


          this.resultList.geofence.forEach(element => {
            this.AddCircle(new google.maps.LatLng(element.latitude, element.longitude), element.geofenceName, Number(element.radius), element.geofenceID);
          });

          this.resultList.polygon.forEach(element => {
            var geoName = element.geofenceName;
            var geoId = element.geofenceID;

            var geoColor = "#3598DC";

            var commanarray = new Array()
            {
              element.latLongs.forEach(childelement => {


                var latLngPoly = new google.maps.LatLng(childelement.lat, childelement.lng);
                commanarray.push(latLngPoly);

              });

              this.polygon(commanarray, geoName, geoColor, geoId)
            }

          });
        }

      });
  }

  polygon(Polygonarray: any, gbname: string, gbcolor: string, gbID: any) {

    var gbcolorvalue = gbcolor;

    var flightPath = new google.maps.Polygon({
      paths: Polygonarray,
      strokeColor: gbcolorvalue,
      //strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: gbcolorvalue,
      //fillOpacity: 0.25,
      map: this.map
    });

    flightPath.setMap(this.map);

    // var listner = google.maps.event.addListener(flightPath, 'click', showArrays);
    //var listner = google.maps.event.addListener(flightPath, 'mouseout', mouseoutpolygon);

    this.polygnPathArray.push({ "geoMap": flightPath, "geoID": gbID });

    var font = this.ReturnFontSize();

    var mapLabel = new MapLabel({
      text: gbname,
      position: Polygonarray[0],
      fontSize: font,
      strokeWeight: 5,
      fontColor: '#6200EA',
      align: 'center',
      map: this.map
    });


    mapLabel.setMap(this.map);
    this.mapLabelArray.push(mapLabel);
    //infowindow = new google.maps.InfoWindow();
    //function mouseoutpolygon() {
    //    infowindow.open(null);
    //}
  }
  clearMap() {
    if (this.circleArray.length > 0) {
      for (var i: any = 0; i < this.circleArray.length; i++) {
        this.circleArray[i].geoMap.setMap(null);
      }
      this.circleArray = [];
    }

    if (this.polygnPathArray.length > 0) {
      for (var i: any = 0; i < this.polygnPathArray.length; i++) {
        this.polygnPathArray[i].geoMap.setMap(null);
      }
      this.polygnPathArray = [];
    }
    if (this.mapLabelArray.length > 0) {
      for (var i: any = 0; i < this.mapLabelArray.length; i++) {
        this.mapLabelArray[i].setMap(null);
      }
      this.mapLabelArray = [];
    }
  }

  AddCircle(latLng: any, gname: any, radius: any, geoID: any) {

    var CircleOptions = {
      strokeColor: "#3598DC",
      fillColor: "#3598DC",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillOpacity: 0.35,
      clickable: true,
      map: this.map,
      clickble: false,
      editable: false,
      center: latLng,
      title: gname,
      radius: parseFloat(radius)
    };

    var Drawcircle = new google.maps.Circle(CircleOptions);
    this.circleArray.push({ "geoMap": Drawcircle, "geoID": geoID });
    Drawcircle.setMap(this.map);


    var font = this.ReturnFontSize();
    var mapLabel = new MapLabel(
      {
        text: gname,
        position: latLng,
        fontSize: font,
        strokeWeight: 5,
        fontColor: '#6200EA',
        align: 'center',
        map: this.map
      });
    mapLabel.setMap(this.map);
    this.mapLabelArray.push(mapLabel);
  }

  ReturnFontSize() {

    var zoom = this.map.getZoom();
    if (zoom <= 5) {
      this.font = 7;
    }
    else if (zoom > 5 && zoom <= 10) {
      this.font = 9;
    }
    else if (zoom > 10 && zoom <= 15) {
      this.font = 13;
    }

    else {
      this.font = 15;
    }
    return this.font;
  }


  peopleTrackData() {
    this.trackerList = [];
    this.trackerList = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_PEOPLE"));
    this._route.queryParams.subscribe((params) => {
      if (params["TrackerNo"] != null) {
        this.nrSelect = params["TrackerNo"];
        this.LivePath(this.nrSelect);
      }
    });
  }
  Generate(newLiveFrm: any) {
    this.refreshMap();
    if (newLiveFrm.ddTracker !== undefined && newLiveFrm.ddTracker != null) {
      this.deviceNo = newLiveFrm.ddTracker;
      this.LivePath(this.deviceNo);

    }
    else {
      if (newLiveFrm.ddTracker == null || newLiveFrm.ddTracker == undefined) {
        this._toastr.warning("Please select Tracker");
      }
    }
  }

  LivePath(deviceNo: any) {

    var obj = (this.trackerList.filter(x => x.deviceNo == deviceNo));
    this.trackertype = obj[0].assetType;
    this.trackerName = obj[0].assetNo;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    var currentDate = new Date(yyyy + "-" + mm + "-" + dd);
    var date = currentDate.valueOf();

    // this.requestedObj = {
    //   "divType": "JioPhone,",
    //   "IMEI": "911510857771394,",
    //   "efd": date
    // };


    this.requestedObj = {
      "divType": this.trackertype + ",",
      "IMEI": deviceNo + ",",
      "efd": date
    };

    this.Time = Number(this.selectedTime) * 1000;
    this.timer = Observable.timer(0, Number(this.Time));
    this.sub = this.timer.subscribe(N => this.addLatLong());
  }

  selectChangeHandler(event: any) {
    this.selectedTime = event.target.value;
    if (this.selectedTime == "00") {
      this.isTrack = false;
      this.sub.unsubscribe();
    }
    else {
      this.isTrack = true;
      this.sub.unsubscribe();
      if (this.trackerName != "") {
        this.Time = Number(this.selectedTime) * 1000;
        this.timer = Observable.timer(0, Number(this.Time));
        this.sub = this.timer.subscribe(N => this.addLatLong());
      }

    }
  }

  addLatLong() {

    this._LiveTrackService.getTrackerLiveData(this.requestedObj).subscribe(result => {
      this.response = result;
      if (this.response.sts == "200" && this.response.evd.length > 0) {
        // if (this.response.evd.length > 0) {

        if (Number(this.response.evd[0].lat) != 0 && Number(this.response.evd[0].lon) != 0) {

          try {
            // this.tms = datePipe.transform(this.response.evd[0].tms1, 'dd/MM/yyyy hh:mm:ss a');
            this.tms = this._commonService.DateConvert(this.response.evd[0].tms1);
            this.response.evd[0].igs = this.response.evd[0].igs == "1" ? "ON" : "OFF";
            this.response.evd[0].pos = this.response.evd[0].pos == "A" || this.response.evd[0].pos == "1" ? "ON" : "OFF";

            this.LatestData = this.response.evd[0];
            this.ignitionImage = this.response.evd[0].igs == "ON" ? this.ignitionImageOn : this.ignitionImageOff;
            this.gpsImage = this.response.evd[0].pos == "ON" ? this.gpsImageOn : this.gpsImageOff;
          } catch (e) {
            e = null;
          }

          var point = new google.maps.LatLng(Number(this.response.evd[0].lat), Number(this.response.evd[0].lon));
          this.map.panTo(point);

          if (this.isfirstCall) {
            this.previousPoint = point;
            this.isfirstCall = true;
            this.isShowListIcon = true;
          }
          //
          var heading = google.maps.geometry.spherical.computeHeading(this.previousPoint, point);

          var imgPath = '';

          var offSet = '';

          var strdata = '<div id="iw-container">' +
            '<div class="iw-title">' + this.trackerName + '</div>' +
            '<div class="iw-content">' +
            '<table><tr><td style="cursor:pointer;vertical-align: top;padding:5px;">' +
            '<img src="./assets/Images/Map.svg"  title="Location"/>' +
            '</td><td>' + this.response.evd[0].loc + '</td></tr>' +
            '<tr><td>' +
            '<img src="./assets/Images/timer.svg" style="cursor:pointer;vertical-align: top;padding:5px;" title="Time"/>' +
            '</td><td>' + this.tms + '</td></tr>' +
            '<tr><td>' +
            '<img src="' + this.gpsImage + '" style="cursor:pointer;vertical-align: top;padding:5px;" title="GPS"/>' +
            '</td><td>' + this.response.evd[0].pos + '</td></tr></table>' +
            '</div>' +
            '<div class="iw-bottom-gradient" style="display:none"></div>' +
            '</div>';

          imgPath = "M23,0C10.297,0,0,10.298,0,23s10.297,23,23,23c12.702,0,23-10.298,23-23S35.702,0,23,0z M23,42C12.507,42,4,33.493,4,23     S12.507,4,23,4s19,8.507,19,19S33.493,42,23,42z M23,16c-3.866,0-7,3.134-7,7s3.134,7,7,7s7-3.134,7-7S26.866,16,23,16z";
          offSet = '5%';

          var circleImg = "M10.577462,0C11.476438,0,12.475451,1.0989916,13.174417,3.2959987L14.372402,7.0909559C15.771373,11.485916,18.16838,18.676877,19.566373,23.171843L20.765334,26.96683C22.163329,31.36179 20.565326,33.159783 17.169368,30.961798 13.873384,28.764823 10.976444,26.96683 10.877446,26.96683 10.777472,26.96683 7.780496,28.764823 4.2855405,31.061804 0.78954698,33.259789 -0.90843194,31.461796 0.48956246,27.066836L1.6885238,23.271847C3.0865182,18.876889,5.4835247,11.685927,6.8824958,7.1909615L8.0804809,3.3959733C8.779447,1.0989916,9.6784853,0,10.577462,0z";

          var imageArrow = {
            path: circleImg,
            scale: .5,
            strokeColor: 'white',
            strokeWeight: 2,
            fillOpacity: 0.4,
            fillColor: '#488FCC',
            offset: '5%',
            rotation: Number(heading),
            anchor: new google.maps.Point(10, 25)
          };

          this.Polypath = this.poly.getPath();
          this.Polypath.push(this.previousPoint);

          //this.deleteOverlays();

          var markerCircle;

          // var mapProp = {
          //   center: point,
          //   zoom: 18,
          //   mapTypeId: google.maps.MapTypeId.SATELLITE,
          //   mapTypeControl: true
          // };
          // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

          markerCircle = new google.maps.Marker({
            position: this.previousPoint,
            icon: imageArrow,
            title: this.trackerName,
            zIndex: 1,
            map: this.map
          });


          this.imageIcon = {
            path: imgPath,
            scale: .58,
            strokeColor: 'white',
            strokeWeight: .20,
            fillOpacity: 1,
            fillColor: '#006DF0',
            offset: offSet,
            rotation: Number(heading),
            anchor: new google.maps.Point(10, 25)
          };

          if (this.isfirstCall) {
            this.isfirstCall = false;
            this.marker = new google.maps.Marker({
              position: point,
              icon: this.imageIcon, title: this.trackerName, map: this.map, zIndex: 3
            });
            this.map.setZoom(17);
          }
          this.attachMarker(this.marker, strdata, this);
          this.marker.setOptions({ icon: this.imageIcon });

          //var marker: any;

          // marker = new SlidingMarker({
          //   position: this.previousPoint,
          //   map: this.map,
          //   title: this.trackerName,
          //   icon: this.imageIcon,
          //   zIndex: 2,
          //   optimized: false
          // });


          //this.markerArray.push(marker);
          //this.attachMarker(marker, strdata);
          this.closeinfowindow();
          this.markersArray.push(markerCircle);
          this.attachMarker(markerCircle, strdata, this);


          this.poly.setMap(this.map);
          this.PolyArray.push(this.poly);
          this.AnimatedMove(this.marker, .5, this.marker.position, point, heading);
          //
          // marker.setDuration(3000);
          // marker.setEasing('linear');
          // marker.setPosition(point);

          this.previousPoint = point;
        }
        // }
        // else {
        //   this._toastr.warning("Last known location not available for tracker: " + this.trackerName, '', { timeOut: 1000 })
        // }
      }
      else {
        this._toastr.warning("Last known location not available for tracker: " + this.trackerName, '', { timeOut: 1000 })

      }
    }, error => {
      //this._toastr.warning(error.error.Message)
    });

  }
  AnimatedMove(marker, t, current, moveto, heading) {

    var deltalat = (moveto.lat() - current.lat()) / 100;
    var deltalng = (moveto.lng() - current.lng()) / 100;

    var delay = 20 * t;
    for (var i = 0; i < 100; i++) {
      (function (ind) {

        setTimeout(
          function () {
            var lat = marker.position.lat();
            var lng = marker.position.lng();
            lat += deltalat;
            lng += deltalng;
            var latlng = new google.maps.LatLng(lat, lng);
            marker.setPosition(latlng);
            marker.setro
          }, delay * ind
        );
      })(i)
    }
  }
  closeinfowindow() {
    if (this.infoarray.length > 0) {
      for (var j = 0; j < this.infoarray.length; j++) {
        this.infoarray[j].open(null);
      }
      this.infoarray.length = 0;
    }
  }
  infoarray: any = [];
  attachMarker(marker, indx, that) {
    var infowindow = new google.maps.InfoWindow(
      {
        content: indx,
        // size: new google.maps.Size(50, 50)
      });

    google.maps.event.addListener(marker, 'click', function () {
      // //
      that.closeinfowindow();
      infowindow.open(this.map, marker);
      that.infoarray.push(infowindow); //Commented By Naresh k
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
        background: 'white',
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
  }

  ShowSideDiv() {
    if (this.isShowRecordPeople) {
      this.isShowRecordPeople = false;
    } else {
      this.isShowRecordPeople = true;
    }

  }


  deleteOverlays() {
    ////
    if (this.markerArray) {
      for (var i = 0; i < this.markerArray.length; i++) {
        this.markerArray[i].setMap(null);
      }
      this.markerArray.length = 0;
    }
  }


  refreshMap() {
    this.trackerName = "";
    this.LatestData = {};
    this.SuportDataForVehicle = [];
    this.isfirstCall = true;
    this.isShowRecordPeople = false;
    this.requestedObj = {};
    this.poly = new google.maps.Polyline(this.polyOptions);

    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }

    // ////
    if (this.markerArray) {
      for (var i = 0; i < this.markerArray.length; i++) {
        this.markerArray[i].setMap(null);
      }
      this.markerArray.length = 0;
    }
    if (this.marker) {
      // for (var i = 0; i < this.marker.length; i++) {
      this.marker.setMap(null);
      // }
      // this.marker.length = 0;
    }

    if (this.markersArray) {
      for (var i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray.length = 0;
    }

    if (this.PolyArray != undefined) {

      for (let index = 0; index < this.PolyArray.length; index++) {
        this.PolyArray[index].setMap(null);
      }
      this.PolyArray.length = 0;
    }

    if (this.polyline !== undefined) {

      this.polyline.setMap(null);

      for (let index = 0; index < this.markers.length; index++) {
        this.markers[index].setMap(null);
      }
    }
    this.isPlayClicked = false;
  }

  ngOnDestroy() {
    if (this.sub != undefined) {
      this.sub.unsubscribe();
    }
  }

}

interface imageIcon {
  path: string,
  scale: any,
  strokeColor: string,
  strokeWeight: any,
  fillOpacity: number,
  fillColor: string,
  offset: string,
  rotation: number,
  anchor: any
}

export class TrackingItems {
  Id: String;
  TrackingType: String;
  public userId: string;
  public userType: string;

}
