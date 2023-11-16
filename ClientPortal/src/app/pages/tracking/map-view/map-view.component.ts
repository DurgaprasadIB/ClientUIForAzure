import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs/Rx';
import { TrackingService } from '../services/tracking.service';

import MarkerClusterer from '@google/markerclusterer'

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  @ViewChild('mapDiv') gmapElement: any;

  map: google.maps.Map;
  peopleListData: any = [];
  newCheckboxAryLst: any[];

  constructor(
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService
  ) { }

  dataset: any[] = [];
  supportDataset: any = [];

  isPeopleMoving: boolean;
  isPeopleStationary: boolean;
  isPeopleAll: boolean;
  isNoPollingPeople: boolean;

  isTimer: boolean;

  selectedTime: string = '';
  private timer;
  private sub: Subscription;

  supportingList: any = [];
  peopleMovingArray: any = [];
  peopleStationaryArray: any = [];
  peopleNoPolingArray: any = [];

  //For Index and Count
  peopleMovingCntindex: number = 0;
  peopleStationaryCntindex: number = 0;
  peopleNoPollingCntindex = 0;
  peopleAllCntindex: number = 0;

  sessionData: any = [];
  sessionIMEIList: any = [];
  sessionDeviceTypeList: any = [];
  markerCluster: any;
  markersArray: any;
  mapViewObj = new MapView();
  imagePathUrl: string;
  PeopleImageUrl: string;

  //for checkbox filter
  isShowAllStatus: boolean;
  isShowStatus: boolean;
  checkBoxListArray: any = [];
  checkedListArray: any = [];
  updatedCheckedList: any = [];

  //Hour Time
  hourorMin: Number;
  calspd: Number;
  defaultHoursorMintsofNopolling: Number;

  pagLst: any = [];
  processing = true;
  status = { text: 'processing...', class: 'alert alert-danger' };
  SearchInputValue: string = "";

  ngOnInit() {

    this.hourorMin = this._commanService.NOPOLLINGHOURSTIME; //24; for no polling time
    this.calspd = this._commanService.VEHICLESPEEDLIMIT; //5; for vehicle speed
    this.defaultHoursorMintsofNopolling = this._commanService.DEFAULTNOPOLLINGTIME; //For Default No Polling Time

    this.isTimer = false;
    this.isPeopleMoving = false;
    this.isPeopleStationary = false;
    this.isNoPollingPeople = false;
    this.isPeopleAll = true;
    this.imagePathUrl = "./assets/Images/stop.png";
    this.PeopleImageUrl = "./assets/Images/MobilePhone.svg";

    // this.updatePeopleData();
    // this.TimerTick();

    debugger
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



  }



  TimerTick() {
    const nameInput = document.getElementById('ddlTimer') as HTMLInputElement;
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


  updatePeopleData() {

    this.mapViewObj.userId = sessionStorage.getItem("LOGINUSERID");
    this.mapViewObj.userType = sessionStorage.getItem("USER_TYPE");
    this._trackingService.getUserDevices(this.mapViewObj).subscribe(
      result => {
        this.peopleListData = result;
        this.peopleListData = this.peopleListData.userPPLAssets;
        sessionStorage.setItem("ASSETS_TYPES_PEOPLE", JSON.stringify(this.peopleListData));

        for (let i = 0; i < this.peopleListData.length; i++) {
          this.supportingList[i] = {
            id: this.peopleListData[i].deviceNo,
            imi: this.peopleListData[i].deviceNo,
            dvt: this.peopleListData[i].assetNo,
            tms: "",
            LatLng: "",
            isChecked: false,
            pos: "",
            spd: "",
            hours: this.defaultHoursorMintsofNopolling,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd
          }
          sessionStorage.setItem("PEOPLE_TOTALDATA", JSON.stringify(this.supportingList));
        }
      });

  }

  onLoadMapViewData() {
    this.mapViewObj = this.getPeopleSessionData();
    this._trackingService.getTrackerLiveData(this.mapViewObj).subscribe(result => {
      this.pagLst = [];
      this.pagLst = result;
      this.pagLst = this.pagLst.evd == null ? [] : this.pagLst.evd;
      this.PeopleTableData();
    }, error => {
    })
  }

  getPeopleSessionData() {
    this.sessionDeviceTypeList = [];
    this.sessionIMEIList = [];
    this.sessionData = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_PEOPLE"));
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

  PeopleTableData() {
    //debugger
    this.dataset = [];
    this.supportDataset = [];
    this.peopleMovingArray = [];
    this.peopleStationaryArray = [];
    this.peopleNoPolingArray = [];

    //For Index and Count
    this.peopleAllCntindex = 0;
    this.peopleMovingCntindex = 0;
    this.peopleStationaryCntindex = 0;
    this.peopleNoPollingCntindex = 0;

    this.sessionData;

    var vehicleDataList = JSON.parse(sessionStorage.getItem("PEOPLE_TOTALDATA"));
    for (let j = 0; j < vehicleDataList.length; j++) {
      for (let i = 0; i < this.pagLst.length; i++) {
        if (this.pagLst[i].imi == vehicleDataList[j].imi) {
          if (Number(this.pagLst[i].lat) != 0 && Number(this.pagLst[i].lon) != 0) {
            var responseDate = this._commanService.epochUTCtoDateWithTimeZone(Number(this.pagLst[i].epochTms), this.pagLst[i].imi)
            var curenntDate = new Date();
            var hourDifference = Math.abs(responseDate.getTime() - curenntDate.getTime());
            //var hours = hourDifference / 1000 / 3600;
            var latlng = new google.maps.LatLng(this.pagLst[i].lat, this.pagLst[i].lon);
            var hours = this._commanService.CalculateTimeStamp(hourDifference); //hourDifference / 1000 / 3600;

            vehicleDataList[j].imi = Number(this.pagLst[i].imi);
            vehicleDataList[j].dvt = vehicleDataList[j].dvt;
            vehicleDataList[j].spd = this.pagLst[i].spd;
            vehicleDataList[j].LatLng = latlng;
            //  vehicleDataList[j].tms = datePipe.transform(this.pagLst[i].tms1,  'dd/MM/yyyy hh:mm:ss a');//this.pagLst[i].tms,
            vehicleDataList[j].tms = this._commanService.DateConvert(this.pagLst[i].tms1);
            vehicleDataList[j].isChecked = false;
            vehicleDataList[j].pos = this.pagLst[i].pos;
            vehicleDataList[j].hours = hours;
            vehicleDataList[j].DefaultTimeInMnts = this.hourorMin;
            vehicleDataList[j].DefaultSpeed = this.calspd;
          }
        }
      }//Inner For Loop
    }//Main For Loop

    this.checkBoxListArray = [];
    sessionStorage.setItem("PEOPLE_TOTALDATA", JSON.stringify(vehicleDataList));
    var result = vehicleDataList;
    this.supportingList = [];

    //For Table
    for (let k = 0; k < result.length; k++) {

      //NoPolling
      if (result[k].hours >= this.hourorMin) {
        this.peopleNoPolingArray[this.peopleNoPollingCntindex] = {
          id: Number(result[k].imi), // again VERY IMPORTANT to fill the "id" with unique values
          dvt: result[k].dvt,
          imi: result[k].imi,
          tms: result[k].tms,
          spd: "0", //result[k].spd,
          LatLng: result[k].LatLng,
          isChecked: false,
          pos: "", //result[k].pos,
          hours: result[k].hours,
          DefaultTimeInMnts: this.hourorMin,
          DefaultSpeed: this.calspd
        }
        this.peopleNoPollingCntindex++;
      }
      //Moving 
      else if (Number(result[k].spd) > 0 && result[k].hours < this.hourorMin) {
        this.peopleMovingArray[this.peopleMovingCntindex] = {
          id: Number(result[k].imi), // again VERY IMPORTANT to fill the "id" with unique values
          dvt: result[k].dvt,
          imi: result[k].imi,
          tms: result[k].tms,
          spd: result[k].spd,
          LatLng: result[k].LatLng,
          isChecked: false,
          pos: result[k].pos,
          hours: result[k].hours,
          DefaultTimeInMnts: this.hourorMin,
          DefaultSpeed: this.calspd
        }
        this.peopleMovingCntindex++;
      }
      //Stationary
      else if (Number(result[k].spd) <= 0 && result[k].hours < this.hourorMin) {
        this.peopleStationaryArray[this.peopleStationaryCntindex] = {
          id: Number(result[k].imi), // again VERY IMPORTANT to fill the "id" with unique values
          dvt: result[k].dvt,
          imi: result[k].imi,
          tms: result[k].tms,
          spd: result[k].spd,
          LatLng: result[k].LatLng,
          isChecked: false,
          pos: result[k].pos,
          hours: result[k].hours,
          DefaultTimeInMnts: this.hourorMin,
          DefaultSpeed: this.calspd
        }
        this.peopleStationaryCntindex++;
      }


      this.dataset[this.peopleAllCntindex] = {
        id: Number(result[k].imi), // again VERY IMPORTANT to fill the "id" with unique values
        dvt: result[k].dvt,
        imi: result[k].imi,
        tms: result[k].tms,
        spd: result[k].hours > this.hourorMin ? "0" : result[k].spd,
        LatLng: result[k].LatLng,
        isChecked: false,
        pos: result[k].hours > this.hourorMin ? "" : result[k].pos,
        hours: result[k].hours,
        DefaultTimeInMnts: this.hourorMin,
        DefaultSpeed: this.calspd
      };
      this.peopleAllCntindex++;
    }


    this.supportDataset = this.dataset;
    //Moving
    if (this.isPeopleMoving) {
      this.dataset = [];
      if (this.checkedListArray.length > 0 && this.peopleMovingArray.length > 0) {
        this.checkedListArray.forEach(element => {
          this.supportDataset.forEach(ele => {
            if (element.imi == ele.imi) {
              element.id = ele.id,
                element.dvt = ele.dvt,
                element.imi = ele.imi,
                element.spd = ele.spd,
                element.pos = ele.pos,
                element.hours = ele.hours,
                element.tms = ele.tms,
                element.LatLng = ele.LatLng,
                element.DefaultTimeInMnts = this.hourorMin,
                element.DefaultSpeed = this.calspd
              this.dataset.push(element);
            }
          });
        });
        this.AddMarkersToMap(this.dataset);
      }
      else {
        this.dataset = this.peopleMovingArray;
        this.AddMarkersToMap(this.peopleMovingArray);
      }
    }
    //Stationary
    else if (this.isPeopleStationary) {
      this.dataset = [];
      if (this.checkedListArray.length > 0 && this.peopleStationaryArray.length > 0) {
        this.checkedListArray.forEach(element => {
          this.supportDataset.forEach(ele => {
            if (element.imi == ele.imi) {
              element.id = ele.id,
                element.dvt = ele.dvt,
                element.imi = ele.imi,
                element.spd = ele.spd,
                element.pos = ele.pos,
                element.hours = ele.hours,
                element.tms = ele.tms,
                element.LatLng = ele.LatLng,
                element.DefaultTimeInMnts = this.hourorMin,
                element.DefaultSpeed = this.calspd
              this.dataset.push(element);
            }
          });
        });
        this.AddMarkersToMap(this.dataset);
      }
      else {
        this.dataset = this.peopleStationaryArray;
        this.AddMarkersToMap(this.peopleStationaryArray);
      }
    }
    //NoPolling
    else if (this.isNoPollingPeople) {
      this.dataset = [];
      if (this.checkedListArray.length > 0 && this.peopleNoPolingArray.length > 0) {
        this.checkedListArray.forEach(element => {
          this.supportDataset.forEach(ele => {
            if (element.imi == ele.imi) {
              element.id = ele.id,
                element.dvt = ele.dvt,
                element.imi = ele.imi,
                element.spd = "0" //ele.spd,
              element.pos = ""// ele.pos,
              element.hours = ele.hours,
                element.tms = ele.tms,
                element.LatLng = ele.LatLng,
                element.DefaultTimeInMnts = this.hourorMin,
                element.DefaultSpeed = this.calspd
              this.dataset.push(element);
            }
          });
        });
        this.AddMarkersToMap(this.dataset);
      }
      else {
        this.dataset = this.peopleNoPolingArray;
        this.AddMarkersToMap(this.peopleNoPolingArray);
      }
    }
    //All
    else {
      this.dataset = [];
      if (this.checkedListArray.length > 0 && this.supportDataset.length > 0) {
        this.checkedListArray.forEach(element => {
          this.supportDataset.forEach(ele => {
            if (element.imi == ele.imi) {
              element.id = ele.id,
                element.dvt = ele.dvt,
                element.imi = ele.imi,
                element.spd = ele.hours > this.hourorMin ? "" : ele.spd,
                element.pos = ele.hours > this.hourorMin ? "" : ele.pos,
                element.hours = ele.hours,
                element.tms = ele.tms,
                element.LatLng = ele.LatLng,
                element.DefaultTimeInMnts = this.hourorMin,
                element.DefaultSpeed = this.calspd
              this.dataset.push(element);
            }
          });
        });
        this.AddMarkersToMap(this.dataset);
      }
      else {
        this.dataset = this.supportDataset;
        this.AddMarkersToMap(this.supportDataset);
      }
    }

    const nameInput = document.getElementById('jqueryDTSearchInput') as HTMLInputElement;
    if (nameInput != null && nameInput.value != "") {
      this.SearchInputValue = nameInput.value;
    } else {
      this.SearchInputValue = "";
    }

  }



  AddMarkersToMap(arrayList: any) {

    var circleImg = "M10.577462,0C11.476438,0,12.475451,1.0989916,13.174417,3.2959987L14.372402,7.0909559C15.771373,11.485916,18.16838,18.676877,19.566373,23.171843L20.765334,26.96683C22.163329,31.36179 20.565326,33.159783 17.169368,30.961798 13.873384,28.764823 10.976444,26.96683 10.877446,26.96683 10.777472,26.96683 7.780496,28.764823 4.2855405,31.061804 0.78954698,33.259789 -0.90843194,31.461796 0.48956246,27.066836L1.6885238,23.271847C3.0865182,18.876889,5.4835247,11.685927,6.8824958,7.1909615L8.0804809,3.3959733C8.779447,1.0989916,9.6784853,0,10.577462,0z";

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
      if (element.imi != "" && element.tms != "" && element.LatLng != "") {

        if (element.LatLng.lat > 0 && element.LatLng.lng > 0) {
          var latlng = new google.maps.LatLng(Number(element.LatLng.lat), Number(element.LatLng.lng))
          element.LatLng = latlng;
        }
        var imgeUrl = "";
        var MovingImageUrl = "./assets/Images/PeopleImg.svg";
        var NoPollingImageUrl = "./assets/Images/PeopleNoPolling.svg";
        var StationaryImageUrl = "./assets/Images/PeopleStationary.svg";
        var speed = Number(element.spd)

        if (speed > 0) {
          imgeUrl = MovingImageUrl;
        }
        if (speed <= 0) {
          imgeUrl = StationaryImageUrl;
        }
        if (element.hours > this.hourorMin) {
          imgeUrl = NoPollingImageUrl;
        }


        // element.sts = element.tms //datePipe.transform(element.tms, 'dd/MM/yyyy hh:mm a');
        //alert(element.LatLng.lat());
        //var ingn = element.Ignition = true ? 'On' : 'Off';


        var strdata = '<div  id="iw-container">' +
          '<div class="iw-title">' + element.dvt + '</div>' +
          '<div class="iw-content">' +
          '<table><tr><td>' + "Time " + '</td><td>:</td><td>' + element.tms + '</td></tr>' +
          '<tr><td style="vertical-align:top">' + "Location " + '</td><td style="vertical-align:top">:</td><td>' + '<a style="color:blue" href="http://maps.google.com/?q=' + element.LatLng.lat() + ',' + element.LatLng.lng() + '" target="_blank"> View on Google Maps' + '</td></tr>' +
          '<tr><td></td><td></td><td align="left">' + '<a style="color:blue" href="/Navnext/#/pages/tracking/LiveTrack?TrackerNo=' + element.imi + '">' + "Live" + '</a>  | ' +
          ' <a style="color:blue" href="/Navnext/#/pages/tracking/TripHistory?TrackerNo=' + element.imi + '">&nbsp;' + "History" + '</a></td></tr></table>' +
          '</div>' +
          '<div class="iw-bottom-gradient" style="display:none"></div>' +
          '</div>';
        //alert(element.imageUrl);

        if (arrayList.length == 1) {
          this.map.setZoom(17);
          var point = new google.maps.LatLng(Number(element.LatLng.lat()), Number(element.LatLng.lng()));
          this.map.panTo(point);
        }
        else {
          this.map.setZoom(12);
        }


        var marker = new google.maps.Marker(
          {
            position: element.LatLng,
            map: this.map,
            title: element.dvt,
            icon: imgeUrl,
            zIndex: 3
          }
        );
        
        bounds.extend(marker.getPosition());
        this.attachMarker(marker, strdata);
        this.markersArray.push(marker);
        this.map.fitBounds(bounds);
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
    if (this.sub != undefined) {
      this.sub.unsubscribe();
    }
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

 
  onPeopleAllVehicles() {
    this.clearCheckBox();
    this.isPeopleMoving = false;
    this.isPeopleStationary = false
    this.isPeopleAll = true;
    this.isNoPollingPeople = false;
    this.dataset = this.supportDataset;
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

}




export class MapView {
  public tkn: string;
  public evnt: string;
  public divType: string;
  public IMEI: string;
  public userId: string;
  public userType: string;
}
