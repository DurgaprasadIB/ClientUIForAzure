import { Component, OnInit } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../service/report.service';
declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { LoaderService } from 'src/app/services/loader.service';
import { AssignService } from '../../master/assign/service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  ResponseList: any = [];
  logObJ: any = new logDetails();
  DeviceList: any;
  UserList: any;
  maxDate: any = Date;
  dataset: any = [];
  dateRange: any;
  DateRangeList: any = [];
  selectedRange: any = "";
  isDates: boolean = false;
  DateFormat: string;
  cldDateFormat: any;
  period: any = "";
  deviceSelectedList: any;
  selectedUser: any;
  disabeleRegSelectAll = false;
  disableRegUnSelectAll = true;
  logTypeList: any;
  logType: any;

  constructor(private _detailService: ReportService,
    private _commanService: IdeaBService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _serviceassignTracker: AssignService
  ) { }

  ngOnInit() {

    sessionStorage.setItem('liveScreen', "log");
    this.loaderService.display(true);
    this.DateFormat = "(" + this._commanService.getDateFormat() + ")";
    this.cldDateFormat = "dd-MM-yyyy";
    var currentDate = new Date();
    this.logObJ.fromDate = ""// new Date(new Date().setHours(0, 0, 0, 0));
    this.logObJ.toDate = ""//currentDate;
    this.maxDate = currentDate;
    this.isDates = false;
    this.logTypeList = [{ 'id': 0, 'name': 'User' }, { 'id': 1, 'name': 'Device' }];

    this.disabeleRegSelectAll = true;
    this.disableRegUnSelectAll = true;

    this.DateRangeList = [{ dtId: "24", dtName: "Last 24 Hrs" },
    { dtId: "72", dtName: "Last 3 Days" },
    { dtId: "168", dtName: "Last 1 Week" },
    { dtId: "720", dtName: "Last 30 Days" },
    { dtId: "custom", dtName: "Custom Dates" }];

    this.loaderService.display(false);
    this.getUsers();
    this.getDevices();
  }

  getUsers() {
    this.selectedUser = undefined;
    this._serviceassignTracker.getUserDetails().subscribe(data => {
      this.UserList = data.userData;
    });
  }

  getDevices() {
    this.deviceSelectedList = [];
    this.DeviceList = {}
    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    if (this.DeviceList.length > 0) {
      this.disabeleRegSelectAll = false;
      this.disableRegUnSelectAll = true;
    }
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

  getUserLogDetails() {

    this.reqObj.timeZone = sessionStorage.getItem('USER_TIMEZONE');

    this.loaderService.display(true);
    this._detailService.GetLogDetails(this.reqObj).subscribe(result => {
      this.ResponseList = result;

      this.loaderService.display(false);


      if (this.reqObj.reportType == "pdf") {
        debugger
        window.open(this.ResponseList.msg, '_blank');
      }
      else {
        if (this.ResponseList.length > 0) {
          this.ResponseList.forEach(element => {

            this.dataset.push([element.userMailID,
            element.deviceName,
            element.module,
            element.actionPerformed,
            element.logDateTimeShow
            ]);
          });

        }
        this.bindDataToTable(this.dataset);
      }
    });
  }

  bindDataToTable(dataset: any) {
    $('#logTable').dataTable().fnDestroy();
    var table = $('#logTable').DataTable({
      "columnDefs": [
        {
          "targets": [1],
          "visible": this.logType == 0 ? false : true
        }
      ],
      paging: dataset.length > 0 ? true : false,
      info: dataset.length > 0 ? true : false,
      search: dataset.length > 0 ? true : false,
    });
    table.clear().rows.add(dataset).draw();
  }

  onSelectAll() {
    this.disabeleRegSelectAll = true;
    this.disableRegUnSelectAll = false;
    this.deviceSelectedList = this.DeviceList.map(x => x.sensorId);
  }

  onDeSelectAll() {
    this.disabeleRegSelectAll = false;
    this.disableRegUnSelectAll = true;
    this.deviceSelectedList = [];
    this.dataset = [];
  }

  logtypechanged() {
    this.deviceSelectedList = [];
    this.selectedUser = undefined;
    this.disabeleRegSelectAll = false;
    this.disableRegUnSelectAll = true;
    this.dataset = [];
    this.bindDataToTable([]);
  }
  reqObj: any = {};
  GetlogDetails() {
    this.reqObj = {};
    if (this.logType == undefined) {
      this.toastr.warning('Please Select Log Type');
      return false;
    }

    if (this.logType == 0) {
      if (this.selectedUser == undefined) {
        this.toastr.warning('Please Select User');
        return false;
      }
    }
    if (this.logType == 1) {
      if (this.deviceSelectedList == undefined || this.deviceSelectedList.length == 0) {
        this.toastr.warning('Please Select Device');
        return false;
      }
    }

    if (this.dateRange == "" || this.dateRange == undefined || this.dateRange == null) {
      this.toastr.warning('Please Select Period');
      return false;
    }

    if (this.dateRange == "custom" && (this.logObJ.fromDate == ''
      || this.logObJ.fromDate == undefined || this.logObJ.fromDate == null)) {
      this.toastr.warning('Please Select Date Range');
      return false;
    }

    this.reqObj["deviceId"] = this.deviceSelectedList;
    this.reqObj["userId"] = this.selectedUser;

    if (this.selectedRange == "custom") {
      this.reqObj["period"] = "";
      this.reqObj["fromDate"] = this._detailService.dateToYYYYMMDDHHMM(this.logObJ.fromDate[0]);
      this.reqObj["toDate"] = this._detailService.todateYYYYMMDDHHMM(this.logObJ.fromDate[1]);
    }
    else {
      this.reqObj["period"] = this.selectedRange;
    }
    this.dataset = [];
    this.reqObj["reportType"] = '';
    this.getUserLogDetails();

  }

  ResetData() {
    this.loaderService.display(true);
    this.disabeleRegSelectAll = true;
    this.disableRegUnSelectAll = true;
    this.reqObj = {};
    this.dataset = [];
    this.deviceSelectedList = null;
    this.selectedUser = undefined;
    this.logType = undefined;
    this.dateRange = undefined;
    this.isDates = false;

    this.bindDataToTable([]);
    var currentDate = new Date();
    this.logObJ.fromDate = "";
    this.logObJ.toDate = "";
    this.maxDate = currentDate;
    this.loaderService.display(false);
  }

  exportPDF() {
    this.reqObj.reportType = "pdf";
    this.getUserLogDetails();
  }
}

export class logDetails // ReportsModal
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



