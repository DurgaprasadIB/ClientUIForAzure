import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../services/tracking.service';
import { LoaderService } from 'src/app/services/loader.service';

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';

@Component({
  selector: 'app-tracker-insights',
  templateUrl: './tracker-insights.component.html',
  styleUrls: ['./tracker-insights.component.css']
})

export class TrackerInsightsComponent implements OnInit, OnDestroy {

  constructor(
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService
  ) {

  }

  trackerInsightsobj = new TrackerInsights();

  peopleListData: any = [];
  dataset: any[] = [];
  supportDataset: any = [];
  processing = true;
  status = { text: 'processing...', class: 'alert alert-danger' };

  isPeopleMoving: boolean;
  isNoPollingPeople: boolean;
  isPeopleStationary: boolean;
  isPeopleAll: boolean;
  selectedTime: string = '';

  private timer;
  private sub: Subscription;

  sessionData: any = [];
  sessionIMEIList: any = [];
  sessionDeviceTypeList: any = [];
  supportingList: any = [];
  curenntDate: any

  //For People
  peopleMovingArray: any = [];
  peopleStationaryArray: any = [];
  peopleNoPolingArray: any = [];
  isTimer: boolean;

  //For Index and Count
  peopleMovingCntindex: number = 0;
  peopleStationaryCntindex: number = 0;
  peopleNoPollingCntindex = 0;
  peopleAllCntindex: number = 0;

  //Hour Time
  hourorMin: Number;
  calspd: Number;
  defaultHoursorMintsofNopolling: Number;

  pagLst: any = [];

  MovingImageUrl = "./assets/Images/PeopleImg.svg";
  NoPollingImageUrl = "./assets/Images/PeopleNoPolling.svg";
  StationaryImageUrl = "./assets/Images/PeopleStationary.svg";

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

    this.updatePeopleData();
    this.timerTick();
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  timerTick() {
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
      this.onLoadTrackerInsightsPeopleData();
    }
  }


  updatePeopleData() {

    this.trackerInsightsobj.userId = sessionStorage.getItem("LOGINUSERID");
    this.trackerInsightsobj.userType = sessionStorage.getItem("USER_TYPE");
    this._trackingService.getUserDevices(this.trackerInsightsobj).subscribe(
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
        }
        sessionStorage.setItem("PEOPLE_TOTALDATA", JSON.stringify(this.supportingList));
      });
  }

  onLoadTrackerInsightsPeopleData() {
    this.displaySpinner(true);
    this.trackerInsightsobj = this.getPeopleSessionData();
    this._trackingService.getTrackerLiveData(this.trackerInsightsobj).subscribe(result => {
      this.pagLst = [];
      this.pagLst = result;
      this.pagLst = this.pagLst.evd == null ? [] : this.pagLst.evd;
      this.PeopleTableData();
    }, error => {
      this.displaySpinner(false);
      this._toaster.warning(error.error.Message);
    })
  }

  getPeopleSessionData() {
    this.sessionDeviceTypeList = [];
    this.sessionIMEIList = [];
    this.sessionData = [];
    this.sessionData = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_PEOPLE"));
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

  PeopleTableData() {

    this.dataset = [];
    this.peopleMovingArray = [];
    this.peopleStationaryArray = [];
    this.peopleNoPolingArray = [];

    //For Index
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

            var latlng = new google.maps.LatLng(this.pagLst[i].lat, this.pagLst[i].lon);
            var hours = this._commanService.CalculateTimeStamp(hourDifference); //hourDifference / 1000 / 3600;

            vehicleDataList[j].imi = Number(this.pagLst[i].imi);
            vehicleDataList[j].dvt = vehicleDataList[j].dvt;
            vehicleDataList[j].spd = this.pagLst[i].spd;
            vehicleDataList[j].LatLng = latlng;
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
          pos: "",//result[k].pos,
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
        LatLng: result[k].LatLng,//result[k].hours > this.hourorMin?"": result[k].LatLng,
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
      this.dataset = this.peopleMovingArray
    }
    //Stationary
    else if (this.isPeopleStationary) {
      this.dataset = this.peopleStationaryArray
    }
    //NoPolling
    else if (this.isNoPollingPeople) {
      this.dataset = this.peopleNoPolingArray
    }
    //All
    else {
      this.dataset = this.supportDataset;
    }

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

// DefaultSpeed: 5
// DefaultTimeInMnts: 720
// LatLng: ""
// dvt: "pass"
// hours: 721
// id: 123888888888888
// imi: "123888888888888"
// isChecked: false
// pos: ""
// spd: "0"
// tms: ""

    var data = [];
    ds.forEach(element => {
      data.push([
        element.dvt,
        PeopleStatus(element),
        gpsFormatter(element.pos),
        element.tms,
        redirectToLiveMap(element)
      ])
    });

    var table = $('#ppleSumTable').DataTable({
      "order": [], "sort": [],
      'columnDefs': [{
        'targets': [1,2, 4], /* column index */
        'orderable': false, /* true or false */

      }]
    });

    table.clear().rows.add(data).draw()

    if (this.SearchInputValue != "") {
      table.search(this.SearchInputValue).draw();
    }

    this._loaderService.display(false);
  }

  onPeopleMovingVehicles() {

    this.isPeopleMoving = true;
    this.isPeopleStationary = false
    this.isPeopleAll = false
    this.isNoPollingPeople = false;
    this.dataset = [];
    this.dataset = this.peopleMovingArray;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onPeopleStationaryVehicles() {
    this.isPeopleMoving = false;
    this.isPeopleStationary = true
    this.isPeopleAll = false;
    this.isNoPollingPeople = false;
    this.dataset = [];
    this.dataset = this.peopleStationaryArray;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onNoPollingPeople() {

    this.isNoPollingPeople = true;
    this.isPeopleMoving = false;
    this.isPeopleStationary = false;
    this.isPeopleAll = false;
    this.dataset = [];
    this.dataset = this.peopleNoPolingArray;
    this.SearchInputValue = "";
    this.BindTableData(this.dataset);
  }

  onPeopleAllVehicles() {
    this.isPeopleMoving = false;
    this.isPeopleStationary = false
    this.isNoPollingPeople = false;
    this.isPeopleAll = true
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

    this.onLoadTrackerInsightsPeopleData();
  }

  ngOnDestroy() {
    if (this.sub != undefined) {
      this.sub.unsubscribe();
    }
  }
}

function redirectToLiveMap(dataContext) {
  return dataContext.hours < dataContext.DefaultTimeInMnts ? ` <a href="/Navnext/#/pages/tracking/LiveTrack?TrackerNo=${dataContext.imi}"> <img src="./assets/Images/Map.svg"  title='Redirect to Live Track' height='20' width='20'></a>` : ""

}

function gpsFormatter(pos) {
  return pos == "A" || pos == "1" ? `<img src="./assets/Images/GpsOn.svg" title="Gps On" style="cursor:pointer" alt="Trulli" width="20" height="20">` : `<img src="./assets/Images/GpsOff.svg" title="Gps Off" style="cursor:pointer" alt="Trulli" width="20" height="20">`
}

function PeopleStatus(dataContext) {
  var imgeUrl = "";
  var MovingImageUrl = "./assets/Images/PeopleImg.svg";
  var NoPollingImageUrl = "./assets/Images/PeopleNoPolling.svg";
  var StationaryImageUrl = "./assets/Images/PeopleStationary.svg";
  var speed = Number(dataContext.spd)

  //NoPolling 
  if (dataContext.hours >= dataContext.DefaultTimeInMnts) {
    imgeUrl = NoPollingImageUrl;
  }
  //Moving
  else if (speed > 0) {
    imgeUrl = MovingImageUrl;
  }
  //Stationary
  else if (speed <= 0) {
    imgeUrl = StationaryImageUrl;
  }

  return `<img src='${imgeUrl}' title="" style="cursor:pointer;margin-top:3px" alt="Trulli" width="25" height="25">`

}

export class TrackerInsights {

  public tkn: string;
  public evnt: string;
  public divType: string;
  public IMEI: string;
  public userId: string;
  public userType: string;

}
