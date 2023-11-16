import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService } from '../../reports/service/report.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-dashboard-pins',
  templateUrl: './dashboard-pins.component.html',
  styleUrls: ['./dashboard-pins.component.css']
})
export class DashboardPinsComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
    private _detailService: ReportService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _commanService: IdeaBService,) { }

  isTrendType: boolean = false;


  hasChart: boolean = false;
  hasSurv: boolean = false;
  hasMap: boolean = false;
  hasTemp: boolean = false;
  hasDBpin: boolean = false;


  LastChartIndex: any;
  CurrentChartIndex: any;
  trendPaging: any = 0;

  DBresponseData: any;

  dateRange: any;
  DateRangeList: any = [];
  selectedRange: any = "";


  isNextDisabled: boolean = true;
  isPrevDisabled: boolean = true;


  private timer;
  private sub: Subscription;

  clientFeatures: any;


  trendChart1: any;
  trendChart2: any;
  trendChart3: any;
  trendChart4: any;
  trendChart5: any;
  trendChart6: any;

  reportId: any;

  DeviceList: any;
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
  isTimer: boolean = false;

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


  currentReportIndex: any


  ngOnInit() {

    this.hasSurv = false;
    this.hasChart = false;

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


    this.DeviceList = {}
    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));


    this.SensorList = {}
    this.SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.SensorList = this.SensorList.filter(item => item.key !== "tms");

    this.SensorUoM = {}
    this.SensorUoM = JSON.parse(sessionStorage.getItem("Sensor_UoM"));
    this.trendPaging = 6;
    this.getSavedReports();
    debugger
    this.isTimer = false;
    this.currentReportIndex = -1;
  }

  runTimer() {
    if (this.isTimer) {
      this.sub.unsubscribe();
      this.isTimer = true;
      this.timer = Observable.timer(0, 10 * 1000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
    else {
      this.isTimer = true;
      this.timer = Observable.timer(0, 10 * 1000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
  }

  ngOnDestroy() {

    if (this.isTimer) {
      this.sub.unsubscribe();
    }
  }

  selectedItemID: any;
  getTimerData(time) {
    debugger
    //this.getReport(this.allsavedReports[0].reportId, this.allsavedReports[0].mathfunctions, this.allsavedReports[0].reportName);

    if (this.allsavedReports !== undefined) {
      this.currentReportIndex += 1;

      if (this.currentReportIndex == this.allsavedReports.length) {
        this.currentReportIndex = 0;
      }

      this.selectedItemID = this.allsavedReports[this.currentReportIndex].reportId;

      this.getReport(this.allsavedReports[this.currentReportIndex].reportId, this.allsavedReports[this.currentReportIndex].mathfunctions, this.allsavedReports[this.currentReportIndex].reportName);
    }
  }

  // showReport(reportId: any, reportType: any, reportName: any)
  // {
  //   this.currentReportIndex = 0;
  //   this.getReport(reportId, reportType, reportName);

  // }

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
    }
    else if (path == "chart") {
      this.router.navigateByUrl('/pages/tracking/SensorView')
    } else
      if (path == "temp") {

        this.router.navigateByUrl('/pages/tracking/TempView')
      } else
        if (path == "map") {

          this.router.navigateByUrl('/pages/tracking/Map')
        }
        else if (path == "image") {
          this.router.navigateByUrl('/pages/reports/images')
        }
  }

  savedReports: any;
  allsavedReports: any;

  showNPbtn: boolean = false;
  collapsedMenu = false;

  getSavedReports() {
    this._detailService.GetPinnedReport().subscribe(result => {
      debugger
      this.savedReports = [];

      var resp: any = [];
      resp = result;

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
        obj.frequency = sr.frequency;

        this.savedReports.push(obj);
      });

      debugger


      this.reportId = "";
      this.allsavedReports = [];
      this.allsavedReports = this.savedReports;
      debugger
      this.runTimer();

    });
  }

  pintToDB(reportId: any) {
    var resp: any = [];

    this._detailService.PintoDashboard(reportId).subscribe(result => {
      debugger

      resp = result;
      if (resp.sts == "200") {
        this.toastr.success(resp.msg);
        this.getSavedReports();
      }
      else {
        this.toastr.warning(resp.msg);
      }
    });
  }

  getReport(reportId: any, reportType: any, reportName: any) {
    debugger
    this.reportNameTop = reportName;
    this.CurrentChartIndex = 0;
    this.LastChartIndex = 0;

    if (reportType == "100") {

      this.isTrendType = false;

      this._detailService.GenerateReport(reportId).subscribe(result => {

        this.DBresponseData = [];

        this.DBresponseData = result;

        this.plotRcharts();
        debugger
      });
    }
    else {

      this.isTrendType = true;

      this._detailService.GenerateReport(reportId).subscribe(result => {

        this.DBresponseData = [];

        this.DBresponseData = result;

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

    resp = this.DBresponseData;

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


    if (this.DBresponseData.length <= 6) {
      this.showNPbtn = false;
    }
    else {
      this.showNPbtn = true;
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

      if (this.DBresponseData.length >= 1 && this.CurrentChartIndex < this.DBresponseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart1(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          debugger
          userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
          // sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
          // if (sensorUoM == undefined || sensorUoM.length == 0) {
          //   sUoM = "";
          // }
          // else {
          //   sUoM = sensorUoM[0].symbol;
          // }
          sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
          this.plottrend1(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }

      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.DBresponseData.length >= 2 && this.CurrentChartIndex < this.DBresponseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart2(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }

          sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
          this.plottrend2(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      ////
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.DBresponseData.length >= 3 && this.CurrentChartIndex < this.DBresponseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart3(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }

          sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
          this.plottrend3(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.DBresponseData.length >= 4 && this.CurrentChartIndex < this.DBresponseData.length) {
        debugger
        if (this.isTrendType !== true) {
          this.plotRchart4(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }

          sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
          this.plottrend4(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.DBresponseData.length >= 5 && this.CurrentChartIndex < this.DBresponseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart5(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }

          sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
          this.plottrend5(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.DBresponseData.length >= 6 && this.CurrentChartIndex < this.DBresponseData.length) {
        if (this.isTrendType !== true) {
          this.plotRchart6(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
        }
        else {
          userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
          sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
          if (sensorUoM == undefined || sensorUoM.length == 0) {
            sUoM = "";
          }
          else {
            sUoM = sensorUoM[0].symbol;
          }

          sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
          this.plottrend6(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }

      }
    }
    else
      if (this.LastChartIndex < this.CurrentChartIndex)//previous charts
      {
        this.CurrentChartIndex = this.LastChartIndex

        if (this.DBresponseData.length >= 1 && this.CurrentChartIndex < this.DBresponseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart1(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }

            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend1(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }

        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 2 && this.CurrentChartIndex < this.DBresponseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart2(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }

            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend2(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        ////
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 3 && this.CurrentChartIndex < this.DBresponseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart3(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend3(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 4 && this.CurrentChartIndex < this.DBresponseData.length
          && this.CurrentChartIndex >= 0) {
          debugger
          if (this.isTrendType !== true) {
            this.plotRchart4(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend4(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 5 && this.CurrentChartIndex < this.DBresponseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart5(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend5(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 6 && this.CurrentChartIndex < this.DBresponseData.length
          && this.CurrentChartIndex >= 0) {
          if (this.isTrendType !== true) {
            this.plotRchart6(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend6(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
      }
      else {
        this.CurrentChartIndex = this.LastChartIndex
        debugger
        if (this.DBresponseData.length >= 1 && this.CurrentChartIndex < this.DBresponseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart1(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            debugger
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);

            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;

            this.plottrend1(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }

        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 2 && this.CurrentChartIndex < this.DBresponseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart2(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }

            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend2(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        ////
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 3 && this.CurrentChartIndex < this.DBresponseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart3(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend3(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 4 && this.CurrentChartIndex < this.DBresponseData.length) {
          debugger
          if (this.isTrendType !== true) {
            this.plotRchart4(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend4(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 5 && this.CurrentChartIndex < this.DBresponseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart5(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend5(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.DBresponseData.length >= 6 && this.CurrentChartIndex < this.DBresponseData.length) {
          if (this.isTrendType !== true) {
            this.plotRchart6(this.DBresponseData[this.CurrentChartIndex].Duration, this.DBresponseData[this.CurrentChartIndex].deviceName, this.DBresponseData[this.CurrentChartIndex].snsrName, '');
          }
          else {
            userDev = this.DeviceList.filter(item => item.sensorId == this.DBresponseData[this.CurrentChartIndex].trend[0].deviceId);//
            sensorUoM = this.SensorUoM.filter(item => item.uomId == this.DBresponseData[this.CurrentChartIndex].trend[0].uom);
            if (sensorUoM == undefined || sensorUoM.length == 0) {
              sUoM = "";
            }
            else {
              sUoM = sensorUoM[0].symbol;
            }
            sUoM = this.DBresponseData[this.CurrentChartIndex].trend[0].uom;
            this.plottrend6(this.DBresponseData[this.CurrentChartIndex], userDev[0].deviceName, this.DBresponseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
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
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart1.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#F8CBAD"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;


    series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    this.RChart1.cursor = new am4charts.XYCursor();
    this.RChart1.cursor.xAxis = dateAxis;

    var title = this.RChart1.titles.create();
    title.text = deviceName + " | " + sensorName + " (" + uom + ")";
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
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart2.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#F8CBAD"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    this.RChart2.cursor = new am4charts.XYCursor();
    this.RChart2.cursor.xAxis = dateAxis;

    var title = this.RChart2.titles.create();
    title.text = deviceName + " | " + sensorName;//+ " (" + uom+")";
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
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart3.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#F8CBAD"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    this.RChart3.cursor = new am4charts.XYCursor();
    this.RChart3.cursor.xAxis = dateAxis;

    var title = this.RChart3.titles.create();
    title.text = deviceName + " | " + sensorName;//+ " (" + uom+")";
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
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart4.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#F8CBAD"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    this.RChart4.cursor = new am4charts.XYCursor();
    this.RChart4.cursor.xAxis = dateAxis;

    var title = this.RChart4.titles.create();
    title.text = deviceName + " | " + sensorName;//+ " (" + uom+")";
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
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart5.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#F8CBAD"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    this.RChart5.cursor = new am4charts.XYCursor();
    this.RChart5.cursor.xAxis = dateAxis;

    var title = this.RChart5.titles.create();
    title.text = deviceName + " | " + sensorName;//+ " (" + uom+")";
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
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart6.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    debugger
    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#F8CBAD"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

    this.RChart6.cursor = new am4charts.XYCursor();
    this.RChart6.cursor.xAxis = dateAxis;

    var title = this.RChart6.titles.create();
    title.text = deviceName + " | " + sensorName;//+ " (" + uom+")";
    title.fontSize = 12;
    title.marginBottom = 5;

  }


  //Trend and Custom

  plottrend1(trend: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],

    var TrendValues: any = [];


    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []
    var hasFV: boolean = false;

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      if (e.sensorValue.toLowerCase() !== 'fv') {
        TrendValues.push(obj);
        val1.push(Number(obj.value));
      }
      else {
        hasFV = true;
        var Nobj: any = {};
        Nobj.date = STime;
        TrendValues.push(Nobj);
      }

    });


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();


    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    // this.zone.runOutsideAngular(() => {
    this.trendChart1 = am4core.create("trChart1", am4charts.XYChart);

    let data = [];
    let visits = 10;



    this.trendChart1.data = TrendValues;

    let dateAxis = this.trendChart1.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;
    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart1.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;

    //valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }
    // if (uom == "(%)") {
    //   valueAxis.min = 0;
    //   valueAxis.max = 100;
    // }


    let series = this.trendChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

//series.connect = false;



    series.stroke = am4core.color("#7092BE");

    this.trendChart1.cursor = new am4charts.XYCursor();
    this.trendChart1.cursor.xAxis = dateAxis;

    // let scrollbarX = new am4core.Scrollbar();
    // scrollbarX.marginBottom = 20;
    // this.trendChart1.scrollbarX = scrollbarX;

    var title = this.trendChart1.titles.create();
    if (uom == "") {
      title.text = deviceName + " | " + sensorName;
    }
    else {
      title.text = deviceName + " | " + sensorName + " (" + uom + ")";
    }
    title.fontSize = 12;
    title.marginBottom = 20;

    let range

    trend.ruleDetails.forEach(pb => {

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

    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []
    var hasFV: boolean = false;

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      if (e.sensorValue.toLowerCase() !== 'fv') {
        TrendValues.push(obj);
        val1.push(Number(obj.value));
      }
      else {
        var Nobj: any = {};
        Nobj.date = STime;
        TrendValues.push(Nobj);
        hasFV = true;

      }

    });

    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();


    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    //this.zone.runOutsideAngular(() => {
    this.trendChart2 = am4core.create("trChart2", am4charts.XYChart);


    this.trendChart2.data = TrendValues;


    let dateAxis = this.trendChart2.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart2.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;


//series.connect = false;

    series.stroke = am4core.color("#7092BE");


    this.trendChart2.cursor = new am4charts.XYCursor();
    this.trendChart2.cursor.xAxis = dateAxis;

    // let scrollbarX = new am4core.Scrollbar();
    // scrollbarX.marginBottom = 20;
    // this.trendChart2.scrollbarX = scrollbarX;

    var title = this.trendChart2.titles.create();
    if (uom == "") {
      title.text = deviceName + " | " + sensorName;
    }
    else {
      title.text = deviceName + " | " + sensorName + " (" + uom + ")";
    }
    //title.text = deviceName + " | " + sensorName + " (" + uom + ")";
    title.fontSize = 12;
    title.marginBottom = 20;

    let range

    trend.ruleDetails.forEach(pb => {

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



    //});

  }
  plottrend3(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []
    var hasFV: boolean = false;


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      if (e.sensorValue.toLowerCase() !== 'fv') {
        TrendValues.push(obj);
        val1.push(Number(obj.value));
      }
      else {
        hasFV = true;
        var Nobj: any = {};
        Nobj.date = STime;
        TrendValues.push(Nobj);
      }

    });


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();


    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    //this.zone.runOutsideAngular(() => {
    this.trendChart3 = am4core.create("trChart3", am4charts.XYChart);


    this.trendChart3.data = TrendValues;


    let dateAxis = this.trendChart3.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart3.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

//series.connect = false;

    series.stroke = am4core.color("#7092BE");


    this.trendChart3.cursor = new am4charts.XYCursor();
    this.trendChart3.cursor.xAxis = dateAxis;


    var title = this.trendChart3.titles.create();
    if (uom == "") {
      title.text = deviceName + " | " + sensorName;
    }
    else {
      title.text = deviceName + " | " + sensorName + " (" + uom + ")";
    }
    title.fontSize = 12;
    title.marginBottom = 20;

    let range

    trend.ruleDetails.forEach(pb => {

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



    //});

  }
  plottrend4(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []
    var hasFV: boolean = false;


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      if (e.sensorValue.toLowerCase() !== 'fv') {
        TrendValues.push(obj);
        val1.push(Number(obj.value));
      }
      else {
        hasFV = true;

        var Nobj: any = {};
        Nobj.date = STime;
        TrendValues.push(Nobj);
      }

    });


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();


    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    //this.zone.runOutsideAngular(() => {
    this.trendChart4 = am4core.create("trChart4", am4charts.XYChart);


    this.trendChart4.data = TrendValues;


    let dateAxis = this.trendChart4.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart4.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

//series.connect = false;

    series.stroke = am4core.color("#7092BE");


    this.trendChart4.cursor = new am4charts.XYCursor();
    this.trendChart4.cursor.xAxis = dateAxis;


    var title = this.trendChart4.titles.create();
    if (uom == "") {
      title.text = deviceName + " | " + sensorName;
    }
    else {
      title.text = deviceName + " | " + sensorName + " (" + uom + ")";
    }
    title.fontSize = 12;
    title.marginBottom = 20;

    let range

    trend.ruleDetails.forEach(pb => {

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



    //});

  }
  plottrend5(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];
    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []
    var hasFV: boolean = false;


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      if (e.sensorValue.toLowerCase() !== 'fv') {
        TrendValues.push(obj);
        val1.push(Number(obj.value));
      }
      else {
        hasFV = true;
        var Nobj: any = {};
        Nobj.date = STime;
        TrendValues.push(Nobj);
      }

    });

    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();


    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    //this.zone.runOutsideAngular(() => {
    this.trendChart5 = am4core.create("trChart5", am4charts.XYChart);


    this.trendChart5.data = TrendValues;


    let dateAxis = this.trendChart5.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart5.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

//series.connect = false;

    series.stroke = am4core.color("#7092BE");


    this.trendChart5.cursor = new am4charts.XYCursor();
    this.trendChart5.cursor.xAxis = dateAxis;


    var title = this.trendChart5.titles.create();
    if (uom == "") {
      title.text = deviceName + " | " + sensorName;
    }
    else {
      title.text = deviceName + " | " + sensorName + " (" + uom + ")";
    }
    title.fontSize = 12;
    title.marginBottom = 20;

    let range

    trend.ruleDetails.forEach(pb => {

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



    //});

  }
  plottrend6(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];
    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []
    var hasFV: boolean = false;

    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;


      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      if (e.sensorValue.toLowerCase() !== 'fv') {
        TrendValues.push(obj);
        val1.push(Number(obj.value));
      }
      else {
        hasFV = true;
        var Nobj: any = {};
        Nobj.date = STime;
        TrendValues.push(Nobj);
      }

    });


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();


    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;

    //this.zone.runOutsideAngular(() => {
    this.trendChart6 = am4core.create("trChart6", am4charts.XYChart);


    this.trendChart6.data = TrendValues;


    let dateAxis = this.trendChart6.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart6.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;

//series.connect = false;

    series.stroke = am4core.color("#7092BE");


    this.trendChart6.cursor = new am4charts.XYCursor();
    this.trendChart6.cursor.xAxis = dateAxis;


    var title = this.trendChart6.titles.create();
    if (uom == "") {
      title.text = deviceName + " | " + sensorName;
    }
    else {
      title.text = deviceName + " | " + sensorName + " (" + uom + ")";
    }
    title.fontSize = 12;
    title.marginBottom = 20;

    let range

    trend.ruleDetails.forEach(pb => {

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