import { Component, OnInit } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import { Toast, ToastrService } from 'ngx-toastr';
import { AssignService } from './service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit {

  constructor(
    private router: Router,
    private _commonService: IdeaBService,
    public _serviceassignTracker: AssignService,
    private loaderService: LoaderService,
    private toastr: ToastrService) { }

  userList: any = "";
  sessionData: any = [];
  _userInfo = new userInfo();
  assignedDevice: any = [];
  responseData: any = []
  isDisabled: boolean = false;
  userLevels: any = []
  bgImage: any;
  userLevel: any = []

  clientRegions: any = []
  selectedRegion: any = []
  DeviceList: any;

  ngOnInit() {



    this.userLevels.push({ userLevel: 'Level2 | Admin', userLevelId: '3' },
      { userLevel: 'Level3 | SuperVisor', userLevelId: '2' },
      { userLevel: 'Level4 | Operator', userLevelId: '1' });

    sessionStorage.setItem('liveScreen', "assign");
    this.bgImage = sessionStorage.getItem('BGimage');

    this.isDisabled = false;

    this._serviceassignTracker.getUserDetails().subscribe(data => {

      this.userList = data.userData;
    });

    this.DeviceList = [];

    this.sessionData = JSON.parse(sessionStorage.getItem("USER_DEVICES"));



    var DisplayIcon = ' <i class="fa fa-arrow-circle-right" style="padding-left:30px;font-size:18px;cursor:pointer" title="Assign" ></i>'



    this.sessionData.forEach(element => {
      this.DeviceList.push([
        element.deviceName,
        DisplayIcon,
        element.sensorId,
        element.regionId])
    });

    this.bindDevicetoTable(this.DeviceList);

    var cRegions: any = []
    cRegions = JSON.parse(sessionStorage.getItem('Regions'));

    this.clientRegions = []
    this.selectedRegion = []

    cRegions.forEach(cR => {


      for (let ri = 0; ri < this.DeviceList.length; ri++) {

        var regCnt = this.clientRegions.filter(r => r.regionId.toLowerCase() == this.DeviceList[ri][3].toLowerCase());


        if (regCnt.length == 0) {
          const regId = this.DeviceList[ri][3];

          var dR = cRegions.filter(r => r.regionId.toLowerCase() == regId.toLowerCase());

          this.clientRegions.push({
            regionId: dR[0].regionId,
            regionName: dR[0].regionName,
            regionLat: dR[0].regionLat,
            regionLng: dR[0].regionLng
          })
        }
      }


    });

  }

  goDevices() {
    this.router.navigateByUrl('/pages/master/deviceManagement');
  }

  changeRegion() {

    debugger

    if (this.selectedRegion != null && this.selectedRegion != undefined) {

      var devices: any = []

      for (let di = 0; di < this.DeviceList.length; di++) {
        const dev = this.DeviceList[di];

        if (this.DeviceList[di][3].toLowerCase() == this.selectedRegion.toLowerCase()) {
          debugger
          devices.push(dev);
        }
      }

      this.bindDevicetoTable(devices);

    }
    else {
      this.bindDevicetoTable(this.DeviceList);
    }
  }

  bindDevicetoTable(data: any) {
    $('#allDevices').dataTable().fnDestroy();
    var table = $('#allDevices').DataTable({
      // paging: data.length > 0 ? true : false,
      // info: data.length > 0 ? true : false,
      paging: false,
      info: false,

    });
    table.clear().rows.add(data).draw();

    var that = this;
    $('#allDevices tbody').on('click', 'td', function () {


      var Index = this.cellIndex

      if (Index == "1") {
        var data = $(this).parent();
        var table = $('#allDevices').DataTable();
        data = table.row(data).data();
        if (that._userInfo.userID !== undefined && that._userInfo.userID !== ''
          && that._userInfo.userID !== null) {

          var DisplayIcon = ' <i class="fa fa-trash" style="padding-left:30px;font-size:18px;cursor:pointer" title="Remove" ></i>'


          var find: any = "0";

          if (that.responseData != undefined && that.responseData.length != 0) {

            that.responseData.forEach(element => {

              if (element.DeviceId == data[2]) {
                find = "1";
              }
            });

          }

          if (find == "0") {

            that.responseData.push({ DeviceName: data[0], DeviceId: data[2] })

            // that.assignedDevice.push([data[0],
            //   DisplayIcon]);

            //that.bindDevicetoATable(that.assignedDevice);
          }
          else {
            that.toastr.warning("Already Assigned");
          }
        }
        else {
          that.toastr.warning("Please select user");
        }
      }

    });

  }

  onchange(data: any) {



    //this.bindDevicetoATable([]);

    if (data == undefined) {
    }
    else {

      var inputData = { loginId: data.userID }

      var uL: any = []

      uL = this.userList.filter(g => g.userID == data.userID)

      this.userLevel = uL[0].escalationLevel;

      this._serviceassignTracker.getAssignedTracker(inputData).subscribe(result => {


        this.responseData = [];
        this.assignedDevice = [];

        var DisplayIcon = ' '

        this.responseData = result;



      });

      this.isDisabled = false;

    }
  }

  removeDeviceFromAssigned(deviceId: any) {

    this.reassignDevices(deviceId);

  }

  // bindDevicetoATable(data: any) {
  //   $('#assignedDevices').dataTable().fnDestroy();
  //   var table = $('#assignedDevices').DataTable({
  //     paging: false,
  //     info: false,
  //   });
  //   table.clear().rows.add(data).draw();

  //   var that = this;

  //   $('#assignedDevices tbody').on('click', 'td', function () {


  //     var Index = this.cellIndex

  //     if (Index == "1") {
  //       var data = $(this).parent();
  //       var table = $('#assignedDevices').DataTable();
  //       data = table.row(data).data();

  //       

  //       that.reassignDevices(data[0]);


  //     }
  //   });
  // }

  reassignDevices(deviceId: any) {
    var DisplayIcon = ' <i class="fa fa-trash" style="padding-left:30px;font-size:18px;cursor:pointer" title="Remove" ></i>'

    var preAssigned;
    preAssigned = []

    this.isDisabled = true;

    var obj: any = {}

    obj.userID = this._userInfo.userID
    obj.DeviceId = deviceId

    var devResp: any

    this.loaderService.display(true);
    this._serviceassignTracker.CheckDevice(obj).subscribe(result => {

      devResp = result

      this.loaderService.display(false);

      if (devResp.sts == "") {
        preAssigned = []
        this.responseData.forEach(element => {

          if (element.DeviceId != deviceId) {
            preAssigned.push({ DeviceId: element.DeviceId, DeviceName: element.DeviceName })

          }
        });


        this.responseData = []
        this.responseData = preAssigned
        this.toastr.success('Click on save button to commit the changes');

        this.isDisabled = false;
        //this.bindDevicetoATable(this.assignedDevice);
      }
      else {
        this.toastr.warning("Already assigned to next level(s), Device can't be deleted");

        this.isDisabled = false;
      }
    })
  }

  saveData() {



    if (this._userInfo.userID !== undefined && this._userInfo.userID !== "" && this._userInfo.userID !== null) {
      var selected: any = [];

      let selectedDevString = "";
      this.responseData.forEach(element => {
        selectedDevString += element.DeviceId + ","
        selected.push({ devId: element.DeviceId });
      }
      );


      var inputData = {
        //clientID: this._commonService.getClientID(),
        userID: this._userInfo.userID,
        assignTracker: selected,
        loginID: this._commonService.getLoginUserID(),
        escalationLevel: this.userLevel
      }

      var resultList: any;

      this.loaderService.display(true);


      this._serviceassignTracker.insertAssingedTracker(inputData).subscribe(result => {
        resultList = result;

        if (resultList.sts == "200") {
          this.toastr.success("Updated Successfully");

          this.formatLogUpdate(selectedDevString);

          this._serviceassignTracker.getUserDetails().subscribe(data => {

            this.userList = data.userData;
          });

          this.loaderService.display(false);
        }
        else {
          this.loaderService.display(false);
          this.toastr.warning(resultList.msg);
        }
      });
    } else {
      this.toastr.warning("Please select user");
    }
  }


  formatLogUpdate(selectedDevices: any) {


    try {
      let userObj = this.userList.find(x => x.userID == this._userInfo.userID);
      let logReq = {
        "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
        "module": "Device Management",
        "actionPerformed": "Devices has been assigned to -" + userObj.userName + ", Devices info -" + selectedDevices.substring(0, selectedDevices.length - 1)
      }

      this._commonService.logUpdate(logReq);
    } catch (e) {
      e = null;
    }
  }

}


export class userInfo {
  userID: string;
}
