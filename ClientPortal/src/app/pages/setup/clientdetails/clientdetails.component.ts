import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Column, Formatters, OnEventArgs, GridOdataService, CaseType, AngularGridInstance } from 'angular-slickgrid';
import { clientProfile } from '../modal/clientProfile';
import { ClientService } from '../Service/client.service';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { SiteAdmin, sensorDetails, HardwareTypes, HWType } from '../modal/site-admin';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import { LoaderService } from 'src/app/services/loader.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const datePipe = new DatePipe('en-In');
import Swal from 'sweetalert2'
import { Subscription, Observable } from 'rxjs/Rx';
import { ReportService } from '../../reports/service/report.service';

@Component({
  selector: 'app-clientdetails',
  templateUrl: './clientdetails.component.html',
  styleUrls: ['./clientdetails.component.css']
})
export class ClientdetailsComponent implements OnInit {


  @ViewChild('Modalopenbtn') ModalopenClient: ElementRef;
  @ViewChild('Modalclosebtn') ModalcloseClient: ElementRef;
  // @ViewChild('Validity') Validity: ElementRef;
  @ViewChild('modalSgnUp') signUpModal: any;
  @ViewChild('modalPermissions') modalPermissions: any;
  @ViewChild('modalSensorType') modalSensorType: any;
  @ViewChild('modalHubType') modalHubType: any;
  @ViewChild('modaladdSensorType') modaladdSensorType: any;
  @ViewChild('modaladdHubType') modaladdHubType: any;
  @ViewChild('modaladdSensorHubType') modaladdSensorHubType: any;
  @ViewChild('modalprogress') modalprogress: any;
  @ViewChild('modalhardwareTypeList') modalhardwareTypeList: any;
  @ViewChild('modalsensorDataFormat') modalsensorDataFormat: any;
  @ViewChild('modaldeviceConfig') modaldeviceConfig: any;
  @ViewChild('modaldeviceUpdate') modaldeviceUpdate: any;
  //
  @ViewChild('modalclientSensor') modalclientSensor: any;

  // @ViewChild('ClientSearch') clientSearch: ElementRef;
  @ViewChild('phoneNo') OfcphoneNo: ElementRef;
  // @ViewChild('Latitude') Latitude: ElementRef;
  // @ViewChild('Longitude') Longitude: ElementRef;
  @ViewChild('ContactPersonNo') ContactPersonNo: ElementRef;
  @ViewChild('ContactPersonMail') ContactPersonMail: ElementRef;

  @ViewChild('ClearSearch') clearSearch: ElementRef;
  @ViewChild('clientNameColor') clientNameColRemove: ElementRef;

  @ViewChild('AttachamentsLogo') AttachamentsLOGO: ElementRef;
  @ViewChild('Attachaments') AttachmenImage: ElementRef;


  @ViewChild('Attachamentsbg') Attachamentsbg: ElementRef;

  isNewClient: boolean = true;
  isNewType: boolean = true;
  isHWNewType: boolean = true;
  isSensor: boolean = false;
  isNewSensor: boolean = true;
  isHub: boolean = true;
  imageCon: boolean = false;
  DBCreated: boolean = false;
  DBNotCreated: boolean = false;
  AppCreated: boolean = false;
  AppNotCreated: boolean = false;
  DomainCreated: boolean = false;
  DomainNotCreated: boolean = false;
  chkShowTrend: boolean = false;
  isWriteType: boolean = true;
  // isIoT: boolean= false;
  isTimer: boolean;
  isHWTypeSave: boolean = false;
  isBoolType: boolean = false;
  isEdit: boolean = false;
  private timer;
  private sub: Subscription;
  domainSts: string;
  savemode: string;
  imagePath: any = "";
  sensorWriteRange: any = "";
  sensorId: any = "";
  //minDate: any = Date;
  NotbasedOnFileValidate: boolean = false;
  basedOnFileValidate: boolean = false;
  countryCode: any = "";
  dataKey: any = "";
  dataKeyName: any = "";
  Convertion: any = "";
  Descr: any = "";
  TypeName: any = "";
  bool0: any = "";
  bool1: any = "";
  sensorOrder: any = "";
  deviceTypeId: any;
  readWriteStatus: any;
  sensorConvertion: any;
  sensorDisplyName: any;
  shortCode: any;

  sensorStates: any = [];
  sensorStatesFilter: any = [];
  sensorStateList: any = [];

  disabeleSelectAll = false;
  disableUnSelectAll = true;

  mathFunctionList: any = [];
  mathFunctions: any = [];

  sensorIcon: any;
  sensorIcons: any = [];


  deviceTypeList: any = [];
  sensorName: any = ""
  //sensorKeyName: any = ""
  sensorNames: any = [];
  sensorUoM: any = [];
  sensorUoMFilter: any = [];

  readWrite: any = [];
  readWriteType: any = "";

  dataTypes: any = [];
  Countries: any = [];
  dateFormat: any = [];
  states_TimeZone: any = [];
  EnterContact: any
  InvalidContact: any;
  contactExist: any;
  HubIDS: any = [];
  SensorIDS: any = [];
  dataFormat: any = "";
  UoM: any = "";
  UoMId: any = "";
  IsNewDF: boolean = true;

  constructor(private ClientService: ClientService,
    private cmnService: IdeaBService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private _detailService: ReportService
  ) {
  }

  columnDefinitions: Column[] = [];
  datasource: any = [];
  rowData: any = [];
  gridOptions: any = {};
  clientProfileobj = new clientProfile();
  sensorTypes: any = [];
  hubCategories: any = [];
  sensorDetails = new sensorDetails();
  HardwareTypes = new HardwareTypes();
  hwType = new HWType();
  siteadminobj = new SiteAdmin();
  c_id: string = "";
  siteAdminID: string = "";
  ClientDB: string = "";
  addSensor: string = "";
  dateValue: any;
  stateList: any = [];
  locationList: any = [];
  ResponseList: any = [];
  clientList: any = [];
  supportList: any = [];
  minDate: any;
  isLogoTextShow: boolean;
  isDeleteShow: boolean = false;
  isCurrectLogo: boolean = true;
  isResetPasswordShow: boolean = true;
  isPermissionShow: boolean = false;
  disabled: boolean = false;
  HWdisabled: boolean = false;
  angularGrid: AngularGridInstance;
  //siteadmin
  isConfirmPasswordShow: boolean = true;
  filterAryList: any = [];
  newFilterAryList: any = [];
  //permissions strat

  resultedMenu: any = [];
  childresultedMenu: any = [];
  menuItem: TreeviewItem;
  childmenuItem: TreeviewItem;
  items: TreeviewItem[];
  SelectedFeatureIds: number[];
  itemArray: any = [];
  defaultFeatureId: any;
  dropDownSourceList: any = [];
  filterDropDownSourceList: any = [];
  defaultDrpList: any = [];
  showLive: boolean = false;
  selectedDefaultDrp = new SelectedDefaultDrp();
  isShowFooter: boolean = false;

  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 250
  });


  ngOnInit() {

    var currentDate = new Date(new Date().setDate(new Date().getFullYear() + 1));
    this.clientProfileobj.Validity = currentDate.toString();
    this.minDate = new Date();
    this.dataTable();
    this.HWTypeDetails();
    //this.getDataTypes();
    this.loadHWTypesModel();
    this.readWrite = [];
    var rw: any = [];

    rw.rwId = "1";
    rw.rwName = "Read";

    this.readWrite.push(rw);

    rw = [];

    rw.rwId = "2";
    rw.rwName = "Read Write";

    this.readWrite.push(rw);


    debugger
    this.userLevel = sessionStorage.getItem("USER_TYPE");
    if (this.userLevel == '1') {
      this.isNewClient = true;
      this.isNewType = false;
    }
    else {
      this.isNewClient = false;
      this.isNewType = true;
    }

  }
  _restrictCharacters(event: any) {
    const pattern = /^[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if ((!pattern.test(inputChar))) {
      event.preventDefault();
    }
  }

  onSelectAll() {

    //this.mathFunction = [];
    debugger
    this.disabeleSelectAll = true;
    this.disableUnSelectAll = false;
    this.mathFunctionList = this.mathFunctions.map(x => x.mathId);

  }

  onDeSelectAll() {
    this.disabeleSelectAll = false;
    this.disableUnSelectAll = true;
    this.mathFunctionList = [];
  }

  changeRWtype() {
    if (this.readWriteType == "2") {
      this.isWriteType = true;
    }
    else {
      this.isWriteType = false;
    }

  }

  addKeyType(obj: any) {
    debugger
    obj.readWrite = this.readWriteType;
    obj.dataKeyName = this.sensorName;
    obj.UoM = this.UoM;
    var isItOk = this.checkGivenKey(obj);
    if (isItOk) {

      debugger
      obj.shortCode = this.hwType.ShortName;

      obj.showLive = (this.showLive == true) ? '1' : '0';

      this.ClientService.HWDataFormat(obj).subscribe(result => {

        debugger

        this.ResponseList = result;
        if (this.ResponseList.length > 0) {

          var keyTypes = []
          this.dataFormat = "{";
          debugger;
          var idx: number = 0;
          this.ResponseList.forEach(element => {
            keyTypes.push([
              element.key,
              element.typeOfData,
              element.description
            ])
            if (idx == 0) {
              this.dataFormat += "\"" + element.key + "\":\"value\"";
            }
            else {
              this.dataFormat += ",\"" + element.key + "\":\"value\"";
            }
            idx = 1;
          });

          this.dataFormat += "}";

          // this.bindKeyDataTable(keyTypes);

          this.Convertion = "";
          this.UoM = "";
          this.bool0 = "";
          this.bool1 = "";
          this.Descr = "";
          this.TypeName = "";
          this.dataKeyName = "";
          this.dataKey = "";

        }
        else {
          this.bindKeyDataTable([]);
          this.dataFormat = "";
        }
      });

    }
    else {
      this.toastr.warning(this.cmnService.MANDATORYMESSAGE);
    }
  }

  GetDeviceDataFormat(event) {
    debugger
    this.shortCode = event.deviceCode;

    this.DeviceDataFormat(this.shortCode);
  }

  DeviceDataFormat(deviceCode: any) {
    this.ClientService.GetDataFormat(deviceCode, "", this.ClientDB).subscribe(result => {
      debugger
      var data: any = [];

      this.tableclientDeviceList = result;
      var DisplayIcon

      DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit"></i>'


      this.tableclientDeviceList.forEach(element => {

        var rwType: string = ""

        if (element.readWrite == "1") {
          rwType = "Read";
        }
        else {
          rwType = "Read Write";
        }

        var mathFun: string = ""

        var deviceMath = element.mathFunctions.split(',');

        for (let index = 0; index < deviceMath.length; index++) {
          this.mathFunctions.forEach(mf => {
            if (mf.mathId == deviceMath[index]) {
              mathFun += mf.functionName + ", ";
            }
          });
        }

        var sensorState: string = ""

        var sensorStates = element.sensorStates.split(',');

        for (let index = 0; index < sensorStates.length; index++) {
          this.sensorStates.forEach(mf => {
            if (mf.stateId == sensorStates[index]) {
              sensorState += mf.stateName + ", ";
            }
          });
        }

        var UoMValue: string = ""

        if (element.uom != "") {
          debugger
          this.sensorUoM.forEach(u => {
            if (u.uomId == element.uom) {
              UoMValue = u.symbol;
            }
          });
        }

        data.push([
          element.key,
          element.keyName,
          UoMValue,
          element.iconName,
          element.convertion,
          mathFun,
          rwType,
          sensorState,
          element.OrderNo,
          DisplayIcon,
          element.sensorName,
          element.mathFunctions,
          element.sensorStates,
          element.uom,
          element.showTrend,
          element.WriteRange
        ]
        )
      });



      debugger
      this.bindingClientDeviceTable(data);

    });
  }

  bindingClientDeviceTable(data) {
    debugger
    if (data.length > 0) {
      this.isShowFooter = true;
    } else {
      this.isShowFooter = false;
    }

    var table = $('#clientDevice').DataTable({
      paging: this.isShowFooter,
      info: this.isShowFooter
    });
    table.clear().rows.add(data).draw();
    jQuery('.dataTable').wrap('<div style="height:auto;max-height:60vh;overflow-y:auto;" />');
    var that = this;

    $('#clientDevice tbody ').on('click', 'td', function () {
      debugger

      var Index = this.cellIndex
      if (Index == "9") {
        var data = $(this).parent();
        var table = $('#clientDevice').DataTable();
        var data = table.row(data).data();


        that.modaldeviceUpdate.show();

        that.deviceSensor = data[0];
        that.sensorDisplyName = data[1];
        that.deviceSensorType = data[10];
        that.deviceSensorIcon = data[3];
        that.sensorConvertion = data[4];
        that.sensorOrder = data[8];
        that.deviceSensorMath = data[11].split(',');
        that.deviceSensorState = data[12].split(',');
        that.deviceSensorUoM = data[13];
        that.chkShowTrend = (data[14] == '1') ? true : false;
        that.sensorWriteRange = data[15];

        if (data[14] != "") {
          that.isWriteType = true;
          that.sensorWriteRange = data[15];
        }
        else {

          that.isWriteType = false;
        }


        debugger
        that.mathFunctionList = [];
        for (let index = 0; index < that.deviceSensorMath.length; index++) {
          if (that.deviceSensorMath[index] != "") {
            that.mathFunctionList.push(that.deviceSensorMath[index])
          }
        }

        that.sensorStateList = [];
        for (let index = 0; index < that.deviceSensorState.length; index++) {
          if (that.deviceSensorState[index] != "") {
            that.sensorStateList.push(that.deviceSensorState[index])
          }
        }

        that.deviceSensorRW = data[6];

        that.sensorName = data[0];

        // var _sensor: any = []
        // _sensor = that.sensorNames.filter(g => g.sensorType == that.deviceSensorType);

        that.getUoM(that.deviceSensorType);


        // debugger
        // var _sensorUoM: any = []
        // _sensorUoM = that.sensorUoMFilter.filter(g => g.uomId == data[12]);

        if (data[13] != "") {
          that.UoM = data[13];//_sensorUoM[0].uomId;
        }

        if (data[6] == "Read") {
          that.readWriteType = "1";
          that.isWriteType = false;
        }
        else if (data[6] != "Read") { that.readWriteType = "2", that.isWriteType = true; }


        that.sensorIcon = data[3];

        that.getSensorState(that.deviceSensorType);


      }
    });

  }

  deviceSensor: any;
  deviceSensorUoM: any;
  deviceSensorType: any;
  deviceSensorIcon: any;
  deviceSensorMath: any;
  deviceSensorRW: any;
  deviceSensorState: any;

  saveDeviceConfig() {
    debugger

    var obj: any = {};

    obj.clientDB = this.ClientDB;
    obj.shortCode = this.shortCode;
    obj.sensorKey = this.deviceSensor;
    obj.Icon = this.sensorIcon;
    obj.uom = this.UoM;
    obj.mathFunction = this.mathFunctionList;
    obj.rwType = this.readWriteType
    obj.displayName = this.sensorDisplyName;
    obj.convertion = this.sensorConvertion;
    obj.sensorStates = this.sensorStateList;
    obj.showTrend = (this.chkShowTrend == true) ? '1' : '0';
    obj.writeRange = this.sensorWriteRange;
    obj.orderNo = this.sensorOrder;
    debugger
    this.ClientService.UpdateHWFormat(obj).subscribe(result => {
      var res: any = [];
      debugger
      res = result;

      if (res.sts == "200") {
        this.toastr.success(res.msg);

        this.DeviceDataFormat(this.shortCode);
      }
      else {
        this.toastr.warning("Updatation failed");
      }

    });
  }

  GetDataFormat() {
    debugger
    this.ClientService.GetDataFormat(this.hwType.ShortName, "", "").subscribe(result => {
      debugger
      this.ResponseList = result;
      if (this.ResponseList.length > 0) {

        var keyTypes = []
        this.dataFormat = "{";
        debugger;
        var idx: number = 0;
        this.ResponseList.forEach(element => {
          keyTypes.push([
            element.key,
            element.typeOfData,
            element.description
          ])
          if (idx == 0) {
            this.dataFormat += "\"" + element.key + "\":\"value\"";
          }
          else {
            this.dataFormat += ",\"" + element.key + "\":\"value\"";
          }
          idx = 1;
        });

        this.dataFormat += "}";

        this.bindKeyDataTable(keyTypes);
      }
      else {
        this.bindKeyDataTable([]);
        this.dataFormat = "";
      }
    });
  }

  checkGivenKey(obj: any) {
    debugger
    if (obj.dataKey == "" || obj.dataKey == undefined || obj.dataKey == "undefined") {
      return false;
    }
    if (obj.dataKeyName == "" || obj.dataKeyName == undefined || obj.dataKeyName == "undefined") {
      return false;
    }
    if (this.isBoolType) {
      if (obj.bool1 == "" || obj.bool1 == undefined || obj.bool1 == "undefined") {
        return false;
      }
      if (obj.bool0 == "" || obj.bool0 == undefined || obj.bool0 == "undefined") {
        return false;
      }
    }

    return true;

  }


  openDataFormatModal() {
    debugger
    if (this.hwType.ShortName != undefined) {
      this.GetDataFormat();
    }

    this.modalsensorDataFormat.show();
  }

  getDataTypes() {

    this.ClientService.getDataTypes().subscribe(result => {
      this.dataTypes = result;
    });

  }

  smsNumber(e) {
  }

  clientResponseArray: any;
  tableBindedList: any;
  tableclientDeviceList: any;
  userLevel: any;
  dataTable() {
    debugger
    var DisplayIcon = "";

    //this.loaderService.display(true);
    this.loaderService.display(false);
    this.ClientService.getClientProfile("", "").subscribe(data => {
      debugger

      this.clientResponseArray = data;
      this.tableBindedList = this.clientResponseArray.clientDetails;
      this.HardwareTypes = this.clientResponseArray.HardwareType;
      this.sensorTypes = this.clientResponseArray.SensorTypes;
      this.hubCategories = this.clientResponseArray.HubCategory;

      var data1 = [];
      if (this.tableBindedList.length > 0) {

        this.userLevel = sessionStorage.getItem("USER_TYPE");;

        if (this.userLevel == "1") {
          DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit"></i>'

        }
        else {
          DisplayIcon = ' <i class="fa fa-sitemap" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit"></i>'

        }

        debugger

        this.tableBindedList.forEach(element => {
          data1.push([
            element.ClientName,
            element.PhoneNumber,
            this.splitForDate(element.Validity),
            element.HardwareType,
            "API: " + element.ListerAPI + "<br/>TCP IP : " + element.ListerIP + " TCP Port : "
            + element.ListerPort + "<br/>" + element.mqttTopic.split(',')[0] + "<br/>" + element.mqttTopic.split(',')[1],
            element.IsActive == 1 ? "Active" : "In Active",
            DisplayIcon,
            element.ClientID,
            element.SiteId,
            element.Domain,
            element.ShortName
          ]
          )
        });

        debugger
        this.loaderService.display(false);
        this.dataBindingTable(data1);

      }
      else {
        debugger
        this.loaderService.display(false);
        this.dataBindingTable([]);
      }
    }), error => {
      debugger
      this.loaderService.display(false);
      this.toastr.warning(error.error.Message);
    };
  }

  BindingHWTypesTable(data) {
    debugger

    $('#HardwareTypeTable').dataTable().fnDestroy();
    var table = $('#HardwareTypeTable').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
    });
    table.clear().rows.add(data).draw();

    this.modalhardwareTypeList.show();

    jQuery('.dataTable').wrap('<div style="height:auto;max-height:50vh;overflow-y:auto;" />');
    var that = this;

    $('#HardwareTypeTable tbody ').on('click', 'td', function () {
      debugger
      var Index = this.cellIndex
      if (Index == "6") {
        debugger


        var data = $(this).parent();
        var table = $('#HardwareTypeTable').DataTable();
        var data = table.row(data).data();

        that.hwType.ShortName = data[2]
        that.hwType.ModelNo = data[3]
        that.hwType.Vendor = data[4]
        that.hwType.dataformat = data[5]
        that.hwType.OS = data[7]

        that.hwType.HardwareName = data[1]

        that.HWdisabled = true;
        that.isHWNewType = false;
        that.isHWTypeSave = true;

        that.IsNewDF = false;

        if (data[0] == "Sensor") {
          that.addSensor = 'Edit Sensor | ' + data[1]
          that.isSensor = true;
          that.isHub = false;
          that.hwType.HardwareType = "1";
          that.modaladdSensorHubType.show();
        }
        else {
          that.addSensor = 'Edit Hub | ' + data[1]
          that.isSensor = false;
          that.isHub = true;
          that.hwType.HardwareType = "2";
          that.modaladdSensorHubType.show();
        }

      }
    });

  }


  BindingSensorTable(data) {
    debugger

    $('#clientSensorTable').dataTable().fnDestroy();
    var table = $('#clientSensorTable').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
    });
    table.clear().rows.add(data).draw();

    this.modalclientSensor.show();

    jQuery('.dataTable').wrap('<div style="height:auto;max-height:50vh;overflow-y:auto;" />');
    var that = this;

    $('#clientSensorTable tbody ').on('click', 'td', function () {
      debugger
      var Index = this.cellIndex
      if (Index == "6") {
        var data = $(this).parent();
        var table = $('#clientSensorTable').DataTable();
        var data = table.row(data).data();
        debugger
        this.sensorDetails = new sensorDetails();

        this.hubCategories = [];

        debugger

        //that.ClientDB;
        that.sensorDetails.SensorId = data[1];
        that.sensorDetails.clientDB = that.ClientDB;
        that.sensorDetails.IsSensorActive = (data[5] == "Active") ? true : false;
        that.sensorDetails.SensorType = data[7];
        that.sensorDetails.HubCategoryId = data[7];
        that.sensorDetails.Delivery = new Date(data[3]);

        that.isNewSensor = false;

        if (data[0] == "Sensor") {
          that.addSensor = 'Edit Sensor | ' + data[1]
          that.modalSensorType.show();
        }
        else {
          that.addSensor = 'Edit Hub | ' + data[1]
          that.modalHubType.show();
        }

      }
    });

  }

  bindKeyDataTable(data) {
    if (data.length > 0) {
      this.isShowFooter = true;
    } else {
      this.isShowFooter = false;
    }
    debugger
    var table = $('#dataTypeTable').DataTable({
      paging: this.isShowFooter,
      info: this.isShowFooter
    });
    table.clear().rows.add(data).draw();

  }

  dataBindingTable(data) {
    debugger
    if (data.length > 0) {
      this.isShowFooter = true;
    } else {
      this.isShowFooter = false;
    }

    var table = $('#clientTable').DataTable({
      paging: this.isShowFooter,
      info: this.isShowFooter
    });
    table.clear().rows.add(data).draw();
    jQuery('.dataTable').wrap('<div style="height:auto;max-height:60vh;overflow-y:auto;" />');
    var that = this;

    $('#clientTable tbody ').on('click', 'td', function () {
      debugger

      var Index = this.cellIndex
      if (Index == "3") {
        var data = $(this).parent();
        var table = $('#clientTable').DataTable();
        var data = table.row(data).data();
        debugger
        that.ClientDB = data[9];
        that.c_id = data[7];
        that.siteAdminID = data[8];

        that.deviceTypeId = [];
        var dev: any = []
        that.deviceTypeList = [];

        var devices: any = []
        devices = data[3].split(',');


        var deviceCode: any = []
        deviceCode = data[10].split(',');


        for (let index = 0; index < deviceCode.length; index++) {

          var dev: any = []

          dev.deviceCode = deviceCode[index];
          dev.deviceName = devices[index];

          that.deviceTypeList.push(dev);
        }



        that.bindingClientDeviceTable([]);//clear device format

        if (that.userLevel == "1") {
          debugger
          that.modaldeviceConfig.show();
        }
      }
      else if (Index == "6") {
        var data = $(this).parent();
        var table = $('#clientTable').DataTable();
        var data = table.row(data).data();
        debugger
        that.ClientDB = data[9];
        that.c_id = data[7];
        that.siteAdminID = data[8];

        if (that.userLevel == "1") {
          that.OpenModal('update');
        }
        else {
          that.ClientDB = data[9];
          that.openSensorModel(that.ClientDB);
        }
      }
    });

  }

  splitForDate(Validity): any {
    var dateObj = Validity.split(" ");
    return dateObj[0];
  }

  //#region Client Profile

  dateChanged(ev) {

    if (ev.currentTarget.children[0].value == "") {
      ev.currentTarget.children[0].style.borderLeft = "1px solid #f3120e";
    }
    else {
      ev.currentTarget.children[0].style.borderLeft = "1px solid #42A948";
    }
  }
  clientType: string;

  url: any = "";

  uploadLogo: any = "";
  uploadbg: any = "";

  removeImageFromServer: any = ""
  removeLogoFromServer: any = ""


  removebgImageFromServer: any = ""
  removebgFromServer: any = ""

  signUp: any = "";
  Permissions: any = "";

  openSensorModel(clientDB: string) {
    this.ClientService.getClientSensor(clientDB).subscribe(data => {
      debugger
      this.ResponseList = data;

      var data1 = [];

      this.BindingSensorTable([]);

      if (this.ResponseList.SensorDetails.length > 0) {

        var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'


        this.ResponseList.SensorDetails.forEach(element => {
          debugger
          this.sensorTypes
          if (element.type == "Sensor") {

            for (var i = 0; i < this.sensorTypes.length; i++) {
              if (this.sensorTypes[i].SensorType == element.sensorType) {
                element.sensorType = this.sensorTypes[i].SensorName;
              }

            }
          }
          else {
            for (var i = 0; i < this.hubCategories.length; i++) {
              if (this.hubCategories[i].HubCategoryId == element.sensorType) {
                element.sensorType = this.hubCategories[i].HubCategoryName;
              }
            }
          }
          debugger

          if (element.isActive == 1) {
            element.isActive = "Active"
          }
          else {
            element.isActive = "Inactive"
          }

          data1.push([
            element.type,
            element.sensorId,
            element.sensorType,
            element.dateOfDelivery,
            element.onBoarded,
            element.isActive,
            DisplayIcon,
            element.sensorTypeId,
            element.dataFormat
          ]
          )
        });
        debugger
        this.BindingSensorTable(data1);

      }
      else {
        debugger
        this.BindingSensorTable([]);
      }
    });


  }

  getShortCode(event) {
    debugger
    for (let i = 0; i < this.HardwareTypesList.types.length; i++) {
      debugger
      const element = this.HardwareTypesList.types[i];
      if (element.TypeValue == event.SensorName) {
        this.NewSensorid = element.ShortCode
        break
      }
    }
  }

  getHubShortCode(event) {
    debugger
    for (let i = 0; i < this.HardwareTypesList.types.length; i++) {
      debugger
      const element = this.HardwareTypesList.types[i];
      if (element.TypeValue == event.HubCategoryName) {
        this.NewHubid = element.ShortCode
        break
      }
    }
  }

  HardwareTypesList: any = [];

  HWTypeDetails() {
    this.ClientService.getHardwareTypes().subscribe(data => {
      this.HardwareTypesList = data;
    });
  }

  loadHWTypesModel() {
    debugger;
    this.ClientService.getHardwareTypes().subscribe(data => {
      debugger
      this.HardwareTypesList = data;

      var data1 = [];
      if (this.HardwareTypesList.sts == "200") {



        this.sensorNames = [];
        this.HardwareTypesList.sensorTypes.forEach(element => {
          this.sensorNames.push(
            {
              'sensorId': element.sensorId,
              'sensorType': element.sensorType
            }
          );
        });

        this.sensorUoM = [];
        this.HardwareTypesList.sensorUoM.forEach(element => {
          this.sensorUoM.push(
            {
              'uomId': element.uomId,
              'sensorId': element.sensorId,
              'uom': element.uom,
              'symbol': element.symbol,
              'uomsymbol': element.uomsymbol
            }
          );
        });

        //mathFunctions
        this.mathFunctions = [];
        this.HardwareTypesList.mathFunctions.forEach(element => {
          this.mathFunctions.push(
            {
              'mathId': element.mathId,
              'functionName': element.functionName
            }
          );
        });

        debugger
        //sensorIcons
        this.sensorIcons = [];
        this.HardwareTypesList.icons.forEach(element => {

          debugger

          this.sensorIcons.push(
            {
              'IconId': element,
              'IconName': element
            }
          );
        });

        //sensorIcons
        this.sensorStates = [];
        this.HardwareTypesList.sensorState.forEach(element => {

          debugger

          this.sensorStates.push(
            {
              'sensorId': element.sensorId,
              'stateId': element.stateId,
              'stateName': element.state
            }
          );
        });

      }

    });
  }

  openHWTypesModel() {

    debugger;
    this.ClientService.getHardwareTypes().subscribe(data => {
      debugger
      this.HardwareTypesList = data;

      var data1 = [];
      if (this.HardwareTypesList.sts == "200") {

        var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'

        this.HardwareTypesList.types.forEach(element => {

          data1.push([
            element.TypeName,
            element.TypeValue,
            element.ShortCode,
            element.ModelNo,
            element.Vendor,
            element.dataformat,
            DisplayIcon,
            element.OS,
          ])

        });
        debugger
        this.sensorNames = [];
        this.HardwareTypesList.sensorTypes.forEach(element => {
          this.sensorNames.push(
            {
              'sensorId': element.sensorId,
              'sensorType': element.sensorType
            }
          );
        });

        this.sensorUoM = [];
        this.HardwareTypesList.sensorUoM.forEach(element => {
          this.sensorUoM.push(
            {
              'uomId': element.uomId,
              'sensorId': element.sensorId,
              'uom': element.uom,
              'symbol': element.symbol,
              'uomsymbol': element.uomsymbol
            }
          );
        });

        debugger
        this.BindingHWTypesTable(data1);

      }
      else {
        debugger
        this.BindingHWTypesTable([]);
      }
    });


  }

  getUoMByEvent(event) {

    this.getUoM(event.sensorId)
    //this.sensorName = event.sensorType;
  }

  getUoM(sensorId) {

    this.UoM = ""; this.UoMId = "";
    this.sensorUoMFilter = [];
    this.sensorUoMFilter = this.sensorUoM.filter(g => g.sensorId == sensorId);

    if (sensorId == 6) { this.isBoolType = true; }
    else { this.isBoolType = false; }
  }

  getSensorState(sensorId) {
    debugger
    this.sensorStatesFilter = [];
    this.sensorStatesFilter = this.sensorStates.filter(g => g.sensorId == sensorId);
  }

  setUoM(event) {
    this.UoMId = event.symbol;
  }

  saveNewSensorHardwareType(isForm: boolean, obj: any) {
    var result: boolean;

    result = this.validateSensorHardware(obj);
    if (result) {
      debugger
      if (this.HWdisabled) {
        obj.savemode = 'modify';
      }
      else {
        obj.savemode = 'create';
      }


      obj.ShortName = obj.ShortName + '_'
      this.hwType.ShortName = obj.ShortName

      this.ClientService.addHardwaretype(obj).subscribe(result => {
        var data: any;
        data = result;

        if (data.sts == "200") {
          //update sensor types and hub types
          this.isHWTypeSave = true;
          this.sensorTypes = data.SensorTypes;
          this.hubCategories = data.HubCategory;
          //this.hwType = new HWType();
          this.toastr.success("Type added");
          this.IsNewDF = false;
          this.openHWTypesModel();
        }
        else {
          this.toastr.warning(data.msg);
          this.IsNewDF = true;
        }
      });
    }
  }

  validateSensorHardware(obj) {
    debugger

    if (this.isHWNewType) {
      if (obj.HardwareType == "" || obj.HardwareType == undefined || obj.HardwareType == "undefined") {
        this.toastr.warning('Please Select Harware Type');
        return false;
      }
      if (obj.ShortName == "" || obj.ShortName == undefined || obj.ShortName == "undefined") {
        this.toastr.warning('Please Enter Short Name');
        return false;
      }
    }

    if (this.isSensor) {

      if (obj.HardwareName == "" || obj.HardwareName == undefined || obj.HardwareName == "undefined") {
        this.toastr.warning('Please Enter Sensor Name');
        return false;
      }

      // if (obj.UoM == "" || obj.UoM == undefined || obj.UoM == "undefined") {
      //   this.toastr.warning('Please Enter UoM');
      //   return false;
      // }
    }
    else {
      if (obj.HardwareName == "" || obj.HardwareName == undefined || obj.HardwareName == "undefined") {
        this.toastr.warning('Please Enter Hub Name');
        return false;
      }
    }

    return true;

  }

  OpenSensorTypeModal(type: string) {
    debugger
    this.IsNewDF = true;

    if (type == "TypeList") {

      this.openHWTypesModel();

    }
    else
      if (type == "Type") {
        this.addSensor = "New Type";
        this.isHWNewType = true;
        this.HWdisabled = false;
        this.hwType = new HWType();
        this.modaladdSensorHubType.show();
        this.isHWTypeSave = false;
      }
      else
        if (type == "Sensor") {
          debugger
          this.isNewSensor = true;
          this.addSensor = "Add Device";
          this.sensorDetails = new sensorDetails();
          this.NewSensorid = "";
          this.modalSensorType.show();
          this.SensorIDS = [];
        }
        else
          if (type == "Hub") {
            debugger
            this.isNewSensor = true;
            this.addSensor = "Add Hub";
            this.sensorDetails = new sensorDetails();
            this.NewHubid = "";
            this.modalHubType.show();
            this.HubIDS = [];
          }
  }

  OpenModal(status: string) {

    this.loaderService.display(true);
    this.signUp = this.translate.instant("SignUp");
    this.Permissions = this.translate.instant('Permissions')
    this.uploadLogo = "";
    this.removeLogoFromServer = "";
    this.clientProfileobj = new clientProfile();
    this.isDeleteShow = false;
    this.isPermissionShow = false;
    this.isConfirmPasswordShow = false;
    this.disabled = false;
    this.isLogoTextShow = false;
    this.siteAdminID = "";
    this.clientProfileobj.LogoPath = "";
    this.clientProfileobj.IsActive = true;
    this.sensorDetails.IsSensorActive = true;
    this.isCurrectLogo = true;

    this.OfcphoneNo.nativeElement.style.borderLeft = "";
    this.ContactPersonNo.nativeElement.style.borderLeft = "";
    this.ContactPersonMail.nativeElement.style.borderLeft = "";
    var currentDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    this.clientProfileobj.Validity = currentDate;

    this.bgPath = "";
    this.bgCon = false;
    this.bgNotbasedOnValidate = true;
    this.bgbasedOnFileValidate = false;

    this.logoPath = "";
    this.logoCon = false;
    this.NotbasedOnLogoValidate = true;
    this.basedOnLogoFileValidate = false;


    this.AttachamentsLOGO.nativeElement.value = "";

    this.isEdit = true;
    if (status === 'Create') {
      this.isEdit = false;
      this.clientType = this.translate.instant('NewClientProfile');
      this.c_id = "";
      this.clientProfileobj.DefaultMap = 1;
      this.clientProfileobj.countryTimeZone = "";
      this.AttachamentsLOGO.nativeElement.value = "";
    }
    else
      if (status === 'New') {
        this.isEdit = false;
        this.clientType = this.translate.instant('NewClientProfile');
        this.c_id = "0";
        this.clientProfileobj.DefaultMap = 1;
        this.clientProfileobj.countryTimeZone = "";
        this.AttachamentsLOGO.nativeElement.value = "";
      }
    this.SensorIDS = [];
    this.HubIDS = [];

    this.ClientService.getClientProfile(this.c_id, this.ClientDB).subscribe(data => {
      this.loaderService.display(false);
      debugger
      this.uploadLogo = "";
      this.ResponseList = data;
      this.locationList = this.ResponseList.locationDetails;
      this.stateList = this.ResponseList.stateDetails;
      this.Countries = this.ResponseList.Countries;
      this.dateFormat = this.ResponseList.dateFormat;

      this.countryCode = "";
      this.countryCode = this.ResponseList.clientDetails[0].ISDCode;
      this.ClientDB = this.ResponseList.clientDetails[0].Domain;
      this.c_id = this.ResponseList.clientDetails[0].ClientID;

      this.sensorTypes = this.ResponseList.SensorTypes;


      if (this.c_id != "") {//modify
        try {

          this.imageCon = true;
          this.NotbasedOnFileValidate = true;
          this.NotbasedOnLogoValidate = true;
          this.logoCon = true;
          this.bgCon = true;

          this.clientNameColRemove.nativeElement.style.borderLeft = "";

          this.clientType = this.translate.instant('EditClientProfile');
          this.clientProfileobj = this.ResponseList.clientDetails[0];
          this.clientProfileobj.DefaultMap = Number(this.ResponseList.clientDetails[0].DefaultMap);

          debugger

          this.logoPath = this.ResponseList.clientDetails[0].LogoPath = this.ResponseList.clientDetails[0].LogoPath;
          this.bgPath = this.ResponseList.clientDetails[0].bgImagePath = this.ResponseList.clientDetails[0].bgImagePath;


          if (this.logoPath != "") {
            var image = this.logoPath.split("/");
            for (let index = 3; index < image.length; index++) {
              this.uploadLogo += "/" + image[index];
            }
          }
          else {
            this.uploadLogo = "";
          }
          this.removeLogoFromServer = this.uploadLogo;

          if (this.bgPath != "") {
            var image = this.bgPath.split("/");
            for (let index = 3; index < image.length; index++) {
              this.uploadbg += "/" + image[index];
            }
          }
          else {
            this.uploadbg = "";
          }
          this.removebgFromServer = this.uploadbg;

          //this.clientProfileobj.Address3 = Number(this.ResponseList.clientDetails[0].Address3);

          this.getStates_Isd_TimeZone(
            {
              "country": "",
              "countryCode": this.ResponseList.clientDetails[0].ISDCode,
              "countryId": this.ResponseList.clientDetails[0].Address4
            });

          this.clientProfileobj.Address3 = this.ResponseList.clientDetails[0].Address3

          if (this.ResponseList.clientDetails[0].Address3 == "0" || this.ResponseList.clientDetails[0].Address3 == "") {
            this.clientProfileobj.Address3 = null;
          } else {
            this.clientProfileobj.Address3 = this.ResponseList.clientDetails[0].Address3;
          }

          if (this.ResponseList.clientDetails[0].IsActive == "0") {
            this.clientProfileobj.IsActive = false;
          } else {
            this.clientProfileobj.IsActive = true;
          }

          // if (this.ResponseList.clientDetails[0].Validity != "" || this.ResponseList.clientDetails[0].Validity !== undefined) {
          //   this.clientProfileobj.Validity = new Date(this.ResponseList.clientDetails[0].Validity.year,
          //     this.ResponseList.clientDetails[0].Validity.month - 1,
          //     this.ResponseList.clientDetails[0].Validity.day);
          // }
          //this.clientProfileobj.Validity = new Date(datePipe.transform(this.ResponseList.clientDetails[0].Validity, 'dd/MM/yyyy hh:mm:ss a'));

          this.clientProfileobj.Validity = new Date(this.ResponseList.clientDetails[0].Validity);

          if (this.ResponseList.clientDetails[0].SiteId == "") {
            this.isPermissionShow = false;
          } else {
            this.isPermissionShow = true;
          }

          if (this.ResponseList.clientDetails[0].LogoPath == "") {
            this.isLogoTextShow = false;
          } else {
            this.isLogoTextShow = true;
          }
          this.isDeleteShow = true;
          this.siteAdminID = this.ResponseList.clientDetails[0].SiteId;

        } catch (e) {
          this.toastr.warning(e);
        }
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
      this.toastr.warning(error.error.Message);
    });

    this.ModalopenClient.nativeElement.click();
  }

  saveSiteSensor(isForm: boolean, obj: any) {

    debugger;
    var result: boolean = false;
    result = this.checkSensor(obj);
    if (result) {
      obj.clientDB = this.ClientDB;

      if (obj.IsSensorActive !== undefined) {
        if (obj.IsSensorActive == true) {
          obj.IsSensorActive = "1";
        } else {
          obj.IsSensorActive = "0";
        }
      } else {
        obj.IsSensorActive = "0";
      }

      obj.SensorIDS = this.SensorIDS;
      obj.SensorId = this.sensorDetails.SensorId;
      obj.Delivery = this._detailService.dateToDDMMYYYY(this.sensorDetails.Delivery);

      this.ClientService.addSensor(obj).subscribe(result => {
        debugger
        this.ResponseList = result;

        if (this.ResponseList.sts == "200") {
          this.toastr.success(this.ResponseList.msg);

          this.SensorIDS = [];
          this.sensorDetails = new sensorDetails();

          this.openSensorModel(this.ClientDB);
        }
        else {
          this.toastr.warning(this.ResponseList.msg);
        }
      });
    }
  }

  saveSiteHub(isForm: boolean, obj: any) {

    debugger;
    var result: boolean = false;
    result = this.checkSensor(obj);
    if (result) {
      obj.clientDB = this.ClientDB;

      if (obj.IsSensorActive !== undefined) {
        if (obj.IsSensorActive == true) {
          obj.IsSensorActive = "1";
        } else {
          obj.IsSensorActive = "0";
        }
      } else {
        obj.IsSensorActive = "0";
      }

      obj.SensorIDS = this.HubIDS;
      obj.HubId = this.sensorDetails.SensorId;
      obj.Delivery = this._detailService.dateToDDMMYYYY(this.sensorDetails.Delivery);

      this.ClientService.addHub(obj).subscribe(result => {
        debugger
        this.ResponseList = result;

        if (this.ResponseList.sts == "200") {
          this.toastr.success(this.ResponseList.msg);

          this.HubIDS = [];
          this.sensorDetails = new sensorDetails();

          this.openSensorModel(this.ClientDB);
        }
        else {
          this.toastr.warning(this.ResponseList.msg);
        }
      });
    }
  }
  checkSensor(obj) {

    debugger
    if (this.addSensor.indexOf("Hub") >= 0) {
      if (obj.HubCategoryId == "" || obj.HubCategoryId == undefined || obj.SensorId == "HubCategoryId") {
        this.toastr.warning('Please Select HubCategory');
        return false;
      }
      if (this.isNewSensor) {
        if (this.HubIDS.length == 0 || this.HubIDS == undefined || this.HubIDS == "undefined") {
          this.toastr.warning('Please Enter HubId');
          return false;
        }
      }
    }
    else {
      // if (obj.DataFormat == "" || obj.DataFormat == undefined || obj.DataFormat == "undefined") {
      //   this.toastr.warning('Please Enter Data Format');
      //   return false;
      // }
      if (this.isNewSensor) {
        if (this.SensorIDS.length == 0 || this.SensorIDS == undefined || this.SensorIDS == "undefined") {
          this.toastr.warning('Please Enter SensorId');
          return false;
        }
      }
      if (obj.SensorType == "" || obj.SensorType == undefined || obj.SensorType == "undefined") {
        this.toastr.warning('Please select SensorType');
        return false;
      }
    }
    // if (obj.ModelNo == "" || obj.ModelNo == undefined || obj.ModelNo == "undefined") {
    //   this.toastr.warning('Please Enter ModelNo');
    //   return false;
    // }
    // if (obj.Vendor == "" || obj.Vendor == undefined || obj.Vendor == "undefined") {
    //   this.toastr.warning('Please Enter Vendor');
    //   return false;
    // }
    return true;
  }

  saveNewClient(isForm: boolean, obj: any, logoAttachement, bgAttachement) {

    debugger
    //if (isForm) {
    var result: boolean = false;
    result = this.checkValidations(obj);
    if (result) {

      //open progress model
      debugger;

      obj.SensorIds = this.SensorIDS;
      obj.HubIds = this.HubIDS;
      //obj.Address4 = "India";
      //obj.ISDCode = "+91";

      obj.ISDCode = this.countryCode;
      obj.DefaultMap = obj.Address3;
      obj.ClientName = obj.ClientName.trim();
      obj.AliasName = obj.AliasName.trim();

      if (obj.AppName === undefined) {
        obj.AppName = "";
      } else {
        obj.AppName = obj.AppName.trim();
      }
      if (obj.Address === undefined) {
        obj.Address = "";
      } else {
        obj.Address = obj.Address.trim();
      }
      if (obj.Address3 === undefined || obj.Address3 == "Select State" || obj.Address3 == null) {
        obj.Address3 = "";
      } else {
        obj.Address3 = obj.Address3;
      }
      if (obj.ZipCode === undefined) {
        obj.ZipCode = "";
      }
      if (obj.RMNnumber === undefined) {
        obj.RMNnumber = "";
      }
      if (obj.PhoneNumber === undefined) {
        obj.PhoneNumber = "";
      } if (obj.Domain === undefined) {
        obj.Domain = "";
      } else {
        obj.Domain = obj.Domain.trim();
      }
      if (obj.ContactPersonName === undefined) {
        obj.ContactPersonName = "";
      } else {
        obj.ContactPersonName = obj.ContactPersonName.trim();
      }
      if (obj.ContactPersonMobileNo === undefined) {
        obj.ContactPersonMobileNo = "";
      } if (obj.ContactPersonEmail === undefined) {
        obj.ContactPersonEmail = "";
      }

      debugger

      if (obj.LogoPath === undefined) {
        obj.LogoPath = "";
      }
      if (!this.isCurrectLogo) {
        obj.LogoPath = "";
      }

      if (this.c_id != "" && this.c_id != "0") {
        obj.ClientID = this.c_id;
        obj.IOT_SiteId = "";

        obj.SaveMode = "Modify";
      } else {
        obj.ClientID = "";
        obj.SaveMode = "Create";
      }

      if (obj.IsActive !== undefined) {
        if (obj.IsActive == true) {
          obj.IsActive = "1";
        } else {
          obj.IsActive = "0";
        }
      } else {
        obj.IsActive = "0";
      }

      this.saveClientDetails(obj, logoAttachement, bgAttachement);
    }
    // } else {
    //   this.toastr.warning(this.cmnService.MANDATORYMESSAGE);
    // }
  }

  saveClientDetails(obj, logoAttachement, bgAttachement) {

    debugger
    obj.isUploadLogo = this.uploadLogo;
    obj.removeLogo = this.removeLogoFromServer;

    obj.isUploadbg = this.uploadbg;
    obj.removebg = this.removebgFromServer;

    if (obj.SaveMode == "Create") {
      this.domainSts = "In-Progress";
      this.DBNotCreated = true;
      this.AppNotCreated = true;
      this.DomainNotCreated = true;
      this.modalprogress.show();
    }

    this.ClientService.ClientProfile(obj, logoAttachement, bgAttachement).subscribe(result => {
      debugger

      this.ResponseList = result;
      if (this.ResponseList.sts == "200") {
        //this.clientSearch.nativeElement.value = "";


        this.isDeleteShow = true;
        //this.toastr.success(this.ResponseList.Message);
        this.clientProfileobj.ClientID = this.ResponseList.ClientID;// json obj ClientID
        this.clientProfileobj.SiteId = this.ResponseList.SiteAdmindID;// json obj ClientID
        this.c_id = this.ResponseList.ClientID;
        this.siteAdminID = this.ResponseList.SiteAdmindID;
        this.ClientDB = this.ResponseList.ClientDB;

        this.dataTable();

        if (obj.SaveMode == "Create") {
          this.TimerTick();
        }
        else {
          this.toastr.success(this.ResponseList.Message);
        }
      } else {
        this.toastr.warning(this.ResponseList.Message);
      }

    }, error => {
      this.toastr.warning(this.cmnService.ERRORMESSAGE);
    });
  }


  TimerTick() {

    this.timer = Observable.timer(0, 1 * 1000);
    this.sub = this.timer.subscribe(N => this.getTimerData(N));

    // if (this.isTimer) {
    //   this.sub.unsubscribe();
    //   this.isTimer = true;
    //   this.timer = Observable.timer(0, 1 * 1000);
    //   this.sub = this.timer.subscribe(N => this.getTimerData(N));
    // }
    // else {
    //   this.isTimer = true;
    //   this.timer = Observable.timer(0, 1 * 1000);
    //   this.sub = this.timer.subscribe(N => this.getTimerData(N));
    // }

  }

  getTimerData(time) {
    this.chekDomainCreated();
  }

  chekDomainCreated() {
    this.domainSts = "In-Progress";
    this.ClientService.checkDomainCreated(this.ClientDB).subscribe(result => {
      debugger
      this.ResponseList = result;
      if (this.ResponseList.sts == "200") {
        if (this.ResponseList.DBCreated == "1") {
          this.DBCreated = true;
          this.DBNotCreated = false;
        }
        else {
          this.DBCreated = false;
          this.DBNotCreated = true;
        }
        if (this.ResponseList.AppCreated == "1") {
          this.AppCreated = true;
          this.AppNotCreated = false;
        }
        else {
          this.AppCreated = false;
          this.AppNotCreated = true;
        }
        if (this.ResponseList.Domainreated == "1") {
          this.DomainCreated = true;
          this.DomainNotCreated = false;
        }
        else {
          this.DomainCreated = false;
          this.DomainNotCreated = true;
        }

        if (this.DomainCreated) {
          debugger
          this.sub.unsubscribe();
          this.domainSts = "IoT Setup Ready";
          this.modalprogress.hide();
        }
      }

    });
  }


  DeleteClient() {

    debugger

    if (this.siteAdminID == "") {
      // if (confirm("Do you Want to Proceed ?")) {
      Swal({
        title: this.translate.instant('SetUpDoYouProceedAlert'),
        text: "",
        type: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: this.translate.instant('Cancel'),
        confirmButtonText: this.translate.instant('SwalYes'),
        // allowOutsideClick: false,
      }).then((result1) => {
        if (result1.value) {

          this.loaderService.display(true);
          this.ClientService.deleteClientProfile(this.c_id).subscribe(result => {

            this.ResponseList = result;
            if (this.ResponseList.sts == "200") {
              if (this.ResponseList.Status == "Warning") {
                this.toastr.warning(this.ResponseList.Message);
              }
              else {
                this.toastr.success(this.ResponseList.Message);
                this.ModalcloseClient.nativeElement.click();
                this.dataTable();
              }
            } else {
              this.toastr.warning(this.cmnService.ERRORREMOVE);
            }
            this.loaderService.display(false);
          }, error => {
            this.loaderService.display(false);
          });
        }

      })
      //   }

      // } else {
      //   this.loaderService.display(false);
      //   this.toastr.warning(this.translate.instant('CannotRemoveMappedtoEnterpriseuser'));
      // }
    }
    else {
      this.loaderService.display(false);
      this.toastr.warning(this.translate.instant('CannotRemoveMappedtoEnterpriseuser'));
    }
  }

  checkValidations(obj) {

    //debugger
    if (obj.ClientName == "" || obj.ClientName == undefined || obj.ClientName == "undefined") {
      this.toastr.warning(this.translate.instant('PleaseenterClientName'));
      return false;
    }
    else if (obj.ClientName.match(/^[0-9 ]+$/g) || obj.ClientName.match(/^[ ]+$/g)) {
      this.clientProfileobj.ClientName = "";
      this.toastr.warning(this.translate.instant("ClientName") + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }

    else if (!this.cmnService.AcceptFirstChar_REGX.test(obj.ClientName.trim())) {
      this.toastr.warning(this.translate.instant('ClientNameStarts'));
      return false;
    }
    else if (!this.cmnService.nameLengthCheck(obj.ClientName)) {
      this.toastr.warning(this.translate.instant('ClientNameLengthCheck'));
      return false;
    }
    else if (obj.ClientName.startsWith(" ")) {
      this.toastr.warning(this.translate.instant("ClientName") + " " + this.translate.instant("SpacesValidation"));
      return false;
    }
    else if (obj.AliasName === "" || obj.AliasName === undefined || obj.AliasName == null) {
      this.toastr.warning(this.translate.instant('PleaseEnterFriendlyName'));
      return false;
    }
    if (obj.AliasName.match(/^[0-9 ]+$/g) || obj.AliasName.match(/^[ ]+$/g)) {
      this.clientProfileobj.AliasName = "";
      this.toastr.warning(this.translate.instant("FriendlyName") + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (obj.AliasName.match(/^[0-9]+$/g)) {
      this.toastr.warning("Invalid Friendly Name");
      return false;
    }
    else if (!this.cmnService.AcceptFirstChar_REGX.test(obj.AliasName.trim())) {
      this.toastr.warning(this.translate.instant('friendlyNameStars'));
      return false;
    }
    else if (!this.cmnService.nameLengthCheck(obj.AliasName)) {
      this.toastr.warning(this.translate.instant('FriendlyNameLengthCheck'));
      return false;
    }
    else if (obj.AliasName.startsWith(" ")) {
      this.toastr.warning(this.translate.instant("FriendlyName") + " " + this.translate.instant("SpacesValidation"));
      return false;
    }
    // else if (!this.Address_1_2(obj.AppName)) {
    //   this.toastr.warning(this.translate.instant('InvalidAddress1'));
    //   return false;
    // }
    else if (!this.checkSpecialCharactersOfAddress(obj.AppName, 'AppName')) {
      return false;
    }

    else if (!this.checkSpecialCharactersOfAddress(obj.Address, 'Address')) {
      return false;
    }

    // else if (!this.Address_1_2(obj.Address)) {
    //   this.toastr.warning(this.translate.instant('InvalidAddress2'));
    //   return false;
    // }
    else if (obj.Address4 == "" || obj.Address4 == null || obj.Address4 === undefined) {
      this.toastr.warning(this.translate.instant('PleaseSelectCountry'));
      return false;
    }
    // else if (obj.DefaultMap == "" || obj.DefaultMap == null || obj.DefaultMap === undefined) {
    //   this.toastr.warning("Please select Country");
    //   return false;
    // }
    else if (obj.Address3 == "" || obj.Address3 == null || obj.Address3 === undefined) {

      this.toastr.warning(this.translate.instant('PleaseSelectState'));
      return false;
    }
    else if (!this.ZipCodeValidation(obj.ZipCode)) {
      this.toastr.warning(this.translate.instant('ZIPCode'));
      return false;
    }
    else if (!this.contactPersonName(obj)) {
      return false;
    }
    else if (!this.contactPersonEmail(obj)) {
      return false;
    }
    // else if (!this.contactPersonMobileNo(obj)) {
    //   return false;
    // }

    else if (!this.dateValidity(obj)) {
      return false;
    }
    else {
      return true;
    }

  }

  Address_1_2(address): any {
    //  debugger
    var pattern = /^[0-9!@#\$%\^\&*\)\(+=._-]+$/g
    if (address == "" || address == undefined) {
      return true;
    }
    else if (address.match(pattern)) {
      return false;
    }
    else {
      return true;
    }

  }

  ZipCodeValidation(zipCode): any {

    //  debugger
    if (zipCode == "" || zipCode == undefined) {
      return true;
    }
    else if (zipCode.length < 3) {
      return false;
    }
    else {
      return true;
    }
  }



  contactPersonName(obj) {
    // debugger
    if (obj.ContactPersonName != "" && obj.ContactPersonName != undefined) {

      if (obj.ContactPersonName.match(/^[0-9 ]+$/g) || obj.ContactPersonName.match(/^[ ]+$/g)) {
        this.clientProfileobj.ContactPersonName = "";
        this.toastr.warning(this.translate.instant("ContactPersonName") + " " + this.translate.instant("NumericSpacesValidation"));
        return false;
      }
      else if (!this.cmnService.AcceptFirstChar_REGX.test(obj.ContactPersonName.trim())) {
        this.toastr.warning(this.translate.instant('contactPersonStarts'));
        return false;
      }
      else if (!this.cmnService.nameLengthCheck(obj.ContactPersonName)) {
        //  this.toastr.warning("Contact Person " + this.cmnService.nameLengthCheckText);
        this.toastr.warning(this.translate.instant('ContactPersonNameLengthCheck'));
        return false;
      }
      else if (obj.ContactPersonName.startsWith(" ")) {
        this.toastr.warning(this.translate.instant("ContactPersonName") + " " + this.translate.instant("SpacesValidation"));
        return false;
      }
      else {
        return true;
      }
    } else {
      return true;
    }
  }

  contactPersonEmail(obj) {
    //debugger
    if (obj.ContactPersonEmail != "" && obj.ContactPersonEmail !== undefined) {
      if (!this.cmnService.EmailID_REGX.test(obj.ContactPersonEmail)) {
        this.toastr.warning(this.translate.instant('InvalidContactPersonEmailID'));
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  contactPersonMobileNo(obj) {
    // debugger
    if (obj.ContactPersonMobileNo != "" && obj.ContactPersonMobileNo !== undefined) {
      if (!this.cmnService.MOBILE_REGX.test(obj.ContactPersonMobileNo)) {
        // this.toastr.warning("Invalid Contact Person Mobile No.");
        this.toastr.warning(this.translate.instant('InvalidMobileNumber'));
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  dateValidity(obj) {
    // debugger
    var date = obj.Validity;
    if (obj.Validity == "" || obj.Validity == undefined) {
      // this.toastr.warning("PleaseselectValidity");
      this.toastr.warning(this.translate.instant('PleaseselectValidity'));
      return false;
    }
    else {
      try {
        obj.Validity = {
          year: date.getFullYear().toString(),
          month: (date.getMonth() + 1).toString(),
          day: date.getDate().toString()
        };
      } catch (e) {
        e = null;
      }
      return true;
    }
  }

  allowNumericsOnly(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  phoneNumberValidate(event) {
    var keycode = event.which;
    if (!(event.shiftKey == false
      && (keycode == 40 || keycode == 41 || keycode == 45 || keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
      return false;
    }
    return true;
  }
  nameValidation(event) {
    var k = event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
  }

  latLongValidate(event) {

    let current: string = event.target.value;
    let next: string = current.concat(event.key);
    var e = event; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;

    if (next.length == 3) {
      if (charCode == 46)
        return true
      else {
        return false
      }
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      return true;
    }
  }
  //endregion
  //#region Site Admin
  mobileNoResetPwd: any;
  siteDetailsLengthValidation: any;
  GetSiteDetails() {
    debugger
    this.siteadminobj = new SiteAdmin();
    if (this.siteAdminID != "") {

      this.loaderService.display(true);
      this.isPermissionShow = true;
      this.isConfirmPasswordShow = false;
      this.disabled = true;
      this.ClientService.getSiteAdminById(this.siteAdminID, this.ClientDB).subscribe(result => {
        debugger
        this.siteDetailsLengthValidation = result;
        if (this.siteDetailsLengthValidation.length != 0) {

          this.siteadminobj = result[0]
          this.mobileNoResetPwd = result[0].mobileNumber
          if (result[0].isDefaultPasswordChanged == "true" || result[0].isDefaultPasswordChanged == true) {
            this.isResetPasswordShow = true;
          } else {
            this.isResetPasswordShow = false;
          }
          this.loaderService.display(false);
          this.signUpModal.show()
        }



      }, error => {
        this.loaderService.display(false);
      });
    }
    else {

      this.signUpModal.show();
      this.isPermissionShow = false;
      this.isConfirmPasswordShow = true;
      this.isResetPasswordShow = false;
      this.siteadminobj = new SiteAdmin();
      this.disabled = false;
    }
  }

  // saveSiteAccess(isForm: boolean, siteadminobj: any) {
  //   debugger
  //   siteadminobj.clientID = this.c_id;
  //   siteadminobj.iotSiteID = "";
  //   siteadminobj.iotUserID = "";
  //   if (this.siteAdminID == "") {
  //     siteadminobj.siteAdminID = "";
  //     siteadminobj.SaveMode = "Create";
  //   } else {
  //     siteadminobj.siteAdminID = this.siteAdminID;
  //     siteadminobj.SaveMode = "Modify";
  //   }

  //   siteadminobj.mailId = siteadminobj.userName;

  //   if (siteadminobj.name == "" || siteadminobj.name === undefined) {
  //     this.toastr.warning(this.translate.instant("PleaseEnterName"));
  //     return false;
  //   }
  //   if (siteadminobj.userName == "" || siteadminobj.userName === undefined) {
  //     this.toastr.warning(this.translate.instant('PleaseEnterEmail'));
  //     return false;
  //   }

  //   if (siteadminobj.SaveMode == "Create") {

  //     if (siteadminobj.mobileNumber == "" || siteadminobj.mobileNumber === undefined) {
  //       this.toastr.warning(this.translate.instant('PleaseenterMobileNo'));
  //       return false;
  //     }
  //     if (siteadminobj.password == "" || siteadminobj.password === undefined) {
  //       this.toastr.warning(this.translate.instant('PleaseEnterPassword'));
  //       return false;
  //     }
  //     if (siteadminobj.password && !String(siteadminobj.password).match(this.cmnService.STRONGPSWD_REGX)) {
  //       this.toastr.warning(this.translate.instant('PleaseEnterValidPassword'));
  //       return false;
  //     }
  //     if (siteadminobj.ConfirmPassword == "" || siteadminobj.ConfirmPassword == undefined) {
  //       this.toastr.warning(this.translate.instant('ReEnterPassword'));
  //       return false;
  //     }
  //     if (siteadminobj.password != siteadminobj.ConfirmPassword) {
  //       this.toastr.warning(this.translate.instant('PasswordisMisMatch'));
  //       return false;
  //     }
  //   }

  //   if (!this.cmnService.EmailID_REGX.test(siteadminobj.mailId)) {
  //     this.toastr.warning(this.translate.instant('InvalidEmailID'));
  //     return false;
  //   }

  //   if (siteadminobj.mobileNumber == "" || siteadminobj.mobileNumber === undefined) {
  //     this.toastr.warning(this.translate.instant('PleaseEnterValidMobileNo'));
  //     return false;
  //   }
  //   if (!this.cmnService.MOBILE_REGX.test(siteadminobj.mobileNumber)) {
  //     this.toastr.warning(this.translate.instant('InvalidMobileNumber'));
  //     return false;
  //   }

  //   siteadminobj.iotUserID = "";
  //   this.saveSiteDetails(siteadminobj);
  // }

  booleanSiteFlag: boolean = false;
  saveSiteAccess(isForm: boolean, siteadminobj: any) {
    //debugger
    this.booleanSiteFlag = this.saveSiteAccessValidation(siteadminobj);
    if (this.booleanSiteFlag) {
      siteadminobj.clientID = this.c_id;
      siteadminobj.clientDB = this.ClientDB;
      siteadminobj.iotSiteID = "";
      siteadminobj.iotUserID = "";
      if (this.siteAdminID == "") {
        siteadminobj.siteAdminID = "";
        siteadminobj.SaveMode = "Create";
      } else {
        siteadminobj.siteAdminID = this.siteAdminID;
        siteadminobj.SaveMode = "Modify";
      }
      siteadminobj.mailId = siteadminobj.userName;
      siteadminobj.iotUserID = "";
      this.saveSiteDetails(siteadminobj);
    }
  }


  saveSiteAccessValidation(siteadminobj): any {

    // debugger
    if (siteadminobj.name == "" || siteadminobj.name === undefined) {
      this.toastr.warning(this.translate.instant("PleaseEnterName"));
      return false;
    }

    else if (siteadminobj.name.match(/^[0-9 ]+$/g) || siteadminobj.name.match(/^[ ]+$/g)) {
      this.siteadminobj.name = "";
      this.toastr.warning(this.translate.instant("Name") + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (!this.cmnService.AcceptFirstChar_REGX.test(siteadminobj.name.trim())) {
      this.toastr.warning(this.translate.instant('nameStarts'));
      return false;
    }
    else if (siteadminobj.name.startsWith(" ")) {
      this.toastr.warning(this.translate.instant("Name") + " " + this.translate.instant("SpacesValidation"));
      return false;
    }
    else if (siteadminobj.userName == "" || siteadminobj.userName === undefined) {
      this.toastr.warning(this.translate.instant('PleaseEnterEmail'));
      return false;
    }
    else if (!this.cmnService.EmailID_REGX.test(siteadminobj.userName)) {
      this.toastr.warning(this.translate.instant('InvalidEmailID'));
      return false;
    }
    else if (siteadminobj.mobileNumber == "" || siteadminobj.mobileNumber === undefined) {
      this.toastr.warning(this.translate.instant('PleaseenterMobileNo'));
      return false;
    }
    // else if (!this.cmnService.MOBILE_REGX.test(siteadminobj.mobileNumber)) {
    //   this.toastr.warning(this.translate.instant('InvalidMobileNumber'));
    //   return false;
    // }
    else if (!this.siteAccessPasswordValidation(siteadminobj)) {
      return false;
    }
    else if (!this.siteAccessReenterPasswordValidtion(siteadminobj)) {
      return false;
    }
    else {
      return true;
    }
  }

  siteAccessPasswordValidation(siteadminobj): any {
    // debugger
    if (this.isConfirmPasswordShow) {
      if (siteadminobj.password == "" || siteadminobj.password === undefined) {
        this.toastr.warning(this.translate.instant('PleaseEnterPassword'));
        return false;
      }
      else if (siteadminobj.password && !String(siteadminobj.password).match(this.cmnService.STRONGPSWD_REGX)) {
        this.toastr.warning(this.translate.instant('PleaseEnterValidPassword'));
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  siteAccessReenterPasswordValidtion(siteadminobj): any {
    // debugger
    if (this.isConfirmPasswordShow) {
      if (siteadminobj.ConfirmPassword == "" || siteadminobj.ConfirmPassword == undefined) {
        this.toastr.warning(this.translate.instant('ReEnterPasswordToaster'));
        return false;
      }
      else if (siteadminobj.password != siteadminobj.ConfirmPassword) {
        this.toastr.warning(this.translate.instant('PasswordisMisMatch'));
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }
  saveSiteDetails(obj) {

    this.loaderService.display(true);
    this.ClientService.saveSiteAdmin(obj).subscribe(result => {
      this.ResponseList = result;
      if (this.ResponseList.sts == "200") {
        if (this.siteAdminID === undefined || this.siteAdminID == "") {
          this.isPermissionShow = true;
        }
        this.siteAdminID = this.ResponseList.SiteAdminID;
        this.toastr.success(this.ResponseList.Status);

        this.signUpModal.hide();
      } else {
        this.loaderService.display(false);
        this.toastr.warning(this.ResponseList.Status);
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
      this.toastr.warning(this.cmnService.ERRORMESSAGE);
    });
  }

  //endregion

  //#region Reset Password 

  saveResetPwd(isvalid: boolean, obj) {

    //if (isvalid) {
    obj.password = obj.ResetPassword;
    obj.ConfirmPassword = obj.ResetConfirmPassword;
    if (obj.password == "" || obj.password == undefined) {
      // this.toastr.warning("PleaseEnterPassword");
      this.toastr.warning(this.translate.instant('PleaseEnterPassword'));
      return false;
    }
    if (obj.password && !String(obj.password).match(this.cmnService.STRONGPSWD_REGX)) {
      // this.toastr.warning("PleaseEnterValidPassword");
      this.toastr.warning(this.translate.instant('PleaseEnterValidPassword'));
      return false;
    }
    if (obj.ConfirmPassword == "" || obj.ConfirmPassword == undefined) {
      // this.toastr.warning("Please Re-Enter Password");
      this.toastr.warning(this.translate.instant('ReEnterPasswordToaster'));
      return false;
    }
    if (obj.password != obj.ConfirmPassword) {
      // this.toastr.warning("Password is MisMatch");
      this.toastr.warning(this.translate.instant('PasswordisMisMatch'));
      return false;
    }

    obj.ConfirmPassword = "";
    obj.siteAdminID = this.siteAdminID;
    obj.SaveMode = "Modify";
    obj.mobileNumber = this.mobileNoResetPwd
    this.ClientService.saveSiteAdmin(obj).subscribe(result => {

      obj.mobileNumber = " ";
      this.ResponseList = result;
      if (this.ResponseList.sts == "200") {
        this.toastr.success(this.ResponseList.Status);
      } else {
        this.toastr.warning(this.cmnService.ERRORMESSAGE);
      }
    });
    // } else {
    //   this.toastr.warning(this.cmnService.MANDATORYMESSAGE);
    // }
  }

  //endregion

  //#region Permissions 
  GetPermissions() {

    this.loaderService.display(true);
    this.resultedMenu = [];
    this.childresultedMenu = [];
    this.items = [];
    this.SelectedFeatureIds = [];
    this.itemArray = [];
    this.defaultFeatureId = "";
    this.dropDownSourceList = [];
    this.filterDropDownSourceList = [];
    this.defaultDrpList = [];
    this.selectedDefaultDrp = new SelectedDefaultDrp();

    debugger
    this.ClientService.getAccess(this.c_id, this.siteAdminID, this.ClientDB).subscribe(result => {

      this.itemArray = result;
      //   console.log(this.itemArray);

      this.childresultedMenu = [];
      this.itemArray.siteFeatures.forEach(element => {

        try {

          /*creating childrens*/

          try {
            this.childmenuItem = new TreeviewItem({
              text: element.text, value: element.value, checked: element.Checked
            })
            this.childresultedMenu.push(this.childmenuItem);


            this.selectedDefaultDrp = {
              id: '',
              name: '',
              disabled: false
            };
            if (element.Checked) {
              this.selectedDefaultDrp.disabled = false;
            }
            else {
              this.selectedDefaultDrp.disabled = true;
            }
            this.selectedDefaultDrp.id = element.value;
            this.selectedDefaultDrp.name = element.text;
            this.dropDownSourceList.push(this.selectedDefaultDrp);

          } catch (e) {
            this.toastr.warning(e);
          }


          // /*creating TreeviewItem*/
          // this.menuItem = new TreeviewItem({
          //   text: element.text, value: element.value, children: this.childresultedMenu
          // });

          /*adding TreeviewItem to array*/
          //this.resultedMenu.push(this.menuItem);

        } catch (e) {
          //alert(e);
          this.toastr.warning(e);
        }
      });
      this.defaultFeatureId = this.itemArray.defaultFeatureID;
      this.items = this.childresultedMenu;// this.resultedMenu;
      this.defaultDrpList = this.dropDownSourceList;
      this.loaderService.display(false);
      this.modalPermissions.show();
    }, error => {
      this.loaderService.display(false);
      // this.toastr.warning("MenusareNotAvaiableForThisSiteIdandClientId");
      this.toastr.warning(this.translate.instant('MenusareNotAvaiableForThisSiteIdandClientId'));
      //this.modalPermissions.show();
    });
  }

  onSelectedChange(event) {
    this.SelectedFeatureIds = event;
    this.filterDropdownListData(this.SelectedFeatureIds)
  }

  savePermissions() {
    if (this.SelectedFeatureIds === undefined || this.SelectedFeatureIds.length == 0) {
      // this.toastr.warning("SelectPermissions");
      this.toastr.warning(this.translate.instant('SelectPermissions'));
    }
    else if (this.defaultFeatureId === undefined || this.defaultFeatureId == null || this.defaultFeatureId == "") {
      // this.toastr.warning("SelectHomePage");
      this.toastr.warning(this.translate.instant('SelectHomePage'));
    }
    else {
      var fetureids: string = "";
      this.SelectedFeatureIds.forEach(element => {
        fetureids += element + ",";
      });

      this.loaderService.display(true);
      this.ClientService.AssignPermissions(this.c_id, this.siteAdminID, fetureids, this.defaultFeatureId, this.ClientDB).subscribe(result => {

        this.ResponseList = result;
        if (this.ResponseList.sts == "200") {
          this.loaderService.display(false);
          this.toastr.success(this.ResponseList.Message);
          this.modalPermissions.hide();
        } else {
          this.loaderService.display(false);
          this.toastr.success(this.cmnService.ERRORMESSAGE);
        }
        this.loaderService.display(false);
      }, error => {
        this.toastr.warning(error.error.Message);
      });

    }
  }

  filterDropdownListData(dropobj: any) {
    this.defaultDrpList = [];
    this.filterDropDownSourceList = [];
    this.dropDownSourceList.forEach(element => {
      dropobj.forEach(ele => {
        if (ele == element.id) {
          element.disabled = false;
          this.filterDropDownSourceList.push(element);
        }
      });
    });

    this.defaultDrpList = this.filterDropDownSourceList;
    var isSelected = false;
    this.defaultDrpList.forEach(element => {
      if (this.defaultFeatureId == element.id) {
        isSelected = true;
      }
    });

    if (!isSelected) {
      this.defaultFeatureId = null;
    }
  }


  fileUploadValidate(event) {

    // debugger;
    this.basedOnFileValidate = true;
    this.NotbasedOnFileValidate = false;
    var totalSize = 0;
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.srcElement.files.length; i++) {
        totalSize += event.srcElement.files[i].size;
      }
      //firefox
      // for (let i = 0; i < event.target.files.length; i++) {
      //   totalSize += event.target.files[i].size;
      // }

      for (let i = 0; i < event.srcElement.files.length; i++) {
        var Extension = event.srcElement.files[i].type;
        if (Extension == "image/png" || Extension == "image/jpeg" || Extension == "image/jpg") {
          if (totalSize <= 50000) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
              $("#DisplayImage").attr('src', (<FileReader>event.target).result);
            };
          }
          else {
            this.toastr.warning(this.translate.instant('UploadProfilePicSizeShouldBeLessThanOrEqualTo50Kb'));
            this.basedOnFileValidate = false;
            this.NotbasedOnFileValidate = true;
            event.srcElement.value = "";
            return false;
          }
        } else {

          //this.toastr.warning("Only allows file types of JPG,PNG,JPEG");
          this.toastr.warning(this.translate.instant("ValidFileupload"));
          event.srcElement.value = "";
          this.basedOnFileValidate = false;
          this.NotbasedOnFileValidate = true;
          return false;
        }
      }

    }
    else {
      this.basedOnFileValidate = false;
      this.NotbasedOnFileValidate = true;
    }
  }

  NotbasedOnLogoValidate: boolean = false;
  logoCon: boolean = false;
  logoPath: any = "";
  basedOnLogoFileValidate: boolean = false;

  bgNotbasedOnValidate: boolean = false;
  bgCon: boolean = false;
  bgPath: any = "";
  bgbasedOnFileValidate: boolean = false;

  logoUpload(event) {

    //   debugger

    this.basedOnLogoFileValidate = true;
    this.NotbasedOnLogoValidate = false;
    var totalSize = 0;
    if (event.target.files && event.target.files[0]) {

      for (let i = 0; i < event.srcElement.files.length; i++) {
        totalSize += event.srcElement.files[i].size;
      }

      for (let i = 0; i < event.srcElement.files.length; i++) {
        var Extension = event.srcElement.files[i].type;

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

  bgUpload(event) {

    //   debugger

    this.bgbasedOnFileValidate = true;
    this.bgNotbasedOnValidate = false;
    var totalSize = 0;
    if (event.target.files && event.target.files[0]) {

      for (let i = 0; i < event.srcElement.files.length; i++) {
        totalSize += event.srcElement.files[i].size;
      }

      for (let i = 0; i < event.srcElement.files.length; i++) {
        var Extension = event.srcElement.files[i].type;

        if (Extension == "image/png" || Extension == "image/jpeg" || Extension == "image/jpg") {

          if (totalSize <= 50000) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
              $("#DisplaybgImage").attr('src', (<FileReader>event.target).result);
            };
          }
          else {
            this.toastr.warning("Upload Image should be < 50Kb");//this.translate.instant('UploadLogoSizeShouldBeLessThanOrEqualTo50Kb'));
            this.bgbasedOnFileValidate = false;
            this.bgNotbasedOnValidate = true;
            event.srcElement.value = "";
            return false;
          }
        }
        else {
          // this.toastr.warning("Only allows file types of JPG,PNG,JPEG");
          this.toastr.warning(this.translate.instant("ValidFileupload"));
          event.srcElement.value = "";
          this.bgbasedOnFileValidate = false;
          this.bgNotbasedOnValidate = true;
          return false;
        }
      }
    }
    else {
      this.bgbasedOnFileValidate = false;
      this.bgNotbasedOnValidate = true;
    }
  }

  getStates_Isd_TimeZone(event) {
    debugger
    if (event.country != "") {
      this.clientProfileobj.Address3 = null;
    }
    this.countryCode = event.countryCode;
    this.ClientService.getStates_TimeZone(event.countryId).subscribe(result => {
      debugger
      this.states_TimeZone = result;
      this.stateList = this.states_TimeZone.states;
      this.clientProfileobj.countryTimeZone = this.states_TimeZone.timeZone;
    });
  }

  getHarwareType(event) {
    if (event.HardwareName == "Device Type") {
      this.isSensor = true;
      this.isHub = false;
    }
    else
      if (event.HardwareName == "HubType") {
        this.isHub = true;
        this.isSensor = false;
      }
  }

  removeImage() {
    //debugger
    if (this.AttachmenImage.nativeElement.value != "") {
      this.AttachmenImage.nativeElement.value = ""
    }
    this.imageCon = false;
    this.basedOnFileValidate = false;
    this.NotbasedOnFileValidate = true;
  }

  removeLogo() {
    //debugger
    if (this.AttachamentsLOGO.nativeElement.value != "") {
      this.AttachamentsLOGO.nativeElement.value = ""
    }
    this.logoCon = false;
    this.removeLogoFromServer = this.uploadLogo;
    this.uploadLogo = "";
    this.basedOnLogoFileValidate = false;
    this.NotbasedOnLogoValidate = true;
  }

  removebg() {
    //debugger
    if (this.Attachamentsbg.nativeElement.value != "") {
      this.Attachamentsbg.nativeElement.value = ""
    }
    this.bgCon = false;
    this.removebgFromServer = this.uploadbg;
    this.uploadbg = "";
    this.bgbasedOnFileValidate = false;
    this.bgNotbasedOnValidate = true;
  }

  pasteBooleanFlag: boolean = false;
  pasteName(event: any, name) {
    this.pasteBooleanFlag = this.cmnService.pasteEvent(event, name);
    if (!this.pasteBooleanFlag) {
      return false;
    }
  }

  spacesCheckedForClientName(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.clientProfileobj.ClientName = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }
  spacesCheckedForFriendly(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.clientProfileobj.AliasName = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }
  spacesCheckedContactPerson(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.clientProfileobj.ContactPersonName = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }
  spacesCheckedForName(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.siteadminobj.name = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }
  //saveSiteAccessValidation
  pasteMobileNo(event, name) {
    if (!event.match(/^[0-9]+$/g)) {
      // this.toastr.warning(this.translate.instant(name) + " " + "Shoud be Numeric");
      this.toastr.warning(this.translate.instant(name) + " " +
        this.translate.instant("TrNumericValidation"));
      return false;
    }
    else {
      return true;
    }
  }

  NewHubid: any;
  HUBId: any = {};

  IdFrom: number;
  IdTo: number;
  IdLength: number;

  addHubID() {  // to add mobile number

    debugger

    this.EnterContact = 'Invalid Hub Id';
    this.InvalidContact = this.translate.instant('InvalidContact')
    this.contactExist = 'Hub Id Already Exists';
    //var MobileNo_regx = /^[0]?[6789]\d{9}$/;


    if (this.NewHubid == "" || this.NewHubid == undefined) {
      this.toastr.warning(this.EnterContact);
      return false;
    }


    this.HUBId = {};
    this.HUBId.hubid = this.NewHubid + this.sensorDetails.HubId;

    this.HubIDS.push(this.HUBId);
    debugger


    debugger
    // this.HUBId.hubid = this.NewHubid

    if (this.HubIDS.length == 0) {
      this.HubIDS.push(this.HUBId);
      this.NewHubid = "";
      this.HUBId = {};
    }
    // this.mobileNo = "";
    // this.Mobiles = {};
  }

  NewSensorid: any;
  sensors: any = {};
  addSensorID() {  // to add sensorIds

    debugger

    this.EnterContact = this.translate.instant('EnterSensorId')
    this.InvalidContact = this.translate.instant('InvalidSensorId')
    this.contactExist = this.translate.instant('SensorIdExist')
    //var MobileNo_regx = /^[0]?[6789]\d{9}$/;

    if (this.NewSensorid == "" || this.NewSensorid == undefined) {
      this.toastr.warning(this.EnterContact);
      return false;
    }

    this.sensors = {};

    this.sensors.sensorid = this.NewSensorid + this.sensorDetails.SensorId;

    this.SensorIDS.push(this.sensors);
    debugger

    if (this.SensorIDS.length == 0) {
      this.SensorIDS.push(this.sensors);
      this.NewSensorid = "";
      this.sensors = {};
    }

  }


  // deleteSensorId(i1)  for to delete sms numbers from Arrays
  deleteSensorId(i1) {

    for (let i = 0; i < this.SensorIDS.length; ++i) {
      if (i1 === i) {
        this.SensorIDS.splice(i1, 1);

      }
    }
  }

  deleteHubId(i1) {

    for (let i = 0; i < this.HubIDS.length; ++i) {
      if (i1 === i) {
        this.HubIDS.splice(i1, 1);

      }
    }
  }

  checkSpecialCharactersOfAddress(event, Address): any {
    // debugger
    var regex = /^[-!$%^&*()_+|~=`{}[:;<>?,.@\\#"'/ \]]+$/g;

    if (event != "" && event != undefined) {
      if (regex.test(event)) {
        if (Address == "AppName") {
          this.clientProfileobj.AppName = "";
        }
        else {
          this.clientProfileobj.Address = "";
        }
        this.toastr.warning(this.translate.instant(Address) + " " + this.translate.instant('address1Alphanumarics'))
        return false;
      }
      else if (event.startsWith(" ")) {
        if (Address == "AppName") {
          this.toastr.warning(this.translate.instant("AppName") + " " + this.translate.instant("SpacesValidation"));
        }
        else {
          this.toastr.warning(this.translate.instant("Address") + " " + this.translate.instant("SpacesValidation"));
        }
        return false;
      }
      else {
        return true
      }
    }
    else {
      return true;
    }
    //  if ( regex.test(event.target.value)) {
    //     if (Address == "AppName") {
    //       this.clientProfileobj.AppName = "";
    //     }
    //     else {
    //       this.clientProfileobj.Address = "";
    //     }
    //     this.toastr.warning(this.translate.instant(Address) + " " + this.translate.instant('address1Alphanumarics'))
    //     return false;
    //   }


  }

}

export class SelectedDefaultDrp {
  public id: string;
  public name: string;
  public disabled: boolean
}
