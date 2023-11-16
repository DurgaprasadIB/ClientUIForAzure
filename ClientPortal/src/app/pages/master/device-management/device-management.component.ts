import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceDataService } from '../../GlobalServices/devicedata.service';
import { ClientService } from '../../setup/Service/client.service';
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import { debug } from 'util';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import * as Paho from "paho-mqtt";
import { TrackingService } from '../../tracking/services/tracking.service';
import { NUMBER } from '@amcharts/amcharts4/core';
import { ReportService } from '../../reports/service/report.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.css']
})
export class DeviceManagementComponent implements OnInit {
  //

  @ViewChild('mapDiv') gmapElement: any;
  @ViewChild('mapDivR') gmapRElement: any;


  map: google.maps.Map;
  Rmap: google.maps.Map;

  @ViewChild('modalRoot') modalRoot: any;
  @ViewChild('modalRegion') modalRegion: any;
  @ViewChild('modalIotCtrl') modalIotCtrl: any;
  @ViewChild('modalClient') modalClient: any;


  constructor(
    private _loaderService: LoaderService,
    private _detailService: ReportService,
    private router: Router,
    private _devicedataservice: DeviceDataService,
    private ClientService: ClientService,
    private _trackingService: TrackingService,
    private comman: IdeaBService,
    private toastr: ToastrService) {
  }


  minDate: any = Date;

  disableSaveButton: boolean = false;
  devActive: boolean = false;
  whiteListedDeviceIdList: any = [];
  deviceDetails: any = new DeviceDetails();
  hwDataFormat: any = [];
  deviceid: any;
  deleteShow: boolean = false;
  onBoardedDevice: any = [];
  sIdShow: boolean = false;
  addDevice: any = "";
  showKey: any = [];
  CheckK: any = new CheckKey();
  offData: any = [];
  IconList: any = [];

  lat: any
  lng: any
  markerList: any
  marker: any

  regionId: any;
  regionName: any;
  regionLat: any;
  regionLng: any;

  mqttClient: any;
  mqttConnected: any;
  requestToRefresh: any;

  hasMQTT: boolean;

  latitude: any
  longitude: any

  _marker: any;

  regionsList: any;
  alertDay: any;
  bgImage: any;
  client: any;
  alertLmtList: any;
  showIoTController: boolean = false;
  showClientManagement: boolean = false;

  showDeviceDelete: boolean = false;

  ngOnInit() {

    var dt = new Date();
    this.minDate = dt;//  new Date(dt.getTime() + (24 * 60 * 60 * 1000));

    this.showIoTController = sessionStorage.getItem("hasIoTController") == "1" ? true : false;
    this.showClientManagement = sessionStorage.getItem("isResellar") == "1" ? true : false;

    sessionStorage.setItem('liveScreen', "device");
    this.bgImage = sessionStorage.getItem('BGimage');

    if (sessionStorage.getItem("User_SuperAdmin").toLowerCase() == "superadmin") {
      this.isSuperAdmin = true;
    }
    else {
      this.isSuperAdmin = false;
    }

    if (sessionStorage.getItem("LoginUser") == "support@ideabytesiot.com") {
      this.showDeviceDelete = true;
    }
    else {
      this.showDeviceDelete = false;
    }

    //alerts per day
    this.alertLmtList = [{ alrtId: 1, alertCount: '1' },
    { alrtId: 2, alertCount: '2' },
    { alrtId: 3, alertCount: '3' },
    { alrtId: 4, alertCount: '4' }]

    this.getRegions();

    this.getOnBoardedDevices();
    this.getWhitListedDevices();
    //this.client = new MQTT.Client('54.179.134.139', Number(1883), 'ranjith1249', 'pub_client', 'password');

    var lat = "17.4330175";// this._commanService.getDefaultLat();
    var lon = "78.3728449";// this._commanService.getDefaultLng()

    var centerLatLng = new google.maps.LatLng(Number(lat), Number(lon));

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


    this.map.addListener('click', (event) => this.setLatLong(event));

    //region Map
    this.Rmap = new google.maps.Map(this.gmapRElement.nativeElement,
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

    this.Rmap.addListener('click', (event) => this.setRLatLong(event));



    var autoLoc = <HTMLInputElement>document.getElementById('txtLocbranch');

    // device map
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(autoLoc);


    // var autocomplete = new google.maps.places.Autocomplete(autoLoc);
    let that = this;
    // google.maps.event.addListener(autocomplete, 'place_changed', function () {


    //   var place = autocomplete.getPlace();
    //   if (place.geometry) {
    //     var latitude = place.geometry.location.lat();
    //     var longitude = place.geometry.location.lng();
    //     var mylatlong = new google.maps.LatLng(latitude, longitude);
    //     that.map.setCenter(mylatlong);
    //     that.map.setZoom(18);
    //     that.marker = new google.maps.Marker({
    //       position: mylatlong,
    //       map: that.map,
    //       // draggable: true,
    //       icon: "./assets/Images/markerB.png"
    //     });
    //     that.markerList.forEach(mkr => {
    //       mkr.setMap(null);
    //     });
    //     that.markerList = [];
    //     that.markerList.push(that.marker);

    //     eve = { lat: latitude, lng: longitude }

    //     that.setLatLong(eve);


    //     that.lat = latitude.toFixed(5);
    //     that.lng = longitude.toFixed(5);

    //     var eve: any = [];



    //     that.marker.addListener('dragend', function (event) {
    //       that.lat = event.latLng.lat().toFixed(5);
    //       that.lng = event.latLng.lng().toFixed(5);

    //     });

    //   }
    //   else {
    //     this.toastr.warning('location not found');
    //   }
    // });


    var autoRLoc = <HTMLInputElement>document.getElementById('txtRLocbranch');
    this.Rmap.controls[google.maps.ControlPosition.TOP_LEFT].push(autoRLoc);

    var autocompleteR = new google.maps.places.Autocomplete(autoRLoc);
    google.maps.event.addListener(autocompleteR, 'place_changed', function () {


      var place = autocompleteR.getPlace();
      if (place.geometry) {
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();
        var mylatlong = new google.maps.LatLng(latitude, longitude);
        that.Rmap.setCenter(mylatlong);
        that.Rmap.setZoom(18);
        that.marker = new google.maps.Marker({
          position: mylatlong,
          map: that.Rmap,
          // draggable: true,
          icon: "./assets/Images/markerB.png"
        });



        if (that.markerList != undefined && that.markerList != null) {
          that.markerList.forEach(mkr => {
            mkr.setMap(null);
          });
        }

        that.markerList = [];
        that.markerList.push(that.marker);


        var eve: any = [];

        eve = { lat: latitude, lng: longitude }

        that.setRLatLong(eve);


        that.lat = latitude.toFixed(5);
        that.lng = longitude.toFixed(5);



        that.marker.addListener('dragend', function (event) {
          that.lat = event.latLng.lat().toFixed(5);
          that.lng = event.latLng.lng().toFixed(5);

        });
      }
      else {
        this.toastr.warning('location not found');
      }
    });

    this.loadSubClients();

  }


  hrsGap: any
  GetHrs(perDay) {
    this.hrsGap = 24 / Number(perDay);
  }

  isSuperAdmin: boolean = false;

  getRegions() {

    //getting all regions

    var respReg: any;
    var obj: any;
    this.regionsList = [];
    obj = [];
    obj.regionId = "";
    obj.loginId = this.comman.getLoginUserID();
    this._devicedataservice.getRegion(obj).subscribe(result => {

      respReg = result;

      this.regionsList = respReg;
      this.bringRegions();

    });
  }

  showRegions() {

    var autoRLoc = <HTMLInputElement>document.getElementById('txtRLocbranch');

    autoRLoc.value = "";

    //debugger

    if (this.markerList != undefined && this.markerList != null) {
      this.markerList.forEach(mkr => {
        mkr.setMap(null);
      });

      for (let mi = 0; mi < this.markerList.length; mi++) {
        this.markerList[mi].setMap(null);

      }

    }

    this.modalRegion.show();
    this.regionLat = "";
    this.regionLng = "";
    this.regionName = "";

    this.bringRegions();
  }




  bringRegions() {

    var data = [];
    var regionData = [];
    var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'

    this.regionsList.forEach(reg => {
      data.push([
        reg.regionName,
        reg.regionLat,
        reg.regionLng,
        DisplayIcon,
        reg.regionId])

      regionData.push({
        "regionId": reg.regionId,
        "regionName": reg.regionName,
        "regionLat": reg.regionLat,
        "regionLng": reg.regionLng
      })
    });



    sessionStorage.setItem('Regions', JSON.stringify(regionData));

    this.bindRegionDatatoTable(data);

  }

  deviceListData: any

  setLatLong(e) {

    this.deviceDetails.regionId = [];

    if (e.lat != undefined && e.lat != '') {
      this.regionLat = "" + e.lat;
      this.regionLng = "" + e.lng;
    }
    else {
      this.regionLat = "" + e.latLng.lat();
      this.regionLng = "" + e.latLng.lng();
    }

    if (this._marker != undefined) {
      this._marker.setMap(null);
    }

    var marker = new google.maps.Marker({
      position: e.latLng,
      map: this.map,
    });

    this._marker = marker;

    this.map.panTo(e.latLng);
  }

  setRLatLong(e) {

    if (e.lat != undefined && e.lat != '') {
      this.regionLat = "" + e.lat;
      this.regionLng = "" + e.lng;
    }
    else {
      this.regionLat = "" + e.latLng.lat();
      this.regionLng = "" + e.latLng.lng();
    }


    if (this._marker != undefined) {
      this._marker.setMap(null);
    }

    var marker = new google.maps.Marker({
      position: e.latLng,
      map: this.Rmap,
    });

    this._marker = marker;

    this.Rmap.panTo(e.latLng);
  }

  public connectMQTT() {
    // connect the client

    this.mqttClient.connect({
      useSSL: true,
      userName: "ibindia",
      password: "IdeaBytes@1234",
      // userName: "admin",
      // password: "hivemq",
      // userName: "iyibvpxf",
      // password: "53a0OAlnvsck",
      onSuccess: () => {

        // alert('connected');

        this.mqttConnected = true;
        // Once a connection has been made, make a subscription and send a message.
        //console.log("[MQTT] Connected");
        //alert(" [MQTT] Connected")
        this.mqttClient.subscribe("World");
        //this.requestToRefresh.emit();
      }
    });
  }

  public initializeMQTT() {

    console.warn("Initializing MQTT");

    // Create a client instance
    //this.mqttClient = new Paho.Client("soldier.cloudmqtt.com", Number(36226), "clientId");
    // this.mqttClient = new Paho.Client("mqttnew.iotsolution.net", Number(8000), "clientId");
    this.mqttClient = new Paho.Client("mqtt.ppm-rs.com", Number(8083), "clientId123");
    //// set callback handlers
    this.mqttClient.onConnectionLost = (responseObject) => {


      if (responseObject.errorCode !== 0) {
        this.mqttConnected = false;

        //alert("Lost connection Please reload.");
        console.error("[MQTT] Connection Lost:" + responseObject.errorMessage);

      }
    };

    this.mqttClient.onMessageArrived = (message) => {



      // auto-scroll to bottom
      //jQuery('#vr-output').animate({ scrollTop: $('#vr-output').get(0).scrollHeight }, 500);
    }


  }

  public sendCommand() {


    var cmd: any;


    if (this.deviceFrequency != undefined) {



      cmd = '{"deviceId":"' + this.deviceid + '","setPollingInterval":' + this.deviceFrequency + '}'

      let message = new Paho.Message(cmd);

      if (this.deviceDetails.mqttPubTopic == "" || this.deviceDetails.mqttPubTopic == undefined) {
        message.destinationName = sessionStorage.getItem("MQTT_PubTopic");//"dx_in";
      }
      else {
        message.destinationName = this.deviceDetails.mqttPubTopic;//"dx_in";

      }

      if (this.mqttConnected) {
        this.mqttClient.send(message);
      }
      else {

        var obj: any = {};

        obj.topicName = message.destinationName;
        obj.command = cmd;

        this._trackingService.sendMqttCmd(obj).subscribe(result => {

        });
      }
    }

    //this.toastr.success("Request hasbeen placed.");

  }


  getOnBoardedDevices() {

    var obj: any = [];

    obj.loginId = this.comman.getLoginUserID();

    this._loaderService.display(true);
    this._devicedataservice.getonBoardDevice(obj).subscribe(result => {

      this._loaderService.display(false);

      this.onBoardedDevice = result;

      this.IconList = []

      this.onBoardedDevice.icons.forEach(e => {
        this.IconList.push({ iconName: e });
      });

      if (this.onBoardedDevice.devices.length > 0) {
        var data = [];
        var DisplayIcon = ' <i class="fa fa-edit" style="padding-left:30px;font-size:18px;cursor:pointer" title="Edit" ></i>'

        var reportingIcon = "";


        this.onBoardedDevice.devices.forEach(element => {
          var devStat = element.isActive
          if (devStat == 'True') {
            devStat = "Active"
          }
          else {
            devStat = "Inactive"
          }

          //isReporting
          if (element.expired == 1) {
            reportingIcon = '<i class="fa fa-clock-o" style="padding-left:0px;font-size:18px;cursor:pointer;color:#da555e;" title="Subscription Expired" ></i>'
          }
          else {
            reportingIcon = '<i class="fa fa-clock-o" style="padding-left:0px;font-size:18px;cursor:pointer;color:#21bf76;" title="" ></i>'
          }

          var userGroup = ' <i class="fa fa-users" style="color:#34949d;" title="' + element.assignedUsers + '"></i>'


          data.push([
            reportingIcon + ' ' + element.DeviceId,
            element.DeviceName, element.frequency,
            element.nofUsers + ' ' + userGroup,
            element.regionName,
            element.expiryDateShow,
            element.softwareExpiry,
            DisplayIcon,
            element.ShortCode,
            element.mqttPubTopic,
            element.latitude,
            element.logitude,
            element.regionId,
            element.isActive,
            element.nextDate,
            element.alertDay,
            element.lastDate,
            element.iotcontroller,
            element.alertCount,
            element.DeviceId,
            element.subClientId]
          )
        });


        this.bindDatatoTable(data);
      }
      else {
        this.bindDatatoTable([]);
      }
    })
  }

  saveRegion(regionid: any) {
    var obj: any;
    obj = {};

    if (this.regionId != '') {
      obj.regionId = this.regionId;
    }

    if (this.regionName !== '' && this.regionName !== undefined) {
      obj.regionName = this.regionName;
      obj.regionLat = this.regionLat;
      obj.regionLng = this.regionLng;

      var resp: any

      this._devicedataservice.createRegion(obj).subscribe(data => {
        resp = data;

        if (resp.sts = "200") {
          this.toastr.success(resp.msg);
          this.regionName = "";
          this.regionId = "";
          this.regionLat = "";
          this.regionLng = "";

          this.getRegions();
        }
        else {
          this.toastr.warning(resp.msg);
        }
      });
    }
    else {
      this.toastr.warning('Please provide Region Name')
    }


  }

  preRegion: any = ""

  bindDatatoTable(data: any) {

    $('#onBoardedSensorTable').dataTable().fnDestroy();
    var table = $('#onBoardedSensorTable').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
      aaSorting: []

    });
    table.clear().rows.add(data).draw();

    jQuery('.dataTable').wrap('<div style="height:auto; overflow-y:auto;" />');
    var that = this;

    $('#onBoardedSensorTable tbody ').on('click', 'td', function () {


      var index = this.cellIndex

      if (index == "7") {
        debugger
        that.deleteShow = true;

        var data = $(this).parent();
        var table = $('#onBoardedSensorTable').DataTable();
        var data = table.row(data).data();
        that.isDiffRegion = false;
        that.sIdShow = false;


        that.deviceid = data[19];

        that.deviceDetails.deviceName = data[1];//.split('|')[0].replace(' ', '');
        //debugger
        that.deviceDetails.frequency = data[2];//.split('|')[1].split(' ')[1];//= data[2];


        that.deviceDetails.shortcode = data[8];
        that.deviceDetails.mqttPubTopic = data[9];
        that.regionLat = data[10];
        that.regionLng = data[11];
        that.deviceDetails.regionId = data[12];
        that.deviceDetails.deviceLat = data[10];
        that.deviceDetails.deviceLng = data[11];
        that.deviceDetails.iotCtrl = data[17];

        //debugger

        if (data[18] == "") {
          that.deviceDetails.alertCount = 1;
        }
        else {
          that.deviceDetails.alertCount = Number(data[18]);//1440 /
        }

        try {
          that.preRegion = that.deviceDetails.regionId
        } catch (e) {
          e = null;
        }

        that.GetHrs(that.deviceDetails.alertCount);

        //debugger

        (data[13] == "True") ? that.devActive = true : that.devActive = false;

        if (that._marker != undefined) {
          that._marker.setMap(null);
        }




        if (that.deviceDetails.deviceLng != "" && that.deviceDetails.deviceLng != undefined && that.deviceDetails.deviceLng != null) {
          var centerLatLng = new google.maps.LatLng(Number(data[10]), Number(data[11]));

          var marker = new google.maps.Marker({
            position: centerLatLng,
            map: that.map,
          });

          that.map.panTo(centerLatLng);
          that._marker = marker;
        }

        that.addDevice = "Edit Device | " + data[19];
        that.subClientId = data[20];
        that.modalRoot.show();

        this.hasMQTT = false;
        if (sessionStorage.getItem("hasMQTT") == "1") {


          this.hasMQTT = true;
          if (that.mqttConnected != true) {
            // that.initializeMQTT();
            // that.connectMQTT();
          }
        }
      }
    })
  }

  iotControls: any = []
  iotCtrlId: any = ""
  iotMqttTopic: any = ""
  iotMobileNos: any = ""
  iotDeviceId: any = ""

  showIotControls() {

    //iotCtrls
    this.iotCtrlId = []
    this.iotMobileNos = "";
    this.iotMqttTopic = "";
    this.iotDeviceId = "";

    this.iotControls = []

    this._devicedataservice.getIoTControllers().subscribe(result => {

      this.iotControls = result;

    });


    this.modalIotCtrl.show();

  }


  subClientId: any = "";
  clientName: any = "";
  clientFMail: any = "";
  clientPhno: any = "";
  subClientList: any = [];

  FillClientModal(cId: any) {
    //debugger

    var subClientDetails = this.subClientList.filter(gr => gr.clientId == cId);

    this.subClientId = "";

    this.subClientId = cId;
    this.clientName = subClientDetails[0].clientName;
    this.clientFMail = subClientDetails[0].financeMail;
    this.clientPhno = subClientDetails[0].financeContact;

  }

  loadSubClients() {
    var obj: any = {};

    this._devicedataservice.GetSubClient(obj).subscribe(result => {
      this.subClientList = result;
    })
  }

  showModalClient() {

    this.clientName = ""
    this.clientFMail = ""
    this.clientPhno = ""

    this.modalClient.show();
  }

  saveClient() {
    var obj: any = {}
    //debugger
    if (this.validateSubClient()) {
      obj.clientId = this.subClientId;
      obj.clientName = this.clientName;
      obj.financeMail = this.clientFMail;
      obj.financeContact = this.clientPhno;
      this._loaderService.display(true);
      var resp: any = {};
      this._devicedataservice.saveSubClient(obj).subscribe(result => {
        resp = result;
        this._loaderService.display(false);

        if (resp.sts == "200") {
          if (this.subClientId == "") {
            this.toastr.success('New Customer Added Sucessfully');
          }
          else {
            this.toastr.success('Customer Updated Sucessfully');
          }
          this.clearSubClientInputs();
          this.loadSubClients();
          this.showModalClient();
        }

      })
    }
  }

  clearSubClientInputs() {
    this.subClientId = "";
    this.clientName = "";
    this.clientFMail = "";
    this.clientPhno = "";
  }

  validateSubClient() {
    //debugger
    if (this.clientName == null || this.clientName == undefined || this.clientName == "") {
      this.toastr.warning('Client Name required')
      return false;
    }

    if (this.clientFMail == null || this.clientFMail == undefined || this.clientFMail == "") {
      this.toastr.warning('Client Finance Mail required')
      return false;
    }
    else {
      if (!this.comman.EmailID_REGX.test(this.clientFMail)) {
        this.toastr.warning("Invalid Finance Mail Id");
        return false;
      }
    }

    if (this.clientPhno == null || this.clientPhno == undefined || this.clientPhno == "") {
      this.toastr.warning('Finance Ph.no. required')
      return false;
    }
    if (!this.clientPhno.match("^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$")) {
      this.toastr.warning('Please check Finance Ph.no.');
      return false;
    }
    var subClientDetails: any = this.subClientList.filter(gr => gr.clientName == this.clientName && gr.financeMail == this.clientFMail && gr.financeContact == this.clientPhno);
    if (subClientDetails.length >= 1) {
      this.toastr.warning('This User Already Exist');
      return false;
    }
    return true;


  }

  configAndSave() {
    var cmd: any;


    var obj: any = {}

    obj.iotControl = this.iotCtrlId;
    obj.mobileNo = this.iotMobileNos;
    obj.mqttTopic = this.iotMqttTopic;
    obj.sendCommand = "Send";

    this.iotControls = []

    this._loaderService.display(true);
    this._devicedataservice.saveIotControl(obj).subscribe(result => {
      this.iotControls = result;

      this._loaderService.display(false);
    })

  }

  GetIotCtrlDetails() {

    var iotctrl: any = []

    iotctrl = this.iotControls.filter(gr => gr.iotControl == this.iotCtrlId);

    this.iotMobileNos = iotctrl[0].mobileNo;
    this.iotMqttTopic = iotctrl[0].mqttTopic;
    this.iotDeviceId = iotctrl[0].deviceIds;

  }

  saveIotControl() {
    var obj: any = {}

    obj.iotControl = this.iotCtrlId;
    obj.mobileNo = this.iotMobileNos;
    obj.mqttTopic = this.iotMqttTopic;

    this.iotControls = []

    this._loaderService.display(true);
    this._devicedataservice.saveIotControl(obj).subscribe(result => {
      this.iotControls = result;
      this._loaderService.display(false);
    })

  }

  bindRegionDatatoTable(data: any) {

    $('#tblRegions').dataTable().fnDestroy();

    var table = $('#tblRegions').DataTable({
      paging: data.length > 0 ? true : false,
      info: data.length > 0 ? true : false,
    });
    table.clear().rows.add(data).draw();

    jQuery('.dataTable').wrap('<div style="height:auto; overflow-y:auto;" />');
    var that = this;

    $('#tblRegions tbody ').on('click', 'td', function () {


      var index = this.cellIndex

      if (index == "3") {


        var data = $(this).parent();
        var table = $('#tblRegions').DataTable();
        var data = table.row(data).data();

        that.sIdShow = false;
        that.regionId = data[4];
        that.regionName = data[0];
        that.regionLat = data[1];
        that.regionLng = data[2];


        if (that._marker != undefined) {
          that._marker.setMap(null);
        }

        if (that.regionLat != "" && that.regionLat != undefined && that.regionLat != null) {
          var centerLatLng = new google.maps.LatLng(Number(data[1]), Number(data[2]));

          var marker = new google.maps.Marker({
            position: centerLatLng,
            map: that.Rmap,
          });

          that.Rmap.panTo(centerLatLng);
          that._marker = marker;
        }

        that.modalRegion.show();


      }
    })
  }

  getWhitListedDevices() {


    this._devicedataservice.getWhiteListedDeviceDetails().subscribe(result => {


      var devices: any = []
      devices = result;

      this.whiteListedDeviceIdList = [];
      devices.forEach(dev => {

        this.whiteListedDeviceIdList.push({
          deviceid: dev.sensorid
        });
      });

    });
  }

  OpenModal(obj: any, savemode: any) {


    this.data = [];
    this.deviceDetails = [];
    this.sIdShow = true;
    this.addDevice = "Add Device";
    this.deleteShow = false;
    this.devActive = true;
    this.deviceid = [];

    this.deviceDetails.alertCount = 1440 / 360;

    this.GetHrs(this.deviceDetails.alertCount);

    this.modalRoot.show();

    this.hasMQTT = false;
    if (sessionStorage.getItem("hasMQTT") == "1") {

      this.hasMQTT = true;
      if (this.mqttConnected != true) {
        this.initializeMQTT();
        this.connectMQTT();

        this.deviceDetails.mqttPubTopic = sessionStorage.getItem("MQTT_PubTopic");
      }
    }
  }

  allowNumericsOnly(evt) {
    //debugger
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    //|| this.clientPhno.length == 10
    //43 95
    if (charCode == 43 || charCode == 45) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      console.log(charCode);
      return false;
    }
    return true;
  }

  allowAlphaNumericsndSpace(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;


    // if (charCode == 32 || (charCode > 48 && charCode < 57)
    // || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
    //   return true;
    // }

    if (charCode == 35 || charCode == 36 || charCode == 34 || charCode == 95 || charCode == 124) {
      return false;
    }

    return true;
  }

  deviceFrequency: any

  saveDevice(isValid: any, obj: any) {

    debugger
    isValid = true;

    if (this.deviceid == '' || this.deviceid == undefined || this.deviceid == null) {
      this.toastr.warning('Please select device Id');
      isValid = false;
    }
    else if (obj.deviceName == '' || obj.deviceName == undefined || obj.deviceName.replace(/\s/g, "") == '') {

      this.toastr.warning('Please select device name');

      isValid = false;
    }
    else if (this.deviceDetails.regionId == '' || this.deviceDetails.regionId == undefined
      || this.deviceDetails.regionId == null) {

      this.toastr.warning('Please select Region');

      isValid = false;
    }
    else if (this.deviceDetails.alertCount == '' || this.deviceDetails.alertCount == undefined
      || this.deviceDetails.alertCount == null || this.deviceDetails.alertCount == null) {

      this.toastr.warning('Please select Alert limit Per Day');

      isValid = false;
    }

    if (this.isSuperAdmin && this.showClientManagement) {
      if (this.subClientId == '' || this.subClientId == undefined
        || this.subClientId == null || this.subClientId == null) {
        this.toastr.warning('Pleas select Client');
        isValid = false;
      }
    }
    // else
    // if(item.alertCount)

    // else if (((this.regionLat == '' || this.regionLat == undefined) &&
    //   (this.regionLng == '' || this.regionLng == undefined))
    //   && (obj.devregionId == '' || obj.devregionId == undefined)) {
    //   
    //   this.toastr.warning('Please select device location using Region or MAP');
    //   isValid = false;
    // }
    // //regionLng
    // 
    // if (this.lastDate.length != 0) {
    //   obj.lastDate = this._detailService.dateToYYYYMMDDHHMM(this.lastDate);
    // }

    // if (this.nextDate.length != 0) {
    //   obj.nextDate = this._detailService.dateToYYYYMMDDHHMM(this.nextDate);

    //   obj.alertDay = this.alertDay;
    //   
    //   if (obj.nextDate != null && obj.nextDate != [] && obj.nextDate != undefined) {
    //     var dateDiff: any = []

    //     dateDiff = this.nextDate - this.minDate;
    //     dateDiff = dateDiff / 1000 / 60 / 60 / 24;
    //     dateDiff = dateDiff.toFixed(0)
    //     
    //     var trigger: Number = 0;
    //     if (this.alertDay == null || this.alertDay == undefined || this.alertDay == '') {
    //       isValid = false;
    //       this.toastr.warning('Please Select Alert Before Day(s)')
    //     }
    //     else {
    //       trigger = +this.alertDay
    //       if (dateDiff > 0) {
    //         if (dateDiff < trigger) {
    //           isValid = false;
    //           this.toastr.warning('Next Maintenance Date Sholud be \r\ngreater than Alert Before Day(s)')
    //         }
    //       }
    //       else {
    //         isValid = false;
    //         this.toastr.warning('Next Maintenance Date Sholud not be Today')
    //       }
    //     }
    //   }
    // }

    if (isValid) {


      obj.deviceLat = this.regionLat
      obj.deviceLng = this.regionLng
      obj.deviceId = this.deviceid;
      this.deviceFrequency = obj.frequency;

      obj.mqttPubTopic = this.deviceDetails.mqttPubTopic;
      obj.regionId = this.deviceDetails.regionId;
      obj.iotCtrl = this.deviceDetails.iotCtrl;
      obj.loginId = this.comman.getLoginUserID();
      obj.alertCount = this.deviceDetails.alertCount;

      obj.subClientId = this.subClientId;
      // obj.devActive=
      (this.devActive == true) ? obj.devActive = '1' : obj.devActive = '0';



      this._devicedataservice.onBoardDevice(obj).subscribe(data => {

        var result: any = [];
        result = data;

        if (result.sts == "200") {
          this.toastr.success(result.msg);
          //this.deviceid = []
          this.deviceDetails = new DeviceDetails();

          this.deviceDetails.shortcode = [];
          this.getWhitListedDevices();
          this.getOnBoardedDevices();
          this.sendCommand();
          this.modalRoot.hide();
          this.formatLogUpdate(result.msg.includes('onboarded') ? 'onboarded' : 'updated', obj);
          if (!result.msg.includes('onboarded')) {
            this.formatDeviceLogUpdate('configured', obj);
          }
          var jsonData = {
            "userID": sessionStorage.getItem("LOGINUSERID")
          }

          this._trackingService.getUserDevices(jsonData).subscribe(

            result => {

              this.deviceListData = []
              this.deviceListData = result;
              this.deviceListData = this.deviceListData;
              sessionStorage.setItem("USER_DEVICES", JSON.stringify(this.deviceListData));
            });
        }
        else {
          this.toastr.warning("Device not updated");
        }
      })
    }
  }

  formatLogUpdate(action: string, obj) {


    try {
      let regObj = this.regionsList.find(x => x.regionId == obj.regionId);
      let formatedString = "DeviceId: " + obj.deviceId +
        ", Device Name: " + obj.deviceName +
        ", Frequency (Mins): " + obj.frequency +
        ", Region/Facility: " + regObj.regionName +
        ", isActive: " + (obj.devActive == "1" ? true : false) +
        ", mqttPubTopic: " + obj.mqttPubTopic +
        ", latitude: " + this.regionLat +
        ", longitude: " + this.regionLng;
      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Device Management",
        "actionPerformed": "Device has been " + action + ". Device info -" + formatedString
      }

      this.comman.logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

  formatDeviceLogUpdate(action: string, obj) {


    try {
      let regObj = this.regionsList.find(x => x.regionId == obj.regionId);
      let formatedString = "DeviceId: " + obj.deviceId +
        ", Device Name: " + obj.deviceName +
        ", Frequency (Mins): " + obj.frequency +
        ", Region/Facility: " + regObj.regionName +
        ", isActive: " + (obj.devActive == "1" ? true : false) +
        ", mqttPubTopic: " + obj.mqttPubTopic +
        ", latitude: " + this.regionLat +
        ", longitude: " + this.regionLng;
      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Device Management",
        "deviceId": obj.deviceId,
        "actionPerformed": "Device has been " + action + ". Device info -" + formatedString
      }

      this.comman.device_logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

  isDiffRegion: boolean = false;

  GetRegionDetails(event: any) {

    var obj: any;
    obj = [];
    obj.regionId = event.regionId;

    this.isDiffRegion = false;
    if (this.preRegion !== event.regionId) {
      this.isDiffRegion = true;
    }
    var regDetails: any
    this._devicedataservice.getRegion(obj).subscribe(result => {

      regDetails = result;
      this.regionLat = regDetails[0].regionLat;
      this.regionLng = regDetails[0].regionLng;

      if (this._marker != undefined) {
        this._marker.setMap(null);
      }

      if (this.regionLng != "" && this.regionLng != undefined && this.regionLng != null) {
        var centerLatLng = new google.maps.LatLng(Number(regDetails[0].regionLat), Number(regDetails[0].regionLng));

        var marker = new google.maps.Marker({
          position: centerLatLng,
          map: this.map,
        });

        this.map.panTo(centerLatLng);
        this._marker = marker;
      }
    });
  }
  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
  }

  onConnect() {

    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    this.mqttClient.subscribe("World");
    var message = new Paho.MQTT.Message("Hello");
    message.destinationName = "World";
    this.mqttClient.send(message);
  }

  goAssign() {
    this.router.navigateByUrl('/pages/master/assignTracker');
  }

  data = [];
  getDataFormat(event) {

    this.data = [];
    this.deviceDetails = [];
    this.deviceid = event.sensorid;

    this.deviceDetails.mqttPubTopic = sessionStorage.getItem("MQTT_PubTopic");

  }

  addId(datKey: string) {


    if (this.showKey.indexOf(datKey) > -1) {
      this.showKey.pop(datKey);
    }
    else {
      this.showKey.push(datKey);
    }
  }

  DeleteDevice() {

    this.deviceid

    var res: any

    Swal({
      title: "All Device data will be removed, Do you really want to delete?",// this._translate.instant('SetUpDoYouProceedAlert'),
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

        this._devicedataservice.deleteDevice(this.deviceid).subscribe(result => {


          res = result;

          if (res.sts == "200") {

            this.toastr.success(res.msg);
            this.modalRoot.hide();
            this.getOnBoardedDevices();

            let obj = Object.assign({}, this.deviceDetails);
            obj.deviceId = this.deviceid;
            this.formatLogUpdate('deleted', obj);
            this.formatDeviceLogUpdate('deleted', obj);
          }
          else {
            this.toastr.warning(res.msg);
          }
        });
      }

    })


  }

  popupClose(event) {
    debugger;
    console.log(event);
  }
}

export class CheckKey {
  public key: boolean;
}

export class DeviceDetails {
  public sensorid: string;
  public deviceName: string;
  public shortcode: string;
  public frequency: string;
  public mqttPubTopic: string;
  public deviceLat: string;
  public deviceLng: string;
  public regionId: string;
  public iotCtrl: string;
  public alertCount: string;
}
