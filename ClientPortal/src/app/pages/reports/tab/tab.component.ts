import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DeviceDataService } from '../../GlobalServices/devicedata.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../service/report.service';

declare var require: any
const FileSaver = require('file-saver');
import 'rxjs/Rx';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import Swal from 'sweetalert2'
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { ExportExcelService } from '../../GlobalServices/export-excel.service';
import { debounce } from 'rxjs-compat/operator/debounce';
import { DEGREES } from '@amcharts/amcharts4/.internal/core/utils/Math';
import { debug } from 'util';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AssignService } from '../../master/assign/service';
import { AnonymousSubscription } from 'rxjs-compat/Subscription';
import { Observable, Subscription } from 'rxjs/Rx';
import { escapeRegExp } from 'lodash';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare var $: any;

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {


  @ViewChild('modalFilter') modalFilter: any;
  @ViewChild('modalChart') modalChart: any;
  @ViewChild('modalPdfTemp') modalPdfTemp: any;
  @ViewChild('modalReportDates') modalReportDates: any;

  active: boolean;

  constructor(
    private _detailService: ReportService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _devicedataservice: DeviceDataService,
    private _exportExcel: ExportExcelService,
    private _commanService: IdeaBService,
    private _serviceassignTracker: AssignService) { }

  isTimes: boolean = false;
  isDates: boolean = false;
  isDaily: boolean = false;
  is15Days: boolean = false;
  is31Days: boolean = false;
  hasCharts: boolean = false;
  hasLogReports: boolean = false;
  hasPdfTemplate: boolean = false;
  hasRegReports: boolean = false;
  hasAudit: boolean = false;

  createReportModal: any = "";

  scheduleReport: any;
  selectedView = '1';
  devDataua: boolean = true;
  devAlert: boolean = true;
  devAudit: boolean = true;
  disableReportName: boolean = false;
  showCharts: boolean = false;
  showSVReports: boolean = false;
  showSCONReports: boolean = false;
  showSCReports: boolean = true;
  showOnDemandReports: boolean = false;
  showLogReports: boolean = false;
  hasSavedReports: boolean = false;
  isTrendType: boolean = false;
  showNPbtn: boolean = false;
  validName: boolean = false;
  showRadio: boolean = false;
  multiSensors: boolean = false;
  cameFrom: any;

  isDeviceReport: boolean = false;
  islogReport: boolean = false;
  isRegionReport: boolean = false;

  isNextDisabled: boolean = true;
  isPrevDisabled: boolean = true;

  RegSensorList: any;
  regSensorSelectedList: any = [];

  selectedDevice: any;
  selectedSensor: any;
  selectedSensorMath: any;

  selectedTomails: any;
  selectedCCmails: any;
  selectedBCCmails: any;

  toMailids: any;
  ccMailids: any;
  bccMailids: any;


  RChart1: any;
  RChart2: any;
  RChart3: any;
  RChart4: any;
  RChart5: any;
  RChart6: any;


  trendChart1: any;
  trendChart2: any;
  trendChart3: any;
  trendChart4: any;
  trendChart5: any;
  trendChart6: any;
  trendChartMax: any;

  reportNameTop: any;
  DeviceList: any;
  FilterDeviceList: any;

  SensorList: any;
  SensorUoM: any;
  SensorMath: any;
  SensorMathFiltered: any;
  maxDate: any = Date;
  minDate: any = Date;
  minDateE: any = Date;

  disablesensorMathSelectAll = false;
  disablesensorMathUnSelectAll = true;
  mathSelectedList: any;

  disabledeviceSelectAll = false;
  disabledeviceUnSelectAll = true;
  deviceSelectedList: any;
  regDeviceSelectedList: any;

  disablesensorSelectAll = false;
  disablesensorUnSelectAll = true;
  sensorSelectedList: any;


  LastChartIndex: any;
  CurrentChartIndex: any;

  dateRange: any;
  dateEnergyRange:any;
  DateRangeEnergyList:any = [];
  DateRangeList: any = [];
  DateRangeListReg: any = [];
  LogDateRangeList: any = [];

  reportUserMailIds: any = [];

  selectedRange: any = "";

  reportName: any = "";

  regionsList: any;
  totalRegions: any;

  regionId: any;

  periodRange: any;
  filteredPeriodRange: any;
  filteredEnergyPeriodRange:any;
  frequencyRange: any;
  LogfrequencyRange: any;
  frequency: any;

  dayRange: any;
  day: any;

  interval: any;
  isSensorReading: boolean = true;
  isScheduled: boolean = false;
  mode: boolean = true;
  Chmode: boolean = true;

  devMKT: boolean = true;
  generatedTime: boolean = true;

  fromDate: any;
  toDate: any;
  reportHR: any;
  reportMM: any;
  reportFHR: any;
  reportTHR: any;

  savedReports: any;
  allsavedReports: any;

  reportId: any;

  responseData: any;

  isSuperAdmin: boolean = false;

  reportFormatList: any = []
  reportTypeList: any = []
  chartTypeList: any = []

  logTypeList: any;
  logType: any;

  ngOnInit() {
    debugger
    this.is31Days = false;
    this.isDaily = true;
    var currentDate = new Date();
    this.fromDate = ""// new Date(new Date().setHours(0, 0, 0, 0));
    this.toDate = ""//currentDate;
    this.maxDate = currentDate;
    this.minDate = new Date(new Date().setDate(new Date().getDate() - 90));
    this.minDateE = new Date(new Date().setDate(new Date().getDate() - 30));

    this.logTypeList = [{ 'id': 0, 'name': 'User' }, { 'id': 1, 'name': 'Device' }];

    if (sessionStorage.getItem("User_SuperAdmin").toLowerCase() == "superadmin") {
      this.isSuperAdmin = true;
      this.showReportButton = true;
    }
    else {
      this.showReportButton = (sessionStorage.getItem("Get_ReportStatus") == "1") ? true : false;
      this.isSuperAdmin = false;
    }

    this.hasRegReports = false;

    if (sessionStorage.getItem("hasCddRegionReport") == "1") {
      this.hasRegReports = true;
    }

    this.hasAudit = false;
    if (sessionStorage.getItem("hasAuditReport") == "1") {
      this.hasAudit = true;
    }


    this.totalRegions = {}
    this.regionsList = []
    this.totalRegions = JSON.parse(sessionStorage.getItem("Regions"));

    this.reportUserMailIds = JSON.parse(sessionStorage.getItem("iotUserMailIds"));


    this.hasLogReports = false;
    this.hasCharts = false;
    this.hasPdfTemplate = false;

    let chartPlot = sessionStorage.getItem('ReportCharts');
    let logRep = sessionStorage.getItem('ReportLogs');
    let hasPdfTemplate = sessionStorage.getItem('ReportpdfTemplate');

    if (chartPlot == '1') {
      this.hasCharts = true;
    }

    if (logRep == '1') {
      this.hasLogReports = true;
    }

    if (hasPdfTemplate == '1') {
      this.hasPdfTemplate = true;
    }

    this.DeviceList = {}
    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    // this.reportFormatList.push({ name: 'PDF', value: 'PDF' }, { name: 'Excel', value: 'Excel' },
    //   { name: 'CSV', value: 'CSV' });
    this.reportFormatList.push({ name: 'PDF', value: 'PDF' },
      { name: 'CSV', value: 'CSV' });
    // , { name: 'JPEG', value: 'JPEG' }
    this.reportTypeList.push({ name: 'OnDemand', value: 'OnDemand' }, { name: 'Schedule', value: 'Schedule' });


    this.RegSensorList = []

    this.RegSensorList.push({ snrId: 't', snrName: 'T - °C' }, { snrId: 'h', snrName: 'RH - %' })


    this.chartTypeList.push({ name: 'Single', value: 'Single' }, { name: 'Multiple', value: 'Multiple' });

    this.totalRegions.forEach(reg => {
      //
      this.DeviceList.forEach(uD => {
        //
        if (uD.regionId == reg.regionId) {

          if (this.regionsList.length > 0) {

            const found = this.regionsList.some(item => item.regionId === reg.regionId);


            if (found == false) {
              this.regionsList.push(reg);
            }
          }
          else {
            this.regionsList.push(reg);
          }
        }
      });
    });


    this.SensorMath = {}
    this.SensorMath = JSON.parse(sessionStorage.getItem("MathFunctions"));

    this.SensorUoM = {}
    this.SensorUoM = JSON.parse(sessionStorage.getItem("Sensor_UoM"));

    this.loadDateRanges();

    this.loadPeriods();

    this.loadFrequency();

    this.getSavedReports("", "landing");

    this.getUsers();

    this.TimerTick();
  }

  scheduleReportFont: any = ""
  scheduleReportBG: any = ""

  onDemandReportFont: any = ""
  onDemandReportBG: any = ""

  showSchedule() {

    this.showSCReports = true;
    this.showOnDemandReports = false;
    this.scheduleReportFont = "Bold";
    this.onDemandReportFont = "normal";

    this.scheduleReportBG = '#03243B';
    this.onDemandReportBG = '#4d6a7c';
  }

  showOnDemand() {

    this.showOnDemandReports = true;
    this.showSCReports = false;
    this.onDemandReportFont = "Bold";
    this.scheduleReportFont = "normal";


    this.scheduleReportBG = '#4d6a7c';
    this.onDemandReportBG = '#03243B';


  }

  selectedUser: any;
  UserList: any;
  LogUserList: any;

  getUsers() {

    this.selectedUser = undefined;

    var resp: any
    this._serviceassignTracker.getUserDetails().subscribe(data => {
      debugger
      resp = []


      let LoginUser = sessionStorage.getItem('LoginUser');

      resp.push({ userName: LoginUser })

      data.userData.forEach(user => {
        resp.push({ userName: user.userName })
      });

      this.LogUserList = resp;

      this.UserList = data.userData;
    });
  }




  showDiv(showWhat: any) {
    this.showCharts = false;
    this.showSVReports = false;
    this.showSCONReports = false;
    this.showSCReports = false;
    this.showOnDemandReports = false;
    this.showRadio = false;
    this.showLogReports = false;

    if (showWhat == "chart") {
      this.showRadio = true;
      this.showCharts = true;

      if (this.allsavedReports.length > 0) {
        this.hasSavedReports = true;
        this.getReport(this.allsavedReports[0].reportId, this.allsavedReports[0].mathfunctions, this.allsavedReports[0].reportName, "");
      }
      else {
        this.hasSavedReports = false;
      }

    }
    else if (showWhat == "scheduled") {

      this.showSCONReports = true;

      this.getScheduleReportsList("");
      this.showSchedule();
    }
    else
      if (showWhat == "LogReports") {
        this.showLogReports = true;
        this.getLogReportsList();
      }
  }

  Exportdataset: any;

  exportToExcel(fileName: any) {

    var headerText = [fileName] //[this.trendResponse.title]
    var columnKeys = [
      { key: 'deviceId', width: 40 },
      { key: 'sensorId', width: 30 },
      { key: 'sensorValue', width: 20 },
      { key: '_sensorTime', width: 25 }
    ];
    var columnHeaders = ["Device Name", "Sensor", "Value", "Time"]

    this.Exportdataset = [];



    this.responseData.forEach(resp => {

      resp.trend.forEach(element => {

        this.Exportdataset.push([
          element.deviceId,
          element.sensorName,
          element.sensorValue,
          element._sensorTime
        ]);
      });
    });




    var frDate = this.responseData[0].frTime;
    var toDate = this.responseData[0].toTime;


    this._exportExcel.exportExcelFileMultiTrend(fileName, headerText, columnKeys, columnHeaders, this.Exportdataset, frDate, toDate)


  }

  regSensor(obj: any) {


    if (obj.length == 0) {
      this.selectedSensor = [];
    }
    if (obj.length == 1) {
      this.selectedSensor = obj[0].snrName
    }
    if (obj.length == 2) {
      this.selectedSensor = obj[0].snrName + ', ' + obj[1].snrName
    }
  }
  Morethan_30days() {
    debugger
    // this.reportFHR = "";
    // this.reportTHR = "";
    // this.isTimes = false;
    var Difference_In_Time = this.fromDate[1].getTime() - this.fromDate[0].getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days >= 20) {
      this.is31Days = true;
      this.devMKT = false;
      this.devAlert = false;
      this.devDataua = false;
      this.chTypeSelected = "";
    } else {
      this.is31Days = false
    }

  }

  exportStateDataToExcel(fileName: any) {

    var headerText = [fileName] //[this.trendResponse.title]
    var columnKeys = [
      { key: 'deviceId', width: 30 },
      { key: 'Date', width: 30 },
      { key: 'desc', width: 50 },
      { key: 'critical', width: 20 },
      { key: 'warning', width: 20 },
      { key: 'ok', width: 20 }
    ];
    var columnHeaders = ["Device Name", "Date", "Rule", "Critical", "Warning", "Good"]



    this.Exportdataset = [];



    this.responseData.forEach(resp => {

      resp.Duration.forEach(element => {

        this.Exportdataset.push([
          resp.deviceName,
          element._date,
          element.ruleDesc,
          element.critical,
          element.warning,
          element.ok
        ]);
      });
    });




    var frDate = this.responseData[0].frTime;
    var toDate = this.responseData[0].toTime;


    this._exportExcel.exportExcelFileMultiTrend(fileName, headerText, columnKeys, columnHeaders, this.Exportdataset, frDate, toDate)


  }

  pintToDB(reportId: any, cameFrom: any) {
    var resp: any = [];

    this._detailService.PintoDashboard(reportId).subscribe(result => {


      resp = result;
      if (resp.sts == "200") {
        this.toastr.success(resp.msg);

        if (cameFrom == "saved") {
          this.getSavedReportsList("");
        }
        if (cameFrom == "Scheduled") {
          this.getScheduleReportsList("");
        }
      }
      else {
        this.toastr.warning(resp.msg);
      }
    });
  }

  saveTemplate() {

    var resp: any = []

    this._detailService.updatePDFtemplate(this.selectedView).subscribe(result => {


      resp = result;

      if (resp.sts == "200") {
        this.toastr.success(resp.msg);
        this.modalPdfTemp.hide();

        let PDFText = "";
        if (this.selectedView == '1') {
          PDFText = "No Header Logo";
        } else if (this.selectedView == '2') {
          PDFText = "My Company Logo on Right";
        } else if (this.selectedView == '3') {
          PDFText = "My Company Logo on Left";
        } else if (this.selectedView == '4') {
          PDFText = "Client Logo on Left";
        } else if (this.selectedView == '5') {
          PDFText = "Client Logo on Right";
        } else if (this.selectedView == '6') {
          PDFText = "Client Logo on Left & My Company Logo on Right";
        } else if (this.selectedView == '7') {
          PDFText = "Client Logo on Right & My Company Logo on Left";
        }

        let logReq = {
          "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
          "module": "Analytics",
          "actionPerformed": "PDF Template has been selected. Info - " + PDFText
        }

        this._commanService.logUpdate(logReq);

      }
      else {
        this.toastr.warning(resp.msg);
      }
    });
  }

  deleteReport(reportId: any, reportName: any, cameFrom: any) {

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

          this.toastr.success("Deleted Successfully");


          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Analytics",
            "actionPerformed": "Report has been deleted. Report Name: " + reportName
          }

          this._commanService.logUpdate(logReq);



          // this.getSavedReports("", "");

          // if (cameFrom == "srList") {
          //   this.getSavedReportsList("");
          // }
          // else
          //   if (cameFrom == "schList") {
          this.getScheduleReportsList("");
          //   }

        });
      }
    });
  }


  reportFormat: any = ""

  onItemChange(type) {
    this.reportFormat = type.value;
    this.deviceSelectedList = [];
    this.selectedDevice = "";
  }

  onRPItemChange(type) {
    debugger

    this.isDates = false;
    this.dateRange = [];
    this.isScheduled = false;
    this.reportFHR = '';
    this.reportTHR = '';

    if (type.value.toLowerCase() == "ondemand") {
      this.isDates = true;
      this.is31Days = false
      this.isTimes = true;
    }
    else {
      this.isScheduled = true;
      this.is31Days = false;
      // this.isSensorReading = false;
      this.isTimes = false;
    }
  }

  onTypeChange(type) {


    if (type.value == 'Single') {
      this.Chmode = true;
    }
    else {
      this.Chmode = false;
    }
  }

  logReports: any

  getSavedReports(reportId: any, cameFrom: any) {
    debugger
    this.cameFrom = cameFrom;

    this.reset();
    this._detailService.GetSavedReport(reportId).subscribe(result => {
      

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
          obj.devices = sr.devices.replaceAll("\r\n", "");
          obj.sensors = sr.sensors;
          obj.period = sr.period;
          obj.mathfunctions = sr.mathfunctions;
          obj.showinDB = sr.showinDB;
          obj.shortCode = sr.shortCode;
          obj.regionId = sr.regionId;
          obj.interval = sr.interval;
          obj.showThis = false;

          obj.toMailds = sr.toMailds;
          obj.ccMailds = sr.ccMailds;
          obj.bccMailds = sr.bccMailds;
          obj.timeToSend = sr.timeToSend;
          obj.dayToSend = sr.dayToSend;
          obj.frequency = sr.frequency;
          obj.chType = sr.chType;
          obj.dataUA = sr.dataUA;
          obj.devAlert = sr.devAlert;
          obj.devAudit = sr.devAudit;
          obj.devMKT = sr.devMKT;
          obj.generatedTime = sr.generatedTime;
          obj.reportFormat = sr.reportFormat;
          obj.isOnDemand = sr.isOnDemand;
          this.savedReports.push(obj);
        });


        if (reportId !== "" && reportId !== undefined) {
          this.reportId = reportId;
          this.openFilter("update");
          this.isCreate = false;

        }
        else {
          this.reportId = "";
          this.allsavedReports = [];
          this.allsavedReports = this.savedReports;

          if (this.allsavedReports.length > 0) {

            this.getReport(this.allsavedReports[0].reportId, this.allsavedReports[0].mathfunctions, this.allsavedReports[0].reportName, "");
          }

        }
      }
      else {
        this.hasSavedReports = false;
      }

      if (cameFrom == "landing") {
        if (this.hasSavedReports == true) {
          this.showDiv('scheduled');
        }
        else {
          this.openFilter('New');
        }
      }
      debugger
      if(resp.length > 0 && resp[0].period.includes(',')){
        this.isTimes = true;
      }
      else{
        this.isTimes = false;
      }
    });
  }

  loadReport(obj: any, type: any) {

    // this.loaderService.display(true);

    obj.type = "report";

    if (type == "chart") {
      this.showSVReports = false;
      this.showSCONReports = false;
      this.showCharts = true;

      this.selectedItemID = "";
      this._detailService.ShowReport(obj).subscribe(result => {
        // this.loaderService.display(false);

        this.responseData = [];

        this.responseData = result;
        this.CurrentChartIndex = 0;
        this.LastChartIndex = 0;

        if (this.responseData.length > 0) {

          this.modalFilter.hide();
          this.plotRcharts();
        }
        else {
          this.toastr.warning("Report is unavailable due to no data");

        }
      });
    }
    else
      if (type == "file") {
        obj.type = "file";


        obj.reportFormat = this.reportFormat;
        obj.chType = (this.Chmode == true) ? '1' : '2';
        obj.dataUA = (this.devDataua == true) ? '1' : '0';
        obj.devAlert = (this.devAlert == true) ? '1' : '0';
        obj.devAudit = (this.devAudit == true) ? '1' : '0';
        obj.devMKT = (this.devMKT == true) ? '1' : '0';
        obj.generatedTime = (this.generatedTime == true) ? '1' : '0';

        this._detailService.GetReportPDF(obj).subscribe(result => {
          // this.loaderService.display(false);

          this.responseData = [];

          this.responseData = result;
          this.CurrentChartIndex = 0;
          this.LastChartIndex = 0;



          if (type == "file") {
            if (this.responseData.sts == "200") {

              // window.location.href = resp.msg;
              if (this.responseData.msg == "") {
                this.toastr.warning("Failed to download report");
              }
              else {
                var files: any;
                if (this.responseData.msg.includes('.pdf') || this.responseData.msg.includes('.csv')
                  || this.responseData.msg.includes('.xlsx') || this.responseData.msg.includes('.xls')
                  || this.responseData.msg.toLowerCase().includes('.jpg') || this.responseData.msg.toLowerCase().includes('.jpeg')) {
                  var tabI: number = 0;
                  files = this.responseData.msg.split(',');

                  files.forEach(f => {
                    tabI += 1;

                    // FileSaver.saveAs(f, "reportFile");
                    window.open(f, tabI + '');
                    // window.open(f, tabI + '', "menubar=yes, location=yes, resizable=yes, scrollbars=yes, titlebar=yes, width=400, height=300, top=10, left=10");

                    // this.downloadFile(f);
                  });
                }
                // else {
                //   var tabI: number = 0;

                //   files = this.responseData.msg.split('|');

                //   files.forEach(f => {

                //     if (f !== '') {
                //       tabI += 1;

                //       const a = document.createElement('a');
                //       a.target = '_blank';
                //       a.href = f;
                //       a.download = tabI + obj.reportName + '.jpg';
                //       a.click();
                //     }

                //   });
                // }

                let logReq = {
                  "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
                  "module": "Analytics",
                  "actionPerformed": "Report has been downloaded. Report Name: " + obj.reportName
                }

                this._commanService.logUpdate(logReq);

                //window.open(this.responseData.msg, '_bank');
              }
            }
            else {
              this.toastr.warning(this.responseData.msg);
            }
          }

          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Analytics",
            "actionPerformed": "Report has been downloaded. Report Name: " + obj.reportName
          }

          this._commanService.logUpdate(logReq);

        });
      }

  }

  plotPrev() {
    this.isNextDisabled = false;
    this.LastChartIndex = this.LastChartIndex - 6;
    this.plotRcharts();
  }
  plotNext() {
    this.isPrevDisabled = false; //enable
    this.LastChartIndex = this.LastChartIndex + 6;
    this.plotRcharts();
  }

  getExcelData(reportId: any, reportType: any, reportName: any) {
    this._detailService.GenerateReport(reportId).subscribe(result => {

      this.responseData = [];

      this.loaderService.display(false);

      this.responseData = result;

      if (reportType == '100') {
        this.exportStateDataToExcel(reportName);
      }
      else {
        this.exportToExcel(reportName);
      }

    });
  }

  getSavedReportsList(reportId: any) {

    this._detailService.GetSavedReport(reportId).subscribe(result => {

      var srData = [];
      var resp: any = [];
      resp = result;

      var DisplayIcon1: any
      var DisplayIcon2: any
      var DisplayIcon3: any
      var DisplayIcon4: any
      var DisplayIcon5: any


      var reportNameColor: any;

      resp.forEach(element => {

        if (element.frequency == "") {

          if (this.hasCharts) {
            DisplayIcon1 = ' <div *ngIf="hasCharts" style="background-color:#06D79C;border-radius: 5px;padding-left: 5px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;"><i class="fa fa-line-chart" style="font-size:18px;cursor:pointer;color:white;"  title="Plot" ></i></div>'
          }
          // else {
          //   DisplayIcon1 = "<div></div>";
          // }

          if (element.showinDB == "1") {
            DisplayIcon4 = ' <div style="background-color:#06D79C;border-radius: 5px;height: 25px;padding-top: 2px;width: 30px;margin-right: 3px;margin-left: -55px;"><img src="assets/Images/pin.png" height="23px" title="Pin to Dashboard" ></i></div>'
          }
          if (element.showinDB == "0") {
            DisplayIcon4 = ' <div style="background-color:#398BF7;border-radius: 5px;height: 25px;padding-top: 2px;width: 30px;margin-right: 3px;margin-left: -55px;"><img src="assets/Images/pin.png" height="23px" title="Pin to Dashboard" ></i></div>'
          }

          DisplayIcon2 = ' <div style="background-color:#398BF7;border-radius: 5px;padding-left: 6px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -25px;"><i class="fa fa-download" style="font-size:18px;cursor:pointer;color:white;" title="Download" ></i></div>'

          if (element.readWrite == "1") {
            DisplayIcon3 = ' <div style="background-color:#745AF2;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -40px;"><i class="fa fa-pencil-square-o" style="font-size:18px;cursor:pointer;color:white;" title="Edit" ></i></div>'



            DisplayIcon5 = ' <div style="background-color:#E55350;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -70px;"><i class="fa fa-trash-o" style="font-size:18px;cursor:pointer;color:white;" title="Delete" ></i></div>'

          }
          else {
            //DisplayIcon2 = ' <div style="background-color:gray;border-radius: 5px;padding-left: 6px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -25px;"><i class="fa fa-download" style="font-size:18px;cursor:pointer;color:white;" title="Download | No Access" ></i></div>'
            DisplayIcon3 = ' <div style="background-color:gray;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -40px;"><i class="fa fa-pencil-square-o" style="font-size:18px;color:white;" title="Edit | No Access" ></i></div>'
            // DisplayIcon4 = ' <div style="background-color:gray;border-radius: 5px;height: 25px;padding-top: 2px;width: 30px;margin-right: 3px;margin-left: -55px;"><img src="assets/Images/pin.png" height="23px" title="Pin to Dashboard | No Access" ></i></div>'
            DisplayIcon5 = ' <div style="background-color:gray;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -70px;"><i class="fa fa-trash-o" style="font-size:18px;color:white;" title="Delete | No Access" ></i></div>'
          }




          reportNameColor = '<span style="color:#0090D9">' + element.reportName + '</span>'


          srData.push([
            reportNameColor,
            element.updatedBy,
            element.lastUpdated,
            DisplayIcon1,
            DisplayIcon2,
            DisplayIcon3,
            DisplayIcon4,
            DisplayIcon5,
            element.reportId,
            element.mathfunctions,
            element.reportName,
            element.readWrite
          ]
          )
        }
      });


      this.bindDatatoSRTable(srData);

    });
  }


  bindDatatoSRTable(data: any) {
    $('#srTable').dataTable().fnDestroy();
    var table = $('#srTable').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
      ordering: false,
      searching: false
    });
    table.clear().rows.add(data).draw();

    var that = this;

    $('#srTable tbody').off().on('click', 'td', function () {


      var Index = this.cellIndex

      var data = $(this).parent();
      var table = $('#srTable').DataTable();

      data = table.row(data).data();

      if (Index == "3") {
        that.getReportFromSRTab(data[8], data[9], data[10]);
      }
      // if (Index == "4" && data[11] == "1") {
      if (Index == "4") {
        that.getReportPDF(data[8], data[9], data[10], "");
      }

      if (Index == "5" && data[11] == "1") {
        that.getSavedReports(data[8], "Saved");
      }
      // if (Index == "6" && data[11] == "1") {
      if (Index == "6") {
        that.pintToDB(data[8], "saved");
      }
      if (Index == "7" && data[11] == "1") {
        that.deleteReport(data[8], data[10], "srList");
      }


    });

  }

  reportList: any = []
  getScheduleReportsList(reportId: any) {

    this._detailService.GetSavedReport(reportId).subscribe(result => {

      this.reportList = result;

      this.loadReports();

    });
  }


  reportListForTableSchedule: any = [];
  reportListForTableOnDemand: any = [];

  loadReports() {
    var srData = [];
    var resp: any = [];
    resp = this.reportList;

    this.reportListForTableSchedule = [];
    this.reportListForTableOnDemand = [];

    var DisplayIcon1: any
    var showDownload: boolean = false;
    var showEdit: boolean = false;
    var blockDownload: boolean = false;
    var showDelete: boolean = false;

    var DisplayIcon2: any
    var DisplayIcon3: any
    var DisplayIcon4: any
    var DisplayIcon5: any

    var freq: any;
    var reportNameColor: any;

    var idx: any = 0

    var schReport: any = []

    resp.forEach(element => {

      idx = idx + 1;

      var cnt: any = [];
      cnt = this.requestedReports.filter(g => g.reportId == element.reportId)

      if (cnt.length > 0) {
        showDownload = false;// DisplayIcon2 = //' <div style="border-radius: 5px;padding-left: 8px;height: 25px;padding-top: 3px;width: 30px;margin-right: 3px;margin-left: -13px;"><i class="fa fa-spinner fa-spin" style="color:#398BF7;" title="pending"></i></div>'
      }
      else {
        showDownload = true;// = ' <div style="background-color:#398BF7;border-radius: 5px;padding-left: 6px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -13px;"><i class="fa fa-download" style="font-size:18px;cursor:pointer;color:white;" title="Download" ></i></div>'
      }

      if (element.dynamicType.toLowerCase() == "regular") {
        if (element.showinDB == "1") {
          DisplayIcon4 = ' <div style="background-color:#06D79C;border-radius: 5px;height: 25px;padding-top: 2px;width: 30px;margin-right: 3px;margin-left: -55px;"><img src="assets/Images/pin.png" height="23px" title="Pin to Dashboard" ></i></div>'
        }
        if (element.showinDB == "0") {
          DisplayIcon4 = ' <div style="background-color:#398BF7;border-radius: 5px;height: 25px;padding-top: 2px;width: 30px;margin-right: 3px;margin-left: -55px;"><img src="assets/Images/pin.png" height="23px" title="Pin to Dashboard" ></i></div>'
        }
      } else {
        DisplayIcon4 = ' <div style="background-color:#398BF7;border-radius: 5px;height: 25px;cursor:no-drop;padding-top: 2px;width: 30px;margin-right: 3px;margin-left: -55px;"><img src="assets/Images/pin.png"; height="23px" title="Pin to Dashboard" ></i></div>'
      }

      if (element.isReady == "1") {
        blockDownload = false;
      }
      else {
        blockDownload = true;
      }


      if (element.readWrite == "1") {
        showEdit = true;
        showDelete = true;

        DisplayIcon3 = ' <div style="background-color:#745AF2;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -40px;"><i class="fa fa-pencil-square-o" style="font-size:18px;cursor:pointer;color:white;" title="Edit" ></i></div>'

        DisplayIcon5 = ' <div style="background-color:#E55350;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -70px;"><i class="fa fa-trash-o" style="font-size:18px;cursor:pointer;color:white;" title="Delete" ></i></div>'
      }
      else {
        showEdit = false;
        showDelete = false;

        DisplayIcon3 = ' <div style="background-color:gray;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -40px;"><i class="fa fa-pencil-square-o" style="font-size:18px;cursor:no-drop;color:white;" title="Edit | No Access" ></i></div>'
        DisplayIcon5 = ' <div style="background-color:gray;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -70px;"><i class="fa fa-trash-o" style="font-size:18px;cursor:no-drop;color:white;" title="Delete | No Access" ></i></div>'
      }



      // if (this.hasCharts) {
      //   DisplayIcon1 = ' <div style="background-color:#06D79C;border-radius: 5px;padding-left: 5px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;"><i class="fa fa-line-chart" style="font-size:18px;cursor:pointer;color:white;"  title="Plot" ></i></div>'
      // }
      // else { DisplayIcon1 = '<div></div>' }


      reportNameColor = '<span style="color:#743FAA">' + element.reportName + '</span>'

      var freqInTable: any = "";
      freq = [];

      freq = this.frequencyRange.filter(g => g.frequency == element.frequency);

      if (element.frequency == "0") {

        freqInTable = freq[0].fVal;
      }
      else
        if (element.frequency == "1") {
          this.getWeekDay(element.dayToSend);
          freq[0].frequency = 1;
          freqInTable = "Weekly | Every " + this.dayOfWeek;
        }
        else
          if (element.frequency == "2") {
            // freq[0].fVal = element.dayToSend
            freq[0].frequency = 2;
            freqInTable = "Monthly | Every " + "Day " + element.dayToSend;
          }
          else
            if (element.frequency == "3") {
              // freq[0].fVal = element.dayToSend
              freq[0].frequency = 3;
              freqInTable = "Every 15 Days";
            }


      if (freqInTable.length > 0) {
        freqInTable = freqInTable + " | ";
      }

      var deviceNames: any = "";

      var deviceIds: any = []


      deviceIds = element.devices.split(',');




      deviceIds.forEach(dev => {
        var objDev = this.DeviceList.filter(d => d.sensorId == dev.replace('\r\n', ''));
        deviceNames += objDev[0].deviceName + ",";
      });

      deviceNames = deviceNames.substring(0, deviceNames.length - 1);

      if (deviceNames.length > 80) {
        deviceNames = deviceNames.substring(0, 77) + '...';
      }

      var reportPeriod: any = "";

      if (element.period.toLowerCase() == 'lastday') {
        reportPeriod = "Yesterday"
      }
      else {

        var _val: any;



        _val = Number(element.period)

        if (isNaN(_val)) {
          reportPeriod = element.period;
        }
        else {
          if (element.period == 720) { reportPeriod = "Last Month" }
          else {
            reportPeriod = element.period / 24 + " Days";
          }
        }
      }


      if (element.frequency.length > 0) {
        this.reportListForTableSchedule.push({
          reportName: element.reportName,
          dynamicType: element.dynamicType,
          freqInTable: freqInTable,
          timeToSend: element.timeToSend,
          updatedBy: element.updatedBy,
          lastUpdated: element.lastUpdated,
          showDownload: showDownload,
          showEdit: showEdit,
          icon4: DisplayIcon4,
          showDelete: showDelete,
          reportId: element.reportId,
          mathfunctions: element.mathfunctions,
          readWrite: element.readWrite,
          frequency: element.frequency,
          reportFormat: element.reportFormat,
          length: cnt.length,
          isOnDemand: element.isOnDemand,
          deviceNames: deviceNames.replaceAll(',', '\r\n'),
          period: reportPeriod,
          sensorNames: element.sensorNames,
          deviceCount: element.deviceCount,
          sensorCount: element.sensorCount,
          showThis: false,
          blockDownload: blockDownload,
          reportFile: element.reportFile
        });
      }
      else {
        this.reportListForTableOnDemand.push({
          reportName: element.reportName,
          dynamicType: element.dynamicType,
          freqInTable: freqInTable,
          timeToSend: element.timeToSend,
          updatedBy: element.updatedBy,
          lastUpdated: element.lastUpdated,
          showDownload: showDownload,
          showEdit: showEdit,
          icon4: DisplayIcon4,
          showDelete: showDelete,
          reportId: element.reportId,
          mathfunctions: element.mathfunctions,
          readWrite: element.readWrite,
          frequency: element.frequency,
          reportFormat: element.reportFormat,
          length: cnt.length,
          isOnDemand: element.isOnDemand,
          deviceNames: deviceNames.replaceAll(',', '\r\n'),
          period: reportPeriod,
          sensorNames: element.sensorNames,
          deviceCount: element.deviceCount,
          sensorCount: element.sensorCount,
          showThis: false,
          blockDownload: blockDownload,
          reportFile: element.reportFile
        });
      }

      if (this.reportListForTableOnDemand.length > 0) {
        this.scheduleReportSize = '240px'
      }
      else {
        this.scheduleReportSize = '500px'
      }

      srData.push([
        reportNameColor,
        freqInTable,
        element.timeToSend,
        element.updatedBy,
        element.lastUpdated,
        DisplayIcon1,
        DisplayIcon2,
        DisplayIcon3,
        DisplayIcon4,
        DisplayIcon5,
        element.reportId,
        element.mathfunctions,
        element.reportName,
        element.readWrite,
        element.frequency,
        element.reportFormat,
        element.dynamicType,
        cnt.length
      ]
      )

    });


  }

  reportDates: any = [];
  reportFiles: any = [];
  fromDatelist: any = "";
  reportsFromDates: any = [];

  selectedDuration(reportId: any) {

    var obj: any = {}

    obj.reportId = reportId;
    obj.fromDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDatelist[0]);
    obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.fromDatelist[1]);

    var resp: any = []

    this._detailService.GetReportFromDates(obj).subscribe(result => {
      resp = result;

      this.loaderService.display(false);

      if (resp.sts == "200") {


        if (resp.msg == "") {
          this.toastr.warning("Report is unavailable due to no data");
        }
        else {
          if (resp.msg == "Failed") {
            this.toastr.warning("Report is unavailable due to no data");
          }
          else {

            var files: any;

            if (resp.cnt == 1) {

              if (resp.msg.includes('.pdf') || resp.msg.includes('.csv')
                || resp.msg.includes('.xlsx') || resp.msg.includes('.xls')) {
                var tabI: number = 0;
                files = resp.msg.split(',');

                files.forEach(f => {
                  tabI += 1;

                  window.open(f, tabI + '');

                });
              }

            }
            else
              if (resp.cnt > 1) {
                files = resp.msg.split(',');

                this.reportsFromDates = [];
                this.reportFiles = files;
                this.reportDates = resp.reportDates.split(',');
                var idx: number
                idx = 0;
                this.reportDates.forEach(repo => {

                  var repoFiles = this.reportFiles.filter(gr => gr.includes(repo));
                  var rfile = ""
                  for (let rf = 0; rf < repoFiles.length; rf++) {
                    rfile += repoFiles[rf] + ',';
                  }

                  this.reportsFromDates.push(
                    {
                      reportDate: repo,
                      reportFile: rfile
                    }
                  )


                  idx += 1;
                });

                this.modalReportDates.show();

              }


            // this.toastr.success("Request for report has been placed", "", { timeOut: 5000 });

            // // this.loadReports();
            // var reportList = this.reportListForTableSchedule.filter(g => g.reportId == reportId)

            // if (reportList.length > 0) {
            //   this.reportListForTableSchedule.forEach(rep => {
            //     if (rep.reportId == reportId) {
            //       rep.showDownload = false;
            //     }
            //   });
            // }
            // else {
            //   this.reportListForTableOnDemand.forEach(rep => {
            //     if (rep.reportId == reportId) {
            //       rep.showDownload = false;
            //     }
            //   });
            // }

            // this.checkReportStatus(reportId, reportName);


          }
        }
      }
      else {
        //this.toastr.warning("Report is unavailable due to no data");
        this.toastr.warning(resp.msg);
      }
    });
  }

  openReport(reportFile) {
    var files = reportFile.split(',');
    var tabI: number = 0;

    files.forEach(f => {
      if (f.length > 0) {
        tabI += 1;
        window.open(f, tabI + '');
      }
    });
    // window.open(reportFile);
  }

  showRepoList(reportId: any) {

    // this.reportListForTableSchedule.filter(g => g.reportId == reportId).showThis = true;

    this.reportListForTableSchedule.forEach(rep => {
      if (rep.reportId == reportId) {
        if (rep.showThis) {
          rep.showThis = false;
          this.fromDatelist = "";
        }
        else {
          rep.showThis = true;
        }
      }
      else {
        rep.showThis = false;
      }
    });

  }


  scheduleReportSize: any = 0;

  private timer;
  private sub: Subscription;

  TimerTick() {
    this.timer = Observable.timer(0, Number(5) * 1000);
    this.sub = this.timer.subscribe(N => this.CheckOnDemandReport())
  }

  CheckOnDemandReport() {

    var ondemandReports = this.reportListForTableOnDemand.filter(g => g.isOnDemand == "1")

    if (ondemandReports.length > 0) {
      ondemandReports.forEach(report => {

        this.checkReportStatus(report.reportId, report.reportName);

      });
    }
    // else {
    //   this.toastr.success('No Pending Reports')
    // }

  }

  getLogReportsList() {

    this.logReports = []
    this._detailService.GetLogReports().subscribe(result => {


      var srData = [];
      var resp: any = [];
      resp = result;

      var DisplayIcon1: any
      var DisplayIcon2: any
      var DisplayIcon3: any

      var freq: any;
      var reportNameColor: any;

      resp.forEach(element => {

        DisplayIcon1 = ' <div style="background-color:#398BF7;border-radius: 5px;padding-left: 6px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -25px;"><i class="fa fa-download" style="font-size:18px;cursor:pointer;color:white;" title="Download" ></i></div>'
        DisplayIcon2 = ' <div style="background-color:#745AF2;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -40px;"><i class="fa fa-pencil-square-o" style="font-size:18px;cursor:pointer;color:white;" title="Edit" ></i></div>'
        DisplayIcon3 = ' <div style="background-color:#E55350;border-radius: 5px;padding-left: 7px;height: 25px;padding-top: 4px;width: 30px;margin-right: 3px;margin-left: -70px;"><i class="fa fa-trash-o" style="font-size:18px;cursor:pointer;color:white;" title="Delete" ></i></div>'

        reportNameColor = '<span style="color:#743FAA">' + element.ReportName + '</span>'

        var freqInTable: any = "";
        freq = [];

        freq = this.frequencyRange.filter(g => g.frequency == element.Frequency);

        if (element.Frequency == "0") {
          freqInTable = freq[0].fVal;
        }
        else
          if (element.Frequency == "1") {
            this.getWeekDay(element.DayToSend);
            freq[0].frequency = 1;
            freqInTable = "Weekly | Every " + this.dayOfWeek;
          }
          else
            if (element.Frequency == "2") {
              // freq[0].fVal = element.dayToSend
              freq[0].frequency = 2;
              freqInTable = "Monthly | Every " + "Day " + element.DayToSend
            }
            else
              if (element.Frequency == "3") {
                // freq[0].fVal = element.dayToSend
                freq[0].frequency = 3;
                freqInTable = "Every 15 Days"
              }

        srData.push([
          reportNameColor,
          // freqInTable,
          // element.TimeToSend,
          element.updatedBy,
          element.LastUpdated,
          DisplayIcon1,
          DisplayIcon2,
          DisplayIcon3,
          element.reportId,
          element.LogType,
          element.ReportName,
          element.LogUserIds,
          element.Devices,
          element.Period,
          element.ToMailid,
          element.CCMailid,
          element.BCCMailid,
          element.DayToSend,
          element.Frequency,
        ])

        this.logReports.push({
          reportId: element.reportId,
          LogType: element.LogType,
          ReportName: element.ReportName,
          LogUserIds: element.LogUserIds,
          Devices: element.Devices,
          Period: element.Period,
          ToMailid: element.ToMailid,
          CCMailid: element.CCMailid,
          BCCMailid: element.BCCMailid,
          DayToSend: element.DayToSend,
          Frequency: element.Frequency,
          TimeToSend: element.TimeToSend,
          updatedBy: element.updatedBy,
          LastUpdated: element.LastUpdated
        })
        // }
      });


      this.bindDatatolOGTable(srData);

    });
  }

  dayOfWeek: any;
  getWeekDay(day: any) {

    this.dayOfWeek = "";

    if (day == "1") {
      this.dayOfWeek = "Sunday";
    }
    else
      if (day == "2") {
        this.dayOfWeek = "Monday";
      }
      else
        if (day == "3") {
          this.dayOfWeek = "Tuesday";
        }
        else
          if (day == "4") {
            this.dayOfWeek = "Wednesday";
          }
          else
            if (day == "5") {
              this.dayOfWeek = "Thursday";
            }
            else
              if (day == "6") {
                this.dayOfWeek = "Friday";
              }
              else
                if (day == "7") {
                  this.dayOfWeek = "Saturday";
                }
  }

  bindDatatolOGTable(data: any) {
    $('#logTable').dataTable().fnDestroy();
    var table = $('#logTable').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
      ordering: false,
      searching: false
    });
    table.clear().rows.add(data).draw();

    var that = this;

    $('#logTable tbody').off().on('click', 'td', function () {


      var Index = this.cellIndex

      var data = $(this).parent();
      var table = $('#logTable').DataTable();

      data = table.row(data).data();

      if (Index == "3") {//download
        that.downloadReport(data[6]);
      }

      if (Index == "4") {//edit

        that.isCreate = false;
        that.getEditLogReport(data[6]);
      }

      if (Index == "5") {//delete
        that.deleteLogReport(data[6]);
      }


    });

  }

  downloadReport(reportId: any) {
    var logReport: any
    var obj: any

    obj = {}

    obj.reportType = 'pdf';


    logReport = {}

    logReport = this.logReports.filter(g => g.reportId == reportId);

    obj.logType = Number(logReport[0].LogType);

    if (logReport[0].Devices !== '' && logReport[0].Devices !== null) {
      var devices: any = [];

      devices = logReport[0].Devices.split(',');

      this.deviceSelectedList = [];
      this.selectedDevice = "";



      devices.forEach(dev => {
        this.deviceSelectedList.push(dev);
      });

      obj.deviceId = this.deviceSelectedList;
    }
    if (logReport[0].LogUserIds !== '') {
      obj.userId = logReport[0].LogUserIds;
    }

    obj.period = logReport[0].Period;
    obj.reportName = logReport[0].ReportName;

    var resp: any = []

    this._detailService.GetLogReportDetails(obj).subscribe(result => {
      resp = result;

      window.open(resp.msg, '_blank');

    });

  }



  getEditLogReport(reportId: any) {
    debugger
    var logReport: any

    logReport = {}

    logReport = this.logReports.filter(g => g.reportId == reportId);

    this.reportId = reportId;

    this.logType = Number(logReport[0].LogType);

    if (logReport[0].Devices !== '' && logReport[0].Devices !== null) {
      var devices: any = [];

      devices = logReport[0].Devices.split(',');

      this.deviceSelectedList = [];
      this.selectedDevice = "";


      devices.forEach(dev => {
        this.deviceSelectedList.push(dev);
      });
    }
    if (logReport[0].LogUserIds !== '') {
      this.selectedUser = logReport[0].LogUserIds;
    }

    this.dateRange = logReport[0].Period;
    this.reportName = logReport[0].ReportName;
    this.frequency = Number(logReport[0].Frequency);

    this.day = Number(logReport[0].DayToSend);

    this.isScheduled = true;

    this.setFrequency()

    this.reportHR = logReport[0].TimeToSend.split(':')[0];
    this.reportMM = logReport[0].TimeToSend.split(':')[1];
    this.toMailids = logReport[0].ToMailid;
    this.ccMailids = logReport[0].CCMailid;
    this.bccMailids = logReport[0].BCCMailid;

    this.modalFilter.show();

    this.showReportFilter('log')

    this.disableReportName = true;

  }


  deleteLogReport(reportId: any) {

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
      var resp: any
      this._detailService.DeleteLogReport(reportId).subscribe(result => {
        resp = result;

        if (resp.sts == "200") {
          this.getLogReportsList();
        }
      });
    });

  }


  bindDatatoSCRTable(data: any) {
    $('#schrTable').dataTable().fnDestroy();
    var table = $('#schrTable').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
      ordering: false,
      // searching: false
    });
    table.clear().rows.add(data).draw();

    var that = this;

    $('#schrTable tbody').off().on('click', 'td', function () {



      var Index = this.cellIndex

      var data = $(this).parent();
      var table = $('#schrTable').DataTable();

      data = table.row(data).data();

      if (Index == "5") {
        that.getReportFromSRTab(data[10], data[11], data[12]);
      }

      if (Index == "6" && data[17] == 0) {

        that.getReportPDF(data[10], data[11], data[12], "");

        //        that.getExcelData(data[10], data[11], data[12]);
      }

      if (Index == "7" && data[13] == "1") {


        if (data[16] == "Region") {
          that.getSavedReports(data[10], "Region");
        }
        else {
          if (data[14] !== "") {
            that.getSavedReports(data[10], "Scheduled");
          }
          else {
            that.getSavedReports(data[10], "Saved");
          }
        }
      }

      if (Index == "8" && data[16] !== "Region") {

        that.pintToDB(data[10], "Scheduled");
      }
      if (Index == "9" && data[13] == "1") {

        that.deleteReport(data[10], data[12], "schList");
      }


    });

  }

  getReportFromSRTab(reportId: any, reportType: any, reportName: any) {


    this.showSVReports = false;
    this.showSCONReports = false;

    this.showCharts = true;
    this.getReport(reportId, reportType, reportName, "");
  }

  collapsedMenu = false;
  selectedItemID: any;
  getReport(reportId: any, reportType: any, reportName: any, divId: any) {

    this.selectedItemID = reportId;
    this.reportNameTop = reportName;
    this.CurrentChartIndex = 0;
    this.LastChartIndex = 0;

    // this.loaderService.display(true);

    if (reportType == "100") {

      this.isTrendType = false;

      this._detailService.GenerateReport(reportId).subscribe(result => {

        this.responseData = [];

        this.loaderService.display(false);

        this.responseData = result;

        this.plotRcharts();

      });
    }
    else {

      this.isTrendType = true;

      this._detailService.GenerateReport(reportId).subscribe(result => {

        this.responseData = [];

        this.responseData = result;


        // this.loaderService.display(false);

        this.plotRcharts();

      });
    }
  }

  requestedReports: any = []

  getReportPDF(reportId: any, reportType: any, reportName: any, divId: any) {


    this.requestedReports.push({ reportId: reportId });

    this.loaderService.display(true);

    var resp: any = []
    var resp2: any = []
    var obj: any = {}
    obj.reportId = reportId;




    this._detailService.GetReportPDF(reportId).subscribe(result => {

      resp2 = result;

      this.loaderService.display(false);

      if (resp2.sts == "200") {


        this.requestedReports = this.requestedReports.filter(g => g.reportId !== reportId);


        this.reportListForTableSchedule.forEach(rep => {
          if (rep.reportId == reportId) {
            rep.showDownload = true;
            rep.isOnDemand = "0";
          }
        });


        this.reportListForTableOnDemand.forEach(rep => {
          if (rep.reportId == reportId) {
            rep.showDownload = true;
            rep.isOnDemand = "0";
          }
        });



        if (resp2.msg == "") {
          this.toastr.warning("Report is unavailable due to no data");
        }
        else {
          if (resp2.msg == "Failed") {
            this.toastr.warning("Report is unavailable due to no data");
          }
          else {

            var files: any;


            if (resp2.msg.includes('.pdf') || resp2.msg.includes('.csv')
              || resp2.msg.includes('.xlsx') || resp2.msg.includes('.xls')
              || resp2.msg.toLowerCase().includes('.jpg') || resp2.msg.toLowerCase().includes('.jpeg')) {
              var tabI: number = 0;
              files = resp2.msg.split(',');

              files.forEach(f => {
                tabI += 1;


                // window.open(f, tabI + '', "menubar=yes, location=yes, resizable=yes, scrollbars=yes, titlebar=yes, width=400, height=300, top=10, left=10");

                window.open(f, tabI + '');

              });
            }
            else {
              var tabI: number = 0;

              files = resp2.msg.split('|');

              files.forEach(f => {

                if (f !== '') {

                  tabI += 1;

                  const a = document.createElement('a');
                  a.target = '_blank';
                  a.href = f;
                  a.download = tabI + reportName + '.jpg';
                  a.click();
                }

              });
            }

          }
        }

        // this.toastr.success("Request for report has been placed", "", { timeOut: 5000 });

        // // this.loadReports();
        // var reportList = this.reportListForTableSchedule.filter(g => g.reportId == reportId)

        // if (reportList.length > 0) {
        //   this.reportListForTableSchedule.forEach(rep => {
        //     if (rep.reportId == reportId) {
        //       rep.showDownload = false;
        //     }
        //   });
        // }
        // else {
        //   this.reportListForTableOnDemand.forEach(rep => {
        //     if (rep.reportId == reportId) {
        //       rep.showDownload = false;
        //     }
        //   });
        // }

        // this.checkReportStatus(reportId, reportName);


      }
      else {
        //this.toastr.warning("Report is unavailable due to no data");
        this.toastr.warning(resp2.msg);
      }
    });

    // this._detailService.GetReportPDF(reportId).subscribe(result => {
    //   

    //   resp = result;


    //   if (resp.sts == "200") {

    //     // window.location.href = resp.msg;
    //     if (resp.msg == "") {
    //       this.toastr.warning("Report is unavailable due to no data");
    //     }
    //     else {
    //       if (resp.msg == "Failed") {
    //         this.toastr.warning("Report is unavailable due to no data");
    //       }
    //       else {

    //         var files: any;


    //         if (resp.msg.includes('.pdf') || resp.msg.includes('.csv')
    //           || resp.msg.includes('.xlsx') || resp.msg.includes('.xls')) {
    //           var tabI: number = 0;
    //           files = resp.msg.split(',');

    //           files.forEach(f => {
    //             tabI += 1;


    //             window.open(f, tabI + '');

    //           });
    //         }
    //         else {
    //           var tabI: number = 0;

    //           files = resp.msg.split('|');

    //           files.forEach(f => {

    //             if (f !== '') {

    //               tabI += 1;

    //               const a = document.createElement('a');
    //               a.target = '_blank';
    //               a.href = f;
    //               a.download = tabI + reportName + '.jpg';
    //               a.click();
    //             }

    //           });
    //         }

    //       }
    //     }
    //   }


    //   let logReq = {
    //     "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
    //     "module": "Analytics",
    //     "actionPerformed": "Report has been downloaded. Report Name: " + reportName
    //   }

    //   this._commanService.logUpdate(logReq);

    //   // reportId: "64ca4b84-f8cd-4926-bfea-62cd5e530229"

    //   this.loaderService.display(false);

    // }, (error: any) => {
    //   
    //   console.log(error.url);
    // });
  }

  getReportFile(reportFile: any) {


    
    this.loaderService.display(true);

    var resp: any = []
    var resp2: any = []
    var obj: any = {}



      if (reportFile.length  >5) {


     

       

            var files: any;


            if (reportFile.includes('.pdf') || reportFile.includes('.csv')
              || reportFile.includes('.xlsx') || reportFile.includes('.xls')
              || reportFile.toLowerCase().includes('.jpg') || reportFile.toLowerCase().includes('.jpeg')) {
              var tabI: number = 0;
              files = reportFile.split(',');

              files.forEach(f => {
                tabI += 1;


                // window.open(f, tabI + '', "menubar=yes, location=yes, resizable=yes, scrollbars=yes, titlebar=yes, width=400, height=300, top=10, left=10");

                window.open(f, tabI + '');

              });
            }
            // else {
            //   var tabI: number = 0;

            //   files = resp2.msg.split('|');

            //   files.forEach(f => {

            //     if (f !== '') {

            //       tabI += 1;

            //       const a = document.createElement('a');
            //       a.target = '_blank';
            //       a.href = f;
            //       a.download = tabI + reportName + '.jpg';
            //       a.click();
            //     }

            //   });
            // }

          
        }
      else {
        this.toastr.warning("Report is in progress");
      }
    
      this.loaderService.display(false);
  
  }

  checkReportStatus(reportId: any, reportName: any) {

    var resp: any = []

    this._detailService.OnDemandReportSts(reportId).subscribe(result2 => {

      resp = result2;

      if (resp.sts == "200") {

        this.requestedReports = this.requestedReports.filter(g => g.reportId !== reportId);

        this.reportListForTableSchedule.forEach(rep => {
          if (rep.reportId == reportId) {
            rep.showDownload = true;
            rep.isOnDemand = "0";
          }
        });


        this.reportListForTableOnDemand.forEach(rep => {
          if (rep.reportId == reportId) {
            rep.showDownload = true;
            rep.isOnDemand = "0";
          }
        });



        let logReq = {
          "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
          "module": "Reports",
          "actionPerformed": "Report has been downloaded. Report Name: " + reportName
        }

        this._commanService.logUpdate(logReq);
      }
      else {
        // this.toastr.warning(resp.msg);
      }




      // reportId: "64ca4b84-f8cd-4926-bfea-62cd5e530229"


    })
  }

  downloadFile(data: any) {

    const blob = new Blob([data], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);
    // window.open(url);


    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fileName.csv";
    // start download
    a.click();
  }

  onDemand() {


    this.isScheduled = false;

  }

  zoomRChart(idx: any) {

    if (this.trendChartMax) {
      this.trendChartMax.dispose();
    }

    this.LastChartIndex

    var index: number
    index = +idx - 1;

    index = this.LastChartIndex + index;

    this.modalChart.show();

    this.plotRchartMax(this.responseData[index].Duration, this.responseData[index].deviceName, this.responseData[index].snsrName, '');

  }

  zoomChart(idx: any) {

    if (this.trendChartMax) {
      this.trendChartMax.dispose();
    }

    this.LastChartIndex

    var index: number
    index = +idx - 1;


    index = this.LastChartIndex + index;

    var userDev: any = [];
    var sensorUoM: any = [];

    var sUoM: any = "";

    userDev = this.DeviceList.filter(item => item.sensorId == this.responseData[index].trend[0].deviceId);//
    sensorUoM = this.SensorUoM.filter(item => item.uomId == this.responseData[index].trend[0].uom);
    if (sensorUoM == undefined || sensorUoM.length == 0) {
      sUoM = "";
    }
    else {
      sUoM = sensorUoM[0].symbol;
    }
    sUoM = this.responseData[index].trend[0].uom;

    this.modalChart.show();

    this.plottrendMax(this.responseData[index], userDev[0].deviceName, this.responseData[index].trend[0].sensorName, sUoM);

  }

  plotRcharts() {
    var resp: any = [];

    resp = this.responseData;



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

    if (this.responseData.length <= 6) {
      this.showNPbtn = false;
    }
    else {
      this.showNPbtn = true;
    }


    if (this.LastChartIndex > this.CurrentChartIndex) //next charts
    {
      this.CurrentChartIndex = this.LastChartIndex

      if (this.responseData.length >= 1 && this.CurrentChartIndex < this.responseData.length) {
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
          sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
          sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
          sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

          this.plottrend3(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
        }
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.responseData.length >= 4 && this.CurrentChartIndex < this.responseData.length) {

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
          sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
          sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
          sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

            this.plottrend3(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 4 && this.CurrentChartIndex < this.responseData.length
          && this.CurrentChartIndex >= 0) {

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

            this.plottrend6(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
      }
      else {
        this.CurrentChartIndex = this.LastChartIndex

        if (this.responseData.length >= 1 && this.CurrentChartIndex < this.responseData.length) {
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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;


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

            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

            this.plottrend3(this.responseData[this.CurrentChartIndex], userDev[0].deviceName, this.responseData[this.CurrentChartIndex].trend[0].sensorName, sUoM);
          }
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.responseData.length >= 4 && this.CurrentChartIndex < this.responseData.length) {

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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
            sUoM = this.responseData[this.CurrentChartIndex].trend[0].uom;

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


    if (this.LastChartIndex == 0) {
      this.isPrevDisabled = true;
    }



  }


  plotRchart1(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],


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

    // this.zone.runOutsideAngular(() => {
    this.RChart1 = am4core.create("RChart1", am4charts.XYChart);

    this.RChart1.data = TrendValues;

    let dateAxis = this.RChart1.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart1.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;


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
    //series.tensionX = 0.83;

    series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.RChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    this.RChart1.cursor = new am4charts.XYCursor();
    this.RChart1.cursor.xAxis = dateAxis;

    var title = this.RChart1.titles.create();
    title.text = deviceName + " | " + sensorName;// + " (" + uom+")";
    title.fontSize = 12;
    title.marginBottom = 20;

  }
  plotRchart2(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],


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

    // this.zone.runOutsideAngular(() => {
    this.RChart2 = am4core.create("RChart2", am4charts.XYChart);

    this.RChart2.data = TrendValues;

    let dateAxis = this.RChart2.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart2.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;


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
    //series.tensionX = 0.83;

    series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.RChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    this.RChart2.cursor = new am4charts.XYCursor();
    this.RChart2.cursor.xAxis = dateAxis;

    var title = this.RChart2.titles.create();
    title.text = deviceName + " | " + sensorName;// + " (" + uom+")";
    title.fontSize = 12;
    title.marginBottom = 20;

  }
  plotRchart3(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],


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

    // this.zone.runOutsideAngular(() => {
    this.RChart3 = am4core.create("RChart3", am4charts.XYChart);

    this.RChart3.data = TrendValues;

    let dateAxis = this.RChart3.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart3.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;


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
    //series.tensionX = 0.83;

    series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.RChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    this.RChart3.cursor = new am4charts.XYCursor();
    this.RChart3.cursor.xAxis = dateAxis;

    var title = this.RChart3.titles.create();
    title.text = deviceName + " | " + sensorName;// + " (" + uom+")";
    title.fontSize = 12;
    title.marginBottom = 20;

  }
  plotRchart4(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],


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

    // this.zone.runOutsideAngular(() => {
    this.RChart4 = am4core.create("RChart4", am4charts.XYChart);

    this.RChart4.data = TrendValues;

    let dateAxis = this.RChart4.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart4.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;


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
    //series.tensionX = 0.83;

    series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.RChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    this.RChart4.cursor = new am4charts.XYCursor();
    this.RChart4.cursor.xAxis = dateAxis;

    var title = this.RChart4.titles.create();
    title.text = deviceName + " | " + sensorName;// + " (" + uom+")";
    title.fontSize = 12;
    title.marginBottom = 20;

  }
  plotRchart5(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],


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

    // this.zone.runOutsideAngular(() => {
    this.RChart5 = am4core.create("RChart5", am4charts.XYChart);

    this.RChart5.data = TrendValues;

    let dateAxis = this.RChart5.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart5.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;


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
    //series.tensionX = 0.83;

    series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.RChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    this.RChart5.cursor = new am4charts.XYCursor();
    this.RChart5.cursor.xAxis = dateAxis;

    var title = this.RChart5.titles.create();
    title.text = deviceName + " | " + sensorName;//+ " (" + uom+")";
    title.fontSize = 12;
    title.marginBottom = 20;

  }
  plotRchart6(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],


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

    // this.zone.runOutsideAngular(() => {
    this.RChart6 = am4core.create("RChart6", am4charts.XYChart);

    this.RChart6.data = TrendValues;

    let dateAxis = this.RChart6.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.labels.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.RChart6.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.fontSize = 8;
    //valueAxis.renderer.labels.template.disabled = true;

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
    //series.tensionX = 0.83;

    series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.RChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    this.RChart6.cursor = new am4charts.XYCursor();
    this.RChart6.cursor.xAxis = dateAxis;

    var title = this.RChart6.titles.create();
    title.text = deviceName + " | " + sensorName;// + " (" + uom+")";
    title.fontSize = 12;
    title.marginBottom = 20;

  }

  plotRchartMax(report: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],


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

    // this.zone.runOutsideAngular(() => {
    this.trendChartMax = am4core.create("trChartMax", am4charts.XYChart);

    this.trendChartMax.data = TrendValues;

    let dateAxis = this.trendChartMax.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 40;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 500;

    let valueAxis = this.trendChartMax.yAxes.push(new am4charts.ValueAxis());
    //valueAxis.renderer.labels.template.disabled = true;


    if (uom == "(%)") {
      valueAxis.min = 0;
      valueAxis.max = 100;
    }


    let series = this.trendChartMax.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "critical";
    series.stroke = am4core.color("#F8CBAD"); // red
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.trendChartMax.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "warning";
    series.stroke = am4core.color("#FFE699"); // Orange
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    series = this.trendChartMax.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "good";
    series.stroke = am4core.color("#C5E0B4"); // Green
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX = 0.83;

    this.trendChartMax.cursor = new am4charts.XYCursor();
    this.trendChartMax.cursor.xAxis = dateAxis;


    this.maxViewTitle = deviceName + " | " + sensorName;// + " (" + uom+")";

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
    //series.tensionX = 0.83;


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
    //series.tensionX = 0.83;

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
    //series.tensionX = 0.83;

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
    //series.tensionX = 0.83;

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
    //series.tensionX = 0.83;

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
    //series.tensionX = 0.83;

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

  maxViewTitle: any = ""

  plottrendMax(trend: any, deviceName: any, sensorName: any, uom: any) {

    var trendMin1: any = 0
    var trendMax1: any = 0

    var val1: any = []

    var TrendValues: any = [];

    var hasFV: boolean = false

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

    this.trendChartMax = am4core.create("trChartMax", am4charts.XYChart);


    this.trendChartMax.data = TrendValues;


    let dateAxis = this.trendChartMax.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 40;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChartMax.yAxes.push(new am4charts.ValueAxis());
    //valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);

    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChartMax.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    // //series.tensionX = 0.83;


    //series.connect = false;


    series.stroke = am4core.color("#7092BE");

    this.trendChartMax.cursor = new am4charts.XYCursor();
    this.trendChartMax.cursor.xAxis = dateAxis;

    if (uom == "") {
      this.maxViewTitle = deviceName + " | " + sensorName;
    }
    else {
      this.maxViewTitle = deviceName + " | " + sensorName + " (" + uom + ")";
    }


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

  onScheduled() {

    this.scheduleReport
    this.isScheduled = true;
    this.isDates = false;
    // this.dateRange = [];

  }

  checkSpecialChar(event) {

    var iChars = "!`@#$%^&*()+=-[]\\\';,./{}|\":<>?~_";

    if (iChars.includes(event.key)) {
      return false;
    }
    return true;

    //allsavedReports
  }

  checkReportname() {
    var name: any;

    name = this.reportName.split(' ').join('_');

    var sameReportNames: any = []

    if (this.allsavedReports !== undefined) {
      if (this.allsavedReports.length > 0) {
        sameReportNames = this.allsavedReports.filter(r => r.reportName.toLowerCase() == name.toLowerCase());

        if (sameReportNames.length > 0) {
          this.validName = false;
        }
        else {
          this.validName = true;
        }
      }
      else {
        this.validName = true;
      }
    }
    else {
      this.validName = true;

    }
  }

  checkNumericsHr(event) {

    var iChars = "0123456789";



    if (iChars.includes(event.key)) {


      var num1: any = ""
      num1 = this.reportHR

      num1 += event.key;

      var num: number

      num = +num1;

      if (num < 24) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }

  checkNumericsFHr(event) {
    debugger
    var iChars = "0123456789";



    if (iChars.includes(event.key)) {


      var num1: any = ""
      num1 = this.reportFHR

      num1 += event.key;

      var num: number

      num = +num1;

      if (num < 24) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }
  onPasteFHr(event: ClipboardEvent, from:any) {
    debugger
    event.preventDefault(); // Prevent the default paste behavior
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text/plain');
    if(from == "FHr"){
      this.reportFHR = this.onPasteText(pastedText)
    }
    else{
      this.reportTHR = this.onPasteText(pastedText)
    }
  }
  onPasteText(text:any){
    var textActual = "";
    if (!/^\d*$/.test(text)) {
      textActual = "";
      this.toastr.warning('Accepts only Numbers');
    } else {
      var num: number = text;
      if(num < 24){
        textActual = text
      }
      else{
        textActual = "";
        this.toastr.warning('The Time Must be in 24 hours format less than 24');
      }
    }
    return textActual;
  }
  checkNumericsTHr(event) {
    debugger
    var iChars = "0123456789";



    if (iChars.includes(event.key)) {


      var num1: any = ""
      num1 = this.reportTHR

      num1 += event.key;

      var num: number

      num = +num1;

      if (num < 24) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }

  checkNumericsMin(event) {


    var iChars = "0123456789";

    if (iChars.includes(event.key)) {


      var num1: any = ""
      if (this.reportMM == undefined) {
        this.reportMM = "0";
      }
      num1 = this.reportMM

      num1 += event.key;

      var num: number

      num = +num1;

      if (num < 60) {
        return true;
      }
      else {

        return false;
      }
    }
    return false;
  }


  validateFilters() {
    debugger
    var valid: boolean = true;
    //regionId

    if (this.validName == false) {
      valid = false;
      if (this.reportName == "" || this.reportName == undefined || this.reportName == null) {
        this.toastr.warning('please enter Report Name');
      }
      else {
        this.toastr.warning('Report Name Already Exists');
      }
    }
    else
      if (this.regionId == undefined || this.regionId == null || this.regionId == '') {

        valid = false;
        this.toastr.warning('please select Region');
      }
      else if (this.modelId == undefined || this.modelId == null || this.modelId == '') {

        valid = false;
        this.toastr.warning('please select Model');
      }
      else
        if (this.deviceSelectedList == undefined || this.deviceSelectedList.length == 0) {

          valid = false;
          this.toastr.warning('please select Device');
        }
        else
          if (this.reportFormat == undefined || this.reportFormat == ''
            || this.reportFormat == null) {

            valid = false;
            this.toastr.warning('please select Report Format');
          }
          //reportFormat
          else
            if (this.sensorSelectedList == undefined || this.sensorSelectedList.length == 0) {

              valid = false;
              this.toastr.warning('please select Sensor');
            } else
              if (this.mathSelectedList == undefined || this.mathSelectedList.length == 0) {

                valid = false;
                this.toastr.warning('please select Sensor Function');
              }
              else
                if ((this.dateRange == null || this.dateRange.length == 0) && !this.isETimeInterval) {

                  valid = false;
                  this.toastr.warning('please select Period');
                } else
                  if ((this.interval == null || this.interval == '') && this.isSensorReading && !this.is31Days && !this.isETimeInterval) {

                    valid = false;
                    this.toastr.warning('please select Interval');
                  }
                  else
                    if (this.reportName == undefined || this.reportName.length == 0) {

                      this.toastr.warning('please enter report name');

                      valid = false;
                    } else
                      if (this.dateRange == "custom" && !this.isETimeInterval) {

                        if (this.fromDate == '' || this.fromDate == undefined) {
                          valid = false;
                          this.toastr.warning('Please select date range');
                        }
                        else {
                          var _frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate[0]);
                          var _toDate = this._detailService.todateYYYYMMDDHHMM(this.fromDate[1]);

                          var _days: any

                          _days = this._detailService.DateDifference(this.fromDate[0], this.fromDate[1]);



                          if (this.reportFHR == '' || this.reportFHR == undefined) {
                            valid = false;
                            this.toastr.warning('Please provide valid Time Range');
                          }
                          else
                            if (this.reportTHR == '' || this.reportTHR == undefined) {
                              valid = false;
                              this.toastr.warning('Please provide valid Time Range');
                            }
                            else
                              if (Number(_days) == 0 && ((Number(this.reportFHR) > Number(this.reportTHR)) || (Number(this.reportFHR) == Number(this.reportTHR)))) {
                                valid = false;
                                this.toastr.warning('Please provide valid Time Range that From Time must be less than To Time');
                              }
                              else
                                if (Number(_days) > 90) {
                                  valid = false;
                                  this.toastr.warning('Report for more than 90 days is not allowed, please contact support');
                                }
                                else {
                                  valid = true;
                                }
                        }




                      } else
                        if (this.dateRange == "customtime" && !this.isETimeInterval) {

                          if (this.reportFHR == '' || this.reportFHR == undefined) {
                            valid = false;
                            this.toastr.warning('Please provide valid Time Range');
                          }

                          if (this.reportTHR == '' || this.reportTHR == undefined) {
                            valid = false;
                            this.toastr.warning('Please provide valid Time Range');
                          }
                        }
                        else if (this.isScheduled) {
                          if ((this.frequency == null || this.frequency.length == 0)) {

                            valid = false;
                            this.toastr.warning('please select Frequnecy');
                          } else
                            if ((this.reportHR == null || this.reportHR == undefined || this.reportMM == "")) {

                              valid = false;
                              this.toastr.warning('please select Time HRs');
                            } else
                              if ((this.reportMM == null || this.reportMM == undefined || this.reportMM == "")) {

                                valid = false;
                                this.toastr.warning('please select Time Mins');
                              } else
                                if ((this.isDaily == false) && (this.day == null || this.day == undefined || this.day == "")) {

                                  valid = false;
                                  this.toastr.warning('please select Day');
                                } else
                                  if ((this.toMailids == null || this.toMailids == "" || this.toMailids == undefined)) {

                                    valid = false;
                                    this.toastr.warning('please select ToMailIds');
                                  }


                          var mailIds: any = [];
                          mailIds = this.toMailids;//.split(',');
                          mailIds.forEach(mail => {
                            if (mail !== '') {
                              if (!this._commanService.EmailID_REGX.test(mail)) {
                                this.toastr.warning(mail + ' is Invalid EmailId');
                                valid = false;
                              }
                            }
                          });

                          if (this.ccMailids.length > 0) {
                            mailIds = this.ccMailids;//.split(',');
                            mailIds.forEach(mail => {
                              if (mail !== '') {
                                if (!this._commanService.EmailID_REGX.test(mail)) {
                                  this.toastr.warning(mail + ' is Invalid EmailId');
                                  valid = false;
                                }
                              }
                            });
                          }


                          if (this.bccMailids.length > 0) {
                            mailIds = this.bccMailids;//.split(',');
                            mailIds.forEach(mail => {
                              if (mail !== '') {
                                if (!this._commanService.EmailID_REGX.test(mail)) {
                                  this.toastr.warning(mail + ' is Invalid EmailId');
                                  valid = false;
                                }
                              }
                            });
                          }
                        }
                        

    this.reportName = this.reportName.replace(/\s/g, "-");

    this.reportName = this.reportName.replace(".", "");


    return valid;
  }

  fromEnergyDate:any;
  validateEnergy(){
    debugger
    var valid: boolean = true;
    this.interval = this.ETimeinterval;
    if (this.validName == false) {
      valid = false;
      
    }else
    if (this.ETimeinterval == null || this.ETimeinterval == '') {
      valid = false;
      this.toastr.warning('please select Interval');
    }
    else if(this.isScheduled){
      if(this.dateEnergyRange == '' || this.dateEnergyRange == null || this.dateEnergyRange == undefined){
        valid = false 
        this.toastr.warning("please Select Duration/Period");
      }
      else {
        this.dateRange = this.dateEnergyRange
      }
    }
    else if(!this.isScheduled){
       if(this.ETimeinterval == "Hourly"){
        if(this.hourlyDate == null || this.hourlyDate == ''){
          valid = false;
          this.toastr.warning('please select Date');
        }
        else {
          var toDate = this.formatDate(new Date(this.hourlyDate));
          const previousDate = new Date(this.hourlyDate);
          previousDate.setDate(previousDate.getDate() - 1);
          var fromDate = this.formatDate(new Date(previousDate));
          this.dateRange = fromDate + '|' + toDate
        }
      }
      else if(this.ETimeinterval == "Daily"){
        if(this.fromEnergyDate == null || this.fromEnergyDate == '' || this.fromEnergyDate == undefined){
          valid = false;
          this.toastr.warning('please select Date Range');
        }
        else {
          var fromDate = this.formatDate(new Date(this.fromEnergyDate[0]));
          var toDate = this.formatDate(new Date(this.fromEnergyDate[1]));
          if(fromDate == toDate){
            this.toastr.warning("please Select Different Dates in Date Range");
            valid = false;
          }
          else{
            this.dateRange = fromDate + '|' + toDate;
          }
        }
      }
      else if(this.ETimeinterval == "Monthly"){
       
        if(this.startMonth == '' || this.startMonth == null){
          this.toastr.warning("please Select start Month");
          valid =  false;
        }
        else if(this.endMonth == '' || this.endMonth == null){
          this.toastr.warning("please Select End Month");
          valid =  false;
        }
        else {
          var tfromDate =  this.formatDate(new Date(this.startMonth));
          var toDate =  this.formatDate(new Date(this.endMonth));
          if(tfromDate > toDate){
            this.toastr.warning("please Select Different Months in Date Range");
            valid = false;
          }
          else {
            this.dateRange = tfromDate + '|' + toDate;
          }
        }
  
      }
    }
    
    
    return valid
  }
  saveReport() {
    debugger
    this.reportFormat = this.radioSelected
    var validEnergyCon = true;
    if (this.isETimeInterval) {
      validEnergyCon = this.validateEnergy();
    }
    
    if (!this.isScheduled && !this.isETimeInterval) {
      this.dateRange = "custom";
    }

    var valid = this.validateFilters();

    if (valid && validEnergyCon) {
      debugger
      this.loaderService.display(true);
      var obj: any = {};

      obj.chType = (this.Chmode == true) ? '1' : '2';
      obj.reportFormat = this.reportFormat;
      obj.dataUA = (this.devDataua == true) ? '1' : '0';
      obj.devAlert = (this.devAlert == true) ? '1' : '0';
      obj.devAudit = (this.devAudit == true) ? '1' : '0';
      obj.devMKT = (this.devMKT == true) ? '1' : '0';
      obj.generatedTime = (this.generatedTime == true) ? '1' : '0';

      obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
      obj.reportId = this.reportId;
      obj.regionId = this.regionId;
      obj.reportName = this.reportName;
      obj.devices = "";

      this.deviceSelectedList.forEach(dev => {
        obj.devices += dev + ',';
      });

      //obj.mathfunctions = this.mathSelectedList;
      // if (this.interval == undefined || this.interval == '' || this.interval == [] || this.interval == null) {
      //   this.interval = 60;
      // }

      obj.mathfunctions = "";


      // this.mathSelectedList.forEach(dev => {

      //   obj.mathfunctions += dev + ',';
      // });

      obj.mathfunctions = this.mathSelectedList

      obj.sensors = "";

      if (this.sensorSelectedList.length == 1) {
        obj.sensors = this.sensorSelectedList[0];
      }
      else {
        this.sensorSelectedList.forEach(dev => {

          obj.sensors += dev + ',';
        });
      }



      if (this.dateRange == "custom") {

        obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate[0]);
        obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.fromDate[1]);

        //2021-10-04 10:00
        if (this.reportFHR !== "" && this.reportTHR !== "") {

          if (this.reportTHR == "23" || this.reportTHR == "00" || this.reportTHR == null || this.reportTHR == '' || this.reportTHR == undefined) {
            obj.period = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00' + '|' + obj.toDate.split(' ')[0] + ' 23:59'// + this.reportTHR;
          }
          else {
            obj.period = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00' + '|' + obj.toDate.split(' ')[0] + ' ' + this.reportTHR + ':00'// + this.reportTHR;

          }

        }       //this.period = obj.frDate + ' To ' + obj.tDate
        else {
          obj.period = obj.frDate + '|' + obj.toDate;
        }

      }
      else if (this.dateRange == "customtime") {
        obj.period = this.reportFHR + ',' + this.reportTHR;
      }
      else {
        obj.period = this.dateRange;
      }


      obj.interval = this.interval;

      if (this.isScheduled == true) {
        obj.frequency = this.frequency;
        obj.dayToSend = this.day;

        if (this.reportHR.length > 0) {
          if (this.reportHR.length == 1) {
            this.reportHR = "0" + this.reportHR;
          }
          if (this.reportMM.length == 1) {
            this.reportMM = "0" + this.reportMM;
          }

          obj.userTimeZone = sessionStorage.getItem('USER_TIMEZONE');
          obj.timeToSend = this.reportHR + ":" + this.reportMM;
        }

        obj.toMailds = "";
        if (this.toMailids !== "" && this.toMailids !== null && this.toMailids !== undefined) {

          this.toMailids.forEach(mail => {
            obj.toMailds += mail + ',';
          });
        }

        obj.ccMailds = "";
        if (this.ccMailids !== "" && this.ccMailids !== null && this.ccMailids !== undefined) {

          if (this.ccMailids.length > 0) {
            this.ccMailids.forEach(mail => {
              obj.ccMailds += mail + ',';
            });
          }
        }

        obj.bccMailds = "";
        if (this.bccMailids !== "" && this.bccMailids !== null && this.bccMailids !== undefined) {

          if (this.bccMailids.length > 0) {
            this.bccMailids.forEach(mail => {
              obj.bccMailds += mail + ',';
            });
          }
        }
      }
      // obj.toMailds = this.toMailids;
      // obj.ccMailds = this.ccMailids;
      // obj.bccMailds = this.bccMailids;
      // }
      debugger

      //checking report available or not
      var interval = "";
      if (obj.interval) {
        interval = obj.interval
      }
      var countReportExist = this.reportList.filter(item => item.devices.replace(/[\n\r]/g, "") == obj.devices.slice(0, -1) && item.sensors == obj.sensors && item.period == obj.period && item.interval == interval);//&& item.reportFormat == obj.reportFormat
      if (countReportExist.length > 0 && this.createReportModal.toLowerCase().includes('create')) {
        debugger
        this.loaderService.display(false);
        this.toastr.warning("Already Report Exists with same Metrics:" + countReportExist[0].displayName.toString(), '', { timeOut: 5000 });
        return
      }
      var resp: any = [];
      debugger
      this._detailService.SaveCustonReport(obj).subscribe(result => {
        resp = result;
        debugger
        if (resp.sts == "200") {

          this.loaderService.display(false);
          this.hasSavedReports = true;
          this.toastr.success(resp.msg);

          this.formatLogUpdate(obj);
          this.modalFilter.hide();

          this.reset();

          // this.getSavedReports("", "");
          this.getScheduleReportsList("");

        }
        else {

          this.loaderService.display(false);
          this.toastr.warning(resp.msg, '', { timeOut: 5000 });
        }
      });
    }
  }

  validateRegFilters() {

    var valid: boolean = true;

    if (this.FilterDeviceList.length == 0) {
      valid = false;
    }
    if (this.regSensorSelectedList.length == 0) {
      valid = false;
    }
    if (this.dateRange == null) {
      valid = false;
    }
    // if ((this.frequency == null || this.frequency.length == 0)) {

    //   valid = false;
    //   this.toastr.warning('please select Frequnecy');
    // } else
    //   if ((this.reportHR == null || this.reportHR == undefined || this.reportMM == "")) {

    //     valid = false;
    //     this.toastr.warning('please select Time HRs');
    //   } else
    //     if ((this.reportMM == null || this.reportMM == undefined || this.reportMM == "")) {

    //       valid = false;
    //       this.toastr.warning('please select Time Mins');
    //     } else
    //       if ((this.isDaily == false) && (this.day == null || this.day == undefined || this.day == "")) {

    //         valid = false;
    //         this.toastr.warning('please select Day');
    //       } else
    //         if ((this.toMailids == null || this.toMailids == "" || this.toMailids == undefined)) {

    //           valid = false;
    //           this.toastr.warning('please select ToMailIds');
    //         }
    //         else if (this.isScheduled == true) {
    //           var mailIds: any = [];
    //           mailIds = this.toMailids.split(',');
    //           mailIds.forEach(mail => {
    //             if (mail !== '') {
    //               if (!this._commanService.EmailID_REGX.test(mail)) {
    //                 this.toastr.warning(mail + ' is Invalid EmailId');
    //                 valid = false;
    //               }

    //             }
    //           });

    //           mailIds = this.ccMailids.split(',');
    //           mailIds.forEach(mail => {
    //             if (mail !== '') {
    //               if (!this._commanService.EmailID_REGX.test(mail)) {
    //                 this.toastr.warning(mail + ' is Invalid EmailId');
    //                 valid = false;
    //               }

    //             }
    //           });

    //           mailIds = this.bccMailids.split(',');
    //           mailIds.forEach(mail => {
    //             if (mail !== '') {
    //               if (!this._commanService.EmailID_REGX.test(mail)) {
    //                 this.toastr.warning(mail + ' is Invalid EmailId');
    //                 valid = false;
    //               }

    //             }
    //           });
    //         }
    return valid;

  }

  saveRegReport() {



    var valid = this.validateRegFilters();



    if (valid) {

      this.loaderService.display(true);
      var obj: any = {};

      obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
      obj.reportId = this.reportId;
      obj.regionId = this.regionId;
      obj.reportName = this.reportName;
      obj.devices = "";

      this.regDeviceSelectedList.forEach(dev => {
        obj.devices += dev + ',';
      });


      obj.sensors = "";

      if (this.regSensorSelectedList.length == 1) {
        obj.sensors = this.regSensorSelectedList[0];
      }
      else {
        this.regSensorSelectedList.forEach(dev => {

          obj.sensors += dev + ',';
        });
      }



      if (this.dateRange == "custom") {

        obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate[0]);
        obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.fromDate[1]);

        //2021-10-04 10:00
        if (this.reportFHR !== "" && this.reportTHR !== "") {

          if (this.reportTHR == "23" || this.reportTHR == "00" || this.reportTHR == null || this.reportTHR == '' || this.reportTHR == undefined) {
            obj.period = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00' + '|' + obj.toDate.split(' ')[0] + ' 23:59'// + this.reportTHR;
          }
          else {
            obj.period = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00' + '|' + obj.toDate.split(' ')[0] + ' ' + this.reportTHR + ':00'// + this.reportTHR;

          }

        }       //this.period = obj.frDate + ' To ' + obj.tDate
        else {
          obj.period = obj.frDate + '|' + obj.toDate;
        }

      }
      else if (this.dateRange == "customtime") {
        obj.period = this.reportFHR + ',' + this.reportTHR;
      }
      else {
        obj.period = this.dateRange;
      }

      if (this.isScheduled == true) {
        obj.frequency = this.frequency;
        obj.dayToSend = this.day;

        if (this.reportHR.length > 0) {
          if (this.reportHR.length == 1) {
            this.reportHR = "0" + this.reportHR;
          }
          if (this.reportMM.length == 1) {
            this.reportMM = "0" + this.reportMM;
          }

          obj.userTimeZone = sessionStorage.getItem('USER_TIMEZONE');
          obj.timeToSend = this.reportHR + ":" + this.reportMM;
        }



        obj.toMailds = this.toMailids;
        obj.ccMailds = this.ccMailids;
        obj.bccMailds = this.bccMailids;
      }


      var resp: any = [];

      this._detailService.SaveTHreport(obj).subscribe(result => {
        resp = result;

        if (resp.sts == "200") {

          this.loaderService.display(false);
          this.hasSavedReports = true;
          this.toastr.success(resp.msg);

          this.modalFilter.hide();

          this.reset();

          // this.getSavedReports("", "");
          this.getScheduleReportsList("");

          this.formatLogUpdate(obj);

        }
        else {
          this.loaderService.display(false);
          this.toastr.warning(resp.msg, '', { timeOut: 5000 });
        }
      });
    }
    else {
      this.toastr.warning('Please select required fields');
    }
  }

  formatLogUpdate(obj: any) {
    debugger
    let regionObj = this.regionsList.find(x => x.regionId == obj.regionId);

    let deviceObj = "";
    this.deviceSelectedList.forEach(dev => {
      let devObj = this.FilterDeviceList.find(x => x.deviceId == dev);
      if (devObj) {
        deviceObj += devObj.deviceName + '|';
      }
    });
    deviceObj = deviceObj.substring(0, deviceObj.length - 1);


    let sensorObj = "";
    this.sensorSelectedList.forEach(dev => {
      let devObj = this.SensorList.find(x => x.key == dev);
      if (devObj) {
        sensorObj += devObj.keyName + '|';
      }
    });
    sensorObj = sensorObj.substring(0, sensorObj.length - 1);

    let sensorFunObj = "";


    try {
      this.mathSelectedList.forEach(dev => {
        let devObj = this.SensorMathFiltered.find(x => x.mathId == dev);
        if (devObj) {
          sensorFunObj += devObj.functionName + '|';
        }
      });
      sensorFunObj = sensorFunObj.substring(0, sensorFunObj.length - 1);
    }
    catch (e) {
      e = null;
    }

    let duration = "";
    try {
      if (this.dateRange == "customtime") {
        duration = this.reportFHR + ':' + this.reportTHR;
      }
      else {
        let durObj = this.DateRangeList.find(x => x.dtId == this.dateRange);
        duration = durObj.dtName;
      }
    }
    catch (e) {
      e = null;
    }

    var timeInt = "";

    try {
      var pr = this.periodRange.find(x => x.pId == obj.interval);

      timeInt = pr.pVal;
    }
    catch (e) {
      e = null;
    }

    let scheduledString = "";
    if (this.isScheduled == true) {
      let freqObj = this.frequencyRange.find(x => x.frequency == obj.frequency);
      scheduledString += ", Frequency: " + freqObj.fVal;

      if (this.is15Days) {
        let dayObj = this.dayRange.find(x => x.dId == obj.dayToSend);
        scheduledString += ", Day: " + dayObj.dVal;
      }

      let ccMail = ""
      let bccMail = ""

      if (obj.ccMailds !== null && obj.ccMailds !== "") {
        ccMail = ", CC MailID(s): " + obj.ccMailds;
      }


      if (obj.ccMailds !== null && obj.ccMailds !== "") {
        bccMail = ", BCC MailID(s): " + obj.bccMailds;
      }

      scheduledString += ", Time (24hrs format): " + obj.timeToSend +
        ", To MailID(s): " + obj.toMailds + ccMail + bccMail;
    }



    let formatString = "Report Type: " + (!this.isScheduled ? "On Demand" : "Scheduled") +
      ", Region: " + regionObj.regionName + ", Device: " + obj.devices + ", Sensor: " + sensorObj +
      ", Sensor Function: " + sensorFunObj + ", Duration: " + duration + ", Time Interval: " + timeInt +
      (this.isScheduled ? scheduledString : '') +
      ", Report Name: " + obj.reportName + ", Chart Type: " + (obj.chType == "1" ? 'Single' : 'Multiple') +
      ", Data Unavailable Summary: " + (obj.dataUA == "1" ? 'true' : 'false') + ", Show MKT: " + (obj.devMKT == "1" ? 'true' : 'false') +
      ", Show Report Generated Time: " + (obj.generatedTime == "1" ? 'true' : 'false') + ", Report Format: " + obj.reportFormat;


    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "Analytics",
      "actionPerformed": "Report has been " + (obj.reportId ? "updated" : "created") + " - " + formatString
    }

    this._commanService.logUpdate(logReq);
  }

  isCreate: boolean = false;

  reset() {
    debugger
    this.refreshDataEC();
    this.isCreate = true;
    this.regionId = [];
    this.modelId = [];
    this.FilterDeviceList = [];
    this.deviceSelectedList = [];
    this.SensorList = [];
    this.selectedUser = [];
    this.logType = [];
    this.sensorSelectedList = [];
    this.SensorMathFiltered = [];
    this.mathSelectedList = [];

    this.dateRange = [];
    this.frequency = [];
    this.day = [];

    this.devDataua = true;
    this.devAlert = true;
    this.devAudit = false;
    this.isSensorReading = true;
    this.isTimes = false;

    this.showReportFilter('Device');

    this.reportFHR = "";
    this.reportTHR = "";
    this.reportHR = "";
    this.reportMM = "";
    this.toMailids = "";
    this.ccMailids = "";
    this.bccMailids = "";
    this.reportName = "";
    this.fromDate = "";
    this.toDate = "";

    this.reportFormat = "PDF";
    this.radioSelected = "PDF";
    this.radioRPSelected = "OnDemand";
    this.dateRange = "custom";
    this.isDates = true;
    this.isSensorReading = true;
    this.isTimes = true;
    this.Chmode = true;
    this.chTypeSelected = "";
    this.interval = [];


  }

  GetReportDetails(type: any) {

    this.reportFormat = this.radioSelected
    var valid = this.validateFilters();

    if (valid) {
      var obj: any

      obj = {}

      obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
      obj.devices = "";

      this.deviceSelectedList.forEach(dev => {

        obj.devices += dev + ',';
      });

      obj.mathfunctions = "";



      this.mathSelectedList.forEach(dev => {

        obj.mathfunctions += dev + ',';
      });

      obj.reportName = this.reportName;
      obj.regionId = this.regionId;

      obj.sensors = "";
      // this.sensorSelectedList
      if (this.sensorSelectedList.length > 1) {
        this.sensorSelectedList.forEach(dev => {

          obj.sensors += dev + ',';
        });
      } else {
        obj.sensors = this.sensorSelectedList[0];
      }

      obj.interval = this.interval;

      if (obj.mathfunctions == "100,") {
        this.isTrendType = false;
      }
      else {
        this.isTrendType = true;
      }



      if (this.dateRange == "custom") {


        obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate[0]);
        obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.fromDate[1]);

        if (this.reportFHR !== "" && this.reportTHR !== "") {
          obj.period = this.reportFHR + ',' + this.reportTHR;
        }       //this.period = obj.frDate + ' To ' + obj.tDate
      }
      else if (this.dateRange == "customtime") {
        obj.frDate = this.reportFHR + ',' + this.reportTHR;
      }
      else {
        obj.frDate = this.dateRange;

      }


      this.loadReport(obj, type);
    }
  }

  showReportFilter(type: any) {


    this.islogReport = false;
    this.isDeviceReport = false;
    this.isRegionReport = false;

    if (type == 'Device') {
      this.isDeviceReport = true;
    }
    else if (type == 'log') {
      this.islogReport = true;
    }
    else if (type == 'regReport') {
      this.isRegionReport = true;
    }
  }

  SendReportMail(type: any) { }

  getDevicesFromReg(reg: any) {



    this.regDeviceSelectedList = [];

    this.FilterDeviceList = [];

    var devices = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    this.FilterDeviceList = devices.filter(g => g.regionId == reg.regionId)

  }

  setFrequency() {
    this.isDaily = false;

    if (this.frequency == "0") {
      this.isDaily = true;
    }
    else
      if (this.frequency == "1") {
        this.loadDays();
      }
      else {
        this.load30Days();
      }


    this.is15Days = false;
    if (this.frequency == "3") {
      this.is15Days = true;
    }
  }

  getSensorList(regionId: any) {


    var userDevices: any = "";
    userDevices = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    this.sensorSelectedList = [];
    // this.selectedDevice = "";



    var snrs: any;


    snrs = []
    snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));


    this.SensorList = [];

    var snrList: any = [];

    var snr = snrs.filter(g => g.shortCode == this.modelId);

    snr.forEach(s => {
      var obj: any = [];
      //s.sensorTypeId !== "6"
      if (s.sensorTypeId !== "7" && s.sensorTypeId !== "17" && s.key !== "deviceId" && s.key !== "tms") {
        obj.key = s.sensorTypeId;

        obj.keyName = s.keyName;

        obj.mathFunctions = s.mathFunctions;

        snrList.push(obj);
      }
    });

    var snr: any = [];



    snr.shortCode = this.modelId;

    this._devicedataservice.getbitwiseDataFormat(snr).subscribe(result => {

      var d: any = []

      d = result;


      d.forEach(s => {
        var obj: any = []


        if (s.name !== '') {
          obj.key = '17|' + s.dataKey + '|' + s.bitPos;

          obj.keyName = s.name;

          // obj.mathFunctions = s.mathFunctions;

          snrList.push(obj);
        }
      });

      this.SensorList = snrList;


      this.filterDevices(regionId);
    });

    if (this.deviceSelectedList.length !== this.FilterDeviceList.length) {
      this.disabledeviceSelectAll = false;
      this.disabledeviceUnSelectAll = false;
    }
    else {
      this.disabledeviceSelectAll = true;
      this.disabledeviceUnSelectAll = false;
    }

    if (this.sensorSelectedList.length !== this.SensorList.length) {
      this.disablesensorSelectAll = false;
      this.disablesensorUnSelectAll = false;
    }
    else {
      this.disablesensorSelectAll = true;
      this.disablesensorUnSelectAll = false;
    }

  }

  disableFrequency: any = false;

  checkDateRange(event: any) {
    debugger
    this.selectedRange = event.dtId;
    this.isDates = false;
    this.isTimes = false;
    this.frequency = 0;
    this.setFrequency();
    this.disableFrequency = false;

    if (event.dtId == "custom") {
      this.isDates = true;
    }
    else if (event.dtId == "customtime") {
      this.isTimes = true;
    }
    else
      if (event.dtId == "168") {
        {

          this.frequency = 1;
          this.setFrequency();

          this.disableFrequency = true;
        }
      }
      else
        if (event.dtId == "720") {
          {
            this.frequency = 2;
            this.setFrequency();

            this.disableFrequency = true;
          }
        }
    if (event.dtName == "Last Month") {
      this.is31Days = true
      this.devMKT = false;
      this.devAlert = false;
      this.devDataua = false;
      this.chTypeSelected = "";
    } else {
      this.is31Days = false
    }

  }
  selectedEnergyRange:any;
  checkDateRangeEnergy(event: any) {
    debugger
    this.selectedEnergyRange = event.dtId;
    this.frequency = 0;
    this.setFrequency();
    this.disableFrequency = false;
      if (event.dtId == "168") {
        {

          this.frequency = 1;
          this.setFrequency();

          this.disableFrequency = true;
        }
      }
      else
        if (event.dtId == "720") {
          {
            this.frequency = 2;
            this.setFrequency();

            this.disableFrequency = true;
          }
        }
    if (event.dtName == "Last Month") {
      this.is31Days = true
      this.devMKT = false;
      this.devAlert = false;
      this.devDataua = false;
      this.chTypeSelected = "";
    } else {
      this.is31Days = false
    }

  }
  
  getMathFun() {


    this.SensorMathFiltered = []

    var sM: any = {};



    sM.mathId = "0";
    sM.functionName = 'Sensor Readings';
    this.SensorMathFiltered.push(sM);



    if (this.sensorSelectedList.length > 10) {

      this.toastr.warning('Not allowed more than 10 sensor for one report');

      var senr: any = []
      let idx = 0
      this.sensorSelectedList.forEach(snr => {
        if (idx < 10) {
          senr.push(snr)
          idx += 1;
        }
      });


      this.sensorSelectedList = senr;

    }
    else {
      this.selectedSensor = "";
      this.sensorSelectedList.forEach(s => {
        var sName: any;

        sName = this.SensorList.filter(item => item.key == s);//
        this.selectedSensor += sName[0].keyName + ',';
      });



      if (this.selectedDevice.length > 30) {
        this.selectedDevice = this.selectedDevice.substring(0, 25) + '...';
      }

      if (this.sensorSelectedList.length > 1) { this.multiSensors = true; }
      else {
        this.multiSensors = false;
        this.chartType('single')
      }

      if (this.selectedSensor.length > 30) {
        this.selectedSensor = this.selectedSensor.substring(0, 25) + '...';
      }

      if (this.sensorSelectedList.length == 1) {

        var mathIDs: any

        mathIDs = this.SensorList.filter(item => item.key == this.sensorSelectedList[0]);//

        var mathIDsList: any = []
        mathIDsList = mathIDs[0].mathFunctions.split(',');


        for (let index = 0; index < mathIDsList.length; index++) {

          const element = mathIDsList[index];
          if (element != "") {
            var sM: any = {};


            sM.mathId = element;

            var mFunction: any;
            mFunction = this.SensorMath.filter(i => i.mathId == element);
            sM.functionName = mFunction[0].functionName;

            this.SensorMathFiltered.push(sM);
          }
        }
      }

      // sM.mathId = s.
      if (this.sensorSelectedList.length !== this.SensorList.length) {
        this.disablesensorSelectAll = false;
        this.disablesensorUnSelectAll = true;
      }
    }
  }
  loadDateRanges() {
    //Last 24 Hrs
    //Last 3 Days
    //Last 1 Week
    //Last 10 Days
    //Custom Dates

    this.DateRangeList = []
    this.LogDateRangeList = []
    this.DateRangeListReg = []

    var dtRange: any

    // dtRange = []
    // dtRange.dtId = "24"
    // dtRange.dtName = "Last 24 Hrs"

    // this.DateRangeList.push(dtRange);
    // this.LogDateRangeList.push(dtRange);


    dtRange = []
    dtRange.dtId = "lastDay"
    dtRange.dtName = "Yesterday"

    this.DateRangeList.push(dtRange);
    this.DateRangeListReg.push(dtRange);

    dtRange = []
    dtRange.dtId = "72"
    dtRange.dtName = "Last 3 Days"

    this.DateRangeList.push(dtRange);
    this.LogDateRangeList.push(dtRange);
    this.DateRangeListReg.push(dtRange);

    dtRange = []
    dtRange.dtId = "168"
    dtRange.dtName = "Last Week"

    this.DateRangeList.push(dtRange);
    this.LogDateRangeList.push(dtRange);
    this.DateRangeListReg.push(dtRange);


    // dtRange = []
    // dtRange.dtId = "360"
    // dtRange.dtName = "Last 15 Days"

    // this.DateRangeList.push(dtRange);
    // this.LogDateRangeList.push(dtRange);
    // this.DateRangeListReg.push(dtRange);

    dtRange = []
    dtRange.dtId = "720"
    dtRange.dtName = "Last Month"

    this.DateRangeList.push(dtRange);
    this.LogDateRangeList.push(dtRange);
    this.DateRangeListReg.push(dtRange);

    // dtRange = []
    // dtRange.dtId = "custom"
    // dtRange.dtName = "Custom Dates"

    // this.DateRangeList.push(dtRange);
    // this.DateRangeListReg.push(dtRange);

    dtRange = []
    dtRange.dtId = "customtime"
    dtRange.dtName = "Custom Time"

    this.DateRangeList.push(dtRange);

  }

  loadPeriods() {
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
      }
    );
  }

  loadFrequency() {
    this.frequencyRange = [];
    this.LogfrequencyRange = [];
    this.frequencyRange.push(
      {
        frequency: 0,
        fVal: 'Daily'
      },
      {
        frequency: 1,
        fVal: 'Weekly'
      },
      {
        frequency: 2,
        fVal: 'Monthly'
      },
      {
        frequency: 3,
        fVal: 'Every 15 days'
      }
    );

    this.LogfrequencyRange.push(
      {
        frequency: 0,
        fVal: 'Daily'
      },
      {
        frequency: 1,
        fVal: 'Weekly'
      },
      {
        frequency: 2,
        fVal: 'Monthly'
      }
    );
  }

  loadDays() {
    this.dayRange = [];
    this.dayRange.push(
      {
        dId: 1,
        dVal: 'Sunday'
      },
      {
        dId: 2,
        dVal: 'Monday'
      },
      {
        dId: 3,
        dVal: 'Tuesday'
      },
      {
        dId: 4,
        dVal: 'Wednesday'
      },
      {
        dId: 5,
        dVal: 'Thursday'
      },
      {
        dId: 6,
        dVal: 'Friday'
      },
      {
        dId: 7,
        dVal: 'Saturday'
      }
    );
  }

  logtypechanged() {

    this.deviceSelectedList = [];
    this.selectedUser = undefined;

  }

  saveLogReport() {

    var obj: any

    obj = {}



    obj.reportId = this.reportId;
    obj.LogType = this.logType
    obj.Devices = ""

    if (this.deviceSelectedList.length > 0) {
      this.deviceSelectedList.forEach(device => {
        obj.Devices += device + ',';
      });
    }

    if (this.selectedUser !== undefined) {
      obj.LogUserIds = this.selectedUser;
    }


    obj.Period = this.dateRange
    obj.ReportName = this.reportName
    obj.Frequency = this.frequency
    obj.DayToSend = this.day

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.timeToSend = this.reportHR + ":" + this.reportMM;

    obj.ToMailid = this.toMailids
    obj.CCMailid = this.ccMailids
    obj.BCCMailid = this.bccMailids

    var resp: any
    this._detailService.saveLogReport(obj).subscribe(result => {
      resp = result

      if (resp.sts == '200') {
        this.toastr.success('Log Report Saved')
        this.getLogReportsList();
        this.modalFilter.hide();
      }
      else {
        this.toastr.warning(resp.msg);//'Log Report Not Saved')
      }
    });

  }

  load30Days() {
    this.dayRange = [];

    for (let index = 1; index <= 31; index++) {
      this.dayRange.push(
        {
          dId: index,
          dVal: 'Day ' + index
        }
      );
    }


  }
  isETimeInterval:boolean = false;
  ETimeinterval:any;
  loadEnergyDateRanges() {
    this.DateRangeEnergyList = []
    var dtRange: any
    if(this.ETimeinterval == "Hourly" || this.ETimeinterval == "Daily"){
      dtRange = []
      dtRange.dtId = "lastDay"
      dtRange.dtName = "Yesterday"
  
      this.DateRangeEnergyList.push(dtRange);
  
      dtRange = []
      dtRange.dtId = "168"
      dtRange.dtName = "Last Week"
  
      this.DateRangeEnergyList.push(dtRange);
  
      dtRange = []
      dtRange.dtId = "240"
      dtRange.dtName = "Last 10 Days"
  
      this.DateRangeEnergyList.push(dtRange);
      
  
      dtRange = []
      dtRange.dtId = "720"
      dtRange.dtName = "Last Month"
  
      this.DateRangeEnergyList.push(dtRange);
    }
    else{
      dtRange = []
      dtRange.dtId = "720"
      dtRange.dtName = "Last Month"
  
      this.DateRangeEnergyList.push(dtRange);
    }
    
  }

  loadEnergyPeriods() {
    this.filteredEnergyPeriodRange = [];
    this.filteredEnergyPeriodRange.push(
      {
        pId: 'Hourly',
        pVal: 'Hourly'
      },
      {
        pId: 'Daily',
        pVal: 'Daily'
      },
      {
        pId: 'Monthly',
        pVal: 'Monthly'
      }
    );
  }
  isHourly:boolean = false;
  hourlyDate:any;
  maxDateH:any;
  minDateH:any;
  refreshDataEC(){
    this.ETimeinterval = [];
    this.isETimeInterval = false;
    this.startMonth = "";
    this.endMonth = "";
    this.fromDate = "";
    this.hourlyDate = "";
    this.isHourly = false;
    this.isEDaily = false;
    this.isMonthly = false;
  }
  sensorFunction() {
    debugger
    // if (this.mathSelectedList.length == this.SensorMathFiltered.length) {
    //   this.toastr.warning("All Sensor functions are not allowed at a time")
    //   this.mathSelectedList = [];
    // }
    // else {
      this.refreshDataEC();
    if (this.mathSelectedList == "0") {
      this.isSensorReading = true;
      this.isETimeInterval = false;
    }
    else if(this.mathSelectedList == "7"){
      this.isETimeInterval = true;
      this.filteredEnergyPeriodRange = [];
      this.loadEnergyPeriods();
      this.loadEnergyDateRanges();
      this.setDatesforEnergy();
      
    }
    else {
      this.isSensorReading = false;
    }

    this.selectedSensorMath = "";

    this.mathSelectedList.forEach(s => {
      var sName: any;

      if (this.mathSelectedList.length > 1 && s == "0") {
        this.toastr.warning("Sensor reading with other combinations are not allowed at a time")
        this.mathSelectedList = [];
        return
      }
      else if (this.mathSelectedList.length > 1 && s == "100") {
        this.toastr.warning("State Based with other combinations are not allowed at a time")
        this.mathSelectedList = [];
        return
      }
      else {
        sName = this.SensorMathFiltered.filter(item => item.mathId == s);//
        this.selectedSensorMath += sName[0].functionName + ',';
      }
    });

    if (this.selectedSensorMath.length > 30) {
      this.selectedSensorMath = this.selectedSensorMath.substring(0, 25) + '...';
    }
    //}
  }
  isEDaily:boolean = false;
  startMonth:any;
  endMonth:any;
  isMonthly:boolean = false;
  checkEnergyTimeRange() {
    debugger
    this.dateEnergyRange = [];
    this.isEDaily = false;
      this.isHourly = false;
      this.isMonthly = false;
    if (this.ETimeinterval == "Hourly") {
      this.isHourly = true;
      this.isEDaily = false;
      this.isMonthly = false;
    }
    else if(this.ETimeinterval == "Daily"){
      this.isEDaily = true;
      this.isHourly = false;
      this.isMonthly = false;
    }
    else if(this.ETimeinterval == "Monthly"){
      this.isEDaily = false;
      this.isHourly = false;
      this.isMonthly = true;
    }
    this.loadEnergyDateRanges();
  }
minDateM:any;
maxDateM:any;
  setDatesforEnergy(){
    var currentDate = new Date();
    var maxDate = new Date(new Date().setDate(new Date().getDate() - 30));
    this.maxDateH = this.formatDate(currentDate)
    this.minDateH = this.formatDate(maxDate)
    this.minDateM = this.formatDateforMonth(new Date("2023-09"))
    this.maxDateM = this.formatDateforMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    
  }
  formatDateforMonth(date: Date): string {
    debugger
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if necessary
    const year = date.getFullYear().toString(); // Get year
  
    return `${year}-${month}`;
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if necessary
    const year = date.getFullYear().toString(); // Get year
  
    return `${year}-${month}-${day}`;
  }
  openNew(fType: any) {
    this.reset();

    this.showRadio = false;
    this.cameFrom = fType;

    this.radioSelected = "PDF";
    this.radioRPSelected = "OnDemand";

    if (this.cameFrom == "Scheduled") {
      this.onScheduled();
      this.mode = false;
      this.disableReportName = false;
      this.reportId = "";
      this.createReportModal = "Create Scheduled Report";
    }
    else
      if (this.cameFrom == "Saved") {
        this.onDemand();
        this.mode = true;
        this.disableReportName = false;
        this.reportId = "";
        this.createReportModal = "Create Saved Report";
      }


    this.modalFilter.show();
  }

  openPDFTemplate() {

    var resp: any = []
    this.loaderService.display(true);
    this._detailService.getPDFtemplate().subscribe(result => {

      resp = result;

      this.loaderService.display(false);
      this.selectedView = resp;
    });

    this.modalPdfTemp.show()

  }
  showReportButton: boolean = false;
  radioSelected: any = []
  radioRPSelected: any = []
  chTypeSelected: any = []
  openFilter(fType: any) {
    this.reset();
    debugger



    this.createReportModal = "Create Report";
    this.isRegionReport = false;

    if (this.cameFrom == "Region" && fType !== "New") {

      this.radioRPSelected = "Schedule";
      // this.dateRange = [];
      this.isDates = false;
      this.isScheduled = true;


      this.createReportModal = "Update Report";
      this.isDeviceReport = false;

      this.disableReportName = true;
      this.regionId = this.savedReports[0].regionId;
      this.interval = +this.savedReports[0].interval;
      this.modelId = this.savedReports[0].shortCode;
      this.dateRange = this.savedReports[0].period;

      this.reportName = this.savedReports[0].reportName;

      if (this.savedReports[0].period.includes('|')) {
        this.dateRange = "custom";
        this.isDates = true;
        var _frDate = this.savedReports[0].period;
        // 2021-10-04 10:00
        this.fromDate = []

        this.fromDate[0] = new Date(new Date(_frDate.split('|')[0].split(' ')[0]).setMinutes(-300))
        this.fromDate[1] = new Date(new Date(_frDate.split('|')[1].split(' ')[0]).setMinutes(-300))


        var _fTime = _frDate.split('|')[0].split(' ')[1].split(':')[0]
        var _tTime = _frDate.split('|')[1].split(' ')[1].split(':')[0]

        this.reportFHR = _fTime;

        this.reportTHR = _tTime;

      }

      this.isRegionReport = true;

      var snrs = this.savedReports[0].sensors.split(',');
      this.regSensorSelectedList = []
      for (let idx = 0; idx < snrs.length; idx++) {
        if (snrs[idx] != "") {
          this.regSensorSelectedList.push(snrs[idx]);
        }
      }

      if (this.regSensorSelectedList.length == 2) {
        this.selectedSensor = "T - °C,RH - %"
      }
      else {
        if (this.regSensorSelectedList[0] == "t") { this.selectedSensor = "T - °C" }
        else
          if (this.regSensorSelectedList[0] == "h") { this.selectedSensor = "RH - %" }
      }



      this.toMailids = this.savedReports[0].toMailds;
      this.ccMailids = this.savedReports[0].ccMailds;
      this.bccMailids = this.savedReports[0].bccMailds;
      this.frequency = + this.savedReports[0].frequency




      this.setFrequency();

      this.day = +this.savedReports[0].dayToSend;

      this.reportHR = this.savedReports[0].timeToSend.split(':')[0];
      this.reportMM = this.savedReports[0].timeToSend.split(':')[1];



      if (this.savedReports[0].frequency !== '' && this.savedReports[0].frequency !== null) {
        this.onScheduled();

        this.mode = false;
      }
      else {
        this.onDemand();
        this.mode = true;
      }


      this.modalFilter.show();

      var obj: any = {}
      obj.regionId = this.regionId;

      this.getDevicesFromReg(obj);

      var devices: any = [];

      devices = this.savedReports[0].devices.split(',');

      this.regDeviceSelectedList = [];
      this.selectedDevice = "";


      var devName: any = []

      devices.forEach(dev => {
        this.regDeviceSelectedList.push(dev);
        devName = this.FilterDeviceList.filter(gr => gr.sensorId == dev);

        this.selectedDevice += devName[0].deviceName + ",";
      });
      if (this.regDeviceSelectedList.length > 1) {
        this.selectRegDev(this.regDeviceSelectedList)
      }

      //this.RegSensorList.push({ snrId: '1', snrName: '°C' }, { snrId: '14', snrName: '%' })

    }
    else {
      if (this.cameFrom == "Scheduled") {
        this.onScheduled();
        this.mode = false;
      }
      else
        if (this.cameFrom == "Saved") {
          this.onDemand();
          this.mode = true;
        }
        else {
          this.onDemand();
        }



      this.modalFilter.show();

      if (fType == "New") {
        this.reportId = "";
        this.showRadio = true;
        this.disableReportName = false;
        this.regDeviceSelectedList = []
        this.regSensorSelectedList = []
        this.mode = true;
      }
      else {

        this.createReportModal = "Update " + this.cameFrom + " Report";

        // this.reportFormat = this.savedReports[0].reportFormat;

        this.radioSelected = this.savedReports[0].reportFormat;
        this.reportFormat = this.radioSelected

        this.disableReportName = true;
        this.regionId = this.savedReports[0].regionId;
        this.interval = +this.savedReports[0].interval;
        this.modelId = this.savedReports[0].shortCode;

        this.loaderService.display(true);
        
        if (this.savedReports[0].chType == '1') {
          // this.multiSensors = false;
          // this.chartType('single')
          this.chTypeSelected = "Single"; this.Chmode = true;
        }
        else if (this.savedReports[0].chType == '2') {
          // this.multiSensors = true;
          // this.chartType('multiple')
          this.chTypeSelected = "Multiple"; this.Chmode = false;
        }

        this.devMKT = false;
        if (this.savedReports[0].devMKT == '1') {
          this.devMKT = true;
        }


        this.isScheduled = true;

        if (this.savedReports[0].frequency == "") {
          this.isScheduled = false;
        }


        this.generatedTime = false;
        if (this.savedReports[0].generatedTime == '1') {
          this.generatedTime = true;
        }

        this.getDevices(this.regionId);
        // this.getSensorList(this.regionId);

        this.isDates = false;
        this.isScheduled = true;
        this.radioRPSelected = 'Schedule';

        this.selectDev();
        debugger
        this.mathSelectedList = this.savedReports[0].mathfunctions;
        if(this.mathSelectedList == "7"){

          this.isETimeInterval = true;
          this.ETimeinterval = this.savedReports[0].interval
          this.loadEnergyPeriods();
          this.loadEnergyDateRanges();
          this.dateEnergyRange = this.savedReports[0].period;
        }
      }
    }

  }

  ondevSelectAll() {

    this.disabledeviceSelectAll = true;
    this.disabledeviceUnSelectAll = false;
    this.deviceSelectedList = this.FilterDeviceList.map(x => x.deviceId);

  }
  ondevDeSelectAll() {


    this.disabledeviceSelectAll = false;
    this.disabledeviceUnSelectAll = true;
    this.deviceSelectedList = [];

  }


  onsenSelectAll() {


    this.disablesensorSelectAll = true;
    this.disablesensorUnSelectAll = false;
    this.sensorSelectedList = this.SensorList.map(x => x.key);

    this.getMathFun();
  }
  onsenDeSelectAll() {



    this.disablesensorSelectAll = false;
    this.disablesensorUnSelectAll = true;
    this.sensorSelectedList = [];

  }

  onsenMathSelectAll() {


    this.disablesensorMathSelectAll = true;
    this.disablesensorMathUnSelectAll = false;
    this.mathSelectedList = this.SensorMathFiltered;//.map(x => x.key);

  }
  onsenMathDeSelectAll() {



    this.disablesensorMathSelectAll = false;
    this.disablesensorMathUnSelectAll = true;
    this.mathSelectedList = [];

  }

  modelList: any = []
  modelId: any;
  AllDevices: any = [];

  getDevices(regionId: any) {
    debugger
    var obj: any;

    obj = {};

    obj.loginId = sessionStorage.getItem("LOGINUSERID")
    obj.regionId = this.regionId;

    this.deviceSelectedList = [];
    // this.selectedDevice = "";
    this.sensorSelectedList = [];

    // this.modelId = [];


    var devList: any;
    devList = [];
    this._devicedataservice.getonBoardDevice(obj).subscribe(result => {
      devList = result;

      var dev: any;

      this.AllDevices = [];
      this.modelList = [];

      devList.devices.forEach(d => {
        dev = [];

        dev.deviceId = d.DeviceId;
        dev.deviceName = d.DeviceName;
        dev.frequency = d.frequency;

        this.AllDevices.push(dev);

        this.modelList.push({
          modelId: d.DeviceId.split('_')[0] + '_',
          modelName: d.DeviceId.split('_')[0],
        });
      });

      this.modelList = this.modelList.filter(
        (thing, i, arr) => arr.findIndex(t => t.modelId === thing.modelId) === i
      );

      if (this.modelList.length == 1) {
        this.modelId = this.modelList[0].modelId;
      }

      this.getSensorList(regionId);

    });

  }


  chartType(type) {


    if (type == 'single') {
      this.Chmode = true;
    }
    else {
      this.Chmode = false;
    }

  }

  selectDev() {
    
    if ((this.deviceSelectedList.length > 5 && this.reportFormat.toLowerCase() !== 'excel') ||
      (this.deviceSelectedList.length > 10 && this.reportFormat.toLowerCase() == 'excel')) {

      this.toastr.warning('Not allowed more than ' + (Number(this.deviceSelectedList.length) - 1) + ' Devices for ' + this.reportFormat + ' report');

      var senr: any = []
      let idx = 0
      this.deviceSelectedList.forEach(snr => {
        if (idx < (Number(this.deviceSelectedList.length) - 1)) {
          senr.push(snr)
          idx += 1;
        }
      });


      this.deviceSelectedList = senr;

    }



    this.selectedDevice = "";
    var devname: any = []
    var freqList: any = [];
    this.deviceSelectedList.forEach(dev => {
      devname = this.FilterDeviceList.filter(x => x.deviceId == dev)

      this.selectedDevice += devname[0].deviceName + ',';

      freqList.push(Number(devname[0].frequency))
    });



    var maxFreq = Math.max(...freqList);

    this.filteredPeriodRange = [];
    

    this.periodRange.forEach(pr => {
      if (pr.pId >= (maxFreq * 60)) {
        this.filteredPeriodRange.push({
          pId: pr.pId,
          pVal: pr.pVal
        });
      }
    });

    if (this.selectedDevice.length > 30) {
      this.selectedDevice = this.selectedDevice.substring(0, 25) + '...';
    }

  }



  selectRegDev(obj: any) {

    // this.deviceSelectedList = obj;

    if (this.regDeviceSelectedList.length == this.FilterDeviceList.length) {
      this.selectedDevice = "All"
    }
    else
      if (this.regDeviceSelectedList.length == 1) {

        this.selectedDevice = obj[0].deviceName
      }
      else
        if (this.regDeviceSelectedList.length > 1) {

          this.selectedDevice = this.regDeviceSelectedList.length + " Selected";// obj[0].deviceName
        }
  }

  filterDevices(regionId: any) {

    this.loaderService.display(false);



    this.FilterDeviceList = [];

    this.disabledeviceSelectAll = false;
    this.disabledeviceUnSelectAll = true;

    this.disablesensorSelectAll = false;
    this.disablesensorUnSelectAll = true;

    this.disablesensorMathSelectAll = false;
    this.disablesensorMathUnSelectAll = true;


    this.deviceSelectedList = [];
    this.selectedDevice = "";
    this.FilterDeviceList = [];

    this.selectedSensor = "";
    this.sensorSelectedList = [];

    this.selectedSensorMath = "";
    this.mathSelectedList = [];



    var fdList: any = []
    this.AllDevices.forEach(d => {
      if (d.deviceId.includes(this.modelId)) {
        fdList.push(d);
      }
    });

    this.FilterDeviceList = fdList



    if (regionId != "") {
      // this.sensorSelectedList = this.savedReports[0].sensors;
      var devices: any = [];

      devices = this.savedReports[0].devices.split(',');

      this.deviceSelectedList = [];
      this.selectedDevice = "";

      var devName: any = []

      devices.forEach(dev => {
        this.deviceSelectedList.push(dev);
        devName = this.FilterDeviceList.filter(gr => gr.deviceId == dev);
        this.selectedDevice += devName[0].deviceName + ",";
      });

      if (devices.length > 0) {
        this.modelId = devices[0].split('_')[0] + '_';
      }


      // this.getSensorList('');

      var SelectedDevices: any = [];

      SelectedDevices = this.FilterDeviceList;

      this.FilterDeviceList = [];

      var fdList: any = []
      SelectedDevices.forEach(d => {
        if (d.deviceId.includes(this.modelId)) {
          fdList.push(d);
        }
      });

      this.FilterDeviceList = fdList;


      var obj: any = {}
      obj.key = this.savedReports[0].sensors;

      var mfList: any = [];

      mfList = this.savedReports[0].sensors.split(',');

      this.sensorSelectedList = [];

      mfList.forEach(dev => {
        if (dev != "") {
          this.sensorSelectedList.push(dev);
        }
      });

      this.getMathFun();

      this.mathSelectedList = this.savedReports[0].mathfunctions;

      // this.mathSelectedList = [];
      // var mathFun: any
      // mathFun = []
      // mathFun = this.savedReports[0].mathfunctions.split(',');


      // mathFun.forEach(dev => {
      //   if (dev == "0") {
      //     this.isSensorReading = true;
      //   }
      //   else {

      //     this.isSensorReading = false;
      //   }
      //   this.mathSelectedList.push(dev)
      // });

      // this.selectedSensorMath = "";

      // this.mathSelectedList.forEach(s => {
      //   var sName: any;

      //   sName = this.SensorMathFiltered.filter(item => item.mathId == s);//
      //   this.selectedSensorMath += sName[0].functionName + ',';
      // });

      // if (this.selectedSensorMath.length > 30) {
      //   this.selectedSensorMath = this.selectedSensorMath.substring(0, 25) + '...';
      // }

      this.reportName = this.savedReports[0].reportName;
      this.dateRange = this.savedReports[0].period;

      this.interval = +this.savedReports[0].interval;

      var mails: any = [];

      //to mailds
      this.toMailids = [];
      if (this.savedReports[0].toMailds.length > 0) {
        // this.toMailids = this.savedReports[0].toMailds.split(',');
        var toMailIds = this.savedReports[0].toMailds.split(',');
        toMailIds.forEach(mailId => {
          if (mailId !== '') {
            this.toMailids.push(mailId);
          }
        });
      }

      //cc mailIds
      this.ccMailids = [];
      if (this.savedReports[0].ccMailds.length > 0) {
        // this.ccMailids = this.savedReports[0].ccMailds.split(',');
        var toMailIds = this.savedReports[0].ccMailds.split(',');
        toMailIds.forEach(mailId => {
          if (mailId !== '') {
            this.ccMailids.push(mailId);
          }
        });
      }

      //bcc MailIds
      this.bccMailids = [];
      if (this.savedReports[0].bccMailds.length > 0) {
        // this.bccMailids = this.savedReports[0].bccMailds.split(',');

        var toMailIds = this.savedReports[0].bccMailds.split(',');
        toMailIds.forEach(mailId => {
          if (mailId !== '') {
            this.bccMailids.push(mailId);
          }
        });
      }

      // var freq: any;

      // freq = this.frequencyRange.filter(g => g.frequency == this.savedReports[0].frequency);



      this.frequency = + this.savedReports[0].frequency

      this.setFrequency();

      // var days: any;

      // days = this.frequencyRange.filter(g => g.frequency == this.savedReports[0].dayToSend);

      this.day = +this.savedReports[0].dayToSend;


      this.reportHR = this.savedReports[0].timeToSend.split(':')[0];
      this.reportMM = this.savedReports[0].timeToSend.split(':')[1];

      if (this.savedReports[0].period.includes(',')) {
        this.isTimes = true;
        this.dateRange = "customtime";
        this.reportFHR = this.savedReports[0].period.split(',')[0];
        this.reportTHR = this.savedReports[0].period.split(',')[1];
      }
      else if (this.savedReports[0].period.includes('|')) {
        this.dateRange = "custom";
        this.isDates = true;
        var _frDate = this.savedReports[0].period;
        // 2021-10-04 10:00
        this.fromDate = []

        this.fromDate[0] = new Date(new Date(_frDate.split('|')[0].split(' ')[0]).setMinutes(-300))
        this.fromDate[1] = new Date(new Date(_frDate.split('|')[1].split(' ')[0]).setMinutes(-300))


        var _fTime = _frDate.split('|')[0].split(' ')[1].split(':')[0]
        var _tTime = _frDate.split('|')[1].split(' ')[1].split(':')[0]

        this.reportFHR = _fTime;

        this.reportTHR = _tTime;

      }

      this.validName = true;



      this.devDataua = this.savedReports[0].dataUA == '1' ? true : false;
      this.devAlert = this.savedReports[0].devAlert == '1' ? true : false;
      this.devAudit = this.savedReports[0].devAudit == '1' ? true : false;

    }
  }
}
