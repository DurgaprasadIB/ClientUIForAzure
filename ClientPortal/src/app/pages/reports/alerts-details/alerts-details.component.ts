import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../service/report.service';
import Swal from 'sweetalert2'
import { ExportExcelService } from '../../GlobalServices/export-excel.service';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/services/loader.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NullTemplateVisitor } from '@angular/compiler';
import { DeviceDataService } from '../../GlobalServices/devicedata.service';

@Component({
  selector: 'app-alerts-details',
  templateUrl: './alerts-details.component.html',
  styleUrls: ['./alerts-details.component.css']
})
export class AlertsDetailsComponent implements OnInit {



  @ViewChild('AttachamentFile') AttachamentFile: ElementRef;
  @ViewChild('modelAlertSet') modelAlertSet: any;

  @ViewChild('modalAlertCause') modalAlertCause: any;
  @ViewChild('modalAlertCauseImage') modalAlertCauseImage: any;
  @ViewChild('modalAlertReport') modalAlertReport: any;

  excelShowHide: any = false;
  ResponseList: any = [];
  responseData: any = []
  SupportListList: any = [];
  AlertsDetailsObj: any = new AlertsDetails();
  DeviceList: any;
  tempDevicelist: any
  SensorList: any;
  tempSensorList: any;

  maxDate: any = Date;
  maxDateCause: any = Date;
  dataset: any;

  TableType: any;
  alertRespData: any

  smsCheck: boolean;
  emailCheck: boolean;
  notifCheck: boolean;

  dateRange: any;
  DateRangeList: any = [];
  selectedRange: any = "";

  isDates: boolean = false;

  processing = true;
  isGo: boolean = false;
  Exportdataset: any = [];
  ExportPDFdata: any = [];
  status = { text: 'processing...', class: 'alert alert-danger' };
  isShowFooter: boolean = false;
  DateFormat: string;
  cldDateFormat: any;

  period: any = "";
  deviceSelectedList: any;
  sensorSelectedList: any;
  statusSelectedList: any;

  isAllsnsrSelected: boolean = false;
  isNotAllsnsrSelected: boolean = true;

  isAllDevSelected: boolean = false;
  isNotAllDevSelected: boolean = true;

  alertTypeData: any = [];

  disabeleRegSelectAll = false;
  disableRegUnSelectAll = true;

  disabeleSnsrSelectAll = false;
  disableSnsrRegUnSelectAll = true;

  clientRegions: any = []
  selectedRegion: any = []
  isSuperAdmin: boolean = false;
  userHwTypes: any;
  selectHW: any;
  operationalStatus: any;
  selectopStatus: any;
  selectopStatusCause: any;
  statusList: any;
  reportFormatList: any = [];
  reportFormatListCAPA: any = [];
  reportUserMailIds: any = [];
  constructor(private _detailService: ReportService,
    private _commanService: IdeaBService,
    private toastr: ToastrService,
    private _exportExcel: ExportExcelService,
    private loaderService: LoaderService,
    private _devicedataservice: DeviceDataService,
    private translate: TranslateService,
  ) { }

  bgImage: any;

  ngOnInit() {

    debugger
    sessionStorage.setItem('liveScreen', "alert");
    this.bgImage = sessionStorage.getItem('BGimage');
    this.loaderService.display(true);
    this.DateFormat = "(" + this._commanService.getDateFormat() + ")";
    this.cldDateFormat = "dd-MM-yyyy";
    this.reportUserMailIds = JSON.parse(sessionStorage.getItem("iotUserMailIds"));
    //this.PleaseselectRegNo = this.translate.instant('PleaseselectRegNo')
    var currentDate = new Date();

    this.AlertsDetailsObj.fromDate = ""// new Date(new Date().setHours(0, 0, 0, 0));
    this.AlertsDetailsObj.toDate = ""//currentDate;
    this.maxDate = currentDate;
    currentDate.setHours(0, 0, 0, 0);
    this.maxDateCause = currentDate//new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
    this.reportFormatList.push({ name: 'PDF', value: 'PDF' },
      { name: 'Excel', value: 'Excel' });
    this.reportFormatListCAPA.push({ name: 'CAPA', value: '1' }, { name: 'No_CAPA', value: '0' })

    this.isDates = false;
    // this.selectHW = [];
    // USER_DEVICES
    this.DeviceList = []

    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));
    var cRegions: any = []
    cRegions = JSON.parse(sessionStorage.getItem('Regions'));

    this.clientRegions = []
    this.selectedRegion = []

    cRegions.forEach(cR => {
      var dR = this.DeviceList.filter(r => r.regionId.toLowerCase() == cR.regionId.toLowerCase());

      if (dR.length > 0) {
        this.clientRegions.push({
          regionId: cR.regionId,
          regionName: cR.regionName,
          regionLat: cR.regionLat,
          regionLng: cR.regionLng
        })
      }

    });

    this.userHwTypes = [];
    this.operationalStatus = [];


    var operationalstats: any;
    operationalstats = JSON.parse(sessionStorage.getItem('operational_Status'));
    var opStat: any;
    if (operationalstats !== undefined && operationalstats !== null) {
      operationalstats.forEach(ops => {
        opStat = {}

        opStat.id = ops.operational_Id;
        opStat.name = ops.operational_status;

        this.operationalStatus.push(opStat);
      });
    }
    this.disabeleRegSelectAll = true;
    this.disableRegUnSelectAll = true;

    this.disabeleSnsrSelectAll = true;
    this.disableSnsrRegUnSelectAll = true;


    this.statusList = []

    var sts: any
    sts = []
    sts.status = "Critical"
    this.statusList.push(sts);

    sts = []
    sts.status = "Warning"
    this.statusList.push(sts);


    this.loadDateRanges();
    this.loadDateRangesAlert();
    this.loadDefaultAlerts();
    this.loaderService.display(false);

    this.TableType = "Live Alerts";


    if (sessionStorage.getItem("User_SuperAdmin").toLowerCase() == "superadmin") {
      this.isSuperAdmin = true;
    }
    else {
      this.isSuperAdmin = false;
    }
  }

  modelList: any = []
  modelId: any;
  AllDevices: any = [];
  regionId: any = ""

  changeRegion() {

    this.regionId = this.selectedRegion;

    var obj: any;

    obj = {};

    obj.loginId = sessionStorage.getItem("LOGINUSERID")
    obj.regionId = this.regionId;

    this.deviceSelectedList = [];
    // this.selectedDevice = "";
    this.sensorSelectedList = [];

    // this.modelId = [];
    this.DeviceList = [];
    this.SensorList = [];
    this.userHwTypes = [];
    debugger
    var devList: any;
    devList = [];
    this._devicedataservice.getonBoardDevice(obj).subscribe(result => {
      devList = result;

      var dev: any;
      debugger
      this.DeviceList = [];
      this.modelList = [];


      devList.devices.forEach(d => {
        debugger
        if (d.regionId == this.regionId) {
          dev = {};
          debugger
          dev.sensorId = d.DeviceId;
          dev.deviceName = d.DeviceName;
          dev.frequency = d.frequency;

          this.DeviceList.push(dev);



          this.userHwTypes.push({
            id: d.DeviceId.split('_')[0] + '_',
            name: d.DeviceId.split('_')[0],
          });
        }
      });


      this.userHwTypes = this.userHwTypes.filter(
        (thing, i, arr) => arr.findIndex(t => t.Id === thing.Id) === i
      );



    });

  }

  isDaily: boolean = false;
  radioSelected: any;
  radioSelectedCAPA: any;
  is15Days: boolean = false;
  frequency: any;
  setFrequency() {
    debugger
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

  dayRange: any;
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

  statusListAlert: any;
  alertReportDetails: any;
  alertReportId: any;
  resetAlertReport() {
    this.radioSelected = "PDF";
    this.radioSelectedCAPA = "1";
    this.isDaily = true;
    this.statusListAlert = []

    var sts: any
    sts = []
    sts.status = "Critical"
    this.statusListAlert.push(sts);

    sts = []
    sts.status = "Warning"
    this.statusListAlert.push(sts);

    this.reportHR = "";
    this.reportMM = "";
    this.dateRangeAlert = null;
    this.frequency = null;
    this.day = null;
    this.alertReportId = "";
    this.statusAlertSelectedList = [];
    this.toMailids = [];
    this.loadFrequency();
  }
  OpenAlertReport() {

    // sts = []
    // sts.status = "Warning"
    // this.statusListAlert.push(sts);
    this.resetAlertReport();

    this._detailService.GetAlertReportConfig().subscribe(result => {
      debugger
      this.alertReportDetails = result;
      if (this.alertReportDetails.length > 0) {
        this.dateRangeAlert = this.alertReportDetails[0].period;
        this.radioSelectedCAPA = this.alertReportDetails[0].CAPA;
        //this.frequency = this.alertReportDetails[0].frequency;
        this.frequency = + this.alertReportDetails[0].frequency
        this.setFrequency();
        this.day = +this.alertReportDetails[0].dayToSend;
        this.reportHR = this.alertReportDetails[0].timeToSend.split(':')[0];
        this.reportMM = this.alertReportDetails[0].timeToSend.split(':')[1];
        this.radioSelected = this.alertReportDetails[0].reportFormat;
        //this.toMailids = this.alertReportDetails[0].toMailds;
        this.alertReportId = this.alertReportDetails[0].reportId;
        this.statusAlertSelectedList = [];
        if (this.alertReportDetails[0].status.length > 0) {
          // this.toMailids = this.savedReports[0].toMailds.split(',');
          var status = this.alertReportDetails[0].status.split(',');
          status.forEach(status => {
            if (status !== '') {
              this.statusAlertSelectedList.push(status);
            }
          });
        }
        this.toMailids = [];
        if (this.alertReportDetails[0].toMailds.length > 0) {
          // this.toMailids = this.savedReports[0].toMailds.split(',');
          var toMailIds = this.alertReportDetails[0].toMailds.split(',');
          toMailIds.forEach(mailId => {
            if (mailId !== '') {
              this.toMailids.push(mailId);
            }
          });
        }

      }
    })
    this.modalAlertReport.show();
  }
  SaveAlertReport() {
    debugger

    var valid = this.validateFilters();

    if (valid) {
      debugger
      this.loaderService.display(true);
      var obj: any = {};
      obj.reportId = this.alertReportId;
      //obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
      // this.reportName = this.reportName.replace(/\s/g, "-");
      // this.reportName = this.reportName.replace(".", "");
      // obj.reportName = this.reportName;
      obj.period = this.dateRangeAlert;
      obj.frequency = this.frequency;
      if (this.frequency == "0") {
        this.day = "0"
      }
      obj.dayToSend = this.day;
      obj.reportFormat =this.radioSelected;
      obj.CAPA ='1';// this.radioSelectedCAPA;

      var myObjectArray = this.statusAlertSelectedList.join(', ');//.map(sts => `${sts.status}`)
      obj.status = myObjectArray;
      if (this.reportHR.length > 0) {
        if (this.reportHR.length == 1) {
          this.reportHR = "0" + this.reportHR;
        }
        if (this.reportMM.length == 1) {
          this.reportMM = "0" + this.reportMM;
        }
        obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
        // obj.userTimeZone = sessionStorage.getItem('USER_TIMEZONE');
        obj.timeToSend = this.reportHR + ":" + this.reportMM;
      }
      obj.toMailds = "";
      if (this.toMailids !== "" && this.toMailids !== null && this.toMailids !== undefined) {

        this.toMailids.forEach(mail => {
          obj.toMailds += mail + ',';
        });
      }

      // obj.ccMailds = "";
      // if (this.ccMailids !== "" && this.ccMailids !== null && this.ccMailids !== undefined) {

      //   if (this.ccMailids.length > 0) {
      //     this.ccMailids.forEach(mail => {
      //       obj.ccMailds += mail + ',';
      //     });
      //   }
      // }

      // obj.bccMailds = "";
      // if (this.bccMailids !== "" && this.bccMailids !== null && this.bccMailids !== undefined) {

      //   if (this.bccMailids.length > 0) {
      //     this.bccMailids.forEach(mail => {
      //       obj.bccMailds += mail + ',';
      //     });
      //   }
      // }
      // var countReportExist = this.reportList.filter(item => item.devices == obj.devices.slice(0, -1) && item.sensors == obj.sensors && item.period == obj.period && item.interval == interval);//&& item.reportFormat == obj.reportFormat
      // if(countReportExist.length > 0){
      //   debugger
      //   this.loaderService.display(false);
      //   this.toastr.warning("Already Report Exists with same Metrics:" + countReportExist[0].displayName.toString(), '', { timeOut: 5000 });
      //   return
      // }
      var resp: any = [];
      debugger
      this._detailService.SaveAlertCustonReport(obj).subscribe(result => {
        resp = result;
        debugger
        if (resp.sts == "200") {

          this.loaderService.display(false);
          this.toastr.success(resp.msg);
          // this.modalFilter.hide();

          // this.reset();
        }
        else {

          this.loaderService.display(false);
          this.toastr.warning(resp.msg, '', { timeOut: 5000 });
        }
      });
    }
  }

  reportName: any = "";
  day: any;
  validateFilters() {

    var valid: boolean = true;
    if (this.dateRangeAlert == "" || this.dateRangeAlert == undefined || this.dateRangeAlert == null) {
      this.toastr.warning("Please Select Period");
      valid = false;
    }
    else if (this.statusAlertSelectedList == "" || this.statusAlertSelectedList == undefined || this.statusAlertSelectedList == null) {
      this.toastr.warning("Please Select Status");
      valid = false;
    } else if ((this.frequency == null || this.frequency.length == 0)) {

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
    return valid;
  }
  reportMM: any;
  reportHR: any;


  getDevices(fromModel: any) {



    this.DeviceList = {}
    this.tempDevicelist = {}
    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));
    this.tempDevicelist = this.DeviceList
    this.SensorList = {}
    this.tempSensorList = {}
    this.SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.tempSensorList = this.SensorList


    if (fromModel) {
      this.deviceSelectedList = [];
      this.sensorSelectedList = [];
      this.dateRange = [];
      this.selectedRange = [];
      this.statusSelectedList = [];
      this.selectopStatus = null;
      //this.ResetData(this.AlertsDetailsObj);
    }
    if (this.DeviceList.length > 0) {
      this.disabeleRegSelectAll = false;
      this.disableRegUnSelectAll = true;
    }


    if (this.regionId) {
      this.DeviceList = this.DeviceList.filter(item => item.regionId == this.regionId);//
    }

    if (this.selectHW) {
      if (this.selectHW.length > 0) {
        this.DeviceList = this.DeviceList.filter(item => item.shortCode == this.selectHW);//
        this.SensorList = this.SensorList.filter(item => item.shortCode == this.selectHW);
      }
    }
    else {

      this.selectHW = [];
    }

    if (this.SensorList.length > 0) {
      this.disabeleSnsrSelectAll = false;
      this.disableSnsrRegUnSelectAll = true;
    }


  }


  openImage(imgURL: any) {

    this.modalAlertCauseImage.show();

    this.imgPath = imgURL;
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
  DateRangeListAlert: any;
  dateRangeAlert: any;
  statusAlertSelectedList: any;
  selectedTomails: any;
  selectedCCmails: any;
  selectedBCCmails: any;

  toMailids: any;
  ccMailids: any;
  bccMailids: any;
  loadDateRangesAlert() {
    //Last 24 Hrs
    //Last 3 Days
    //Last 1 Week
    //Last 10 Days
    //Custom Dates

    this.DateRangeListAlert = []

    var dtRange: any

    dtRange = []
    dtRange.dtId = "24"
    dtRange.dtName = "Last 24 Hrs"

    this.DateRangeListAlert.push(dtRange);

    // dtRange = []
    // dtRange.dtId = "72"
    // dtRange.dtName = "Last 3 Days"

    // this.DateRangeListAlert.push(dtRange);

    // dtRange = []
    // dtRange.dtId = "168"
    // dtRange.dtName = "Last 1 Week"

    // this.DateRangeListAlert.push(dtRange);

    // dtRange = []
    // dtRange.dtId = "720"
    // dtRange.dtName = "Last 30 Days"

    // this.DateRangeListAlert.push(dtRange);

  }
  checkSpecialChar(event) {

    var iChars = "!`@#$%^&*()+=-[]\\\';,./{}|\":<>?~_";

    if (iChars.includes(event.key)) {
      return false;
    }
    return true;

    //allsavedReports
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


  checkNumericsHr(event) {
    debugger
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
  frequencyRange: any;
  LogfrequencyRange: any;
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
  reportFHR: any = '';
  reportTHR: any = '';
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

  checkNumericsTHr(event) {

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

  isTimes: boolean = false;
  checkDateRange(event: any) {
    this.selectedRange = event.dtId;

    if (event.dtId == "custom") {
      this.isDates = true;
      this.isTimes = true;
    }
    else {
      this.isDates = false;
      this.isTimes = false;
      this.reportFHR = "";
      this.reportTHR = "";
      this.AlertsDetailsObj.fromDate = "";
    }
  }

  loadDefaultAlerts() {

    var obj: any

    obj = {}
    obj.SensorId = []

    // this.SensorList.forEach(element => {
    //   obj.SensorId.push(element.key)
    // });

    obj.status = []

    obj.page = "Top"

    this.statusList.forEach(element => {
      obj.status.push(element.status)
    });

    this.period = "Latest 50 Alert Details"
    obj.reportType = "";

    this.loadAlerts(obj);
  }

  loadAlerts(obj: any) {



    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');

    this.loaderService.display(true);
    this._detailService.GetAlertDetails(obj).subscribe(result => {

      this.ResponseList = result;

      this.loaderService.display(false);
      this.dataset = [];
      this.Exportdataset = [];
      this.ExportPDFdata = [];
      debugger
      if (obj.page != "Top") {

        this.excelShowHide = true;

      }

      if (obj.reportType == "Alerts" || obj.reportType == "CAPA") {
        window.open(this.ResponseList.msg, '_blank');
        // window.location.href = this.ResponseList.msg;
      }
      else {


        //this.respTempLiveData.filter(gr => gr.regionId == this.selectedRegion);
        var selecttopStatus = this.selectopStatus ? this.selectopStatus : ""
        if (selecttopStatus) {
          this.ResponseList = this.ResponseList.filter(gr => gr.OperationalStatus == selecttopStatus);
        }


        if (this.ResponseList.length > 0) {

          //  this.dataset = this.ResponseList
          this.ExportPDFdata.push(
            [{ text: 'Device Name', style: 'tableHeader' },
            { text: 'Sensor', style: 'tableHeader' },
            { text: 'Alert', style: 'tableHeader' },
            { text: 'Alert Time', style: 'tableHeader' }]
          )


          var DisplayIcon = "";
          var OperationalStatus = "";



          this.ResponseList.forEach(element => {

            if (element.CAPA == "") {
              DisplayIcon = ' <i class="fa fa-file-text-o" style="padding-left:30px;font-size:18px;cursor:pointer" title="Add CAPA" ></i>'
            }
            else {
              DisplayIcon = ' <i class="fa fa-file-text-o" style="padding-left:30px;font-size:18px;font-weight: bold;cursor:pointer;color:#1a4c9c;" title="Update CAPA" ></i>'
            }

            var oprStatus = []
            var _oprStatus = ""

            if (element.OperationalStatus !== null && element.OperationalStatus !== ''
              && element.OperationalStatus !== undefined) {

              oprStatus = this.operationalStatus.filter(r => r.id == element.OperationalStatus)
              _oprStatus = oprStatus[0].name;
            }

            debugger

            this.dataset.push([
              element.region,
              element.DeviceName,
              element.Sensor,
              element.AlertStatus,
              element.Alert,
              element.AlertTime,
              element.AlertValue,
              element.Duration,
              DisplayIcon,
              _oprStatus,
              element.alertSlno,
              element.deviceId,
              element.OperationalStatus,
              element.region,
              element.AlertEndTime,
              element.CAPA
            ])

            OperationalStatus = ""
            this.Exportdataset.push([
              element.DeviceName,
              element.Sensor,
              element.AlertStatus + " : " + element.Alert,
              element.AlertTime
            ])


            this.ExportPDFdata.push([
              element.DeviceName,
              element.Sensor,
              element.AlertStatus + " : " + element.Alert,
              element.AlertTime
            ])

          });


          this.bindDataToTable(this.dataset);


          this.isShowFooter = true;
        }
        else {

          this.bindDataToTable(this.dataset);

          this.excelShowHide = false;
          this.isShowFooter = false;
        }
      }
    });
  }
  downloadchat: any = "";
  downloadCause() {
    debugger
    if (this.alertCauses.length == 0) {
      this.toastr.warning(this.translate.instant('No Data to Download'));
      return
    }
    else {
      this.loaderService.display(true);
      this._detailService.GetAlertCause(this.causeAlertSlno, true).subscribe(result => {
        this.loaderService.display(false);
        this.downloadchat = result;
        var tabI: number = 0;
        if (this.downloadchat) {
          window.open(this.downloadchat, tabI + '');
        }
      });
    }

  }
  alertCause: any = "";
  uploadAttchment: any = "";
  rootcause: any = "";
  correctiveaction: any = "";
  preventionaction: any = "";
  targetDate: any = "";
  formatNumber(number) {
    return number === "" ? "00" : number.length === 1 ? "0" + number : number;
  }
  updateCause(uploadAttchment: any) {
    debugger
    var obj: any = {}
    if (this.alertCause.trim() != "" && this.selectopStatusCause != undefined) {

      obj.causeId = this.causeAlertSlno
      obj.comment = this.alertCause
      obj.operationalStatus = this.selectopStatusCause ? this.selectopStatusCause : "";
      obj.rootCause = this.rootcause
      obj.correctiveAction = this.correctiveaction
      obj.preventionAction = this.preventionaction
      var date1 = this._detailService.dateToDDMMYY(this.targetDate);
      var hour = this.formatNumber(this.reportHR);
      var Min = this.formatNumber(this.reportMM);
      // var targetDateTime = date1 + " " + hour + ":"  + Min  
      // if(targetDateTime.includes("NaN")){
      //   targetDateTime = "";
      // }
      if (date1.includes("NaN")) {
        date1 = "";
      }
      obj.TargetCompletionDate = date1
      // obj.comment.replaceAll("\r\n", "\n").replaceAll("\r", "\n")
      // obj.comment.replaceAll("\n", "")
      obj.loginId = this._commanService.LOGINUSERID


      var resp: any = {}
      this._detailService.updateCause(obj, uploadAttchment).subscribe(result => {

        resp = result;

        //this.alertCauses = [];
        this.causeResetMetrics();
        this.removeLogo();
        this.alertCause = "";
        if (resp.causeId !== '' && resp.causeId !== null) {
          this._detailService.GetAlertCause(resp.causeId, false).subscribe(result => {

            this.alertCauses = result;



            this.alertCauses.forEach(aC => {

              if (aC.operationalStatus !== '' && aC.operationalStatus !== null
                && aC.operationalStatus !== undefined) {
                var oprStatus = this.operationalStatus.filter(r => r.id == aC.operationalStatus)
                aC.operationalStatus = oprStatus[0].name;
                //id
              }
            });

          })
        }

      });
      //this.selectopStatusCause = null;

      if (this.reportTypeStatus == "Filter") {
        this.GetAlertsDetails('Filter');
      }
      else {
        this.loadDefaultAlerts();
      }
    }
    else {
      if (this.alertCause.trim() == "") {
        this.toastr.warning(this.translate.instant('Please Enter Comment!!'));
      }
      else if (this.selectopStatusCause == undefined) {
        this.toastr.warning(this.translate.instant('Please Select Operational Status'));
      }
    }
    //this.loadAlerts(obj);
  }


  NotbasedOnLogoValidate: boolean = false;
  logoCon: boolean = false;
  logoPath: any = "";
  logoFileName: any = "";
  basedOnLogoFileValidate: boolean = false;


  imageUpload(event) {



    this.basedOnLogoFileValidate = true;
    this.NotbasedOnLogoValidate = false;
    var totalSize = 0;
    this.logoFileName = "";




    if (event.target.files && event.target.files[0]) {

      for (let i = 0; i < event.srcElement.files.length; i++) {
        totalSize += event.srcElement.files[i].size;
      }

      for (let i = 0; i < event.srcElement.files.length; i++) {
        var Extension = event.srcElement.files[i].type;

        this.logoFileName = event.srcElement.files[i].name;

        if (Extension == "image/png" || Extension == "image/jpeg" || Extension == "image/jpg") {

          if (totalSize <= 50000) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
              $("#DisplayLogoImage").attr('src', (<FileReader>event.target).result);
            };
          }
          else {
            this.toastr.warning(this.translate.instant('UploadLogoSizeShouldBeLessThanOrEqualTo50Kb'));
            this.basedOnLogoFileValidate = false;
            this.NotbasedOnLogoValidate = true;
            event.srcElement.value = "";
            return false;
          }
        }
        else {
          // this.toastr.warning("Only allows file types of JPG,PNG,JPEG");
          this.toastr.warning(this.translate.instant("ValidFileupload"));
          event.srcElement.value = "";
          this.basedOnLogoFileValidate = false;
          this.NotbasedOnLogoValidate = true;
          return false;
        }
      }
    }
    else {
      this.basedOnLogoFileValidate = false;
      this.NotbasedOnLogoValidate = true;
    }
  }


  bindDataToTable(dataset: any) {

    $('#alertRpTable').dataTable().fnDestroy();
    var table = $('#alertRpTable').DataTable({
      paging: dataset.length > 0 ? true : false,
      info: dataset.length > 0 ? true : false,
    });

    table.clear().rows.add(dataset).draw();

    var that = this;

    $('#alertRpTable tbody').on('click', 'td', function () {

      var Index = this.cellIndex
      that.causeReset();

      if (Index == 8) {
        var data = $(this).parent();
        var table = $('#alertRpTable').DataTable();
        data = table.row(data).data();

        that.causedDevice = data[1];// + " (" + data[1] + ")";

        that.causedSensor = data[2];
        that.causedAlert = data[3];
        that.causedAlertReason = data[4];
        that.causedAlertTime = data[5];
        that.causedAlertToTime = data[14];
        that.causedAlertDuration = data[7];
        that.causeAlertSlno = data[10]
        that.causedLocation = data[13];
        if (data[12] !== '' && data[12] !== null && data[12] !== undefined) {
          that.selectopStatusCause = data[11];
        }

        // that.operationalStatus.forEach(opstat => {
        //   if (opstat.name == data[7]) {
        //     that.selectopStatusCause = opstat.id
        //   }
        // });

        that.alertCauses = [];

        that._detailService.GetAlertCause(that.causeAlertSlno, false).subscribe(result => {
          debugger
          that.alertCauses = result;

          that.alertCauses.forEach(aC => {


            if (aC.operationalStatus !== '' && aC.operationalStatus !== null) {
              // opStat.id = ops.operational_Id;
              // opStat.name = ops.operational_status;

              var oprSts = that.operationalStatus.filter(r => r.id == aC.operationalStatus);

              aC.operationalStatus = oprSts[0].name;
            }
          });

        })

        that.modalAlertCause.show();
      }
    });

  }

  alertCauses: any = []

  causedDevice: any = "";
  causedLocation: any = "";
  causedSensor: any = "";
  causedAlert: any = "";
  causedAlertReason: any = "";
  causedAlertTime: any = "";
  causedAlertToTime: any = "";
  causedAlertDuration: any = "";
  causeAlertSlno: any = "";

  imgPath: any = "";

  causeReset() {
    this.causedDevice = "";
    this.causedLocation = "";
    this.causedSensor = "";
    this.causedAlert = "";
    this.causedAlertReason = "";
    this.causedAlertTime = "";
    this.causedAlertToTime = "";
    this.causedAlertDuration = "";
    this.reportHR = "";
    this.reportMM = "";
    this.correctiveaction = "";
    this.preventionaction = "";
    this.targetDate = "";
    this.alertCause = "";
    this.rootcause = "";
  }
  causeResetMetrics() {
    this.reportHR = "";
    this.reportMM = "";
    this.correctiveaction = "";
    this.preventionaction = "";
    this.targetDate = "";
    this.alertCause = "";
    this.rootcause = "";
  }


  removeLogo() {
    //

    if (this.AttachamentFile.nativeElement.value != "") {
      this.AttachamentFile.nativeElement.value = ""
    }
    this.logoCon = false;
    this.basedOnLogoFileValidate = false;
    this.NotbasedOnLogoValidate = true;
  }


  devClear() {


    this.isNotAllDevSelected = true;
    this.isAllDevSelected = false;
  }

  snsrClear() {


    this.isNotAllsnsrSelected = true;
    this.isAllsnsrSelected = false;
  }
  onSelectAll(isForm: boolean, AlertsDetailsObj) {


    this.disabeleRegSelectAll = true;
    this.disableRegUnSelectAll = false;
    this.deviceSelectedList = this.DeviceList.map(x => x.sensorId);


  }

  onsnsrSelectAll(isForm: boolean, AlertsDetailsObj) {


    this.disabeleSnsrSelectAll = true;
    this.disableSnsrRegUnSelectAll = false;
    this.sensorSelectedList = this.SensorList.map(x => x.key);


  }
  reportTypeStatus: any;
  GetAlertsDetails(reportType: any) {
    var valid: boolean = false;

    var obj: any

    obj = {}


    // if ((this.dateRange !== "" || this.dateRange !== undefined || this.dateRange !== null)) {
    //   reportType = "Filter";
    // }


    if (reportType == 'Filter' || reportType == 'Alerts' || reportType == 'CAPA') {
      // if((this.selectHW == '' || this.selectHW == undefined) &&
      // (this.deviceSelectedList == undefined || this.deviceSelectedList.length == 0) &&
      // (this.statusSelectedList == undefined || this.statusSelectedList.length == 0) &&
      // (this.sensorSelectedList == undefined || this.sensorSelectedList.length == 0)
      // &&(this.dateRange != "" || this.dateRange != undefined || this.dateRange != null)){

      //  this.getDevices();
      //   this.deviceSelectedList = this.tempDevicelist.map(x => x.sensorId);
      //   this.sensorSelectedList = this.tempSensorList.map(x => x.key);
      //   this.statusSelectedList=this.statusList
      // }
      valid = true;
      // if (this.selectHW == '' || this.selectHW == undefined) {
      //   this.toastr.warning('Please Select Model');
      //   valid = false;
      // }
      // else {

      this.getDevices("");
      debugger
      if (this.deviceSelectedList == undefined || this.deviceSelectedList.length == 0) {
        this.deviceSelectedList = this.DeviceList.map(x => x.sensorId);
        this.sensorSelectedList = this.SensorList.map(x => x.key);
      }
      if (this.sensorSelectedList == undefined || this.sensorSelectedList.length == 0) {
        this.sensorSelectedList = this.SensorList.map(x => x.key);
      }
      if (this.statusSelectedList == "" || this.statusSelectedList == undefined || this.statusSelectedList == null) {
        this.statusSelectedList = this.statusList.map(x => x.status);
      }

      if (this.dateRange == "" || this.dateRange == undefined || this.dateRange == null) {
        this.dateRange = "24";
        this.selectedRange = "24";
      }
      else
        if (this.dateRange == "custom") {
          if (this.AlertsDetailsObj.fromDate == ''
            || this.AlertsDetailsObj.fromDate == undefined || this.AlertsDetailsObj.fromDate == null) {
            this.toastr.warning('Please Select Date Range');
            valid = false;
          }
          else {
            var _frDate = this._detailService.dateToYYYYMMDDHHMM(this.AlertsDetailsObj.fromDate[0]);
            var _toDate = this._detailService.todateYYYYMMDDHHMM(this.AlertsDetailsObj.fromDate[1]);

            var _days: any

            _days = this._detailService.DateDifference(this.AlertsDetailsObj.fromDate[0], this.AlertsDetailsObj.fromDate[1]);


            if (this.reportFHR == '' || this.reportFHR == undefined) {
              valid = false;
              this.toastr.warning('Please provide valid Time Range');
            }
            else
              if (this.reportTHR == '' || this.reportTHR == undefined) {
                valid = false;
                this.toastr.warning('Please provide valid Time Range');
              }
              else if (Number(_days) == 0 && ((Number(this.reportFHR) > Number(this.reportTHR)) || (Number(this.reportFHR) == Number(this.reportTHR)))) {
                valid = false;
                this.toastr.warning('Please provide valid Time Range that From Time must be less than To Time');
              }

              else if (Number(_days) > 90) {
                valid = false;
                this.toastr.warning('Report for more than 90 days is not allowed, please contact support');
              }
              else {
                valid = true;
              }
          }
        }
        else {
          debugger
          this.dateRange
        }
      //}


      // else
      //   if (this.deviceSelectedList == undefined || this.deviceSelectedList.length == 0) {
      //     this.toastr.warning('Please Select Device');
      //     valid = false;
      //   }
      //   else
      //     if (this.sensorSelectedList == undefined || this.sensorSelectedList.length == 0) {
      //       this.toastr.warning('Please Select Sensor');
      //       valid = false;
      //     }
      //     else
      //       if (this.statusSelectedList == undefined || this.statusSelectedList.length == 0) {
      //         this.toastr.warning('Please Select Status');
      //         valid = false;
      //       } else
      //         if (this.dateRange == "" || this.dateRange == undefined || this.dateRange == null) {
      //           this.toastr.warning('Please Select Period');
      //           valid = false;
      //         }
      //         else
      //           if (this.dateRange == "custom" && (this.AlertsDetailsObj.fromDate == ''
      //             || this.AlertsDetailsObj.fromDate == undefined || this.AlertsDetailsObj.fromDate == null)) {
      //             this.toastr.warning('Please Select Date Range');
      //             valid = false;
      //           }
      // else {
      //   valid = true;
      // }
      this.reportTypeStatus = reportType;

      this.TableType = "History Alerts";
    }
    else
      if (this.selectHW == '' || this.selectHW == undefined) {
        valid = true;

        obj.page = "Top"

        this.TableType = "Live Alerts";
      }


    if (obj.page !== "Top") {

      obj.DeviceId = this.deviceSelectedList
      obj.SensorId = this.sensorSelectedList
      obj.status = this.statusSelectedList

      if (obj.SensorId == undefined || obj.SensorId.length == 0) {

        obj.SensorId = []

        this.SensorList.forEach(element => {
          obj.SensorId.push(element.key)
        });
      }

      if (obj.status == undefined || obj.status.length == 0) {
        obj.status = []

        this.statusList.forEach(element => {
          obj.status.push(element.status)
        });
      }


      debugger
      if (valid) {
        if (this.dateRange == "custom") {
          debugger
          obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.AlertsDetailsObj.fromDate[0]);
          obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.AlertsDetailsObj.fromDate[1]);
          if (this.reportTHR == "23" || this.reportTHR == "00" || this.reportTHR == null || this.reportTHR == '' || this.reportTHR == undefined) {
            obj.frDate = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00';
            obj.toDate = obj.toDate.split(' ')[0] + ' 23:59';
            this.period = obj.frDate + ' To ' + obj.toDate
            //this.period = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00' + ' To ' + obj.toDate.split(' ')[0] + ' 23:59'// + this.reportTHR;
            valid = true;
          }
          else {
            obj.frDate = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00';
            obj.toDate = obj.toDate.split(' ')[0] + ' ' + this.reportTHR + ':00';
            this.period = obj.frDate + ' To ' + obj.toDate
            //this.period = obj.frDate.split(' ')[0] + ' ' + this.reportFHR + ':00' + ' To ' + obj.toDate.split(' ')[0] + ' ' + this.reportTHR + ':00'// + this.reportTHR;
            valid = true;
          }

          //this.period = obj.frDate + ' To ' + obj.tDate
        }
        else {
          obj.frDate = this.dateRange;

          var hr = ""// obj.frDate;

          if (obj.frDate == "72") {
            hr = "Last 3 Days";
          }
          else
            if (obj.frDate == "168") {
              hr = "Last 1 Week";
            }
            else
              if (obj.frDate == "360") {
                hr = "Last 15 Days";
              }
              else
                if (obj.frDate == "720") {
                  hr = "Last 30 Days";
                }

          this.period = "For " + hr;//+ " Hrs"
          valid = true;
        }
      }



      obj.page = "All"

      //valid = true;
    }

    obj.reportType = reportType;
    obj.opStatus = this.selectopStatus;
    debugger
    if (valid) {
      this.loadAlerts(obj);
    }

    //this.loadAlerts(obj);
  }

  ResetData(AlertsDetailsObj: any) {
    debugger
    if (this.reqReport) {
      this.reqReport.unsubscribe();
    }
    this.disabeleRegSelectAll = true;
    this.disableRegUnSelectAll = true;
    this.selectopStatus = null;
    this.disabeleSnsrSelectAll = true;
    this.disableSnsrRegUnSelectAll = true;
    this.reportTypeStatus = "";

    this.loaderService.display(true);
    this.isGo = false;
    this.excelShowHide = false;
    this.isShowFooter = false;
    this.dataset = [];
    this.deviceSelectedList = null;
    this.sensorSelectedList = null;
    this.statusSelectedList = null;
    this.selectHW = null;
    this.dateRange = [];
    this.isDates = false;
    this.reportFHR = "";
    this.reportTHR = "";
    this.isTimes = false;


    $('#alertRpTable').dataTable().fnDestroy();

    AlertsDetailsObj.vehicleSelect = [];
    var currentDate = new Date();

    this.AlertsDetailsObj.fromDate = ""
    //this.AlertsDetailsObj.fromDate = new Date(new Date().setHours(0, 0, 0, 0));
    this.AlertsDetailsObj.toDate = ""// currentDate;
    this.maxDate = currentDate;

    this.DeviceList = [];
    this.deviceSelectedList = [];

    this.SensorList = [];
    this.sensorSelectedList = [];

    this.SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));


    this.loadDefaultAlerts();
    this.TableType = "Live Alerts";
    this.loaderService.display(false);
    this.selectedRegion = [];
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  exportPDF(obj: any) {

    this.GetAlertsDetails(obj);

  }
  // exportPDF() {


  //   var docDefinition = {
  //     content: [
  //       {
  //         text: 'Alert Details',
  //         style: 'header'
  //       }, {
  //         text: 'Period : ' + this.period,
  //         style: 'header2'
  //       }, {
  //         table: {
  //           // headers are automatically repeated if the table spans over multiple pages
  //           // you can declare how many rows should be treated as headers
  //           headerRows: 1,
  //           widths: ['*', 'auto', 'auto', '*'],
  //           body: this.ExportPDFdata
  //         }
  //       }
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 20, 0, 10]
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 14
  //       },
  //       header2: {
  //         fontSize: 10
  //       }
  //     }
  //   }

  //   pdfMake.createPdf(docDefinition).open();

  // }

  exportExcel() {


    var fileName = this.translate.instant('AlertDetails');
    var headerText = [this.translate.instant('AlertDetails')];
    var columnKeys = [
      { key: 'DeviceName', width: 20 },
      { key: 'Sensor', width: 30 },
      { key: 'Alert', width: 50 },
      { key: 'AlertTime', width: 40 }
    ];
    var columnHeaders = ["Device Name", "Sensor", "Alert", "Alert Time"]
    this._exportExcel.exportExcelFile(fileName, headerText, columnKeys, columnHeaders, this.Exportdataset, '', '')
  }

  openSettings() {
    this.modelAlertSet.show();
    this.loadAlertSettings();
  }

  onDeSelectAll() {
    this.disabeleRegSelectAll = false;
    this.disableRegUnSelectAll = true;
    this.deviceSelectedList = [];
    this.dataset = [];
    this.excelShowHide = false;
    this.isShowFooter = false;
  }

  onsnsrDeSelectAll() {
    this.disabeleSnsrSelectAll = false;
    this.disableSnsrRegUnSelectAll = true;
    this.sensorSelectedList = [];
    this.dataset = [];
    this.excelShowHide = false;
    this.isShowFooter = false;
  }

  atData = new assetData();

  reqReport: any;



  ngOnDestroy() {
    if (this.reqReport) {
      this.reqReport.unsubscribe();
    }
  }

  loadAlertSettings() {
    this._detailService.AlertDetails().subscribe(data => {
      this.responseData = data;


      if (this.responseData.length > 0) {

        var alertData;
        var smsIcon = "";
        var emailIcon = "";
        var notifIcon = "";

        alertData = [];

        var smsCheckCnt: number = 0;
        var emailCheckCnt: number = 0;
        var notifCheckCnt: number = 0;


        this.responseData.forEach(element => {

          if (element.sms == "1") {
            smsIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
            smsCheckCnt += 1;
          }
          else {
            smsIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';
          }

          if (element.email == "1") {
            emailIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
            emailCheckCnt += 1;
          }
          else {
            emailIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';
          }

          if (element.notif == "1") {
            notifIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
            notifCheckCnt += 1;
          }
          else {
            notifIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';
          }


          alertData.push([element.deviceName,
            smsIcon,
            emailIcon,
            notifIcon,
          element.deviceId,
          element.sms,
          element.email,
          element.notif]);
        });



        if (smsCheckCnt == alertData.length) {
          this.smsCheck = true;
        }
        else {
          this.smsCheck = false;
        }

        if (emailCheckCnt == alertData.length) {
          this.emailCheck = true;
        }
        else {
          this.emailCheck = false;
        }

        if (notifCheckCnt == alertData.length) {
          this.notifCheck = true;
        }
        else {
          this.notifCheck = false;
        }

        this.bindAlertData(alertData);
      }
    });
  }

  bindAlertData(data: any) {
    $('#alertData').dataTable().fnDestroy();
    var table = $('#alertData').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
    });
    table.clear().rows.add(data).draw();

    var that = this;

    $('#alertData tbody').on('click', 'td', function () {


      var Index = this.cellIndex

      if (Index == "1" ||
        Index == "2" ||
        Index == "3") {
        var data = $(this).parent();
        var table = $('#alertData').DataTable();
        data = table.row(data).data();

        var obj;

        var sms: string = "";
        var email: string = "";
        var notif: string = "";

        var yesIcon: any
        var noIcon: any

        yesIcon = "";
        yesIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';

        noIcon = "";
        noIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';

        obj = {};

        obj.deviceId = data[4]





        if (Index == "1") {
          sms = "1"
          if (data[5] == "1") {
            obj.sms = "0";
          }
          else {
            obj.sms = "1";
          }

          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Alerts",
            "actionPerformed": "SMS trigger has been " + (obj.sms == "1" ? "enabled" : "disabled") + " for " + obj.deviceId
          }

          that._commanService.logUpdate(logReq);



          logReq["deviceId"] = obj.deviceId;
          that._commanService.device_logUpdate(logReq);
        }
        else {
          obj.sms = data[5];
          sms = "0"
        }

        if (Index == "2") {
          email = "1"
          if (data[6] == "1") {
            obj.email = "0";
          }
          else {
            obj.email = "1";
          }

          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Alerts",
            "actionPerformed": "Email trigger has been " + (obj.email == "1" ? "enabled" : "disabled") + " for " + obj.deviceId
          }

          that._commanService.logUpdate(logReq);



          logReq["deviceId"] = obj.deviceId;
          that._commanService.device_logUpdate(logReq);
        }
        else {
          obj.email = data[6];
          email = "0"
        }

        if (Index == "3") {
          notif = "1"
          if (data[7] == "1") {
            obj.notif = "0";
          }
          else {
            obj.notif = "1";
          }

          let logReq = {
            "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
            "module": "Alerts",
            "actionPerformed": "Mobile Notification trigger has been " + (obj.notif == "1" ? "enabled" : "disabled") + " for " + obj.deviceId
          }

          that._commanService.logUpdate(logReq);



          logReq["deviceId"] = obj.deviceId;
          that._commanService.device_logUpdate(logReq);
        }
        else {
          notif = "0"
          obj.notif = data[7];
        }

        that.updateAlert(obj)


        that.alertRespData.forEach(element => {
          if (element.deviceId == data[4]) {
            if (sms == "1") {
              if (data[5] == "1") {
                element.smsIcon = noIcon;
                element.sms = "0";
              }
              else {
                element.smsIcon = yesIcon;
                element.sms = "1";
              }
            }
            else
              if (email == "1") {
                if (data[6] == "1") {
                  element.emailIcon = noIcon;
                  element.email = "0";
                }
                else {
                  element.emailIcon = yesIcon;
                  element.email = "1";
                }
              }
              else
                if (notif == "1") {
                  if (data[7] == "1") {
                    element.notifIcon = noIcon;
                    element.notif = "0";
                  }
                  else {
                    element.notifIcon = yesIcon;
                    element.notif = "1";
                  }
                }
          }
        });

      }

    });
  }

  checkSMS() {


    var obj;

    obj = {};


    if (this.smsCheck) {
      this.smsCheck = false;
      obj.sms = "0";
    }
    else {
      this.smsCheck = true;
      obj.sms = "1";
    }

    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "Alerts",
      "actionPerformed": "SMS trigger has been " + (obj.sms == "1" ? "enabled" : "disabled") + " for all devices"
    }

    this._commanService.logUpdate(logReq);

    this.loaderService.display(true)
    this.updateAlert(obj);
  }

  checkEmail() {

    var obj;

    obj = {};

    if (this.emailCheck) {
      this.emailCheck = false;
      obj.email = "0";
    }
    else {
      this.emailCheck = true;
      obj.email = "1";
    }

    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "Alerts",
      "actionPerformed": "Email trigger has been " + (obj.email == "1" ? "enabled" : "disabled") + " for all devices "
    }

    this._commanService.logUpdate(logReq);

    this.loaderService.display(true)
    this.updateAlert(obj);
  }

  checkNotif() {

    var obj;

    obj = {};

    if (this.notifCheck) {
      this.notifCheck = false;
      obj.notif = "0";
    }
    else {
      this.notifCheck = true;
      obj.notif = "1";
    }

    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "Alerts",
      "actionPerformed": "Mobile Notification trigger has been " + (obj.notif == "1" ? "enabled" : "disabled") + " for all devices "
    }

    this._commanService.logUpdate(logReq);

    this.loaderService.display(true)
    this.updateAlert(obj);
  }

  updateAlert(obj) {


    this._detailService.updateAlert(obj).subscribe(data => {

      this.loaderService.display(false)
      this.responseData = data;

      if (this.responseData.sts = "200") {
        this.loadAlertSettings();
      }
    });

  }

}

export class AlertsDetails // ReportsModal
{
  public imei: any;
  public assetNo: string;
  public deviceNo: any;
  public ddDevice: any;
  public fromDate: any;
  public toDate: any;
  public dtTo: Date;
  public dtFrom: Date;
  deviceSelect: any;
}

export class assetData {

  public imei: any;
  public timeZone: string;

}

