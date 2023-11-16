import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RulesManagementService } from './service/service';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import { forEach } from '@angular/router/src/utils/collection';
import { DeviceDataService } from '../../GlobalServices/devicedata.service';
import { filter } from 'rxjs-compat/operator/filter';
import Swal from 'sweetalert2'
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-rules-management',
  templateUrl: './rules-management.component.html',
  styleUrls: ['./rules-management.component.css']
})
export class RulesManagementComponent implements OnInit {


  @ViewChild('modalRule') modalRule: any;
  constructor(
    private toastr: ToastrService,
    private ruleService: RulesManagementService,
    private cmnService: IdeaBService, private _loaderService: LoaderService,
    private _devicedataservice: DeviceDataService,
  ) { }

  hasSetPoint: boolean = false;
  RuleType: string;

  isRuleEdit: boolean = false;
  disabled: boolean = false;
  isDeleteShow: boolean = false;
  isGreen: boolean = false;
  isBlue: boolean = false;
  isOrng: boolean = false;
  isRed: boolean = false;
  isNTms: boolean = false;
  isEnergy: boolean = false;
  isNTms2: boolean = false;
  isTms: boolean = false;
  isBool: boolean = false;
  isBool2: boolean = false;
  showRange: boolean = false;
  showRange2: boolean = false;
  conOprFirst: any;
  conOprSecond: any;
  isActive: boolean = false;
  checked: boolean;
  Escalate: boolean = false;
  ruleId: string = "";
  loginId: string;
  pHMinVal1: string = "";
  pHMinVal2: string = "";
  devices: any = "";
  dataFormat: any = "";
  // dataFormat2: any = "";
  dataFormat2Filtered: any = ""
  assignmentOpr: any = "";
  conditionalOpr: any = "";
  mode: any = "";
  responseData: any = [];
  ruleMt = new ruleMgnt();
  format = new Format();
  format2 = new Format2();

  clientRegions: any = []
  selectedRegion: any = []
  CRSelectedRegion: any = []

  selectHW: any = "";
  com = new combi();
  assignOpr = new AssignOpr();
  states: any = "";
  state: string = "";
  buffMins: any = "";
  bufferMin: any = [];
  colorCode: string = "";
  MinValue: string = "";
  MaxValue: string = "";

  MinValue2: string = "";
  MaxValue2: string = "";

  ReportTime: string = "";

  boolVals: any = [];
  setBool: string = "";
  setBool2: string = "";

  OpenOrCloseTime: string = "";
  OpenOrCloseTime2: string = "";

  conOpr: any = "";
  combi: boolean = false;
  bgImage: any;

  userHwTypes: any;
  cummPeriod: any;
  cummId: any;
  userDevices: any = []
  userDevicesByLocation: any = []

  ngOnInit() {

    sessionStorage.setItem('liveScreen', "rule");
    this.bgImage = sessionStorage.getItem('BGimage');

    this.RuleType = "New Rule";

    this.loginId = this.cmnService.getLoginUserID();
    this.loadRules()

    this.isTms = false;
    this.isNTms = true;
    this.isNTms2 = true;
    this.isBool = false;
    this.isBool2 = false;
    this.Escalate = true;
    this.isActive = true;

    this.pHMinVal1 = "Value";
    this.pHMinVal2 = "Value";

    this.regexForDecimal = new RegExp(/^-?\d*\.?\d*$/);

    this.hasSetPoint = false;

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

    this.buffMins = [];

    this.buffMins.push({
      minId: -1,
      min: "Immediate"
    }, {
      minId: 5,
      min: "5 Mins"
    },
      {
        minId: 10,
        min: "10 Mins"
      },
      {
        minId: 15,
        min: "15 Mins"
      },
      {
        minId: 30,
        min: "30 Mins"
      },
      {
        minId: 60,
        min: "1 Hr"
      })

    this.cummPeriod = [];
    var cumm: any;

    cumm = {};
    cumm.id = "30";
    cumm.name = "30 mins";

    this.cummPeriod.push(cumm);

    cumm = {};
    cumm.id = "60";
    cumm.name = "1 Hr";

    this.cummPeriod.push(cumm);

    cumm = {};
    cumm.id = "120";
    cumm.name = "2 Hrs";

    this.cummPeriod.push(cumm);

    //this.showDiv('defaultRules');

    //this.getUserDevices();
  }

  getUserDevices() {
    var devs: any;

    devs = []
    devs = JSON.parse(sessionStorage.getItem("USER_DEVICES"));


    var cRegions: any = []
    cRegions = JSON.parse(sessionStorage.getItem('Regions'));

    this.clientRegions = []
    this.selectedRegion = []

    cRegions.forEach(cR => {

      devs.forEach(dev => {
        if (dev.regionId.toLowerCase() == cR.regionId.toLowerCase()) {
          var regCnt = this.clientRegions.filter(r => r.regionId.toLowerCase() == cR.regionId.toLowerCase());

          if (regCnt.length == 0) {

            var dR = cRegions.filter(r => r.regionId.toLowerCase() == cR.regionId.toLowerCase());

            this.clientRegions.push({
              regionId: dR[0].regionId,
              regionName: dR[0].regionName,
              regionLat: dR[0].regionLat,
              regionLng: dR[0].regionLng
            })
          }
        }

      });




    });



    var dataList: any = []

    this.userDevices = []

    devs.forEach(element => {

      dataList.push(
        {
          deviceId: element.sensorId,
          deviceName: element.deviceName,
          regionId: element.regionId
        }
      )
    });

    this.userDevices = dataList
    this.userDevicesByLocation = this.userDevices;
  }

  changeRegion() {

    debugger
    if (this.selectedRegion != null && this.selectedRegion != undefined) {


      this.userDevicesByLocation = this.userDevices.filter(r => r.regionId == this.selectedRegion);

    }
    else {
      this.getUserDevices()
    }
  }
  selectedRegionRules: any;
  changeRegionRule() {
    this.loadRules();
    //this.processloadRules(this.responseData);
  }
  changeRegionCR() {


    if (this.CRSelectedRegion != null && this.CRSelectedRegion != undefined) {


      this.getDevices();

      this.devices = this.devices.filter(r => r.regionId == this.CRSelectedRegion);

    }
    else {

      this.getDevices()
    }
  }


  defaultSensorRules: any
  _deviceName: any

  getDefaultRules(deviceId) {

    var dv = this.userDevices.filter(g => g.deviceId == deviceId)

    this._deviceName = dv[0].deviceName;

    var obj: any = {}

    obj.deviceId = deviceId;

    this.defaultSensorRules = []

    var resp: any
    this._loaderService.display(true);

    this.ruleService.getDefaultRules(obj).subscribe(data => {
      resp = data;
      this._loaderService.display(false);

      resp.details.forEach(sn => {
        this.defaultSensorRules.push({
          "sensorName": sn.sensorName + ' ' + sn.uom,
          "min": sn.sMin,
          "max": sn.sMax,
          "tolerance": sn.sTolerance,
          "deviceId": deviceId,
          "sensor": sn.sensorName,
          "sensorKey": sn.sensorKey
        });
      });


    })
  }

  regexForDecimal: any;


  createRule(sensorDefault: any) {


    var obj: any = {}

    obj.deviceId = sensorDefault.deviceId;
    obj.shortCode = sensorDefault.deviceId.split('_')[0] + '_';
    obj.sensor = sensorDefault.sensorKey;
    obj.minVal = sensorDefault.min;
    obj.maxVal = sensorDefault.max;
    obj.tolerance = sensorDefault.tolerance;

    var valid: boolean = false

    debugger

    if (this.regexForDecimal.test(sensorDefault.min) && sensorDefault.min) {
      valid = true;
    }
    else {
      valid = false;
      this.toastr.warning('Invalid Minimum value');
    }

    if (valid) {
      if (this.regexForDecimal.test(sensorDefault.max) && sensorDefault.max) {
        valid = true;
      }
      else {
        valid = false;
        this.toastr.warning('Invalid Maximum value');
      }
    }

    if (valid) {
      if (this.regexForDecimal.test(sensorDefault.tolerance) && sensorDefault.tolerance) {
        valid = true;
      }
      else {
        valid = false;
        this.toastr.warning('Invalid Tolerance value');
      }
    }

    if (valid) {
      if ((Number(obj.maxVal) - Number(obj.minVal)) / 2 > Number(obj.tolerance)) {

        var resp: any
        this._loaderService.display(true);

        this.ruleService.createRuleFromDefaultRules(obj).subscribe(data => {
          this._loaderService.display(false);
          resp = data;
          debugger
          if (resp.sts == "200") {
            this.toastr.success(resp.msg)


            this.formatLogAndUpdateDefultRule(obj, false);
            this.loadRules();
          }
          else {
            this.toastr.warning(resp.msg)
          }

        })
      }
      else {
        this.toastr.warning('Please check the Tolerance');
      }

      // this.toastr.success(sensorDefault)
    }
  }

  checkForRange(event: any) {
    //
    if (event.Operator == "Between") {
      this.showRange = true;

      this.pHMinVal1 = "Min Value";
    }
    else {
      this.showRange = false;
      this.MaxValue = "";
      this.pHMinVal1 = "Value";
    }
  }

  checkForRange2(event: any) {
    //
    if (event.Operator == "Between") {
      this.showRange2 = true;
      this.pHMinVal2 = "Min Value";
    }
    else {
      this.showRange2 = false;
      this.MaxValue2 = "";
      this.pHMinVal2 = "Value";
    }
  }

  sensor1Name: any = ""
  sensor2Name: any = ""

  getRule(ruleId: string) {

    //
    this.showEditRules = false;
    this.showRules = true;
    this.showDefaultRules = false;
    this.showRange = false;
    this.showRange2 = false;
    this.isRed = false;
    this.isGreen = false;
    this.isOrng = false;
    this.isBlue = false;
    this.combi = false;
    this.isEnergy = false;
    this.format = new Format();
    this.format2 = new Format2();
    this.ruleMt = new ruleMgnt();
    this.MinValue = "";
    this.MaxValue = "";
    this.MinValue2 = "";
    this.MaxValue2 = "";
    this.state = "";
    this.isActive = true;
    this.isBool = false;
    this.isBool2 = false;
    this.isTms = false;
    this.isNTms = false;
    this.isNTms2 = false;
    this.com = new combi();
    var obj: any = {}
    this.conOprFirst = "AND";
    this.conOprSecond = "AND";
    this.conOpr = "AND";

    this.isRuleEdit = true;

    obj.loginId = this.loginId;
    obj.ruleId = ruleId
    this.ruleId = ruleId

    this.ruleService.getRules(obj).subscribe(data => {
      this.responseData = data;


      //


      var isED: boolean = false;
      var snrs: any;
      this.assignmentOpr = this.responseData.assignment
      this.conditionalOpr = this.responseData.condition
      this.states = this.responseData.states



      var RuleData = [];

      if (this.responseData.rules.length > 0) {
        RuleData = this.responseData.rules;

        this.bufferMin = +RuleData[0].buffMin;

        this.selectHW = RuleData[0].shortCode;

        this.getDevices();


        this.format._key = RuleData[0].sensor;



        var dtf = this.dataFormat.find(r => r._key === this.format._key);

        this.sensor1Name = dtf._name



        this.isEnergy = false;

        if (RuleData[0].conPeriod != undefined && RuleData[0].conPeriod != "") {
          this.isEnergy = true;
          this.cummId = RuleData[0].conPeriod
        }



        if (RuleData[0].maxVal != undefined || RuleData[0].maxVal)
          this.assignOpr.operatorMin = RuleData[0].minAssign1


        this.assignOpr.operatorMax = RuleData[0].maxAssign1
        this.assignOpr.operatorMin2 = RuleData[0].minAssign2
        this.assignOpr.operatorMax2 = RuleData[0].maxAssign2

        if (this.assignOpr.operatorMax2 == undefined ||
          this.assignOpr.operatorMax2.length == 0) {
          this.showRange2 = false;
        }
        else {
          this.showRange2 = true;
          this.assignOpr.operatorMin2 = "Between";
        }

        if (this.assignOpr.operatorMax == undefined ||
          this.assignOpr.operatorMax.length == 0) {
          this.showRange = false;
        }
        else {
          this.showRange = true;
          this.assignOpr.operatorMin = "Between";
        }

        this.MinValue = RuleData[0].minVal
        this.MaxValue = RuleData[0].maxVal

        //
        if (this.format._key.toLowerCase() == "tms") {
          this.isTms = true;
          this.ReportTime = RuleData[0].minVal;
        }
        else {
          this.isNTms = true;
        }

        debugger

        if (RuleData[0].sensor2 == undefined ||
          RuleData[0].sensor2 == '') //checking combination rule or single rule
        {
          //single rule
          this.com.mode = true;
          this.combi = false;
          this.MinValue2 = "";
          this.MaxValue2 = "";
          this.format2._key = "";
        }
        else {
          //combination rule
          this.com.mode = false;
          this.combi = true;

          //
          this.sensor2fill(this.format._key);


          this.format2._key = RuleData[0].sensor2

          // if (this.dataFormat2Filtered != undefined && this.dataFormat2Filtered != [] && this.dataFormat2Filtered.length == 0) {
          var dtf2 = this.dataFormat.find(r => r._key === this.format2._key);

          this.sensor2Name = dtf2._name
          // }

          this.isNTms2 = true;
          this.MinValue2 = RuleData[0].minVal2
          this.MaxValue2 = RuleData[0].maxVal2


        }
      }
      else {
        //boolean rules
        //
        RuleData = this.responseData.boolRules;

        this.selectHW = RuleData[0].shortCode;

        this.bufferMin = +RuleData[0].buffMin;

        this.getDevices();

        this.showOpt(RuleData[0].sensor);

        this.format._key = RuleData[0].sensor

        var dtf = this.dataFormat.find(r => r._key === this.format._key);

        this.sensor1Name = dtf._name

        debugger

        if (RuleData[0].sensor2 == undefined ||
          RuleData[0].sensor2 == '') //checking combination rule or single rule
        {
          //single rule
          this.com.mode = true;
          this.combi = false;
          this.MinValue2 = "";
          this.MaxValue2 = "";
          this.format2._key = "";
        }
        else {
          //combination rule
          this.com.mode = false;
          this.combi = true;

          //
          this.sensor2fill(this.format2._key);


          this.format2._key = RuleData[0].sensor2

          // if (this.dataFormat2Filtered != undefined && this.dataFormat2Filtered != [] && this.dataFormat2Filtered.length == 0) {
          var dtf2 = this.dataFormat.find(r => r._key === this.format2._key);

          this.sensor2Name = dtf2._name
          // }


          // this.isNTms2 = true;
          this.MinValue2 = RuleData[0].minVal2
          this.MaxValue2 = RuleData[0].maxVal2


        }

        snrs = [];


        snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));

        snrs = snrs.filter(g => g.key == this.format._key)
        debugger
        if (Number(snrs[0].sensorTypeId) == 6 ||
          (Number(snrs[0].sensorTypeId) >= 61 && Number(snrs[0].sensorTypeId <= 75))) {
          this.assignOpr.operatorMin2 = RuleData[0].minAssign1
          this.assignOpr.operatorMax2 = RuleData[0].maxAssign1

          if (this.assignOpr.operatorMax2 == undefined ||
            this.assignOpr.operatorMax2.length == 0) {
            this.showRange2 = false;
          }
          else {
            this.showRange2 = true;
            this.assignOpr.operatorMin2 = "Between";
          }

          if (snrs[0].ifTrue.toLowerCase() == "open") {

            if (RuleData[0].boolVal == '1') {
              this.setBool = 'Open';
            }
            else {
              this.setBool = 'Close';
            }
          }
          else {

            if (RuleData[0].boolVal == '1') {
              this.setBool = 'On';
            }
            else {
              this.setBool = 'Off';
            }

          }


          this.OpenOrCloseTime = RuleData[0].mins
        }
        else {
          //

          isED = true;
          if (RuleData[0].conPeriod != undefined && RuleData[0].conPeriod != "") {
            this.isEnergy = true;
            this.cummId = RuleData[0].conPeriod
          }

          this.assignOpr.operatorMin = RuleData[0].minAssign1
          this.assignOpr.operatorMax = RuleData[0].maxAssign1

          if (this.assignOpr.operatorMax == undefined ||
            this.assignOpr.operatorMax.length == 0) {
            this.showRange = false;
          }
          else {
            this.showRange = true;
            this.assignOpr.operatorMin = "Between";
          }

          this.isBool2 = true;
          this.MinValue = RuleData[0].boolVal
          this.MaxValue = RuleData[0].mins

          this.OpenOrCloseTime2 = RuleData[0].maxVal

          this.MinValue2 = RuleData[0].minVal
          // // this.MaxValue2 = RuleData[0].maxVal

          // this.com.mode = false;
          // this.combi = true;
          // // this.isNTms2 = true;

          this.format2._key = RuleData[0].sensor2;

          this.showOpt2(RuleData[0].sensor2);

          // if (this.dataFormat2Filtered != undefined && this.dataFormat2Filtered != [] && this.dataFormat2Filtered.length == 0) {
          var dtf2 = this.dataFormat.find(r => r._key === this.format2._key);

          this.sensor2Name = dtf2._name
          // }

          snrs = [];


          snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));

          snrs = snrs.filter(g => g.key == this.format2._key)

          if (snrs[0].ifTrue.toLowerCase() == "open") {

            if (RuleData[0].minVal == '1') {
              this.setBool2 = 'Open';
            }
            else {
              this.setBool2 = 'Close';
            }
          }
          else {

            if (RuleData[0].minVal == '1') {
              this.setBool2 = 'On';
            }
            else {
              this.setBool2 = 'Off';
            }

          }
        }
        //

        if (isED == false) {
          if (RuleData[0].sensor2 == undefined ||
            RuleData[0].sensor2 == '') //checking combination rule or single rule
          {
            //single rule
            this.com.mode = true;
            this.combi = false;

          }
          else {
            //combination rule
            this.com.mode = false;
            this.combi = true;

            this.format2._key = RuleData[0].sensor2

            // if (this.dataFormat2Filtered != undefined && this.dataFormat2Filtered != [] && this.dataFormat2Filtered.length == 0) {
            var dtf2 = this.dataFormat.find(r => r._key === this.format2._key);

            this.sensor2Name = dtf2._name
            // }

            if (RuleData[0].combi == "1") {

              this.isNTms2 = true;
              this.MinValue2 = RuleData[0].minVal
              this.MaxValue2 = RuleData[0].maxVal

            }
            else {
              this.showOpt2(RuleData[0].sensor2);

              if (this.isBool2) {

                snrs = [];


                snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));

                snrs = snrs.filter(g => g.key == RuleData[0].sensor2.toLowerCase())
                //

                if (snrs[0].ifTrue.toLowerCase() == "open") {

                  if (RuleData[0].minVal == '1') {
                    this.setBool2 = 'Open';
                  }
                  else {
                    this.setBool2 = 'Close';
                  }
                }
                else {

                  if (RuleData[0].minVal == '1') {
                    this.setBool2 = 'On';
                  }
                  else {
                    this.setBool2 = 'Off';
                  }

                }
              }
              this.OpenOrCloseTime2 = RuleData[0].maxVal

            }


          }

        }
      }
      if (RuleData[0].alert == "1") {
        this.Escalate = true;
      }
      else {
        this.Escalate = false;
      }

      //

      if (RuleData[0].active == "1") {
        this.isActive = true;
      }
      else {
        this.isActive = false;
      }

      this.ruleMt.DeviceName = RuleData[0].deviceId;

      // if (this.ruleMt.DeviceName == "Default") {
      //   this.ruleMt.DeviceName = "All Devices"
      // }
      //
      // this.format._key = RuleData[0].sensor
      this.conOpr = RuleData[0].condition
      this.state = RuleData[0].state

      this.selectColor()


    });

    //

    this.RuleType = "Edit Rule";


    this.modalRule.show();
  }



  processloadRules(responseData: any) {
    // this.devices = this.responseData.onBoarded
    this.assignmentOpr = this.responseData.assignment
    this.conditionalOpr = this.responseData.condition
    this.states = this.responseData.states

    var RuleData = [];

    var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'

    var alertIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
    var rActive = 'Active';

    this.responseData.ruleDesc.forEach(element => {

      debugger
      var dev = this.userHwTypes.filter(r => r.id == element.shortCode);

      //Default
      if (dev.length > 0) {
        //element.state = "<div style='height:20px;padding-left:15px;color:white; background-color:" + element.colorCode + "'>" + element.status + "</div>";
        element.state = "<span style='color:" + element.colorCode + "'>" + element.status + "</span>";

        if (element.alert == "1") {
          alertIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
        }
        else {
          alertIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';
        }
        //
        if (element.active == "1") {
          rActive = 'Active';
        }
        else {
          rActive = 'Inactive';
        }

        if (!element.condition.toLowerCase().includes("custom")) {
          element.condition = element.decs;
        }

        var accept: boolean = false;

        if (element.deviceId.toLowerCase() !== "all devices") {
          debugger
          var devs: any = [];
          devs = JSON.parse(sessionStorage.getItem("USER_DEVICES"));
          if (this.selectedRegionRules != null && this.selectedRegionRules != undefined) {
            devs = devs.filter(r => r.regionId == this.selectedRegionRules);
          }

          devs = devs.filter(d => d.deviceName == element.deviceId);//deviceName
          if (devs.length > 0) {
            accept = true;
          }
          else {
            accept = false;
          }
        }
        else {
          accept = true;
        }

        //

        if (accept == true) {
          RuleData.push([
            element.shortCode.substring(0, element.shortCode.length - 1),
            element.deviceId,
            element.sensor,
            element.condition,
            element.state,
            alertIcon,
            rActive,
            DisplayIcon,
            element.ruleId,
            element.createdBy,
            element.alert,
            element.type
          ]
          )
        }
      }
    });

    //

    this.bindDatatoTable(RuleData);
    this.getUserDevices();
  }
  loadRules() {

    this.isDeleteShow = false;
    var obj: any = {}

    obj.loginId = this.loginId;
    //

    this.ruleService.getRules(obj).subscribe(data => {
      debugger
      this.responseData = data;


      this.processloadRules(this.responseData);



    });
  }

  showRules: boolean = false;
  showDefaultRules: boolean = false;
  showEditRules: boolean = false;
  showDiv(showWhat: any) {
    debugger
    this.showRules = false;
    this.showDefaultRules = false;

    if (showWhat == 'rules') {
      this.refreshRules();
      this.showRules = true;
      //this.loadRules();
    }
    else {

      this.showDefaultRules = true;
      this.getUserDevices();
      this.defaultSensorRules = [];
      this._deviceName = "";
    }
    this.modalRule.show();
  }

  blockSome: boolean = true;

  bindDatatoTable(data: any) {
    $('#rulesData').dataTable().fnDestroy();
    var table = $('#rulesData').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
    });
    table.clear().rows.add(data).draw();

    var that = this;

    $('#rulesData tbody').on('click', 'td', function () {


      var Index = this.cellIndex
      //
      if (Index == "7" || Index == "3") {

        that.blockSome = false;

        var data = $(this).parent();
        var table = $('#rulesData').DataTable();
        data = table.row(data).data();

        if (data[3].includes('Custom') || Index == "7") {
          that.ruleId = data[8];
          //
          if (that.loginId == data[9]) {
            that.isDeleteShow = true;
          }
          else {
            that.isDeleteShow = false;
          }

          that.getRule(that.ruleId);
        }
      }

    });

  }

  getDevices() {
    var obj: any = [];

    obj.loginId = sessionStorage.getItem('LOGINUSERID');
    obj.shortCode = this.selectHW

    var dev: any = [];
    var devs: any = [];

    var sh_devices: any = [];



    devs = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    devs = devs.filter(g => g.shortCode == this.selectHW);



    devs.forEach(d => {

      dev = {};
      dev.DeviceId = d.sensorId;
      dev.DeviceName = d.deviceName;
      dev.regionId = d.regionId;
      sh_devices.push(dev);
    });

    this.devices = sh_devices

    this.getDataFormat();
    //});

  }

  updateRuleAlert(ruleId: any, alertSts: any, type: any) {

    var obj: any;

    obj = {}
    obj.ruleId = ruleId;

    if (alertSts == "1") {
      obj.alert = "0";
    }
    else {
      obj.alert = "1";
    }

    obj.type = type;

    this.ruleService.InsertRule(obj).subscribe(data => {

      this.responseData = data;

      if (this.responseData.sts == "200") {
        //this.toastr.success(this.responseData.msg);
        this.loadRules()
      }
      else {
        //this.toastr.warning(this.responseData.msg);
      }
    });
  }

  selectedSnrTypeId: any = ""

  showOptions(event) {
    //
    if (this.com.mode == false && this.format2 !== undefined && (this.format._key == this.format2._key)) {
      this.toastr.warning('Sensor 1 and Sensor 2 cannot be same');
      //
      this.dataFormat2Filtered = [];
      this.format2._key = "";
      this.format._key = "";// this.prevSensor1;
    }
    else {
      this.isEnergy = false;
      //
      this.showOpt(event._key);


      if (this.com.mode == false) {
        //

        this.sensor2fill(this.format._key);
      }

      this.format._key = event._key;
      this.selectedSnrTypeId = event._sensorTypeId;

      if (event._sensorTypeId == "1" && this.hasSetPoint) {
        this.MinValue = "SetPoint";
        this.MaxValue = "SetPoint";
      }
      if (event._sensorTypeId == "10") {
        this.isEnergy = true;
      }
      else {
        this.MinValue = "";
        this.MaxValue = "";
      }
    }

  }

  showOpt(_key: string) {

    var snr = this.dataFormat.find(r => r._key === _key);

    if (snr == undefined) {
      snr = this.dataFormat.find(r => r._name === _key);
    }

    if (snr !== undefined) {

      var sId: any = 0;

      sId = +snr._sensorTypeId

      if ((sId == 6) || (sId >= 61 && sId <= 75)) {
        this.isBool = true;
        this.isTms = false;
        this.isNTms = false;
        this.showRange = false;

        this.boolVals = [];
        var st: any = {};
        st.state = snr._ifTrue;
        st.val = snr._ifTrue;

        this.boolVals.push(st);

        st = {};
        st.state = snr._ifFalse;
        st.val = snr._ifFalse;


        this.boolVals.push(st);
      }
      else
        if (_key == "tms") {
          this.isTms = true;
          this.isNTms = false;
          this.isBool = false;
        }
        else {
          this.isTms = false;
          this.isNTms = true;
          this.isBool = false;
        }
    }
  }

  showOptions2(event) {

    this.showOpt2(event._key);


    if (event._sensorTypeId == "1" && this.hasSetPoint) {
      this.MinValue2 = "SetPoint";
      this.MaxValue2 = "SetPoint";
    }
    else {
      this.MinValue2 = "";
      this.MaxValue2 = "";
    }
  }

  showOpt2(_key: string) {

    //
    var snr = this.dataFormat2Filtered.find(r => r._key === _key);

    if (snr == undefined) {
      snr = this.dataFormat2Filtered.find(r => r._name === _key);
    }

    var sId: any = 0;

    sId = +snr._sensorTypeId

    //if (snr._sensorTypeId == "6" && this.isBool == false) 

    if ((sId == 6 || sId >= 61 && sId <= 75) && this.isBool == false) {
      this.isBool2 = true;
      this.isNTms2 = false;
      this.showRange2 = false;

      this.boolVals = [];
      var st: any = {};
      st.state = snr._ifTrue;
      st.val = snr._ifTrue;

      this.boolVals.push(st);

      st = {};
      st.state = snr._ifFalse;
      st.val = snr._ifFalse;


      this.boolVals.push(st);

      this.isNTms2 = false;
    }
    else {
      this.isNTms2 = true;
      this.isBool2 = false;

    }

    if ((sId == 6 || sId >= 61 && sId <= 75) && this.isBool == true) {
      this.toastr.warning("Both sensors are binary type, so not allowed");
      this.format2._key = "";
    }
  }

  selectColor() {


    if (this.state == "Good") {
      this.colorCode = "green";
      this.isGreen = true;
      this.isBlue = false;
      this.isOrng = false;
      this.isRed = false;

    }
    if (this.state == "OK") {
      this.colorCode = "blue";
      this.isGreen = false;
      this.isBlue = true;
      this.isOrng = false;
      this.isRed = false;
    }
    if (this.state == "Warning") {
      this.colorCode = "orange";
      this.isGreen = false;
      this.isBlue = false;
      this.isOrng = true;
      this.isRed = false;
    }
    if (this.state == "Critical") {
      this.colorCode = "red";
      this.isGreen = false;
      this.isBlue = false;
      this.isOrng = false;
      this.isRed = true;
    }
  }

  onSingle() {
    //;cre

    this.combi = false;
    this.conOpr = "";
    this.format2._key = "";

  }


  onCombination() {
    //;

    this.combi = true;

    this.sensor2fill(this.format._key);
  }

  sensor2fill(key: any) {

    var key2: any = ""


    if (this.format2 !== undefined && this.format2 !== null) {
      key2 = this.format2._key;
      this.format2 = new Format2();
    }

    //
    this.dataFormat2Filtered = this.dataFormat.filter(d => d._key != key && d._sensorTypeId !== "10");

    if (key2 !== this.format._key) {
      this.format2._key = key2;
    }
  }
  refreshRules() {
    this.CRSelectedRegion = [];
    this.bufferMin = [];
    this.blockSome = true;
    this.com.mode = true;
    this.assignOpr.operatorMin = "";
    this.showRange = false;
    this.isRuleEdit = false;
    this.selectHW = [];
    this.isRed = false;
    this.isGreen = false;
    this.isOrng = false;
    this.isBlue = false;
    this.combi = false;
    this.format = new Format();
    this.format2 = new Format2();
    this.ruleMt = new ruleMgnt();
    this.MinValue = "";
    this.MaxValue = "";
    this.MinValue2 = "";
    this.MaxValue2 = "";
    this.state = "";
    this.ruleId = "";
    this.assignOpr.operatorMin = "";
    this.assignOpr.operatorMax = "";
    this.assignOpr.operatorMin2 = "";
    this.assignOpr.operatorMax2 = "";

    this.isDeleteShow = false;
    this.conOprFirst = "";
    this.conOprSecond = "";
    this.conOpr = "";
    this.setBool = "";
    this.setBool2 = "";
    this.OpenOrCloseTime = "";
    this.OpenOrCloseTime2 = "";

    this.cummId = "";
    this.isEnergy = false;
  }
  openRuleModel() {
    debugger
    this.RuleType = "New Rule";
    this.showDefaultRules = true;
    this.showRules = false;
    this.showEditRules = true;
    //this.refreshRules();
    //
    this.showDiv('defaultRules')

  }


  saveNewRule(obj: any) {
    //
    var obj: any;

    var valid: boolean = false;


    valid = this.Validate(obj);

    if (valid) {

      this.disabled = true;

      obj.shortCode = this.selectHW;
      obj.ruleId = this.ruleId;
      obj.colorCode = this.colorCode

      obj.deviceId = this.ruleMt.DeviceName
      obj.sensor = this.format._key
      obj.minVal = this.MinValue
      obj.maxVal = this.MaxValue
      obj.conPeriod = this.cummId
      obj.type = "1"
      obj.minAssign1 = this.assignOpr.operatorMin;
      obj.minAssign2 = this.assignOpr.operatorMin2;
      obj.buffMin = this.bufferMin

      if (obj.minAssign1 == "Between") {
        obj.minAssign1 = ">="
        obj.maxAssign1 = "<"
      }
      debugger
      //
      //Reporting Time"
      if (this.format._key == "tms") {
        obj.minVal = this.ReportTime
        obj.maxVal = this.ReportTime
        obj.minAssign1 = ">"
      }
      else {
        if (this.isBool || this.isBool2) {
          //
          if (this.isBool) {
            obj.maxVal = this.OpenOrCloseTime
            debugger
            if (this.setBool.toLowerCase() == "on battery" || this.setBool.toLowerCase() == "battery on") {
              obj.minVal = "0"
            }
            else
              if (this.setBool.toLowerCase() == "open" || this.setBool.toLowerCase() == "on") {
                obj.minVal = "1"
              }
              else
                if (this.setBool.toLowerCase() == "close" || this.setBool.toLowerCase() == "off") {
                  obj.minVal = "0"
                }

            if (obj.minAssign2 == "Between") {
              obj.minAssign2 = ">="
              obj.maxAssign2 = "<="
            }



          }

          if (this.isBool2) {
            this.MaxValue2 = this.OpenOrCloseTime2

            if (this.setBool2.toLowerCase() == "open" || this.setBool2.toLowerCase() == "on") {
              this.MinValue2 = "1"
            }
            else
              if (this.setBool2.toLowerCase() == "close" || this.setBool2.toLowerCase() == "off") {
                this.MinValue2 = "0"
              }


          }

          obj.combi = "2";


          if (this.isBool && !this.isBool2) {
            obj.combi = "0";
          }
          else
            if (!this.isBool && this.isBool2) {
              obj.combi = "1";
            }

          obj.type = "0"


          obj.minVal2 = this.MinValue2
          obj.maxVal2 = this.MaxValue2

        }
        else {
          obj.minVal = this.MinValue;
          obj.maxVal = this.MaxValue;


          obj.minAssign2 = this.assignOpr.operatorMin2;
          obj.maxAssign2 = this.assignOpr.operatorMax2;



          if (obj.minAssign2 == "Between") {
            obj.minAssign2 = ">="
            obj.maxAssign2 = "<="
          }


          obj.minVal2 = this.MinValue2;
          obj.maxVal2 = this.MaxValue2;


        }
      }
      obj.condition = this.conOpr
      obj.sensor2 = this.format2._key


      obj.state = this.state

      if (this.Escalate == true) {
        obj.alert = '1';
      }
      else {
        obj.alert = '0';
      }

      if (this.isActive == true) {
        obj.active = '1';
      }
      else {
        obj.active = '0';
      }

      this.ruleService.InsertRule(obj).subscribe(data => {

        this.responseData = data;

        this.disabled = false;

        if (this.responseData.sts == "200") {


          this.toastr.success(this.responseData.msg);
          this.loadRules();
          this.modalRule.hide();

          this.formatLogAndUpdate(obj, false);
        }
        else {
          this.toastr.warning(this.responseData.msg);
        }
      });
    }

  }
  formatLogAndUpdate(obj: any, isDelete: any) {
    try {
      let modal = this.userHwTypes.find(x => x.id == obj.selectHW);
      let sen1 = this.dataFormat.find(x => x._key == obj.sensor);
      let sen2 = this.dataFormat.find(x => x._key == obj.sensor2);
      let buffMnt = this.buffMins.find(x => x.minId == obj.buffMin);
      let selMode = obj.mode == false ? "Combination" : "Single";
      debugger


      var devs: any;

      devs = []
      devs = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

      var devId = devs.filter(g => g.deviceName == obj.DeviceName);


      let formattedRule = "Model: Alarm Setup, DeviceId : " + devId[0].sensorId + " DeviceName: " + obj.DeviceName + ", Rule Type: " + selMode +
        ", Sensor: " + sen1._name + ", Operator: " + obj.operatorMin + ", Value: " + obj.minVal + (obj.maxVal != '' ? "-" + obj.maxVal : '') +
        (sen2 ? (", Sensor: " + sen2._name + ", Operator: " + obj.operatorMin2 + ", Value: " + obj.minVal2 + (obj.maxVal2 != '' ? "-" + obj.maxVal2 : '')) : '') +
        ", Trigger Alert?: " + obj.Escalate + ", IsActive?: " + obj.isActive +
        ", Color code: " + obj.colorCode + ", State: " + obj.state +
        ", Buffer Mins: " + buffMnt.min;
      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Rule",
        "actionPerformed": "Rule has been " + (isDelete ? "deleted" : (obj.ruleId != "" ? "updated" : "created")) + ". Rule info - " + formattedRule
      }

      this.cmnService.logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

  formatLogAndUpdateDefultRule(obj: any, isDelete: any) {
    try {
      debugger
      var devName = this.userDevices.filter(g => g.deviceId == obj.deviceId);



      var userSensors: any;

      userSensors = []
      userSensors = JSON.parse(sessionStorage.getItem("USER_SENSORS"));

      var sensorName = userSensors.filter(g => g.shortCode == obj.shortCode && g.key == obj.sensor);

      var deviceModel = this.userHwTypes.filter(g => g.id == obj.shortCode);

      let formattedRule = "Model: " + deviceModel[0].name + ", DeviceId: " + obj.deviceId + ", DeviceName: " + devName[0].deviceName +
        ", Sensor: " + sensorName[0].keyName + ", Minimum: " + obj.minVal + ", Maximum: " + obj.maxVal +
        ", Tolerance : " + obj.tolerance;

      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "mobileNo": sessionStorage.getItem('User_MobileNo'),
        "module": "Alarm Setup",
        "actionPerformed": "Rule has been created. Rule info - " + formattedRule
      }

      this.cmnService.logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

  Validate(obj: any) {
    //

    if (this.selectHW == undefined || this.selectHW == "" || this.selectHW == null) {
      this.toastr.warning('Please select Model');
      return false;
    }
    else if (this.ruleMt.DeviceName == undefined || this.ruleMt.DeviceName == "" || this.ruleMt.DeviceName == null) {
      this.toastr.warning('Please select Device');
      return false;
    }
    else {
      if (this.format._key == undefined || this.format._key == "" || this.format._key == null) {
        this.toastr.warning('Please select Sensor');
        return false;
      }



      if (this.isBool == true && (this.setBool == undefined || this.setBool == ""
        || this.setBool == null)) {
        this.toastr.warning('Please select Operator');
        return false;
      }
      if (this.isBool == true && (this.OpenOrCloseTime == undefined || this.OpenOrCloseTime == ""
        || this.OpenOrCloseTime == null)) {
        this.toastr.warning('Please select Duration');
        return false;
      }
      if (this.isBool == false && (this.assignOpr.operatorMin == undefined || this.assignOpr.operatorMin == ""
        || this.assignOpr.operatorMin == null)) {
        this.toastr.warning('Please select Operator');
        return false;
      }


      if (this.showRange == true && (this.MinValue == undefined || this.MinValue == ""
        || this.MaxValue == null)) {
        this.toastr.warning('Please enter Min Value');
        return false;
      }


      if (this.isBool == false && (this.MinValue == undefined || this.MinValue == ""
        || this.MinValue == null)) {
        this.toastr.warning('Please enter Value');
        return false;
      }
      //showRange


      if (this.showRange == true && (this.MaxValue == undefined || this.MaxValue == ""
        || this.MaxValue == null)) {
        this.toastr.warning('Please enter Max Value');
        return false;
      }



      if (this.bufferMin == undefined || this.bufferMin == "" || this.bufferMin == null) {
        this.toastr.warning('Please select Buffer mins');
        return false;
      }



      if (this.com.mode == false)//combination
      {
        if (this.format2._key == undefined || this.format2._key == "" || this.format2._key == null) {
          this.toastr.warning('Please select sensor');
          return false;
        }
        else
          if (this.isBool2 == true && (this.setBool2 == undefined || this.setBool2 == ""
            || this.setBool2 == null)) {
            this.toastr.warning('Please select operator');
            return false;
          }
        if (this.isBool2 == true && (this.OpenOrCloseTime2 == undefined || this.OpenOrCloseTime2 == ""
          || this.OpenOrCloseTime2 == null)) {
          this.toastr.warning('Please select Duration');
          return false;
        }
        else
          if (this.isBool2 == false && (this.assignOpr.operatorMin2 == undefined || this.assignOpr.operatorMin2 == ""
            || this.assignOpr.operatorMin2 == null)) {
            this.toastr.warning('Please select operator');
            return false;
          }
          else
            if (this.isBool2 == false && (this.MinValue2 == undefined || this.MinValue2 == ""
              || this.MinValue2 == null)) {
              this.toastr.warning('Please enter Value');
              return false;
            }
            else
              if (this.showRange2 == true && (this.MaxValue2 == undefined || this.MaxValue2 == ""
                || this.MaxValue2 == null)) {
                this.toastr.warning('Please enter Max Value');
                return false;
              }



      }

      if (this.state == undefined || this.state == ""
        || this.state == null) {
        this.toastr.warning('Please select State');
        return false;
      }

      return true;

    }
  }

  DeleteRule() {

    //


    Swal({
      title: "Do you really want to delete?",// this._translate.instant('SetUpDoYouProceedAlert'),
      text: "",
      type: 'warning',
      showCancelButton: true,
      showLoaderOnConfirm: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: "Yes"
    }).then((result1) => {
      if (result1.value) {

        let deleteObj = {
          selectHW: this.selectHW,
          DeviceName: this.ruleMt.DeviceName,
          Escalate: this.Escalate,
          isActive: this.isActive,
          colorCode: this.colorCode,
          state: this.state,
          buffMin: this.bufferMin,
          mode: this.com.mode,
          sensor: this.format._key,
          minVal: this.MinValue,
          maxVal: this.MaxValue,
          operatorMin: this.assignOpr.operatorMin,
          sensor2: this.format2._key,
          minVal2: this.MinValue2,
          maxVal2: this.MaxValue2,
          operatorMin2: this.assignOpr.operatorMin2
        }

        this.ruleService.deleteRule(this.ruleId).subscribe(data => {
          //
          this.responseData = data;

          if (this.responseData.sts == "200") {
            this.toastr.success(this.responseData.msg);
            this.loadRules();
            this.modalRule.hide();

            this.formatLogAndUpdate(deleteObj, true);
          }
          else {
            this.toastr.warning(this.responseData.msg);
          }
        });

      }

    });


  }

  getDataFormat() {


    this.dataFormat = [];
    var sensors: any = []
    var sensors2: any = []

    var clientDB: any = "";
    clientDB = sessionStorage.getItem("Client_Domain");
    var snrs: any;

    snrs = [];


    snrs = JSON.parse(sessionStorage.getItem("USER_SENSORS"));

    snrs = snrs.filter(g => g.shortCode == this.selectHW);



    snrs.forEach(s => {

      var obj: any = [];
      if (s.sensorTypeId !== "17" && s.sensorTypeId !== "7" && s.key !== "deviceId" && s.key !== "tms") {

        obj._key = s.key;
        obj._name = s.keyName;
        obj._sensorTypeId = s.sensorTypeId;
        obj._ifTrue = s.ifTrue;
        obj._ifFalse = s.ifFalse;

        if (s.sensorTypeId == "7") {
          this.hasSetPoint = true;
        }

        sensors.push(obj);

        if (s.sensorTypeId != "10") {
          sensors2.push(obj);
        }
      }
    });


    this.dataFormat = sensors;
    // this.dataFormat2 = sensors2;


    //
  }

}



export class ruleMgnt {
  DeviceId: string
  DeviceName: string
}

export class Format {
  public _key: string
  public _name: string
  // public _key2: string
  // public _name2: string
}

export class Format2 {
  public _key: string
  public _name: string
}

export class AssignOpr {
  operatorMin: string
  operatorMax: string
  operatorMin2: string
  operatorMax2: string
}

export class ConOpr {
  operator: string
}

export class combi {
  mode: boolean
}
