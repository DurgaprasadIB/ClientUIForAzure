import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TrackerAdding } from '../modal/tracker-adding';
import { TrackerServiceService } from '../../GlobalServices/tracker-service.service';
import { ToastrService } from 'ngx-toastr';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SessionupdateService } from '../../GlobalServices/sessionupdate.service';

import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import { TranslateService } from '@ngx-translate/core';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-tracker-management',
  templateUrl: './tracker-management.component.html',
  styleUrls: ['./tracker-management.component.css']
})

export class TrackerManagementComponent implements OnInit {
  @Output() userAction = new EventEmitter();
  @ViewChild("TrackerSearch") trackerSearch: ElementRef;
  @ViewChild("E1") e1: ElementRef;
  @ViewChild("E2") e2: ElementRef;
  @ViewChild('changeState') changeStateRef: ElementRef;


  bgImage:any;
  dataset: any;
  TrackerId: number;
  trackerDetails: any = new TrackerAdding();
  trackerList: any = [];
  whiteListedIMEIList: any;
  trackekrDtlList: any;
  assetTypesDrpList: any;
  timeZonesDrpList: any;
  sensorNamesList: any;
  vendorDetailsList: any;
  fuelTypeDetailsList: any;
  assetSpeedLimitList: any;
  assetYearList: any;
  tracker = new Tracker();
  ResponseList: any;
  IMEIId1: any;
  IMSI: any;
  editOrSave: any = -1;
  modelYear: any;
  fuelType: any;
  speedLimit: any;
  assetYear: any;
  trackerType: string;
  deviceTypeList: any;
  sensorState: boolean;

  peopleTracker: any = {};
  vehicleTracker: any = {};
  minDate: any;
  isShowFooter: boolean = false;
  responselist: any;

  @ViewChild('Modalbtn') modalClient: ElementRef;
  @ViewChild('modalRoot') modalRootPopUp: any;
  @ViewChild('Validity') Validity: ElementRef;


  constructor(private _trackerService: TrackerServiceService,
    private toastr: ToastrService,
    private comman: IdeaBService,
    private loaderService: LoaderService,
    private _UpdatingSessionStorage: SessionupdateService,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {

    
    this.bgImage = sessionStorage.getItem('logoImage');
    var currentDate = new Date(new Date().setDate(new Date().getFullYear() + 1));
    this.trackerDetails.assetValidity = currentDate.toString();
    this.minDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.modelYear = false;
    this.fuelType = false;
    this.speedLimit = false;
    this.sensorState = false;
    this.TrackerId = -1;
    if (this.TrackerId == -1 || this.TrackerId == undefined) {
      this.TrackerId = -1;
    }
    this.dataBindTable();
  }

  disableSaveButton: boolean = false;

  dataBindTable() {
    debugger;
    this.isShowFooter = false;
    this.loaderService.display(true);
    this.tracker.loginId = this.comman.getLoginUserID();
    this._trackerService.getTrackerDetailData(this.tracker).subscribe(result => {
      this.loaderService.display(false);
      this.trackekrDtlList = result;
      this.assetTypesDrpList = this.trackekrDtlList.assetTypes;
      this.timeZonesDrpList = this.trackekrDtlList.timeZone;
      this.sensorNamesList = this.trackekrDtlList.sensorNames;
      this.whiteListedIMEIList = this.trackekrDtlList.whiteListedIMEI;

      if (this.whiteListedIMEIList.length == 0) {
        this.disableSaveButton = true;
      }

      this.vendorDetailsList = this.trackekrDtlList.vendorDetails;
      this.fuelTypeDetailsList = this.trackekrDtlList.fuelTypeDetails;
      this.assetSpeedLimitList = this.trackekrDtlList.assetSpeedLimit;
      this.assetYearList = this.trackekrDtlList.assetYear;
      this.trackerList = this.trackekrDtlList.trackerNames;
      this.deviceTypeList = this.trackekrDtlList.deviceTypes;

      this._UpdatingSessionStorage.sessionUpdate();

      if (this.trackerList.length > 0) {
        this.isShowFooter = true;
      }

      this.TableRefreshData();


    }, error => {
      this.TableRefreshData();
    });

  }

  TableRefreshData() {

    var table1 = $('#trackerTable').DataTable();
    var pageNo = table1.page.info().page;
    var pagelen = table1.page.info().pages;
    var pageSize = table1.page.len();
    var order = table1.order();
    var search = table1.search();
    debugger

    $('#trackerTable').DataTable().destroy();

    setTimeout(() => {

      var table = $('#trackerTable').DataTable({
        "order": [], "sort": [],
        'columnDefs': [{
          'targets': [8], /* column index */
          'orderable': false, /* true or false */
        }],
        searching: this.isShowFooter,
        paging: this.isShowFooter,
        info: this.isShowFooter,
        "pageLength": pageSize,
      });

      table.order([order[0][0], order[0][1]]).search(search).draw();

      try {
        if (pagelen > pageNo) {
          $('#trackerTable').dataTable().fnPageChange(pageNo);
        }
      } catch (e) {
        e = null;
      }

      jQuery('.dataTable').wrap('<div style="height:72vh;overflow-y:auto;" />');
    });
  }

  datasource: any;
  ResponseList1: any;

  onLoadData() {

    this.dataset = [];
    for (let i = 0; i < this.trackerList.length; i++) {
      this.dataset[i] = {
        id: i, // again VERY IMPORTANT to fill the "id" with unique values
        assetName: this.trackerList[i].assetName,
        assetRegNo: this.trackerList[i].assetRegNo,
        IMEIId: this.trackerList[i].IMEIId,
        simNo: this.trackerList[i].simNo,
        assetTypeName: this.trackerList[i].assetTypeName,
        speedLimit: this.trackerList[i].speedLimit,
        assetValidity: this.trackerList[i].assetValidity.day + "/" + this.trackerList[i].assetValidity.month + "/" + this.trackerList[i].assetValidity.year,
        description: this.responselist[i].descr,
        ownerName: this.trackerList[i].ownerName,
      };
    }
    this.ResponseList1 = this.dataset;
  }
  result: boolean = false;
  ResponseData: any;
  checkMobileNo: boolean = false;
  flag: boolean = false;

  conditionBasedGrid: boolean = false;

  saveTracker(isForm: boolean, tackerdetails: any) {

    // debugger
    var date = this.Validity.nativeElement.value;
    if (date != "" && date !== undefined) {
      date = date.split('/');
      tackerdetails.assetValidity = {
        year: date[2],
        month: date[0],
        day: date[1]
      };
    } else {
      this.toastr.warning(this.translate.instant("TrSelectValidity"));
      return false;
    }

    this.flag = this.validations(tackerdetails);
    if (this.flag) {
      if (this.TrackerId == -1) {

        tackerdetails.saveMode = "Create";
        tackerdetails.installedSensors = this.sensors.toString();
        tackerdetails.sendAlert = true;
        tackerdetails.AssetStatus = true;
        tackerdetails.loginID = this.comman.getLoginUserID();
        this.loaderService.display(true);
        this._trackerService.saveTrackerData(tackerdetails).subscribe(result => {
          this.ResponseData = result;
          if (this.ResponseData.HTTPStatus == "200") {
            this.toastr.success(this.ResponseData.Message);
            this.modalRootPopUp.hide();
            this.loaderService.display(false);
            //$('#trackerTable').dataTable().fnDestroy();
            this.dataBindTable();
          }
          else {
            this.loaderService.display(false);
            this.toastr.warning(this.ResponseData.Message);
          }
          this.loaderService.display(false);

        }, error => {
          this.loaderService.display(false);
          this.toastr.warning(error.error.Message);
        });
      }
      else {
        //  debugger
        tackerdetails.installedSensors = this.sensors.toString();
        tackerdetails.saveMode = "Modify";
        tackerdetails.loginID = this.comman.getLoginUserID();
        this.loaderService.display(true);
        this._trackerService.saveTrackerData(tackerdetails).subscribe(result => {
          this.ResponseData = result;
          if (this.ResponseData.HTTPStatus == "200") {
            this.toastr.success(this.ResponseData.Message);
            this.modalRootPopUp.hide();
            // $('#trackerTable').dataTable().fnDestroy();
            this.dataBindTable();

          }
          else {
            this.loaderService.display(false);
            this.toastr.warning(this.ResponseData.Message);
          }
          this.loaderService.display(false);
        },
          error => {
            this.loaderService.display(false);
            this.toastr.warning(error.error.Message);
          });
      }
    }

  }

  validations(tackerdetails) {
    //debugger
    if (tackerdetails.IMEIId == "" || tackerdetails.IMEIId === undefined || tackerdetails.IMEIId == null) {
      this.toastr.warning(this.translate.instant("TrSelectImei"));
      return false;
    }
    else if (tackerdetails.deviceType == "" || tackerdetails.deviceType === undefined || tackerdetails.deviceType == null) {
      this.toastr.warning(this.translate.instant("TrValidDeviceType"));
      return false;
    }
    else if (tackerdetails.assetName == "" || tackerdetails.assetName === undefined) {
      this.toastr.warning(this.translate.instant("TrValidFriendlyName"));
      return false;
    }

   
    else if (tackerdetails.assetName.match(/^[0-9 ]+$/g) || tackerdetails.assetName.match(/^[ ]+$/g)) {
      this.trackerDetails.assetName = "";
      this.toastr.warning(this.translate.instant("TrFriendlyName") + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (!this.comman.AcceptFirstChar_REGX.test(tackerdetails.assetName.trim())) {
      this.toastr.warning(this.translate.instant('TrFriendlyNameStarts'));
      return false;
    }
    else if (tackerdetails.assetName.startsWith(" ")) {
      this.toastr.warning(this.translate.instant("TrFriendlyName") + " " + this.translate.instant("SpacesValidation"));
      return false;
    }

    else if (!this.comman.nameLengthCheck(tackerdetails.assetName)) {
      this.toastr.warning(this.translate.instant('TrFriendlynameLengthCheckText'));
      return false;
    }
    else if (tackerdetails.assetRegNo == "" || tackerdetails.assetRegNo === undefined) {
      this.toastr.warning(this.translate.instant("TrValidRegNo"));
      return false;
    }

    else if (tackerdetails.assetRegNo.match(/^[0-9 ]+$/g) || tackerdetails.assetRegNo.match(/^[ ]+$/g)) {
      this.trackerDetails.assetRegNo = "";
      this.toastr.warning(this.translate.instant("TrRegNo") + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (!this.comman.AcceptFirstChar_REGX.test(tackerdetails.assetRegNo.trim())) {
      this.toastr.warning(this.translate.instant('TrRegNoStarts'));
      return false;
    }  
    else if( !(tackerdetails.assetRegNo.length>2 && tackerdetails.assetRegNo.length<=15) ){
      this.toastr.warning(this.translate.instant('TrRegNoMaxMin'));
      return false;
    }
    else if (tackerdetails.assetRegNo.startsWith(" ")) {
      this.toastr.warning(this.translate.instant("TrRegNo") + " " + this.translate.instant("SpacesValidation"));
      return false;
    }
    else if (tackerdetails.assetType == "" || tackerdetails.assetType === undefined || tackerdetails.assetType == null) {
      this.toastr.warning(this.translate.instant("TrValidAssetType"));
      return false;
    }

    else if ((tackerdetails.speedLimit == "" || tackerdetails.speedLimit === undefined ||
      tackerdetails.speedLimit == null) && (this.speedLimit != false)) {
      this.toastr.warning(this.translate.instant("TrValidSpeedLimit"));
      return false;
    }

    else if (tackerdetails.timeZone == "" || tackerdetails.timeZone === undefined || tackerdetails.timeZone == null) {
      this.toastr.warning(this.translate.instant("TrValidTimeZone"));
      return false;
    }
    else if (tackerdetails.ownerName == "" || tackerdetails.ownerName === undefined) {
      this.toastr.warning(this.translate.instant("TrValidOwnerName"));
      return false;
    }
    else if (tackerdetails.ownerName.match(/^[0-9 ]+$/g) || tackerdetails.ownerName.match(/^[ ]+$/g)) {
      this.trackerDetails.ownerName = "";
      this.toastr.warning(this.translate.instant("TrOwner Name") + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (!this.comman.AcceptFirstChar_REGX.test(tackerdetails.ownerName.trim())) {
      this.toastr.warning(this.translate.instant('TrownerNameStarts'));
      return false;
    }
    //gOPI ownerNameLength
    else if (!this.comman.nameLengthCheck(tackerdetails.ownerName)) {
      this.toastr.warning(this.translate.instant("TrownerNameLength"));
      return false;
    }

    else if (tackerdetails.ownerName.startsWith(" ")) {
      this.toastr.warning(this.translate.instant("TrOwner Name") + " " + this.translate.instant("SpacesValidation"));
      return false;
    }

    else if (tackerdetails.ownerMobileNo == "" || tackerdetails.ownerMobileNo === undefined) {
      this.toastr.warning(this.translate.instant("TrOwnerContactNo"));
      return false;
    }
    // else if (tackerdetails.ownerMobileNo.length != "10") {
    //   this.toastr.warning(this.translate.instant("TrOwnerContatLength"));
    //   return false;
    // }
    // else if ((this.checkMobileNo = this.checkMobileNumber()) == false) {
    //   this.toastr.warning(this.translate.instant("TrOwnetStartsWith"));
    //   return false
    // }
    else {
      return true;
    }


  }

  trackekrDtlList1: any;
  OpenModal(IMEI, status) {
    // debugger
    this.IMEIId1 = "";
    if (status == 'create') {

      this.trackerDetails = new TrackerAdding();
      this.editOrSave = -1;
      this.TrackerId = -1;
      this.trackerDetails.sendAlert = true;
      var currentDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      this.trackerDetails.assetValidity = currentDate;
      this.Validity.nativeElement.style.borderLeft = "1px solid #42A948";
      this.modelYear = false;
      this.fuelType = false;
      this.speedLimit = false;
      this.assetYear = false;
      this.vehicleTracker = {};
      this.peopleTracker = {};
      this.trackerDetails.AssetStatus = true;
      this.trackerType = this.translate.instant('TrOpenInCreateMode')
      this.sensors = [];
      this.e1.nativeElement.style.borderLeft = "";
      (<any>this.changeStateRef).setDisabledState(false);
      this.sensorState = false;
    }
    else {
      this.disableSaveButton = false;
      this.IMEIId1 = IMEI;
      this.modalRootPopUp.show();
      this.sensors = [];
      this.e1.nativeElement.style.borderLeft = "";
      this.e2.nativeElement.style.borderLeft = "";
      this.trackerType = this.translate.instant('TrOpenInEditMode');
      this.vehicleTracker = {};
      this.peopleTracker = {};
      this.editOrSave = 1;
      this.tracker.loginId = this.comman.getLoginUserID();
      this.tracker.IMEIId = IMEI;
      this.TrackerId = this.tracker.IMEIId;
      //debugger
      this._trackerService.getTrackerDetailData(this.tracker).subscribe(result => {
        this.trackekrDtlList1 = result;
        //debugger 
        this.trackerDetails = this.trackekrDtlList1.trackerNames[0];
        this.sensors = this.trackerDetails.installedSensors.split(",");

        this.trackerDetails.assetYear = this.trackerDetails.assetYear != "" ? this.trackerDetails.assetYear : null;
        this.trackerDetails.assetFuelType = this.trackerDetails.assetFuelType != "" ? this.trackerDetails.assetFuelType : null;

        if (this.trackerDetails.assetType == "10") {
          this.fuelType = false;
          this.speedLimit = false;
          this.modelYear = true;
          this.assetYear = true;
          this.sensorState = false;
        }
        else {
          this.modelYear = true;
          this.fuelType = true;
          this.speedLimit = true;
          this.assetYear = true;
          this.sensorState = true;
        }
        // debugger;
        this.trackerDetails.assetType = Number(this.trackerDetails.assetType);
        this.trackerDetails.vendorCode = null;
        if (this.trackerDetails.assetValidity != "" || this.trackerDetails.assetValidity !== undefined) {
          this.trackerDetails.assetValidity = new Date(this.trackerDetails.assetValidity.year,
            this.trackerDetails.assetValidity.month - 1,
            this.trackerDetails.assetValidity.day);
        }

        if (this.sensors != "") {
          for (var i = 0; i < this.sensors.length; i++) {
            this.trackerDetails[this.sensors[i]] = true;
          }
        }
        (<any>this.changeStateRef).setDisabledState(true);
        this.tracker = new Tracker();
      },
        error => {
          this.toastr.warning(error.error.Message);
        });
    }
  }

  responseDeleteData: any;
  sessionData: any;
  DeleteTracker() {  // DELETE WHITELIST TRACKERS 

    if (this.IMEIId1 != 0) {


      Swal({
        title: this.translate.instant("TrAreYouSure"),
        text: this.translate.instant("TrDeleteConfirmPopUp"),
        type: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: this.translate.instant('Cancel'),
        confirmButtonText: this.translate.instant('SwalYes')
      }).then((result1) => {
        if (result1.value) {
          this.tracker.loginId = this.comman.getLoginUserID();
          this.tracker.IMEIId = this.IMEIId1;
          this.loaderService.display(true);
          this._trackerService.deleteTrackerById(this.tracker).subscribe(result => {
            this.responseDeleteData = result;
            if (this.responseDeleteData.HTTPStatus == "200") {
              this.toastr.success(this.responseDeleteData.Message);
              this.tracker = new Tracker();
              this.modalRootPopUp.hide();

              //$('#trackerTable').dataTable().fnDestroy();
              this.dataBindTable();
            }
            else {
              this.loaderService.display(false);
              this.toastr.warning(this.responseDeleteData.Message);
            }
            this.loaderService.display(false);
          },
            error => {
              this.toastr.warning(error.error.Message);
            }
          );
        }
      });
    }
  }

  getImsiData: any;
  getImsINumber(event: any) {
    if (event == undefined) {
      this.trackerDetails.IMSI = "";
    }
    else {

      this.tracker.loginId = this.comman.getLoginUserID();
      this.tracker.IMEI = event.IMEI;
      this.tracker.clientid = this.comman.getClientID();

      this._trackerService.getImsINumber(this.tracker).subscribe(result => {
        this.getImsiData = result;
        this.trackerDetails.IMSI = this.getImsiData.IMSI;
      }, error => {
        this.toastr.warning(error.error.Message);
      });
    }
  }


  hideElementsBasedOnCond(event) {

    if (event == undefined) {
      this.modelYear = false;
      this.fuelType = false;
      this.speedLimit = false;
      this.assetYear = false;

      this.sensorState = false;
    } else if (event.assetType == this.translate.instant("Mobile Phone")) {
      this.modelYear = true;
      this.fuelType = false;
      this.speedLimit = false;
      this.assetYear = true;
      this.sensorState = false;

    } else {
      this.assetYear = true;
      this.modelYear = true;
      this.fuelType = true;
      this.speedLimit = true;
      this.trackerDetails.speedLimit = "50";

      this.sensorState = true;
    }
  }

  sensors: any = [];
  checkboxes(event: any) {
    // debugger
    if (this.sensors.includes(event)) {
      // this.sensors.splice(this.sensors.indexOf(event), event.length);
      this.sensors.splice(this.sensors.indexOf(event), 1);
    }
    else {
      this.sensors.push(event);
    }
  }

  checkMobileNumber(): boolean {
    //debugger   
    if (this.trackerDetails.ownerMobileNo != undefined && this.trackerDetails.ownerMobileNo != "undefined") {
      if (this.trackerDetails.ownerMobileNo.startsWith("6") ||
        this.trackerDetails.ownerMobileNo.startsWith("7") ||
        this.trackerDetails.ownerMobileNo.startsWith("8") ||
        this.trackerDetails.ownerMobileNo.startsWith("9")) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  pasteName(event, name) {
    if (!this.comman.pasteEvent(event, name)) {
      return false;
    }
  }

  spacesCheckedForOwnerName(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.trackerDetails.ownerName = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }

  spacesCheckedForFriendlyName(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.trackerDetails.assetName = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }

  spacesCheckedForRegisterNo(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.trackerDetails.assetRegNo = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }

  pasteWithDescription(event, name) {
    //debugger
    if (event.match(/^[0-9 ]+$/g) || event.match(/^[ ]+$/g)) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (event.startsWith(" ")) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("SpacesValidation"));
      return false;
    }
    else if (event.length > 1000) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("ExceedValidation"));
      return false;
    }
    else if (event.match(/^[a-zA-Z0-9 ]+$/)) {
      return true;
    }
    else {
      this.toastr.warning(this.translate.instant("specialCharacters"));
      return false;
    }
  }

  spacesCheckedForDescription(event, name) {
    if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
      this.trackerDetails.descr = "";
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
  }

  dateConverion(date) {
    return this.comman.DateConvertWithOutMin(date);
  }
}

export class Tracker {

  public clientid: string;
  public loginId: string;
  public iMEI: number;
  public IMEIId: number;
  public pdid: string;
  public IMEI: any;

}
