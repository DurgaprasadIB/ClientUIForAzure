import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceDataService } from '../../GlobalServices/devicedata.service';
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ReportService } from '../../reports/service/report.service';
import { result } from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-client',
  templateUrl: './sub-client.component.html',
  styleUrls: ['./sub-client.component.css']
})
export class SubClientComponent implements OnInit {


  @ViewChild('modalSubscription') modalSubscription: any;
  @ViewChild('modalOEMdates') modalOEMdates: any;


  constructor(
    private _devicedataservice: DeviceDataService,
    private _detailService: ReportService,
    private toastr: ToastrService,
    private comman: IdeaBService,
    private _loaderService: LoaderService,
  ) { }


  isSuperAdmin: boolean = false

  ngOnInit() {
    this.getOnBoardedDevices();

    this.minDate = new Date();


    if (sessionStorage.getItem("User_SuperAdmin").toLowerCase() == "superadmin") {
      this.isSuperAdmin = true;
    }
    else {
      this.isSuperAdmin = false;
    }
  }

  C_SoftwareExpDate: any = "";
  C_HardwareExpDate: any = "";

  onBoardedDevice: any = [];
  deviceSubscriptionList: any = [];


  minDate: any = Date;

  getOnBoardedDevices() {

    var obj: any = [];

    obj.loginId = this.comman.getLoginUserID();

    this._loaderService.display(true);

    this.deviceSubscriptionList = [];

    this._devicedataservice.deviceWithsubClient(obj).subscribe(result => {

      this._loaderService.display(false);

      this.onBoardedDevice = result;

      if (this.onBoardedDevice.length > 0) {
        var data = [];

        var reportingIcon = "";
        var editIcon = "";
        var expired: boolean = false

        this.onBoardedDevice.forEach(element => {


          //isReporting
          if (element.expired == 1) {
            reportingIcon = '<i class="fa fa-clock-o" style="padding-left:0px;font-size:18px;cursor:pointer;color:#da555e;" title="Subscription Expired" ></i>'
            expired = true;
          }
          else {
            reportingIcon = '<i class="fa fa-clock-o" style="padding-left:0px;font-size:18px;cursor:pointer;color:#21bf76;" title="" ></i>'
            expired = false;
          }

          editIcon = '<i class="fa fa-pencil-square-o" style="padding-left:0px;font-size:18px;cursor:pointer;" title="update" ></i>'


          // this.deviceSubscriptionList.push([
          //   element.SubClient,
          //   reportingIcon + ' ' + element.DeviceId,
          //   element.DeviceName,
          //   element.financeMailId,
          //   element.financeContactNo,
          //   element.HardwareExpiry,
          //   element.SoftwareExpiry,
          //   element.C_HwExpDate,
          //   element.C_SoftwareExpiry,
          //   editIcon
          // ]
          // )

          this.deviceSubscriptionList.push({
            SubClient: element.SubClient,
            DeviceId: element.DeviceId,
            DeviceName: element.DeviceName,
            financeMailId: element.financeMailId,
            financeContactNo: element.financeContactNo,
            HardwareExpiry: element.HardwareExpiry,
            SoftwareExpiry: element.SoftwareExpiry,
            C_HwExpDate: element.C_HwExpDate,
            C_SoftwareExpiry: element.C_SoftwareExpiry,
            icon: editIcon,
            deviceActiveIcon: expired,
            C_HwExpDateShow: element.C_HwExpDateShow,
            C_SoftwareExpiryShow: element.C_SoftwareExpiryShow
          }
          )


        });


        this.bindDatatoTable(data);
      }
      else {
        this.bindDatatoTable([]);
      }
    })
  }

  bindDatatoTable(data: any) {

    // $('#tblDevices').dataTable().fnDestroy();
    // var table = $('#tblDevices').DataTable({
    //   paging: data.length > 0 ? true : false,
    //   info: data.length > 0 ? true : false,
    //   aaSorting: []

    // });
    // table.clear().rows.add(data).draw();

    setTimeout(() => {
      $('#tblDevices').DataTable({
        paging: true,
        info: true,
        "ordering": true,
        columnDefs: [
          {
            orderable: false, targets: "no-sort"
          }
        ]
        //  sort:false,
        //  aoColumns:  [  { "sType": "string-case" },{},{},{},{},{},{} ],
      });
      jQuery('.dataTable').wrap('<div style="overflow-y:auto;" />');
    });
    // table.clear().rows.add(data).draw();

  }

  CustomerDeviceDetails: any = {}

  updateSubcription(obj: any) {
    debugger

    this.CustomerDeviceDetails = obj;
    if (this.CustomerDeviceDetails.C_SoftwareExpiryShow !== '' && this.CustomerDeviceDetails.C_SoftwareExpiryShow !== null) {
      this.C_SoftwareExpDate = new Date(this.CustomerDeviceDetails.C_SoftwareExpiryShow);
      this.C_HardwareExpDate = new Date(this.CustomerDeviceDetails.C_HwExpDateShow);
    }
    else {
      this.C_SoftwareExpDate = "";
      this.C_HardwareExpDate = "";
    }


    this.modalOEMdates.show();
  }

  saveExpireDates(deviceDates: any) {



    this.C_HardwareExpDate = this._detailService.todateYYYYMMDD(this.C_HardwareExpDate);
    this.C_SoftwareExpDate = this._detailService.todateYYYYMMDD(this.C_SoftwareExpDate);

    var obj: any = {}

    obj.deviceId = deviceDates.DeviceId;
    obj.hardwareExp = this.C_HardwareExpDate;
    obj.softwareExp = this.C_SoftwareExpDate;

    var resp: any = {}
    this._devicedataservice.updateCustomerSHexpDates(obj).subscribe(result => {
      resp = result;

      if (resp.sts == "200") {

        this.toastr.success('Updated Successfully');

        this.modalOEMdates.hide();

        this.deviceSubscriptionList.forEach(dev => {
          if (dev.DeviceId == deviceDates.DeviceId) {

            dev.C_HwExpDate = this.C_HardwareExpDate;
            dev.C_SoftwareExpiry = this.C_SoftwareExpDate;

          }
        });
      }
      else {

        this.toastr.warning('Request Failed');

      }

    })
  }

  reset() {
    this.C_HardwareExpDate = "";
    this.C_SoftwareExpDate = "";
  }
}
