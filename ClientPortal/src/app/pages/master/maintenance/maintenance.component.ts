import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { dateFilterCondition } from 'angular-slickgrid/app/modules/angular-slickgrid/filter-conditions/dateFilterCondition';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';
import { DeviceDataService } from '../../GlobalServices/devicedata.service';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ReportService } from '../../reports/service/report.service';
import { AssignService } from '../assign/service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  constructor(private comman: IdeaBService,
    private _detailService: ReportService,
    private toastr: ToastrService,
    private _loaderService: LoaderService,
    private _devicedataservice: DeviceDataService,
    public _serviceassignTracker: AssignService,) { }

  minDate: any = Date;
  statusList: any = []
  repeatList: any = []

  dateRange: any;
  DateRangeList: any = [];
  selectedRange: any = "";
  isDates: boolean = false;
  fromDate: any = ""
  maxDate: any = Date;
  deviceSelectedList: any = [];
  SelectedAssetList: any = [];

  disableAstSelectAll: boolean = false;
  disableAstUnSelectAll: boolean = false;

  hasIoTMaintenance: boolean = false;
  hasGenMaintenance: boolean = false;

  disableDevSelectAll: boolean = false;
  disableDevUnSelectAll: boolean = false;

  hasAstName: boolean = false;
  hasAstDetails: boolean = false;
  hasDeviceName: boolean = false;
  hasSensorName: boolean = false;

  hasMobileNo: boolean = false;
  hasMailid: boolean = false;

  userList: any = []
  filterUserList: any = []
  isSuperAdmin: boolean = false;

  ngOnInit() {

    let _GenMain = sessionStorage.getItem("GenMaint");
    let _IoTMain = sessionStorage.getItem("IoTMaint");
    let _Tickets = sessionStorage.getItem("Tickets");

    this.hasGenMaintenance = false;
    this.hasIoTMaintenance = false;

    if (_GenMain == '1') {
      this.hasGenMaintenance = true;
    }

    if (_IoTMain == '1') {
      this.hasIoTMaintenance = true;
    }

    this.minDate = new Date();
    this.maxDate = new Date();

    if (sessionStorage.getItem("User_SuperAdmin").toLowerCase() == "superadmin") {
      this.isSuperAdmin = true;
    }

    var devMaitain: any
    devMaitain = sessionStorage.getItem('devMaintenance');
    //devMaintenance
    if (devMaitain == '1') {
      this.isSchedule = true;
    }
    else
      if (devMaitain == '2') {
        this.isSchedule = false;
      }

    this.getDevices();
    this.getRegions();
    this.getAssets();

    this.getAccTickets();

    this.loadDateRanges();
    this.isDates = false;

    var st: any = [];

    st.push({ stid: 0, stVal: 'Open' }, { stid: 1, stVal: 'Pending' },
      { stid: 2, stVal: 'In-progress' }, { stid: 3, stVal: 'Close' })

    this.statusList = []

    this.statusList = st;


    var rp: any = [];

    rp.push({ rpid: 0, rpVal: 'None' }, { rpid: 1, rpVal: 'Every Week' },
      { rpid: 2, rpVal: 'Every Month' }, { rpid: 3, rpVal: 'Every Quarter' },
      { rpid: 4, rpVal: 'Every Six Months' }, { rpid: 5, rpVal: 'Every Year' })

    this.repeatList = []

    this.repeatList = rp;

    this._serviceassignTracker.getUserDetails().subscribe(data => {
      this.userList = data.userData;
    });



    this.showDiv('tickets')
  }

  userID: any

  @ViewChild('modaldevMain') modaldevMain: any;

  @ViewChild('modalNIdevMain') modalNIdevMain: any;

  @ViewChild('modalTKdevMain') modalTKdevMain: any;

  @ViewChild('modelTktInst') modelTktInst: any;

  @ViewChild('modelAstInst') modelAstInst: any;

  @ViewChild('modalMapFrm') modalMapFrm: any;

  @ViewChild('modalImgFrm') modalImgFrm: any;

  @ViewChild('mapDiv') gmapElement: any;


  showIoTMain: boolean = false;
  showTicket: boolean = false;
  showGenMain: boolean = false;
  isSchedule: boolean = false;

  onBoardedDevice: any = [];
  assetList: any = [];
  AccticketsList: any = [];
  deviceList: any = [];
  NIdeviceList: any = [];
  NIdevList: any = [];
  alertDay: any;
  nextDate: any = []
  nextDateShow: any = []
  lastDate: any = []
  visitedDate: any = []
  nextSDate: any = []
  onboardedDate: any = [];
  deviceName: any = ""
  deviceId: any = ""
  adminInstruct: any = "";
  NIAssetName: any = "";
  NIAssetDetail: any = "";
  NIDeviceId: any = [];
  NIDeviceName: any = [];
  NIInstallDate: any = [];
  NIlastDate: any = [];
  NInextDate: any = [];
  NImobileNo: any = "";
  NImailids: any = "";
  NICmobileNo: any = "";
  NICmailids: any = "";
  NIalertDay: any;
  regionsList: any;
  NIinstruct: any = "";
  assetId: any = "";

  ticketId: any = "";
  TKAssetName: any = "";
  TKAssetDetail: any = "";
  TKDeviceId: any = [];
  TKDeviceName: any = [];
  TKSensorName: any = [];
  // TKregionName: any = [];
  TKInstallDate: any = [];
  TKlastDate: any = [];
  TKnextDate: any = [];
  TKmobileNo: any = "";
  TKmailids: any = "";
  TKalertDay: any;
  TKinstruct: any = "";
  TKStatus: any = [];
  TkRemark: any = "";
  TkUser: any = "";

  showDiv(showWhat: any) {

    this.showIoTMain = false;
    this.showTicket = false;
    this.showGenMain = false;

    if (showWhat == 'iotMaint') {
      this.showIoTMain = true;

      this.getDevices();
    }
    else
      if (showWhat == 'tickets') {
        this.showTicket = true;

        this.getAccTickets();
      }
      else
        if (showWhat == 'genMaint') {
          this.showGenMain = true;
          this.getAssets();
        }
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

  checkDateRange(event: any) {



    this.selectedRange = event.dtId;

    if (event.dtId == "custom") {
      this.isDates = true;
    }
    else {
      this.isDates = false;
    }
  }

  repeat: any = ""
  TKrepeat: any = ""
  NIrepeat: any = ""

  getDayFromDate(inDate: any) {
    var day: any = ""

    switch (new Date(inDate).getDay()) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }

    return day
  }

  getMonthFromDate(inDate: any) {
    var day: any = ""


    if (inDate > 12) {
      inDate = inDate - 12
    }

    switch (inDate) {
      case 1:
        day = "January";
        break;
      case 2:
        day = "February";
        break;
      case 3:
        day = "March";
        break;
      case 4:
        day = "April";
        break;
      case 5:
        day = "May";
        break;
      case 6:
        day = "June";
        break;
      case 7:
        day = "July";
        break;
      case 8:
        day = "August";
        break;
      case 9:
        day = "September";
        break;
      case 10:
        day = "October";
        break;
      case 11:
        day = "November";
        break;
      case 12:
        day = "December";
    }
    return day
  }

  getRegions() {

    //getting all regions

    var respReg: any;
    var obj: any;
    this.regionsList = [];
    obj = [];
    obj.regionId = "";

    this._devicedataservice.getRegion(obj).subscribe(result => {

      respReg = result;

      this.regionsList = respReg;

    });


  }
  getDevices() {

    var obj: any = [];

    obj.loginId = this.comman.getLoginUserID();

    this._loaderService.display(true);

    this.deviceList = [];
    this.NIdeviceList = [];
    this.NIdevList = [];

    this._devicedataservice.getonBoardDevice(obj).subscribe(result => {
      debugger
      this._loaderService.display(false);

      this.onBoardedDevice = result;

      if (this.onBoardedDevice.devices.length > 0) {
        var data = [];
        var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'
        var devList: any = []

        this.onBoardedDevice.devices.forEach(element => {

          var devStat = element.isActive



          if (devStat == 'True') {
            devStat = "Active"
          }
          else {
            devStat = "Inactive"
          }

          this.NIdevList.push({
            deviceId: element.DeviceId,
            deviceName: element.DeviceName
          });



          devList.push({
            deviceId: element.DeviceId,
            deviceName: element.DeviceName,
            devStatus: devStat,
            nextDateShow: element.nextDateShow,
            lastDateShow: element.lastDateShow,
            onboarded: element.onBoardDateShow,
            alertDay: element.alertDay,
            alertDayShow: element.alertDayShow,
            icon: DisplayIcon,
            nextDate: element.nextDate,
            lastDate: element.lastDate,
            remarks: element.remarks,
            maintenanceUpdate: element.maintenanceUpdate,
            instruction: element.instruction,
            frequency: element.maintainFrequency,
            tktAssign: element.tktAssign,
          }
          )
        });

        this.deviceList = devList
      }


      this.NIdeviceList = this.NIdevList;
    })

  }
  getAssets() {

    var obj: any = [];

    obj.loginId = this.comman.getLoginUserID();
    this.assetId = "";
    this._loaderService.display(true);

    this.assetList = [];

    var tickList: any = []


    this._devicedataservice.getAssets(obj).subscribe(result => {

      this._loaderService.display(false);

      var tickets: any = []

      tickets = result;
      var stsShow: any = "";

      if (tickets.niotList.length > 0) {
        var data = [];
        var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'
        tickets.niotList.forEach(element => {

          if (element.status == '0') { stsShow = 'Open'; }
          else if (element.status == '1') { stsShow = 'Pending'; }

          tickList.push({
            assetId: element.assetId,
            assetName: element.assetName,
            assetDetails: element.assetDetails,
            deviceId: element.DeviceId,
            deviceName: element.DeviceName,
            nextDateShow: element.nextDateShow,
            lastDateShow: element.lastDateShow,
            installedDateShow: element.installedDateShow,
            alertDay: element.alertDay,
            alertDayShow: element.alertDayShow,
            icon: DisplayIcon,
            nextDate: element.nextDate,
            lastDate: element.lastDate,
            remarks: element.remarks,
            maintenanceUpdate: element.maintenanceUpdate,
            installedDate: element.installedDate,
            instruction: element.instruction,
            status: element.status,
            statusShow: stsShow,
            mobileNos: element.mobileNo,
            mailIds: element.mailIds,
            cmobileNos: element.cmobileNo,
            cmailIds: element.cmailIds,
            frequency: element.frequency
          }
          )
        });
      }

      this.assetList = tickList;

    })

  }

  resetFilter() {

    this.dateRange = [];
    this.deviceSelectedList = [];
    this.SelectedAssetList = [];
    this.isDates = false;
    this.fromDate = "";
  }

  getAccTickets() {

    this.resetFilter();

    var obj: any = [];

    this.assetId = "";
    this._loaderService.display(true);

    this.AccticketsList = [];

    this.getTickets(obj, 'live');
  }

  AstInstrs: any = []

  addInstruct() {

    if (this.NIinstruct !== '' && this.NIinstruct !== null) {
      var v = this.AstInstrs.filter(g => g.instr == this.NIinstruct);

      if (v.length == 0) {
        this.AstInstrs.push({ instr: this.NIinstruct })
        this.NIinstruct = "";
      }
      else {
        this.toastr.warning('Instruction Already Exists');
      }
    }
    else {
      this.toastr.warning('Please provide Check List and Click (+) Icon');
    }

  }

  removeInstruct(inst: any) {

    this.AstInstrs = this.AstInstrs.filter(g => g.instr !== inst);

  }


  isLiveTickets: boolean = false;

  getTickets(obj: any, state: any) {

    var tickList: any = []


    obj.loginId = this.comman.getLoginUserID();

    this._devicedataservice.getAccTickets(obj).subscribe(result => {

      this._loaderService.display(false);



      var tickets: any = []

      tickets = result;
      var stsShow: any = "";

      if (tickets.tktList.length > 0) {
        var data = [];
        var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'

        if (state === 'live') {
          this.isLiveTickets = true;
        }
        else {
          this.isLiveTickets = false;
        }


        tickets.tktList.forEach(element => {

          if (element.status == '0') { stsShow = 'Open'; }
          else if (element.status == '1') { stsShow = 'Pending'; }
          else if (element.status == '2') { stsShow = 'In-progress'; }
          else if (element.status == '3') { stsShow = 'Close'; }

          debugger

          tickList.push({
            ticketId: element.ticketId,
            assetId: element.assetId,
            type: element.type,
            assetName: element.assetName,
            assetDetails: element.assetDetails,
            deviceId: element.deviceId,
            deviceName: element.deviceName,
            sensorName: element.sensorName,
            // region: element.regionName,
            nextDateShow: element.nextDateShow,
            alertDayShow: element.alertDayShow,
            status: element.status,
            statusShow: stsShow,
            icon: DisplayIcon,
            mailIds: element.emailids,
            mobileNos: element.mobileNos,
            instruction: element.instruction,
            lat: element.lattitude,
            lng: element.longitude,
            tktImgLst: element.tktImages,
            createDate: element.tktCreated,
            closedDate: element.tktClosed,
            closedBy: element.tktClosedBy,
            showMap: element.lattitude !== '' ? true : false,
            showImage: element.tktImages.length == 0 ? false : true,
            userName: element.userName,
            ackDone: element.ackDone == '1' ? true : false,
            ackDateShow: element.ackDateShow
          }
          )
        });
      }



      this.AccticketsList = tickList;

    })

  }

  map: google.maps.Map;
  _marker: any;

  loadMap(lat: any, lng: any) {


    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lng));

    this.map = new google.maps.Map(this.gmapElement.nativeElement,
      {
        center: centerLatLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy',
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
      }
    );


    if (this._marker != undefined) {
      this._marker.setMap(null);
    }


    var marker = new google.maps.Marker({
      position: centerLatLng,
      map: this.map,
    });

    this.map.panTo(centerLatLng);
    this._marker = marker;


    this.modalMapFrm.show();
  }


  imageList: any
  mainImgPath: any

  loadImages(imgLst: any) {

    this.imageList = imgLst;
    this.mainImgPath = this.imageList[0];

    this.modalImgFrm.show();
  }

  loadMainImg(imgPath: any) {
    this.mainImgPath = imgPath;
  }

  saveAstInstruct() {

  }

  OpenModal() {
    this.reset();
    this.modalNIdevMain.show();
  }

  reset() {
    this.assetId = "";
    this.NInextDate = new Date();
    this.NIlastDate = new Date();
    this.NIInstallDate = new Date();
    this.lastDate = new Date();
    this.alertDay = ""
    this.visitedDate = []
    this.NIDeviceId = [];
    this.deviceName = "";
    // this.NIregionName = [];
    this.NImobileNo = "";
    this.NImailids = "";
    this.NICmobileNo = "";
    this.NICmailids = "";
    this.NIinstruct = "";
    // this.NIStatus = [];
    this.NIAssetName = "";
    this.NIAssetDetail = "";
  }

  editDevice(deviceId: any) {


    var devData: any = []

    devData = this.deviceList.filter(gr => gr.deviceId == deviceId);

    var obj: any = []

    obj.deviceId = deviceId;
    this.AstInstrs = [];

    this._devicedataservice.getInstructions(obj).subscribe(result => {
      this.AstInstrs = result;

    });


    this.assetId = "";
    this.nextDate = new Date();
    this.lastDate = new Date();
    this.alertDay = ""
    this.visitedDate = []
    this.deviceId = devData[0].deviceId;
    this.deviceName = devData[0].deviceName;
    this.repeat = + devData[0].frequency;
    if (devData[0].nextDate !== null && devData[0].nextDate !== undefined) {
      this.nextDate = new Date(devData[0].nextDate);
    }

    if (devData[0].lastDate !== null && devData[0].lastDate !== undefined) {
      this.lastDate = new Date(devData[0].lastDate);
    }
    this.nextDateShow = devData[0].nextDateShow;
    this.alertDay = devData[0].alertDay
    this.onboardedDate = devData[0].onboarded;



    this.adminInstruct = devData[0].instruction;

    if (devData[0].maintenanceUpdate == '1') {
      this.visitedDate = new Date(devData[0].lastDate);
    }
    this.assetId = devData[0].assetId;
    this.userID = devData[0].tktAssign;

    if (this.userID == '' || this.userID == null) {
      this.userID = [];
    }

    this.filterUserList = []

    if (this.deviceId !== '') {

      var tempUserList: any = []
      var userL: any = []
      this._devicedataservice.getDeviceUser(this.deviceId).subscribe(result => {

        userL = result


        userL.userLst.forEach(u => {
          var uL = this.userList.filter(gr => gr.userID == u.userId);

          if (uL.length > 0) {
            tempUserList.push(
              { userID: uL[0].userID, userName: uL[0].userName }
            );
          }
        });

        this.filterUserList = tempUserList;

      });
    }

    this.modaldevMain.show();

  }

  editAsset(assetId: any) {


    var devData: any = []

    devData = this.assetList.filter(gr => gr.assetId == assetId);

    var obj: any = []

    obj.assetId = assetId;

    this.AstInstrs = [];

    this._devicedataservice.getInstructions(obj).subscribe(result => {
      this.AstInstrs = result;

    });


    this.nextDate = new Date();
    this.lastDate = new Date();
    this.NIalertDay = ""
    this.visitedDate = []
    this.adminInstruct = "";

    this.NIrepeat = +devData[0].frequency;


    // this.repeatDetails = "";

    this.NIDeviceId = devData[0].deviceId;
    this.deviceName = devData[0].deviceName;



    // this.regionName = devData[0].region;
    // this.NIregionName = devData[0].regionId;
    this.NImobileNo = devData[0].mobileNos;
    this.NImailids = devData[0].mailIds;
    this.NICmobileNo = devData[0].cmobileNos;
    this.NICmailids = devData[0].cmailIds;
    // this.NIinstruct = devData[0].instruction;
    // this.NIStatus = +devData[0].status;
    this.NIAssetName = devData[0].assetName;
    this.NIAssetDetail = devData[0].assetDetails;
    this.assetId = devData[0].assetId;

    if (devData[0].nextDate !== null && devData[0].nextDate !== undefined) {
      this.NInextDate = new Date(devData[0].nextDate);
    }

    if (devData[0].lastDate !== null && devData[0].lastDate !== undefined) {
      this.NIlastDate = new Date(devData[0].lastDate);
    }
    this.nextDateShow = devData[0].nextDateShow;
    this.NIalertDay = devData[0].alertDay
    this.NIInstallDate = new Date(devData[0].installedDate);


    if (devData[0].maintenanceUpdate == '1') {
      this.NIlastDate = new Date(devData[0].lastDate);
    }

    this.modalNIdevMain.show();

  }

  isAssetTicket: boolean = false;

  editTicket(ticketId: any) {
    var devData: any = []

    devData = this.AccticketsList.filter(gr => gr.ticketId == ticketId);

    var obj: any = []

    debugger

    obj.assetId = devData[0].assetId;
    obj.deviceId = devData[0].deviceId;
    this.AstInstrs = [];
    if (devData[0].type == "Alert") {
      obj.ticketId = ticketId;
    }

    this._devicedataservice.getInstructions(obj).subscribe(result => {

      var inst: any = []

      inst = result;

      inst.forEach(ins => {
        if (ins.status == '1') {
          ins.status = true;
        }
        else {
          ins.status = false;
        }
        this.AstInstrs.push({ instr: ins.instr, status: ins.status, remark: ins.remark })
      });


    });


    this.nextDate = new Date();
    this.lastDate = new Date();
    this.TKalertDay = ""

    this.visitedDate = []
    this.adminInstruct = "";

    this.TKDeviceName = devData[0].deviceName;
    this.TKSensorName = devData[0].sensorName;

    this.hasDeviceName = true;
    this.hasSensorName = true;
    this.hasAstName = true;
    this.hasAstDetails = true;

    this.hasMobileNo = true;
    this.hasMailid = true;


    if (this.TKAssetName == null || this.TKAssetName == "" || this.TKAssetName == []) {
      this.hasAstName = false;
    }
    if (this.TKAssetDetail == null || this.TKAssetDetail == "" || this.TKAssetDetail == []) {
      this.hasAstDetails = false;
    }
    if (this.TKDeviceName == null || this.TKDeviceName == "" || this.TKDeviceName == []) {
      this.hasDeviceName = false;
    }
    if (this.TKSensorName == null || this.TKSensorName == "" || this.TKSensorName == []) {
      this.hasSensorName = false;
    }

    if (this.TKmobileNo == null || this.TKmobileNo == "" || this.TKmobileNo == []) {
      this.hasMobileNo = false;
    }

    if (this.TKmailids == null || this.TKmailids == "" || this.TKmailids == []) {
      this.hasMailid = false;
    }


    // this.TKregionName = devData[0].region;
    this.TKinstruct = devData[0].instruction;
    this.TKStatus = +devData[0].status;
    this.TKAssetName = devData[0].assetName;
    this.TKAssetDetail = devData[0].assetDetails;
    this.ticketId = devData[0].ticketId;
    this.TKnextDate = devData[0].nextDateShow;
    this.TKalertDay = devData[0].alertDayShow;
    this.TKmobileNo = devData[0].mobileNos;
    this.TKmailids = devData[0].mailIds;
    this.TkUser = devData[0].userName;

    if (this.TKAssetName !== '' || this.TKAssetName !== null || this.TKAssetName !== undefined) {
      this.isAssetTicket = true;
    }

    this.modelTktInst.show();

  }

  ackDevice: any

  updateAck() {

    var devN: any = []

    devN = this.deviceList.filter(g => g.deviceId == this.ackDevice);

    debugger
    Swal({
      title: "Would you like to Acknowledge for " + devN[0].deviceName + " ?",// this._translate.instant('SetUpDoYouProceedAlert'),
      text: "",
      type: 'warning',
      showCancelButton: true,
      showLoaderOnConfirm: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes"
      // allowOutsideClick: false,
    }).then((result1) => {
      if (result1.value) {

        this._devicedataservice.ackTicket(this.ackDevice).subscribe(result => {

          this.getAccTickets();

        });
      }
    });

  }


  AstSelectAll() {

    this.disableAstSelectAll = true;
    this.disableAstUnSelectAll = false;
    this.SelectedAssetList = this.assetList.map(x => x.assetId);

  }

  AstDeSelectAll() {
    this.disableAstSelectAll = false;
    this.disableAstUnSelectAll = true;
    this.SelectedAssetList = [];
  }

  assetClick() {

    if (this.SelectedAssetList.length > 0) {
      this.disableAstUnSelectAll = false;
    }
    else {
      this.disableAstUnSelectAll = true;
    }
  }

  onSelectAll() {

    this.disableDevSelectAll = true;
    this.disableDevUnSelectAll = false;
    this.deviceSelectedList = this.deviceList.map(x => x.deviceId);

  }

  onDeSelectAll() {
    this.disableDevSelectAll = false;
    this.disableDevUnSelectAll = true;
    this.deviceSelectedList = [];
  }

  devListClick() {


    if (this.deviceSelectedList.length > 0) {
      this.disableDevUnSelectAll = false;
    }
    else {
      this.disableDevUnSelectAll = true;
    }
  }

  getTicketReport() {

    var valid: boolean = false;

    if (this.SelectedAssetList.length == 0 && this.deviceSelectedList.length == 0) {
      valid = false;
      this.toastr.warning('Please select atleast one Asset/Device');
    }
    else
      if (this.dateRange == "" || this.dateRange == undefined || this.dateRange == null) {
        this.toastr.warning('Please Select Period');
        valid = false;
      }
      else
        if (this.dateRange == "custom" && (this.fromDate == ''
          || this.fromDate == undefined || this.fromDate == null)) {
          this.toastr.warning('Please Select Date Range');
          valid = false;
        }
        else {
          valid = true;
        }

    var obj: any = []

    if (valid) {



      obj.assetList = []

      this.SelectedAssetList.forEach(element => {
        obj.assetList.push(element)
      });


      obj.deviceList = []

      this.deviceSelectedList.forEach(element => {
        obj.deviceList.push(element)
      });


      if (this.selectedRange == "custom") {
        obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.fromDate[0]);
        obj.toDate = this._detailService.todateYYYYMMDDHHMM(this.fromDate[1]);

        // this.period = obj.frDate + ' To ' + obj.tDate
      }
      else {
        obj.frDate = this.selectedRange;
      }

      this.getTickets(obj, 'history');

    }

  }


  saveNIDevice() {


    var isValid: boolean = true;

    var obj: any = {}

    // obj.status = this.NIStatus;//'1';
    //regionLng


    obj.assetId = this.assetId

    obj.astInstructions = this.AstInstrs;

    if (this.NIInstallDate.length != 0) {
      obj.installedDate = this._detailService.dateToYYYYMMDDHHMM(this.NIInstallDate);
    }

    if (this.NIlastDate.length != 0) {
      obj.lastDate = this._detailService.dateToYYYYMMDDHHMM(this.NIlastDate);
    }


    if (this.NInextDate.length != 0) {
      obj.nextDate = this._detailService.dateToYYYYMMDDHHMM(this.NInextDate);

      obj.alertDay = this.NIalertDay;

      if (obj.nextDate != null && obj.nextDate != [] && obj.nextDate != undefined) {
        var dateDiff: any = []

        dateDiff = this.NInextDate - this.minDate;
        dateDiff = dateDiff / 1000 / 60 / 60 / 24;
        dateDiff = dateDiff.toFixed(0)


        var trigger: Number = 0;
        if (this.NIrepeat === undefined || this.NIrepeat === '' || this.NIrepeat === null) {
          this.toastr.warning('Please Select Repeat')
          isValid = false;
        }
        if (this.NIalertDay == null || this.NIalertDay == undefined || this.NIalertDay == '') {
          isValid = false;
          this.toastr.warning('Please Select Alert Before Day(s)')
        }
        else {
          if (this.NIrepeat == "0") {
            trigger = +this.NIalertDay

            if (dateDiff > 0) {
              if (dateDiff < trigger) {
                isValid = false;
                this.toastr.warning('Next Calibration Date Sholud be \r\ngreater than Alert Before Day(s)')
              }
            }
            else {
              isValid = false;
              this.toastr.warning('Next Calibration Date Sholud not be Today')
            }
          }
        }
      }
    }

    var mailIds: any = [];
    mailIds = this.NImailids.split(',');
    mailIds.forEach(mail => {
      if (mail !== '') {
        if (!this.comman.EmailID_REGX.test(mail)) {
          this.toastr.warning(mail + ' is Invalid EmailId');
          isValid = false;
        }

      }
    });


    mailIds = this.NICmailids.split(',');
    mailIds.forEach(mail => {
      if (mail !== '') {
        if (!this.comman.EmailID_REGX.test(mail)) {
          this.toastr.warning(mail + ' is Invalid EmailId');
          isValid = false;
        }

      }
    });




    if (isValid) {

      obj.frequency = this.NIrepeat;
      obj.assetName = this.NIAssetName;
      obj.assetDetails = this.NIAssetDetail;
      obj.deviceId = this.NIDeviceId;
      // obj.regionId = this.NIregionName;

      // if (this.isSchedule) {
      //   if (this.lastDate.length != 0) {
      obj.lastDate = this._detailService.dateToYYYYMMDDHHMM(this.NIlastDate);
      //   }
      // }
      // else {
      //   obj.lastDate = this._detailService.dateToYYYYMMDDHHMM(this.visitedDate);
      // }

      obj.mailIds = this.NImailids;
      obj.mobileNo = this.NImobileNo;

      obj.CmailIds = this.NICmailids;
      obj.CmobileNo = this.NICmobileNo;



      obj.instruction = this.NIinstruct;

      obj.loginId = this.comman.getLoginUserID();


      this._devicedataservice.NIdeviceMaintenance(obj).subscribe(data => {

        var result: any = [];
        result = data;

        if (result.sts == "200") {
          this.toastr.success("Preventive Calibration Updated Successfully");
          this.deviceId = []



          this.getAssets();
          this.modalNIdevMain.hide();

          this.formatLogUpdate_Mnt(obj);


        }
        else {
          this.toastr.warning("Preventive Calibration not Updated");
        }
      })
    }
  }

  saveDevice() {

    var isValid: boolean = true;

    var obj: any = {}
    debugger
    //regionLng
    if (this.isSchedule) {

      if (this.lastDate.length != 0) {
        obj.lastDate = this._detailService.dateToYYYYMMDDHHMM(this.lastDate);
      }
      if (this.userID == '' || this.userID == undefined || this.userID == null) {
        isValid = false;
        this.toastr.warning('Please Select User to Assign')
      }
      if (this.nextDate.length != 0) {
        obj.nextDate = this._detailService.dateToYYYYMMDDHHMM(this.nextDate);

        obj.alertDay = this.alertDay;

        if (obj.nextDate != null && obj.nextDate != [] && obj.nextDate != undefined) {
          var dateDiff: any = []

          dateDiff = this.nextDate - this.minDate;
          dateDiff = dateDiff / 1000 / 60 / 60 / 24;
          dateDiff = dateDiff.toFixed(0)

          var trigger: Number = 0;
          if (this.repeat === undefined || this.repeat === '' || this.repeat === null) {
            this.toastr.warning('Please Select Repeat')
            isValid = false;
          }
          if (this.alertDay == null || this.alertDay == undefined || this.alertDay == '') {
            isValid = false;
            this.toastr.warning('Please Select Alert Before Day(s)')
          }
          else {
            if (this.repeat == "0") {
              trigger = +this.alertDay
              if (dateDiff > 0) {
                if (dateDiff < trigger) {
                  isValid = false;
                  this.toastr.warning('Next Calibration Date Sholud be \r\ngreater than Alert Before Day(s)')
                }
              }
              else {
                isValid = false;
                this.toastr.warning('Next Calibration Date Sholud not be Today')
              }
            }
          }
        }
      }

    }
    else {
      if (this.visitedDate.length == 0) {
        isValid = false;
        this.toastr.warning('Please Select Calibration Date');
      }
      // else
      //   if (this.techComments.length == 0 || this.techComments == undefined || this.techComments == null) {
      //     isValid = false;
      //     this.toastr.warning('Please Fill Remarks');
      //   }

      //visitedDate
    }

    if (isValid) {


      obj.frequency = this.repeat;
      obj.deviceId = this.deviceId;

      obj.astInstructions = this.AstInstrs;


      if (this.isSchedule) {
        if (this.lastDate.length != 0) {
          obj.lastDate = this._detailService.dateToYYYYMMDDHHMM(this.lastDate);
        }

        // obj.instruction = this.adminInstruct;
      }
      else {
        obj.lastDate = this._detailService.dateToYYYYMMDDHHMM(this.visitedDate);
      }

      // obj.Remarks = this.techComments;

      obj.loginId = this.comman.getLoginUserID();

      obj.assignId = this.userID;


      this._devicedataservice.deviceMaintenance(obj).subscribe(data => {

        var result: any = [];
        result = data;

        if (result.sts == "200") {
          this.toastr.success("Preventive Calibration Updated Successfully");
          this.deviceId = []


          this.getDevices();
          this.modaldevMain.hide();

          this.formatLogUpdate_PreventMnt(obj);
          this.formatDeviceLogUpdate_PreventMnt(obj);

        }
        else {
          this.toastr.warning("Preventive Calibration not Updated");
        }
      })
    }
  }

  saveTicket() {

    var obj: any = {}

    var valid: boolean = true;

    if (this.TkRemark != '' || this.TkRemark != undefined || this.TkRemark != null) {

      obj.remarks = this.TkRemark
      obj.ticketId = this.ticketId
      obj.status = this.TKStatus

      debugger

      obj.astInstructions = this.AstInstrs;

      var chkInstr: any

      chkInstr = this.AstInstrs.filter(g => g.status == false)


      obj.loginId = this.comman.getLoginUserID();

      var isValid: boolean = false

      if (this.TKStatus == 3) {
        if (chkInstr.length == 0) {
          isValid = true;
        }
        else {
          isValid = false;
          this.toastr.warning('Please check instrunctions before closing ticket');
        }
      }
      else {
        isValid = true;
      }

      if (isValid) {
        this._loaderService.display(true);
        this._devicedataservice.ticketUpdate(obj).subscribe(data => {
          var resp: any = []

          resp = data;

          if (resp.sts == "200") {

            this._loaderService.display(false);
            this.modelTktInst.hide();
            this.getAccTickets();
            this.formatLogUpdate_Ticket();
            if (this.TKDeviceName && this.TKDeviceName != null && this.TKDeviceName != "") {
              this.formatDeviceLogUpdate_Ticket();
            }
          }

        });
      }

    }
    else {
      this.toastr.warning("Please Enter Remarks");
    }
  }

  formatLogUpdate_Ticket() {

    try {
      let formatInst = "";
      this.AstInstrs.forEach(item => {
        formatInst += "Instruction: " + item.instr +
          ", Done: " + item.status +
          ", Remark: " + item.remark + "|"
      });

      formatInst = formatInst.length > 0 ? formatInst.substring(0, formatInst.length - 1) : '';
      let stsObj = this.statusList.find(x => x.stid == this.TKStatus);

      let assetName = ""
      let assetDetails = ""
      let deviceName = ""

      let formatedString = ""

      debugger

      if (this.TKAssetName !== null && this.TKAssetName !== "") {
        assetName = "Asset name: " + this.TKAssetName
      }

      if (this.TKAssetDetail !== null && this.TKAssetDetail !== "") {
        assetDetails = "Asset Details: " + this.TKAssetDetail
      }

      if (this.TKDeviceName !== null && this.TKDeviceName !== "") {
        deviceName = "Device Name: " + this.TKDeviceName
      }


      formatedString = assetName + "  " + assetDetails + "  " + deviceName + "  Calibration Date: " + this.TKnextDate +
        ", Instructions(s): (" + formatInst +
        "), Status: " + stsObj.stVal;

      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Maintenance",
        "actionPerformed": "Ticket has been updated -" + formatedString
      }

      this.comman.logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

  formatDeviceLogUpdate_Ticket() {

    try {
      let formatInst = "";
      this.AstInstrs.forEach(item => {
        formatInst += "Instruction: " + item.instr +
          ", Done: " + item.status +
          ", Remark: " + item.remark + "|"
      });

      let devObj = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

      let sel_dev = devObj.find(x => x.deviceName == this.TKDeviceName);

      formatInst = formatInst.length > 0 ? formatInst.substring(0, formatInst.length - 1) : '';
      let stsObj = this.statusList.find(x => x.stid == this.TKStatus);


      let assetName = ""
      let assetDetails = ""
      let deviceName = ""

      let formatedString = ""

      debugger

      if (this.TKAssetName !== null && this.TKAssetName !== "") {
        assetName = "Asset name: " + this.TKAssetName
      }

      if (this.TKAssetDetail !== null && this.TKAssetDetail !== "") {
        assetDetails = "Asset Details: " + this.TKAssetDetail
      }

      if (this.TKDeviceName !== null && this.TKDeviceName !== "") {
        deviceName = "Device Name: " + this.TKDeviceName
      }


      formatedString = assetName + "  " + assetDetails + "  " + deviceName + "  Calibration Date: " + this.TKnextDate +
        ", Instructions(s): (" + formatInst +
        "), Status: " + stsObj.stVal;


      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Maintenance",
        "deviceId": sel_dev.sensorId,
        "actionPerformed": "Ticket has been updated -" + formatedString
      }

      this.comman.device_logUpdate(logReq);
    } catch (e) {
      e = null;
    }

  }

  formatLogUpdate_Mnt(obj) {


    try {
      let devObj = this.NIdeviceList.find(x => x.deviceId == obj.deviceId);
      let formatInst = "";
      obj.astInstructions.forEach(element => {
        formatInst += element.instr + ",";
      });
      formatInst = formatInst.length > 0 ? formatInst.substring(0, formatInst.length - 1) : '';
      let formatedString = "Asset name: " + obj.assetName +
        ", Asset Details: " + obj.assetDetails +
        ", Device Name: " + devObj.deviceName +
        ", Installed Date: " + obj.installedDate +
        ", Prev. Calibration Date: " + obj.lastDate +
        ", Next Calibration Date: " + obj.nextDate +
        ", Alert Before Day(s): " + obj.alertDay +
        ", Repeat: " + obj.frequency +
        ", Mobile No(s) (Primary): " + obj.mobileNo +
        ", MailID(s) (Primary): " + obj.mailIds +
        ", Mobile No(s) (Copy): " + obj.CmobileNo +
        ", MailID(s) (Copy): " + obj.CmailIds +
        ", Instructions(s): (" + formatInst + ")";

      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Maintenance",
        "actionPerformed": "General Calibration has been updated. Record info -" + formatedString
      }

      this.comman.logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

  formatLogUpdate_PreventMnt(obj) {


    try {
      // let userObj = this.filterUserList.find(x => x.userID == obj.assignId);
      let formatInst = "";
      obj.astInstructions.forEach(element => {
        formatInst += element.instr + ",";
      });
      formatInst = formatInst.length > 0 ? formatInst.substring(0, formatInst.length - 1) : '';
      let formatedString = "Device ID: " + obj.deviceId +
        ", Device Name: " + this.deviceName +
        ", Prev. Calibration Date: " + obj.lastDate +
        ", Next Calibration Date: " + obj.nextDate +
        ", Alert Before Day(s): " + obj.alertDay +
        ", Repeat: " + obj.frequency +
        //   ", Assign: " + userObj.userName +
        ", Instructions(s): (" + formatInst + ")";

      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Maintenance",
        "actionPerformed": "Preventive Calibration has been updated. Record info -" + formatedString
      }

      this.comman.logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

  formatDeviceLogUpdate_PreventMnt(obj) {
    try {

      let formatInst = "";
      obj.astInstructions.forEach(element => {
        formatInst += element.instr + ",";
      });
      formatInst = formatInst.length > 0 ? formatInst.substring(0, formatInst.length - 1) : '';
      let formatedString = "Device ID: " + obj.deviceId +
        ", Device Name: " + this.deviceName +
        ", Prev. Maintenance Date: " + obj.lastDate +
        ", Next Maintenance Date: " + obj.nextDate +
        ", Alert Before Day(s): " + obj.alertDay +
        ", Repeat: " + obj.frequency +
        //   ", Assign: " + userObj.userName +
        ", Instructions(s): (" + formatInst + ")";

      let logReq = {
        "deviceId": obj.deviceId,
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Maintenance",
        "actionPerformed": "Preventive Calibration has been updated. Record info -" + formatedString
      }

      this.comman.device_logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }
  allowNumericsOnly(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  allowNumericsWithComma(evt) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode == 44) {
      return true;
    }
    else
      if (charCode < 48 || charCode > 57) {
        return false;
      }
    return true;
  }
}
