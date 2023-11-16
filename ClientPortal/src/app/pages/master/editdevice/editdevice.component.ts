import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../../tracking/services/tracking.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../reports/service/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editdevice',
  templateUrl: './editdevice.component.html',
  styleUrls: ['./editdevice.component.css']
})
export class EditdeviceComponent implements OnInit {

  constructor(
    private router: Router,
    private _detailService: ReportService,
    private _trackingService: TrackingService,
    private toastr: ToastrService) { }

  sensorId: any
  sensorName: any
  disabled: boolean = true;
  SensorData: any;
  deviceid: any;
  updatedLoc: any
  DeviceIdList: any

  toDate: any
  fromDate: any

  maxDate: any = Date;
  minDate: any = Date;


  clientFeatures: any;

  ngOnInit() {

    //F27DFCAA-A0CB-4C0A-857D-3FF637FB68A1


    this.clientFeatures = {};
    this.clientFeatures = JSON.parse(sessionStorage.getItem('Client_Feature'));
    debugger
    var features: any = []

    features = this.clientFeatures.filter(f => f.featureId.toUpperCase() == 'F27DFCAA-A0CB-4C0A-857D-3FF637FB68A1')

    if (features.length > 0) {
      var currentDate = new Date();
      this.maxDate = currentDate;
      this.minDate = new Date(new Date().setDate(new Date().getDate() - 61));

      var devs: any;

      devs = []
      devs = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

      var dataList: any = []

      this.DeviceIdList = []

      devs.forEach(element => {

        dataList.push(
          {
            deviceId: element.sensorId,
            deviceName: element.deviceName
          }
        )
      });

      this.DeviceIdList = dataList
    }
    else {
      sessionStorage.clear();
      this.router.navigateByUrl('IoT')
    }
  }

  sensorList: any
  getSensors() {
    var snrs: any;

    snrs = []
    snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));

    var shortC = this.deviceid.split('_')[0] + '_';

    this.sensorList = snrs.filter(s => s.shortCode == shortC)

    this.reset();
  }


  getDeviceData() {
    var obj: any;


    obj = {}

    var tempsnr: any
    tempsnr = []
    tempsnr = this.sensorList.filter(s => s.key == this.sensorId)



    this.sensorName = tempsnr[0].keyName;

    obj.deviceId = this.deviceid;
    obj.sensorId = this.sensorId;

    obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate[0]);
    obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.fromDate[1]);

    // obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate);
    // obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.toDate);

    obj.reportType = "pdff"
    var resp: any

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    this.SensorData = []

    this.disabled = true;

    this._trackingService.getTrendRDS(obj).subscribe(result => {
      resp = result;

      var sData: any
      sData = []

      if (resp.trend.length == 0) {
        this.toastr.warning("Nodata Available")
      }
      else {

        this.disabled = false;

        resp.trend.forEach(s => {

          sData.push({
            time: s._sensorTime,
            sensorValue: s.sensorValue,
            sensorTime: s.sensorTime
          })
        });

        this.SensorData = sData;
      }

      this.updatedLoc = [];
    });

  }



  getSlno(snsrTime: any) {


    this.updatedLoc.push({ sensorTime: snsrTime });
  }


  allowNumericsAndDot(evt, value: any) {


    var v = value + evt.key;

    if (isNaN(v)) {
      return false;
    }
    else {
      // evt = (evt) ? evt : window.event;
      // var key = (evt.which) ? evt.which : evt.keyCode;

      // if (value.includes('.') && key == 46) {
      //   return false;
      // }
      // else if (key == 46 || (key >= 48 && key <= 57)) {
      return true;
      // }

      // return false;
    }
  }
  reset() {

    this.SensorData = [];
    this.disabled = true;
    this.sensorName = ""

  }

  saveDevData() {



    const uniqueLoc = this.updatedLoc.filter(
      (thing, i, arr) => arr.findIndex(t => t.sensorTime === thing.sensorTime) === i
    );

    this.updatedLoc = uniqueLoc

    var obj: any
    obj = {}

    obj.sensorData = this.SensorData;
    obj.dataChanged = this.updatedLoc;
    obj.deviceId = this.deviceid;
    obj.sensorId = this.sensorId;



    var resp: any
    this._trackingService.setTrend(obj).subscribe(result => {

      resp = result;

      if (resp.sts == "200") {
        this.toastr.success(resp.msg);
      }
      else {
        this.toastr.warning(resp.msg);
      }
    });


  }
}
