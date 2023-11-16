import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { HttpClient } from '@angular/common/http';
import { Column, GridOption, OnEventArgs, Formatters, GridOdataService, CaseType, AngularGridInstance, AngularSlickgridComponent } from 'angular-slickgrid';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HtmlParser } from '@angular/compiler';
import { checkboxFormatter } from 'angular-slickgrid/app/modules/angular-slickgrid/formatters/checkboxFormatter';
import { editIconFormatter } from 'angular-slickgrid/app/modules/angular-slickgrid/formatters/editIconFormatter';
import { collectionEditorFormatter } from 'angular-slickgrid/app/modules/angular-slickgrid/formatters/collectionEditorFormatter';
import { LoaderService } from 'src/app/services/loader.service';
import { query } from '@angular/animations';
import { TrackerWhiteListService } from '../Service/tracker-white-list.service';

import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import { TranslateService } from '@ngx-translate/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-tracker-white-list',
  templateUrl: './tracker-white-list.component.html',
  styleUrls: ['./tracker-white-list.component.css']
})
export class TrackerWhiteListComponent implements OnInit {

  @ViewChild('modalRoot') modalRootPopUp: any;
  @ViewChild('TextClear') textClear: ElementRef;
  @ViewChild('whiteListSerarch') whiteListSerarch: ElementRef;

  trackerWhiteList = new TrackerWhiteList();
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any;
  listIMEIs: any;
  listDropdownList: any;
  selectedClientId: string;
  isButtonActive: boolean;
  trackeMappingList: any;
  source: any;
  ResponseList: any;
  ResponseList1: any;
  chkboxCall: any;
  editOrSave: any;
  editResponseData: any;
  trackerlist: any = [];
  imeiList: any;
  angularGrid: AngularGridInstance;

  filterAryList: any = [];
  newFilterAryList: any = [];

  DisplayClientName: string;
  DisplayFriendlyName: string;
  DisplayEmailID: string;
  isClientDetais: boolean;

  tableBindArray: any = [];
  //query:string;

  boolWhiteList: boolean = false;

  TrackerWhitelistMapped: any = ""
  alertEnterIMEI: any = ""
  alertInvalidImei: any;
  alertInvalidImsi: any;
  alertDeleteWhitelist: any;
  alertTrackerListNotDeleted: any = "";
  alertConfirmDeletetrackers: any;
  isPageLoad: boolean = true;
  isShowFooter: boolean = false;

  constructor(
    private _toaster: ToastrService,
    private _commanService: IdeaBService,
    private loaderService: LoaderService,
    private trackerWhiteListService: TrackerWhiteListService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.TrackerWhitelistMapped = this.translate.instant('TrackerWhitelistMapped');
    this.alertEnterIMEI = this.translate.instant('alertEnterIMEI');
    this.alertInvalidImei = this.translate.instant('alertInvalidImei');
    this.alertInvalidImsi = this.translate.instant('alertInvalidImsi');
    this.alertDeleteWhitelist = this.translate.instant('alertDeleteWhitelist');
    this.alertTrackerListNotDeleted = this.translate.instant('alertTrackerListNotDeleted');
    this.alertConfirmDeletetrackers = this.translate.instant('alertConfirmDeletetrackers');

    this.boolWhiteList = false;
    this.isClientDetais = false
    this.isButtonActive = false;

    this.dataTable();

  }



  dataTable() {
    // debugger
    this.loaderService.display(true);
    this.isShowFooter = false;
    this.trackerWhiteList.clientid = this.selectedClientId;
    this.trackerWhiteList.loginId = this._commanService.getLoginUserID();
    this.trackerWhiteList.CIWLID = "";
    this.trackerWhiteListService.getTrackerWhiteListDetails(this.trackerWhiteList).subscribe(data => {
      this.imeiList = data;
      this.listDropdownList = this.imeiList.createdBy;
      this.tableBindArray = this.imeiList.IMEIs;

      if (this.tableBindArray.length > 0) {
        this.isShowFooter = true;
      }
      if (!this.isPageLoad) {
        this.TableRefreshData();
      } else {
        this.isPageLoad = false;
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false)
      this._toaster.warning(error.error.Message);
    });
  }

  onLoadTrackerMappingData(loginId, clientId) {
    this.trackerWhiteList.clientid = clientId
    this.trackerWhiteList.loginId = loginId
    this.trackerWhiteList.CIWLID = "";
    this.loaderService.display(true);
    this.trackerWhiteListService.getTrackerWhiteListDetails(this.trackerWhiteList).subscribe(result => {
      this.trackeMappingList = result;
      this.listIMEIs = this.trackeMappingList.IMEIs;
      //  this.listDropdownList = this.trackeMappingList.createdBy;
      this.source = this.listIMEIs;
      //this.getClientDetailsData();
      // this.getCustomerCall();
      this.loaderService.display(false);

    })
  }
  whitelisttype: string;




  OpenModal(trackerWhiteList, status) { //Edit Functionality

    //debugger
 
    if (status == "update") {
      var statusWithId = trackerWhiteList.split("~");

      var boolValue = JSON.parse(statusWithId[1]);
      var status1 = this.isAddeded(boolValue);

      if (status1 != "Yes") {
        this.loaderService.display(true);
        this.boolWhiteList = false;
        this.whitelisttype = this.translate.instant('Edit WhiteList');
        this.editOrSave = 1;
        this.trackerWhiteList.CIWLID = statusWithId[0];
        this.trackerWhiteList.loginId = this._commanService.getLoginUserID();
        this.trackerWhiteList.clientid = this.selectedClientId;
        this.modalRootPopUp.show();
        this.trackerWhiteListService.getTrackerWhiteListDetails(this.trackerWhiteList).subscribe(result => {
          this.editResponseData = result;
          this.trackerWhiteList = this.editResponseData.IMEIs[0];
          this.loaderService.display(false)
        }, error => {
          this.loaderService.display(false)
        });
      }
      else {
         this._toaster.warning(this.TrackerWhitelistMapped);
      }

    }
    if (status == 'create') {
      this.boolWhiteList = false;
      this.whitelisttype = this.translate.instant('New WhiteList');
      this.editOrSave = -1;
      this.trackerWhiteList = new TrackerWhiteList();
    }
  }

  conditionBasedGrid: boolean = false;
  SuccessMessage: any
  messageSuccesss: any

  saveTrackerWhiteList(isForm: boolean, trackerWhiteList: any) {
    //   debugger
    // if (isForm) {
    if (trackerWhiteList.IMEI == "" ||
      trackerWhiteList.IMEI == null ||
      trackerWhiteList.IMEI === undefined) {
      this._toaster.warning(this.alertEnterIMEI);
      return false;
    }
    else if (trackerWhiteList.IMEI.length < 14) {
      //this._toaster.warning(this.alertInvalidImei);
      this._toaster.warning(this.translate.instant("IMEI") + " " + this.translate.instant('TrNumericMinMaxValidation'));
      return false;
    }
    else if ((this.boolWhiteList) && (trackerWhiteList.IMSI.length < 15)) {
      //   this._toaster.warning(this.alertInvalidImsi);
      this._toaster.warning(this.translate.instant("IMSI") + " " + this.translate.instant('TrNumericMaxValidation'));
      return false;
    }
    else {
      if (this.trackerWhiteList.CIWLID == "-1") {
        trackerWhiteList.clientId = this.selectedClientId;
        trackerWhiteList.loginId = this._commanService.getLoginUserID();
        this.loaderService.display(true);
        this.trackerWhiteListService.createTrackeWhiteList(trackerWhiteList).subscribe(result => {
          this.ResponseList = result;
          if (this.ResponseList.HTTPStatus == "200") {
            this._toaster.success('Save success');
            this.modalRootPopUp.hide();
            // this.onLoadTrackerMappingData(this._commanService.getLoginUserID(), this.selectedClientId)
            this.conditionBased = false;
            this.conditionBasedGrid = true;
            //this.updateItem();
            $('#trackerWhiteListTable').dataTable().fnDestroy();
            this.dataTable();

          }
          else {
            this.loaderService.display(false);

            this._toaster.warning(this.ResponseList.Message);
          }
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
          this._toaster.warning(error.error.Message);
        })
      }
      else {
        //
        trackerWhiteList.clientId = this.selectedClientId;
        trackerWhiteList.loginId = this._commanService.getLoginUserID();
        // trackerWhiteList.CIWLID =
        this.loaderService.display(true);
        this.trackerWhiteListService.updateTrackeWhiteList(trackerWhiteList).subscribe(result => {
          this.ResponseList = result;
          this.SuccessMessage = this.ResponseList.Message
          this.messageSuccesss = this.translate.instant('UpdatedSucessMessage')
          if (this.ResponseList.HTTPStatus == "200") {
            this._toaster.success(this.messageSuccesss);
            this.modalRootPopUp.hide();
            //this.conditionBased = false;
            // this.updateItem();

            $('#trackerWhiteListTable').dataTable().fnDestroy();
            this.dataTable();
          }
          else {
            this.loaderService.display(false);

            this._toaster.warning(this.ResponseList.Message);
          }
          this.loaderService.display(false);
        }, erorr => {
          this.loaderService.display(false);
          this._toaster.warning(erorr.error.Message);
        });
      }
    }

  }

  TableRefreshData() {
    setTimeout(() => {
      $('#trackerWhiteListTable').DataTable({
        "order": [], "sort": [],
        paging: this.isShowFooter,
        info: this.isShowFooter
      });
      jQuery('.dataTable').wrap('<div style="height:auto;max-height:350px;overflow-y:auto;" />');
    }, 10);
  }

  selectCreateBy(event: any) {
    //  debugger
    if (event == undefined) {

      this.DisplayClientName = "";
      this.DisplayFriendlyName = ""
      this.DisplayEmailID = "";
      this.isClientDetais = false;
      this.isButtonActive = false;
      this.dataset = [];
      this.selectedClientId = "";
      this.newFilterAryList = [];
      $('#trackerWhiteListTable').dataTable().fnDestroy();
      this.dataTable();
    }
    else if (event != undefined) {
      this.dataset = [];
      this.isClientDetais = true;

      this.isButtonActive = true;
      this.selectedClientId = event.clientID;
      this.DisplayClientName = event.clientName;
      this.DisplayFriendlyName = event.friendlyName;
      this.DisplayEmailID = event.emailId;

      this.conditionBased = false;

      $('#trackerWhiteListTable').dataTable().fnDestroy();
      this.dataTable();

      //this.dataTable();
    }
    else {
      this.ngOnInit();
    }
  }

  phoneNumberValidate(event) {

    var keycode = event.which;
    if (!(event.shiftKey == false && (keycode == 40 || keycode == 41 || keycode == 8 || keycode == 37 || (keycode >= 48 && keycode <= 57)))) {
      return false;
    }
    return true;
  }

  conditionBased: boolean = false;
  conditionBasedGrid1: boolean = false;
  // filterData(text) { // for searching

  //   if (text == "") {
  //     this.conditionBased = false;
  //     this.dataset = this.ResponseList.filter(x => {
  //       return (x.IMEI.match(text));
  //     })
  //     this.conditionBased = false;
  //    // this.updateItem();
  //   }
  //   else {
  //     this.conditionBased = true;
  //     this.conditionBasedGrid1 = true;
  //     this.dataset = [];
  //     this.newFilterAryList = this.filterAryList.filter(x => {
  //       return (x.IMEI.match(text));
  //     })
  //     for (var i = 0; i < this.newFilterAryList.length; i++) {
  //       this.dataset[i] = {
  //         id: i,
  //         IMEI: this.newFilterAryList[i].IMEI,
  //         IMSI: this.newFilterAryList[i].IMSI,
  //         IsWhitList: this.CheckboxFormatter(this.newFilterAryList[i].IsWhitList),
  //         CIWLID: this.newFilterAryList[i].CIWLID,
  //         isAdded: this.isAddeded(this.newFilterAryList[i].isAdded),

  //       };
  //     }
  //     this.updateItem();
  //   }
  // }

  CheckboxFormatter(value) {

    if (value) {
      return "Yes";
    }
    else {
      return "No";
    }
  }
  isAddeded(value1) {


    if (value1) {
      return "Yes";
    }
    else {

      return "No";
    }
  }

  DeleteTrackerWhiteList() //for deleteing
  {
    Swal({
      title: this.translate.instant('TrAreYouSure'),
      text: this.alertConfirmDeletetrackers,
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: this.translate.instant('Cancel'),
      confirmButtonText: this.translate.instant('SwalYes')
      //allowOutsideClick: false,
    }).then((result1) => {
      if (result1.value) {
        this.trackerWhiteList.clientid = this.selectedClientId;
        this.trackerWhiteList.loginId = this._commanService.getLoginUserID();
        this.loaderService.display(true);
        this.trackerWhiteListService.removeTrackeWhiteList(this.trackerWhiteList).subscribe(result => {
          this.ResponseList = result;
          if (this.ResponseList.HTTPStatus == "200") {
            this._toaster.success(this.ResponseList.Message);
            this.modalRootPopUp.hide();
            $('#trackerWhiteListTable').dataTable().fnDestroy();
            this.dataTable();
          }
          else {
            this.loaderService.display(false);
            this._toaster.warning(this._commanService.SAVEMESSAGE);
          }
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
          this._toaster.warning(error.error.Message);
        });
      }
    });

    // this.trackerWhiteList.clientid = this.selectedClientId;
    // this.trackerWhiteList.loginId = this._commanService.getLoginUserID();
    // this.loaderService.display(true);
    // this.trackerWhiteListService.removeTrackeWhiteList(this.trackerWhiteList).subscribe(result => {
    //   this.ResponseList = result;
    //   if (this.ResponseList.HTTPStatus == "200") {
    //     this._toaster.success(this.ResponseList.Message);
    //     this.modalRootPopUp.hide();
    //     $('#trackerWhiteListTable').dataTable().fnDestroy();
    //     this.dataTable();
    //   }
    //   else {
    //     this.loaderService.display(false);
    //     this._toaster.warning(this._commanService.SAVEMESSAGE);
    //   }
    //   this.loaderService.display(false);
    // }, error => {
    //   this.loaderService.display(false);
    //   this._toaster.warning(error.error.Message);
    // });
    // }
    // else {
    //   this._toaster.warning(this.alertTrackerListNotDeleted);
    // }
  }

  // clearTextBox() {
  //  // this.conditionBased = false;
  //   //  this.textClear.nativeElement.value = "";
  //   // this.updateItem();
  //    //  this.dataTable();
  // }

  whiteListValidation() {
    this.boolWhiteList = this.trackerWhiteList.IMSI.length != 0 ? true : false;
  }

  changeWithImei(event, imeiImsi) {

    // debugger
    if (event.target.value != "") {
      if (Number(event.target.value) == 0) {
        if (imeiImsi == "IMEI") {
          this.trackerWhiteList.IMEI = "";
          this._toaster.warning(this.alertInvalidImei);
        } else {
          this.trackerWhiteList.IMSI = "";
          this._toaster.warning(this.alertInvalidImsi);
        }
        return false;
      }
    }
  }

  pasteIMEI(event, name) {

    // debugger
    if (!event.match(/^[0-9]+$/g)) {
      this._toaster.warning(this.translate.instant(name) + " " + this.translate.instant("TrNumericValidation"));
      return false;
    }
    else if (event.length < 14 || event.length > 15) {
      if (name == "IMSI") {   //this.translate.instant("TrNumericMaxValidation")
        this._toaster.warning(this.translate.instant(name) + " " + this.translate.instant("TrNumericMaxValidation"));
        return false;
      }
      else {
        this._toaster.warning(this.translate.instant(name) + " " + this.translate.instant("TrNumericMinMaxValidation"));
        return false;
      }

    }
    else {
      return true;
    }

  }

}


export class TrackerWhiteList {

  public IMEI: any = "";
  public IMSI: any = "";
  public clientid: string;
  public loginId: string;
  public CIWLID: any = "-1";
  public isAdded: any;

}

