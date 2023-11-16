import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { sm } from '@angular/core/src/render3';
import { debug } from 'util';
import { ReportService } from '../service/report.service';
import { ToastrService } from 'ngx-toastr';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import Swal from 'sweetalert2'
import { LoaderService } from 'src/app/services/loader.service';
import { DeviceDataService } from '../../GlobalServices/devicedata.service';

@Component({
  selector: 'app-save-analytics',
  templateUrl: './save-analytics.component.html',
  styleUrls: ['./save-analytics.component.css']
})
export class SaveAnalyticsComponent implements OnInit {




  constructor(
    private _detailService: ReportService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _devicedataservice: DeviceDataService, ) { }

  isDates: boolean = false;
  isTrendType: boolean = false;

  hasSavedReports: boolean = true;

  LastChartIndex: any;
  CurrentChartIndex: any;
  trendPaging: any = 0;

  isMultipleHW: boolean = false;


  responseData: any;

  dateRange: any;
  DateRangeList: any = [];
  selectedRange: any = "";


  isNextDisabled: boolean = true;
  isPrevDisabled: boolean = true;



  trendChart1: any;
  trendChart2: any;
  trendChart3: any;
  trendChart4: any;
  trendChart5: any;
  trendChart6: any;

  reportId: any;

  DeviceList: any;
  FilterDeviceList: any;

  SensorList: any;
  SensorUoM: any;
  SensorMath: any;
  SensorMathFiltered: any;
  maxDate: any = Date;
  minDate: any = Date;

  categoryList: any;

  fromDate: any;
  toDate: any;

  reportRuleBased: boolean = false;

  RChart1: any;
  RChart2: any;
  RChart3: any;
  RChart4: any;
  RChart5: any;
  RChart6: any;


  disablemathSelectAll = false;
  disablemathUnSelectAll = true;
  mathSelectedList: any;

  disableSnsrSelectAll = false;
  disableSnsrRegUnSelectAll = true;
  sensorSelectedList: any;

  disabledeviceSelectAll = false;
  disabledeviceUnSelectAll = true;
  deviceSelectedList: any;

  reportName: any = "";
  reportNameTop: any = "";

  userHwTypes: any;
  selectHW: any;

  ngOnInit() {


    this.isMultipleHW = false;
    this.trendPaging = 6;
    var currentDate = new Date();

    this.fromDate = ""// new Date(new Date().setHours(0, 0, 0, 0));
    this.toDate = ""//currentDate;
    this.maxDate = currentDate;
    this.minDate = new Date(new Date().setDate(new Date().getDate() - 30));


    this.DeviceList = {}
    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));



    this.SensorUoM = {}
    this.SensorUoM = JSON.parse(sessionStorage.getItem("Sensor_UoM"));

    debugger
    this.SensorMath = {}
    this.SensorMath = JSON.parse(sessionStorage.getItem("MathFunctions"));

    this.isDates = false;

    this.categoryList = []
    var cat: any
    cat = []
    cat.catId = "1"
    cat.categoryName = "Custom"
    this.categoryList.push(cat);

    cat = []
    cat.catId = "2"
    cat.categoryName = "Rule Based"
    this.categoryList.push(cat);

    // this.selectHW = [];
    debugger
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

    }

    // this.isTrendType = true;
    this.loadDateRanges();

    this.getSavedReports("", "");


  }

  getDevices(shortCode: any) {

    if (shortCode == "" || shortCode == undefined || shortCode == null) {
      this.deviceSelectedList = [];
      this.sensorSelectedList = [];
      this.mathSelectedList = [];
      this.reportName = "";
      this.dateRange = [];
    }

    if (this.selectHW == "" || this.selectHW == undefined || this.selectHW == null) {
      this.selectHW = this.userHwTypes[0].id
    }
    debugger
    var obj: any;

    obj = {};

    obj.loginId = sessionStorage.getItem("LOGINUSERID")
    obj.shortCode = this.selectHW;



    var devList: any;
    devList = [];
    this._devicedataservice.getonBoardDevice(obj).subscribe(result => {
      devList = result;

      var dev: any;

      this.FilterDeviceList = [];
      debugger
      devList.devices.forEach(d => {

        dev = [];

        dev.sensorId = d.DeviceId;
        dev.deviceName = d.DeviceName;

        this.FilterDeviceList.push(dev);
      });

      //getting DeviceSensors
      this.getDataFormat();
      debugger
      if (shortCode !== undefined && shortCode != "" && shortCode != null) {
        this.editReport();
      }
    });

  }

  getDataFormat() {



    debugger


    // var clientDB: any = "";
    // clientDB = sessionStorage.getItem("Client_Domain");
    var snrs: any;


    snrs = []
    snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));



    this.SensorList = [];
    snrs.forEach(s => {
      debugger
      var obj: any = [];
      if ((s.sensorTypeId !== "7" && s.sensorTypeId !== "17" && s.key !== "deviceId" && s.key !== "tms") &&
        s.shortCode == this.selectHW) {
        obj.key = s.key;
        obj.keyName = s.keyName;
        obj.mathFunctions = s.mathFunctions;

        this.SensorList.push(obj);
      }
    });
    debugger


    //sensors = JSON.parse(sessionStorage.getItem("USER_SENSORS"));


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

  getMathFun(event: any) {
    debugger

    this.SensorMathFiltered = []

    var sM: any = {};

    debugger

    sM.mathId = "0";
    sM.functionName = 'Sensor Readings';
    this.SensorMathFiltered.push(sM);


    // sM = {}
    // sM.mathId = "100";
    // sM.functionName = 'State Based';
    // this.SensorMathFiltered.push(sM);

    debugger
    var mathIDs: any
    mathIDs = this.SensorList.filter(item => item.key == event.key);//

    var mathIDsList: any = []
    mathIDsList = mathIDs[0].mathFunctions.split(',');

    debugger
    for (let index = 0; index < mathIDsList.length; index++) {
      
      const element = mathIDsList[index];
      if (element != "") {
        var sM: any = {};

        debugger
        sM.mathId = element;

        var mFunction: any;
        mFunction = this.SensorMath.filter(i => i.mathId == element);
        sM.functionName = mFunction[0].functionName;

        this.SensorMathFiltered.push(sM);
      }
    }


    // sM.mathId = s.


    debugger
  }

  SendReportMail(reportType: any) { }

  ResetData() { }

  checkSpecialChar(event) {

    var iChars = "!`@#$%^&*()+=-[]\\\';,./{}|\":<>?~_";
    debugger
    if (iChars.includes(event.key)) {
      return false;
    }
    return true;
  }

  saveReport() {
    debugger

    var valid: boolean = true;
    debugger
    if (this.deviceSelectedList == undefined || this.deviceSelectedList.length == 0) {

      valid = false;
      this.toastr.warning('please select Device');
    }
    else
      if (this.sensorSelectedList == undefined || this.sensorSelectedList.length == 0) {

        valid = false;
        this.toastr.warning('please select Sensor');
      } else
        if (this.mathSelectedList == undefined || this.mathSelectedList.length == 0) {

          valid = false;
          this.toastr.warning('please select Report Type');
        }
        else
          if (this.reportName == undefined || this.reportName.length == 0) {

            this.toastr.warning('please enter report name');

            valid = false;
          }
          else
            if (this.dateRange == null || this.dateRange.length == 0) {

              valid = false;
              this.toastr.warning('please select Period');
            }
            else {

              this.reportName = this.reportName.replace(/\s/g, "_");
              debugger
              this.reportName = this.reportName.replace(".", "");
            }


    if (valid) {
      var obj: any = {};
      obj.reportId = this.reportId;
      obj.reportName = this.reportName;
      obj.mathfunctions = this.mathSelectedList;
      obj.devices = "";
      this.deviceSelectedList.forEach(dev => {
        debugger
        obj.devices += dev + ',';
      });

      obj.sensors = this.sensorSelectedList;
      obj.period = this.dateRange;

      var resp: any = [];

      this._detailService.SaveCustonReport(obj).subscribe(result => {
        resp = result;

        if (resp.sts == "200") {
          this.hasSavedReports = true;
          this.toastr.success(resp.msg);

          //this.modalAnalytic.hide();

          this.getSavedReports("", "");

          this.reset();

        }
        else {
          this.toastr.warning(resp.msg);
        }
      });
    }
  }

  savedReports: any;
  allsavedReports: any;

  getSavedReports(reportId: any, shortCode: any) {
    debugger
    this._detailService.GetSavedReport(reportId).subscribe(result => {
      debugger
      this.savedReports = [];

      var resp: any = [];
      resp = result;

      if (resp.length > 0) {
        this.hasSavedReports = true;
        resp.forEach(sr => {
          var obj: any = {};

          obj.reportId = sr.reportId;
          obj.displayName = sr.displayName;
          obj.reportName = sr.reportName;
          obj.reportType = sr.reportType;
          obj.devices = sr.devices;
          obj.sensors = sr.sensors;
          obj.period = sr.period;
          obj.mathfunctions = sr.mathfunctions;
          obj.showinDB = sr.showinDB;
          obj.shortCode = sr.shortCode;

          this.savedReports.push(obj);
        });

        debugger

        if (reportId !== "" && reportId !== undefined) {
          this.reportId = reportId;
          this.selectHW = shortCode;
          this.getDevices(this.selectHW);
        }
        else {
          this.reportId = "";
          this.allsavedReports = [];
          this.allsavedReports = this.savedReports;
          debugger
          if (this.allsavedReports.length > 0) {
            this.getReport(this.allsavedReports[0].reportId, this.allsavedReports[0].mathfunctions, this.allsavedReports[0].reportName);
          }
        }
      }
      else {
        this.hasSavedReports = false;
      }

    });
  }


  ondevSelectAll() {

    debugger
    this.disabledeviceSelectAll = true;
    this.disabledeviceUnSelectAll = false;
    this.deviceSelectedList = this.DeviceList.map(x => x.sensorId);

  }
  ondevDeSelectAll() {

    debugger
    this.disabledeviceSelectAll = false;
    this.disabledeviceUnSelectAll = true;
    this.deviceSelectedList = [];

  }


  onsnsrSelectAll() {

    debugger
    this.disableSnsrSelectAll = true;
    this.disableSnsrRegUnSelectAll = false;
    this.sensorSelectedList = this.SensorList.map(x => x.key);

  }
  onsnsrDeSelectAll() {

    debugger
    this.disableSnsrSelectAll = false;
    this.disableSnsrRegUnSelectAll = true;
    this.sensorSelectedList = [];

  }

  pintToDB(reportId: any) {
    var resp: any = [];

    this._detailService.PintoDashboard(reportId).subscribe(result => {
      debugger

      resp = result;
      if (resp.sts == "200") {
        this.toastr.success(resp.msg);
        this.getSavedReports("", "");
      }
      else {
        this.toastr.warning(resp.msg);
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
    dtRange.dtId = "720"
    dtRange.dtName = "Last 30 Days"

    this.DateRangeList.push(dtRange);


    dtRange = []
    dtRange.dtId = "custom"
    dtRange.dtName = "Custom Dates"

    this.DateRangeList.push(dtRange);

  }

  GetReportDetails() {
    debugger
    var obj: any

    obj = {}

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.devices = "";

    this.deviceSelectedList.forEach(dev => {

      obj.devices += dev + ',';
    });
    debugger
    obj.sensors = this.sensorSelectedList

    obj.mathfunctions = this.mathSelectedList;

    if (this.mathSelectedList == "100") {
      this.isTrendType = false;
    }
    else {
      this.isTrendType = true;
    }


    if (this.dateRange == "custom") {
      obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate);
      obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.toDate);

      //this.period = obj.frDate + ' To ' + obj.tDate
    }
    else {
      obj.frDate = this.dateRange;

    }



    this.loadReport(obj);
  }

  loadReport(obj: any) {
    this.loaderService.display(true);
    debugger
    this._detailService.ShowReport(obj).subscribe(result => {
      this.loaderService.display(false);

      this.responseData = [];

      this.responseData = result;
      this.CurrentChartIndex = 0;
      this.LastChartIndex = 0;
      this.plotRcharts();
      debugger

    });
  }

  editReport() {

    //this.modalAnalytic.show();

    debugger

    this.deviceSelectedList
    this.sensorSelectedList = this.savedReports[0].sensors;

    var obj: any = {}
    obj.key = this.savedReports[0].sensors;

    this.getMathFun(obj);

    this.mathSelectedList = this.savedReports[0].mathfunctions;

    this.reportName = this.savedReports[0].reportName;
    this.dateRange = this.savedReports[0].period;


    var devices: any = [];

    devices = this.savedReports[0].devices.split(',');

    this.deviceSelectedList = [];

    devices.forEach(dev => {
      this.deviceSelectedList.push(dev);
    });

  }

  deleteReport(reportId: any) {
    debugger
    Swal({
      title: 'Do you want to delete this report?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes',
      // allowOutsideClick: false,
    }).then((result1) => {
      if (result1.value) {
        this._detailService.RemoveSavedReports(reportId).subscribe(result => {
          var resp: any = [];

          resp = result;

          this.toastr.success("Removed Successfully");

          this.getSavedReports("", "");
        });
      }
    });
  }

  reset() {
    this.reportRuleBased = false;
    this.deviceSelectedList = [];
    this.sensorSelectedList = [];
    this.reportName = ""
    this.dateRange = [];
    this.deviceSelectedList = [];
    this.mathSelectedList = [];
    this.reportNameTop = "";
    //this.modalAnalytic.show();
  }

  getReport(reportId: any, reportType: any, reportName: any) {
    debugger
    this.reportNameTop = reportName;
    this.CurrentChartIndex = 0;
    this.LastChartIndex = 0;

    if (reportType == "100") {

      this.isTrendType = false;

      this._detailService.GenerateReport(reportId).subscribe(result => {

        this.responseData = [];

        this.responseData = result;

        this.plotRcharts();
        debugger
      });
    }
    else {

      this.isTrendType = true;

      this._detailService.GenerateReport(reportId).subscribe(result => {

        this.responseData = [];

        this.responseData = result;

        this.plotRcharts();
        debugger
      });
    }
  }

  plotPrev() {
    this.isNextDisabled = false;
    this.LastChartIndex = this.LastChartIndex - this.trendPaging;
    this.plotRcharts();
  }
  plotNext() {
    this.isPrevDisabled = false; //enable
    this.LastChartIndex = this.LastChartIndex + this.trendPaging;
    this.plotRcharts();
  }

  plotRcharts() {
    var resp: any = [];

    resp = this.responseData;

    debugger

    if (this.RChart1) {
      this.RChart1.dispose();
    }
    if (this.RChart2) {
      this.RChart2.dispose();
    }
    if (this.RChart3) {
      this.RChart3.dispose();
    }
    if (this.RChart4) {
      this.RChart4.dispose();
    }
    if (this.RChart5) {
      this.RChart5.dispose();
    }
    if (this.RChart6) {
      this.RChart6.dispose();
    }

    if (this.trendChart1) {
      this.trendChart1.dispose();
    }
    if (this.trendChart2) {
      this.trendChart2.dispose();
    }
    if (this.trendChart3) {
      this.trendChart3.dispose();
    }
    if (this.trendChart4) {
      this.trendChart4.dispose();
    }
    if (this.trendChart5) {
      this.trendChart5.dispose();
    }
    if (this.trendChart6) {
      this.trendChart6.dispose();
    }



    if (this.CurrentChartIndex == "" || this.CurrentChartIndex == undefined) {
      this.CurrentChartIndex = 0;
      this.LastChartIndex = 0;
    }

    var deviceName: any = "";
    var sensorName: any = "";

    var userDev: any = [];
    var sensorUoM: any = [];

    var sUoM: any = "";

    debugger
    if (this.LastChartIndex > this.CurrentChartIndex) //next charts
    {
      this.CurrentChartIndex = this.LastChartIndex

      if (this.responseData.length >= 1 && this.CurrentChartIndex < this.responseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart1(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          debugger
          userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }
          this.plottrend1(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }

      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.responseData.length >= 2 && this.CurrentChartIndex < this.responseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart2(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }
          this.plottrend2(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      ////
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.responseData.length >= 3 && this.CurrentChartIndex < this.responseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart3(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }
          this.plottrend3(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.responseData.length >= 4 && this.CurrentChartIndex < this.responseData.length) {
        debugger
        if (this.isTrendType !== true) {
          this.plotRchart4(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }
          this.plottrend4(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.responseData.length >= 5 && this.CurrentChartIndex < this.responseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart5(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }
          this.plottrend5(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.responseData.length >= 6 && this.CurrentChartIndex < this.responseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart6(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }
          this.plottrend6(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }

      }
    }
    else
      if (this.LastChartIndex < this.CurrentChartIndex)//previous charts
      {
        this.CurrentChartIndex = this.LastChartIndex

        if (this.responseData.length >= 1 && this.CurrentChartIndex < this.responseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart1(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend1(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }

        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 2 && this.CurrentChartIndex < this.responseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart2(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend2(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        ////
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 3 && this.CurrentChartIndex < this.responseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart3(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend3(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 4 && this.CurrentChartIndex < this.responseData.length
          && this.CurrentChartIndex >= 0) {
          debugger
          if (this.isTrendType !== true) {
            this.plotRchart4(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend4(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 5 && this.CurrentChartIndex < this.responseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart5(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend5(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 6 && this.CurrentChartIndex < this.responseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart6(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend6(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
      }
      else {
        this.CurrentChartIndex = this.LastChartIndex
        debugger
        if (this.responseData.length >= 1 && this.CurrentChartIndex < this.responseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart1(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            debugger
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);

            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }

            this.plottrend1(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }

        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 2 && this.CurrentChartIndex < this.responseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart2(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }

            this.plottrend2(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        ////
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 3 && this.CurrentChartIndex < this.responseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart3(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend3(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 4 && this.CurrentChartIndex < this.responseData.length) {
          debugger
          if (this.isTrendType !== true) {
            this.plotRchart4(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend4(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 5 && this.CurrentChartIndex < this.responseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart5(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend5(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 6 && this.CurrentChartIndex < this.responseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart6(this.responseData[this.CurrentChartIndex].Duration, this.responseData[this.CurrentChartIndex].deviceName, this.responseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            this.plottrend6(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
      }


    if (((resp.length - 1) - this.CurrentChartIndex) > 0) {
      this.isNextDisabled = false;
    }
    else {
      this.isNextDisabled = true;
    }

    debugger
    if (this.LastChartIndex == 0) {
      this.isPrevDisabled = true;
    }



  }

  
  plotRchart1(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],
    debugger

    var TrendValues: any = [];

    report.forEach(e => {
      var STime = +e.date;
      var SCritical = +e.critical;
      var SWarning = +e.warning;
      var SGood = +e.ok;

      //STime = STime / 1000;
      debugger
      var obj: any = {};

      obj.date = STime;
      obj.critical = SCritical;
      obj.warning = SWarning;
      obj.good = SGood;

      TrendValues.push(obj);

    });
    debugger
    // this.zone.runOutsideAngular(() => {
    this.RChart1 = am4core.create("RChart1", am4charts.XYChart);

    this.RChart1.data = TrendValues;

    let dateAxis = this.RChart1.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart1.yAxes.push(new am4charts.ValueAxis());

    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#E01F26"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#E7C219"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#00A65A"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.RChart1.cursor = new am4charts.XYCursor();
    this.RChart1.cursor.xAxis = dateAxis;

    var title = this.RChart1.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

  }
  plotRchart2(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],
    debugger

    var TrendValues: any = [];

    report.forEach(e => {
      var STime = +e.date;
      var SCritical = +e.critical;
      var SWarning = +e.warning;
      var SGood = +e.ok;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.critical = SCritical;
      obj.warning = SWarning;
      obj.good = SGood;

      TrendValues.push(obj);

    });
    debugger
    // this.zone.runOutsideAngular(() => {
    this.RChart2 = am4core.create("RChart2", am4charts.XYChart);

    this.RChart2.data = TrendValues;

    let dateAxis = this.RChart2.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart2.yAxes.push(new am4charts.ValueAxis());

    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#E01F26"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#E7C219"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#00A65A"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.RChart2.cursor = new am4charts.XYCursor();
    this.RChart2.cursor.xAxis = dateAxis;

    var title = this.RChart2.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

  }
  plotRchart3(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],
    debugger

    var TrendValues: any = [];

    report.forEach(e => {
      var STime = +e.date;
      var SCritical = +e.critical;
      var SWarning = +e.warning;
      var SGood = +e.ok;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.critical = SCritical;
      obj.warning = SWarning;
      obj.good = SGood;

      TrendValues.push(obj);

    });
    debugger
    // this.zone.runOutsideAngular(() => {
    this.RChart3 = am4core.create("RChart3", am4charts.XYChart);

    this.RChart3.data = TrendValues;

    let dateAxis = this.RChart3.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart3.yAxes.push(new am4charts.ValueAxis());

    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#E01F26"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#E7C219"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#00A65A"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.RChart3.cursor = new am4charts.XYCursor();
    this.RChart3.cursor.xAxis = dateAxis;

    var title = this.RChart3.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

  }
  plotRchart4(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],
    debugger

    var TrendValues: any = [];

    report.forEach(e => {
      var STime = +e.date;
      var SCritical = +e.critical;
      var SWarning = +e.warning;
      var SGood = +e.ok;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.critical = SCritical;
      obj.warning = SWarning;
      obj.good = SGood;

      TrendValues.push(obj);

    });
    debugger
    // this.zone.runOutsideAngular(() => {
    this.RChart4 = am4core.create("RChart4", am4charts.XYChart);

    this.RChart4.data = TrendValues;

    let dateAxis = this.RChart4.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart4.yAxes.push(new am4charts.ValueAxis());

    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#E01F26"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#E7C219"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#00A65A"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.RChart4.cursor = new am4charts.XYCursor();
    this.RChart4.cursor.xAxis = dateAxis;

    var title = this.RChart4.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

  }
  plotRchart5(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],
    debugger

    var TrendValues: any = [];

    report.forEach(e => {
      var STime = +e.date;
      var SCritical = +e.critical;
      var SWarning = +e.warning;
      var SGood = +e.ok;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.critical = SCritical;
      obj.warning = SWarning;
      obj.good = SGood;

      TrendValues.push(obj);

    });
    debugger
    // this.zone.runOutsideAngular(() => {
    this.RChart5 = am4core.create("RChart5", am4charts.XYChart);

    this.RChart5.data = TrendValues;

    let dateAxis = this.RChart5.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart5.yAxes.push(new am4charts.ValueAxis());

    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#E01F26"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#E7C219"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#00A65A"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.RChart5.cursor = new am4charts.XYCursor();
    this.RChart5.cursor.xAxis = dateAxis;

    var title = this.RChart5.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

  }
  plotRchart6(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],
    debugger

    var TrendValues: any = [];

    report.forEach(e => {
      var STime = +e.date;
      var SCritical = +e.critical;
      var SWarning = +e.warning;
      var SGood = +e.ok;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.critical = SCritical;
      obj.warning = SWarning;
      obj.good = SGood;

      TrendValues.push(obj);

    });
    debugger
    // this.zone.runOutsideAngular(() => {
    this.RChart6 = am4core.create("RChart6", am4charts.XYChart);

    this.RChart6.data = TrendValues;

    let dateAxis = this.RChart6.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart6.yAxes.push(new am4charts.ValueAxis());

    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#E01F26"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#E7C219"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#00A65A"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.RChart6.cursor = new am4charts.XYCursor();
    this.RChart6.cursor.xAxis = dateAxis;

    var title = this.RChart6.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

  }


  //Trend and Custom

  plottrend1(trend: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],
    debugger
    var TrendValues: any = [];

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

    });

    // this.zone.runOutsideAngular(() => {
    this.trendChart1 = am4core.create("trChart1", am4charts.XYChart);

    let data = [];
    let visits = 10;



    this.trendChart1.data = TrendValues;

    let dateAxis = this.trendChart1.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart1.yAxes.push(new am4charts.ValueAxis());

    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.trendChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.trendChart1.cursor = new am4charts.XYCursor();
    this.trendChart1.cursor.xAxis = dateAxis;

    // let scrollbarX = new am4core.Scrollbar();
    // scrollbarX.marginBottom = 20;
    // this.trendChart1.scrollbarX = scrollbarX;

    var title = this.trendChart1.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#E01F26");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#00A65A");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#E7C219");
        }

      // var minY: number;
      // var maxY: number;
      // minY = 0;
      // maxY = 0;

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


    // });

  }

  plottrend2(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

    });

    //this.zone.runOutsideAngular(() => {
    this.trendChart2 = am4core.create("trChart2", am4charts.XYChart);


    this.trendChart2.data = TrendValues;


    let dateAxis = this.trendChart2.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart2.yAxes.push(new am4charts.ValueAxis());
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }

    let series = this.trendChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.trendChart2.cursor = new am4charts.XYCursor();
    this.trendChart2.cursor.xAxis = dateAxis;

    // let scrollbarX = new am4core.Scrollbar();
    // scrollbarX.marginBottom = 20;
    // this.trendChart2.scrollbarX = scrollbarX;

    var title = this.trendChart2.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#E01F26");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#00A65A");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#E7C219");
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



    //});

  }
  plottrend3(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

    });

    //this.zone.runOutsideAngular(() => {
    this.trendChart3 = am4core.create("trChart3", am4charts.XYChart);


    this.trendChart3.data = TrendValues;


    let dateAxis = this.trendChart3.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart3.yAxes.push(new am4charts.ValueAxis());
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }

    let series = this.trendChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.trendChart3.cursor = new am4charts.XYCursor();
    this.trendChart3.cursor.xAxis = dateAxis;


    var title = this.trendChart3.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#E01F26");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#00A65A");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#E7C219");
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



    //});

  }
  plottrend4(trend: any, deviceName: any, sensorName: any, uom: any) {
    debugger
    var TrendValues: any = [];

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

    });

    //this.zone.runOutsideAngular(() => {
    this.trendChart4 = am4core.create("trChart4", am4charts.XYChart);


    this.trendChart4.data = TrendValues;


    let dateAxis = this.trendChart4.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart4.yAxes.push(new am4charts.ValueAxis());
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }

    let series = this.trendChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.trendChart4.cursor = new am4charts.XYCursor();
    this.trendChart4.cursor.xAxis = dateAxis;


    var title = this.trendChart4.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#E01F26");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#00A65A");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#E7C219");
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



    //});

  }
  plottrend5(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

    });

    //this.zone.runOutsideAngular(() => {
    this.trendChart5 = am4core.create("trChart5", am4charts.XYChart);


    this.trendChart5.data = TrendValues;


    let dateAxis = this.trendChart5.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart5.yAxes.push(new am4charts.ValueAxis());
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }

    let series = this.trendChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.trendChart5.cursor = new am4charts.XYCursor();
    this.trendChart5.cursor.xAxis = dateAxis;


    var title = this.trendChart5.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#E01F26");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#00A65A");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#E7C219");
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



    //});

  }
  plottrend6(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

    });

    //this.zone.runOutsideAngular(() => {
    this.trendChart6 = am4core.create("trChart6", am4charts.XYChart);


    this.trendChart6.data = TrendValues;


    let dateAxis = this.trendChart6.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart6.yAxes.push(new am4charts.ValueAxis());
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }

    let series = this.trendChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 3;

    this.trendChart6.cursor = new am4charts.XYCursor();
    this.trendChart6.cursor.xAxis = dateAxis;


    var title = this.trendChart6.titles.create();
    title.text = deviceName + " | " + sensorName + " " + uom;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#E01F26");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#00A65A");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#E7C219");
        }


      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {

          range.value = +pb.minVal;
          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {

            range.endValue = +pb.minVal;
          }

    });



    //});

  }
}
