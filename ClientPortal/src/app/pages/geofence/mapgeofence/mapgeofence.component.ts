import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { GeofenceService } from '../services/geofence.service';
import { FormGroup, FormBuilder, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
declare var require: any
const intersectionwith = require('lodash.intersectionwith');
const differenceWith = require('lodash.differencewith');
//import { IItemsMovedEvent, IListBoxItem } from './models';
const datePipe = new DatePipe('en-US');
declare var MapLabel: any;
import "../../../../js/maplabel.js";
@Component({
  selector: 'app-mapgeofence',
  templateUrl: './mapgeofence.component.html',
  styleUrls: ['./mapgeofence.component.css']
})
export class MapgeofenceComponent implements OnInit {
  //@ViewChild('searchFilter') searchValue: any;
  [x: string]: any;
  selectedOptions: string;
  // private variables to manage class
  searchTermAvailable = '';
  selectedGeofence: any;
  searchTermSelected = '';
  DisplayName: string;
  availableItems: Array<IListBoxItem> = [];
  selectedItems: Array<IListBoxItem> = [];
  listBoxForm: FormGroup;
  availableListBoxControl: FormControl = new FormControl();
  selectedListBoxControl: FormControl = new FormControl();
  availableSearchInputControl: FormControl = new FormControl();
  selectedSearchInputControl: FormControl = new FormControl();
  prevSelectedDiv: number = 0;
  isButtonActive: boolean = true;
  // control value accessors
  _onChange = (_: any) => { };
  _onTouched = () => { };
  @Input() regNo = 'regNo';
  // array of items to display in left box
  @Input() set data(items: Array<{}>) {
    this.availableItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField].toString(),
      text: item[this.textField],
      regNo: item[this.regNo]
    }))];
  };

  @Input() set data1(items: Array<{}>) {
    this.selectedItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField].toString(),
      text: item[this.textField],
      regNo: item[this.regNo]
    }))];
  };
  // input to set search term for available list box from the outside
  @Input() set availableSearch(searchTerm: string) {
    this.searchTermAvailable = searchTerm;
    this.availableSearchInputControl.setValue(searchTerm);
  };
  // input to set search term for selected list box from the outside
  @Input() set selectedSearch(searchTerm: string) {
    this.searchTermSelected = searchTerm;
    this.selectedSearchInputControl.setValue(searchTerm);
  };
  // field to use for value of option
  @Input() valueField = 'id';
  // field to use for displaying option text
  @Input() textField = 'name';
  // text to display as title above component
  @Input() title: string;
  // time to debounce search output in ms
  @Input() debounceTime = 500;
  // show/hide button to move all items between boxes
  @Input() moveAllButton = true;
  // text displayed over the available items list box
  @Input() availableText = 'Available Trackers';
  // text displayed over the selected items list box
  // @Input() selectedText = 'Associated Trackers';
  @Input() selectedText = 'Assigned To';
  // set placeholder text in available items list box
  @Input() availableFilterPlaceholder = 'Search...';
  // set placeholder text in selected items list box
  @Input() selectedFilterPlaceholder = 'Search...';

  // event called when item or items from available items(left box) is selected
  @Output() onAvailableItemSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // event called when item or items from selected items(right box) is selected
  @Output() onSelectedItemsSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // event called when items are moved between boxes, returns state of both boxes and item moved
  @Output() onItemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<IItemsMovedEvent>();

  // @Output() someEvent = new EventEmitter<string>();

  saved: EventEmitter<any> = new EventEmitter();

  @ViewChild('modalRoot') modalRootPopUp: any;
  constructor(private _geofenceService: GeofenceService, private toastr: ToastrService,
    public fb: FormBuilder,
    private _commnService: IdeaBService) {
    const activeModal: any = "";
    this.listBoxForm = this.fb.group({
      availableListBox: this.availableListBoxControl,
      selectedListBox: this.selectedListBoxControl,
      availableSearchInput: this.availableSearchInputControl,
      selectedSearchInput: this.selectedSearchInputControl
    });
  }
  modalHeader: string = "";
  geofence: any = "";
  geofenceName: any = "";

  @ViewChild('mapDiv') gmapElement: any;
  @ViewChild('searchFilter') searchValue: any;
  //@ViewChild("searchTracker") searchTracker: ElementRef;

  map: google.maps.Map;

  resultList: any = {};
  grofenceList: any = {};
  polygonList: any = {};
  grofenceList1: any = [];
  polygonList1: any = [];
  polygnPathArray: any = [];
  circleArray: any = [];
  mapLabelArray: any = [];
  public activeElement = 1;

  ngOnInit() {
    //Swal('please select Vehicle No', '', 'warning');

    this.isMoving = false;
    let testArray: any = [];
    this.loadGeofences();
    var latitude = sessionStorage.getItem("DEFAULT_LATITUDE");
    var longitude = sessionStorage.getItem("DEFAULT_LONGITUDE");
    var centerLatLng = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
    var mapProp = {
      center: centerLatLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    // available tracker list
    this.availableListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onAvailableItemSelected.emit(items));
    this.selectedListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onSelectedItemsSelected.emit(items));
    this.availableSearchInputControl
      .valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe((search: string) => this.searchTermAvailable = search);
    this.selectedSearchInputControl
      .valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe((search: string) => this.searchTermSelected = search);
    // available tracker list
  }
  /* Addtracker list code*/

  /**
       * Function to pass to ngFor to improve performance, tracks items
       * by the value field
       * @param index
       * @param item
       */
  trackByValue(index: number, item: {}): string {
    // return item[this.valueField];
    return item[this.regNo];
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  private getValues(): string[] {
    return (this.selectedItems || []).map((item: IListBoxItem) => item.value);
  }

  onCloseModal() {
    this.loadGeofences();

  }

  /**
   * Move single item from available to selected
   * @param item
   */
  moveAvailableItemToSelected(item: IListBoxItem): void {

    this.isButtonActive = false;
    this.availableItems = this.availableItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
    this.selectedItems = [...this.selectedItems, item];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: [item.value],
      from: 'available',
      to: 'selected'
    });
    this.availableSearchInputControl.setValue('');
    this.availableListBoxControl.setValue([]);
    this.writeValue(this.getValues());
  }

  saveData(): void {

    var IMEIS: any = [];

    this.selectedItems.forEach(element => {
      IMEIS.push({ "IMEI": element.value })
      // IMEIS.push({ "pdid": element.value })
    });


    var inputdata: any = {};


    if (this.selectedGeofence != null) {
      if (this.selectedGeofence.shapeType == "G") {
        inputdata = {
          "geofenceID": this.selectedGeofence.geofenceID,
          "geofenceName": this.selectedGeofence.geofenceName,
          "geofenceType": this.selectedGeofence.shapeType,
          "latLongs": [{
            "inx": 0,
            "x": this.selectedGeofence.latitude,
            "y": this.selectedGeofence.longitude
          }],
          "radius": this.selectedGeofence.radius,
          "jioGeofenceID": "",
          "assigned": IMEIS,
          "assingedDate": "",
          "userID": this._commnService.getLoginUserID(),
          "statusType": "NEW"

        };

      }
      else {
        inputdata = {
          "geofenceID": this.selectedGeofence.geofenceID,
          "geofenceName": this.selectedGeofence.geofenceName,
          "geofenceType": this.selectedGeofence.shapeType,
          "latLongs": this.selectedGeofence.latLongs,
          "radius": "",
          "jioGeofenceID": "",
          "assigned": IMEIS,
          "assingedDate": "",
          "userID": this._commnService.getLoginUserID(),
          "statusType": "NEW"
        };
      }

      var resultData = [];
      this._geofenceService.assignGeofenceAssTl(inputdata).subscribe(
        result => {
          // this.ngOnInit();
          this.loadGeofences();
          this.resultData = result;
          if (this.resultData.status == "001") {
            this.toastr.success(this.resultData.message);
            this.modalRootPopUp.hide();
            //   this.searchTracker.nativeElement="";

          }
          else {
            this.toastr.warning(this.resultData.message);
          }
        });
    }
    else {
      this.toastr.success("Error in save");
      return;
    }
  }

  moveAllItemsToSelected(): void {
    if (!this.availableItems.length) {
      return;
    }
    this.selectedItems = [...this.selectedItems, ...this.availableItems];
    this.availableItems = [];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.availableListBoxControl.value,
      from: 'available',
      to: 'selected'
    });
    this.availableListBoxControl.setValue([]);
    this.writeValue(this.getValues());
  }

  /**
       * Move marked items from available items to selected items
       */
  moveMarkedAvailableItemsToSelected(): void {
    this.isButtonActive = false;
    // first move items to selected
    this.selectedItems = [...this.selectedItems,
    ...intersectionwith(this.availableItems, this.availableListBoxControl.value,
      (item: IListBoxItem, value: string) => item.value === value)];
    // now filter available items to not include marked values
    this.availableItems = [...differenceWith(this.availableItems, this.availableListBoxControl.value,
      (item: IListBoxItem, value: string) => item.value === value)];
    // clear marked available items and emit event
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.availableListBoxControl.value,
      from: 'available',
      to: 'selected'
    });
    this.availableListBoxControl.setValue([]);
    this.availableSearchInputControl.setValue('');
    this.writeValue(this.getValues());
  }

  /**
   * Move marked items from selected items to available items
   */
  moveMarkedSelectedItemsToAvailable(): void {
    // this.isButtonActive = false;
    // first move items to available
    this.availableItems = [...this.availableItems,
    ...intersectionwith(this.selectedItems, this.selectedListBoxControl.value,
      (item: IListBoxItem, value: string) => item.value === value)];
    // now filter available items to not include marked values
    this.selectedItems = [...differenceWith(this.selectedItems, this.selectedListBoxControl.value,
      (item: IListBoxItem, value: string) => item.value === value)];
    // this.isButtonActive =this.selectedItems.length>0?false:true;

    // clear marked available items and emit event
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.selectedListBoxControl.value,
      from: 'selected',
      to: 'available'
    });
    this.selectedListBoxControl.setValue([]);
    this.selectedSearchInputControl.setValue('');
    this.writeValue(this.getValues());
  }

  /**
   * Move all items from selected to available
   */
  moveAllItemsToAvailable(): void {
    this.isButtonActive = false;
    if (!this.selectedItems.length) {
      return;
    }
    this.availableItems = [...this.availableItems, ...this.selectedItems];
    this.selectedItems = [];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.selectedListBoxControl.value,
      from: 'selected',
      to: 'available'
    });
    this.selectedListBoxControl.setValue([]);
    this.writeValue([]);
  }


  /**
   * Move single item from selected to available
   * @param item
   */
  moveSelectedItemToAvailable(item: IListBoxItem): void {
    // 
    this.selectedItems = this.selectedItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
    // this.isButtonActive =this.selectedItems.length>0?false:true;
    this.availableItems = [...this.availableItems, item];
    this.onItemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: [item.value],
      from: 'selected',
      to: 'available'
    });

    this.selectedSearchInputControl.setValue('');
    this.selectedListBoxControl.setValue([]);
    this.writeValue(this.getValues());
  }


  writeValue(value: any): void {
    if (this.selectedItems && value && value.length > 0) {
      this.selectedItems = [...this.selectedItems,
      ...intersectionwith(this.availableItems, value, (item: IListBoxItem, val: string) => item.value === val)];
      this.availableItems = [...differenceWith(this.availableItems, value,
        (item: IListBoxItem, val: string) => item.value === val)];
    }
    this._onChange(value);
  }


  /* Add tracker list code*/
  isRecordsCount: boolean = false;
  isGeofencesCount: boolean = false;
  isPolygonsCount: boolean = false;
  isNoRecords: boolean = false;

  loadGeofences() {
    // alert("loadGEofence")
    this.isMoving = true;
    var ClientID: string = this._commnService.getClientID(); //"12";

    this._geofenceService.GetPolygonGeofencesDetails(ClientID).subscribe(res => {

      this.resultList = res;

      this.grofenceList = this.resultList.geofence;
      this.polygonList = this.resultList.polygon;
      this.isRecordsCount = false;
      this.isGeofencesCount = false;
      this.isPolygonsCount = false;
      this.isNoRecords = false;
      if (this.grofenceList[0].geofenceName != "") {
        this.isGeofencesCount = true;
      }

      if (this.polygonList[0].geofenceName != "") {
        this.isPolygonsCount = true;
      }

      if (this.isGeofencesCount || this.isPolygonsCount) {
        this.isRecordsCount = true;
        this.isNoRecords = false;
      }
      else {
        this.isRecordsCount = false;
        this.isNoRecords = true;
      }
      // alert(this.isGeofencesCount);
      // alert(this.isPolygonsCount);
      // alert( this.isRecordsCount);
      // alert(this.isNoRecords);
      this.grofenceList1 = this.resultList.geofence;
      this.polygonList1 = this.resultList.polygon;
      this.grofenceList1 = this.resultList.geofence;
      this.polygonList1 = this.resultList.polygon;
      this.searchValue.nativeElement.value = "";

    });
  }

  AssignedTrackers(geofence: any, gType: any) {

    debugger
    this.activeElement = geofence.geofenceID;
    const swalWithBootstrapButtons = Swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })


    swalWithBootstrapButtons({
      title: 'Do you want push geofence changes to associated trackers?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.RePushData(geofence, gType);
      }
    });



  }


  RePushData(geofence: any, gType: any) {

    var resultList;
    var Imeis: any = [];
    var geofence: any = geofence;
    this._geofenceService.getAssignunAssignTrackers(geofence.geofenceID).subscribe(res => {
      resultList = res;
      var IMEIS: any = [];
      resultList.Assigned.forEach(element => {
        IMEIS.push({ "IMEI": element.pdid })
        // IMEIS.push({ "pdid": element.pdid })
      });

      var inputdata: any = [];

      if (gType == "G") {
        inputdata = {
          "geofenceID": geofence.geofenceID,
          "geofenceName": geofence.geofenceName,
          "geofenceType": geofence.shapeType,
          "latLongs": [{
            "inx": 0,
            "x": geofence.latitude,
            "y": geofence.longitude
          }],
          "radius": geofence.radius,
          "jioGeofenceID": "",
          "assigned": IMEIS,
          "assingedDate": "",
          "userID": this._commnService.getLoginUserID(),
          "statusType": "RePush"

        };

      }
      else {
        inputdata = {
          "geofenceID": geofence.geofenceID,
          "geofenceName": geofence.geofenceName,
          "geofenceType": geofence.shapeType,
          "latLongs": geofence.latLongs,
          "radius": "",
          "jioGeofenceID": "",
          "assigned": IMEIS,
          "assingedDate": "",
          "userID": this._commnService.getLoginUserID(),
          "statusType": "RePush"
        };
      }
      var resultData = [];


      this._geofenceService.assignGeofenceAssTl(inputdata).subscribe(
        result => {
          // this.ngOnInit();
          this.loadGeofences();
          this.resultData = result;
          if (this.resultData.status == "001") {
            this.toastr.success(this.resultData.message);
            // this.modalRootPopUp.hide();
          }
          else {
            this.toastr.warning(this.resultData.message);
          }

        }
      );


    });
  }

  showPopUp(geofence: any): void {

    this.activeElement = geofence.geofenceID;
    let resultList: any;
    this.DisplayName = geofence.geofenceName;
    this.selectedGeofence = geofence;
    this.searchValue.nativeElement.value = "";
    this.availableSearchInputControl.setValue("");
    this.selectedSearchInputControl.setValue("");


    this.availableFilterPlaceholder

    this._geofenceService.getAssignunAssignTrackers(geofence.geofenceID).subscribe(res => {
      resultList = res;

      let testArray: any = [];
      let testArray1: any = [];
      resultList.Assigned.forEach(element => {
        // alert(element.pdid);
        testArray.push({ id: element.pdid, name: element.AssetName, regNo: element.RegNo })
      });

      resultList.Unassigned.forEach(element => {
        testArray1.push({ id: element.pdid, name: element.AssetName, regNo: element.RegNo })
      });

      this.data = testArray1;
      this.data1 = testArray;
      if (testArray.length > 0) {
        this.isButtonActive = false;
      }
      else {
        this.isButtonActive = true;
      }
      this.modalRootPopUp.show();
    },error=>{
      this.modalRootPopUp.show();
    });
  }

  showonMap(geofence: any, gType: any) {

    if (this.prevSelectedDiv != 0 && this.prevSelectedDiv !== undefined && this.prevSelectedDiv != null) {
      var prevdivcntrl = document.getElementById("div" + this.prevSelectedDiv);
      if (prevdivcntrl != null) {
        prevdivcntrl.setAttribute("style", "border-right:0px solid #03243B");
      }
    }

    var divcntrl = document.getElementById("div" + geofence.geofenceID);
    divcntrl.setAttribute("style", "border-right:4px solid #03243B;padding:10px 9px 60px 22px;");

    this.clearMap();

    var geoColor = "#3598DC";

    if (gType == 'P') {
      //Polygon binding
      var geoName = geofence.geofenceName;
      var bounds = new google.maps.LatLngBounds;

      if (geoName != "") {
        var commanarray = new Array()
        {
          geofence.latLongs.forEach(childelement => {

            var latLngPoly = new google.maps.LatLng(childelement.x, childelement.y);
            commanarray.push(latLngPoly);
            bounds.extend(latLngPoly);
          });

          // var latlng = new google.maps.LatLng(geofence.latLongs[0].x, geofence.latLongs[0].y)
          this.map.fitBounds(bounds);
          this.polygon(commanarray, geoName, geoColor)
        }
      }
    } else {

      var latlng = new google.maps.LatLng(geofence.latitude, geofence.longitude)
      // this.map.setCenter(latlng);
      this.AddCircle(latlng, geofence.geofenceName, Number(geofence.radius), geoColor);
    }

    this.prevSelectedDiv = geofence.geofenceID;
    this.activeElement = geofence.geofenceID;
  }

  filterData(text: string) {
    this.grofenceList1 = this.grofenceList.filter(x => {
      return (x.geofenceName.toLowerCase().match(text.toLowerCase()))
    });

    this.polygonList1 = this.polygonList.filter(x => {
      return (x.geofenceName.toLowerCase().match(text.toLowerCase()))
    });


    //side bar selection geofence list color change   
    if (this.prevSelectedDiv != 0 && this.prevSelectedDiv !== undefined && this.prevSelectedDiv != null) {
      var prevdivcntrl = document.getElementById("div" + this.prevSelectedDiv);
      if (prevdivcntrl != null) {
        prevdivcntrl.setAttribute("style", "border-right:4px solid #03243B;padding:10px 9px 60px 22px;");
      }
    }
    //this.clearMap();
  }

  alertGeofence() {
    this.loadGeofences();
  }

  polygon(Polygonarray: any, gbname: string, gbcolor: string) {
    var gbcolorvalue = gbcolor;
    var flightPath = new google.maps.Polygon
      ({
        paths: Polygonarray,
        strokeColor: gbcolorvalue,
        strokeWeight: 2,
        fillColor: gbcolorvalue,
        map: this.map
      });

    flightPath.setMap(this.map);
    this.polygnPathArray.push(flightPath);

    var font = this.ReturnFontSize();

    var mapLabel = new MapLabel({
      text: gbname,
      position: Polygonarray[0],
      fontSize: font,
      strokeWeight: 5,
      fontColor: '#6200EA',
      align: 'center',
      map: this.map
    });

    mapLabel.setMap(this.map);
    this.mapLabelArray.push(mapLabel);
  }

  AddCircle(latLng: any, gname: any, radius: any, color: any) {
    var CircleOptions = {
      strokeColor: color,
      fillColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillOpacity: 0.35,
      map: this.map,
      clickable: false,
      editable: false,
      center: latLng,
      title: gname,
      radius: parseFloat(radius)
    };

    var Drawcircle = new google.maps.Circle(CircleOptions);
    this.circleArray.push(Drawcircle);
    Drawcircle.setMap(this.map);
    this.map.fitBounds(Drawcircle.getBounds());

    var font = this.ReturnFontSize();
    var mapLabel = new MapLabel(
      {
        text: gname,
        position: latLng,
        fontSize: font,
        strokeWeight: 5,
        fontColor: '#6200EA',
        align: 'center',
        map: this.map
      });

    mapLabel.setMap(this.map);
    this.mapLabelArray.push(mapLabel);
  }

  ReturnFontSize() {

    var zoom = this.map.getZoom();
    if (zoom <= 5) {
      this.font = 7;
    }
    else if (zoom > 5 && zoom <= 10) {
      this.font = 9;
    }
    else if (zoom > 10 && zoom <= 15) {
      this.font = 13;
    }
    else {
      this.font = 15;
    }
    return this.font;
  }


  clearMap() {
    if (this.circleArray.length > 0) {
      for (var i: any = 0; i < this.circleArray.length; i++) {
        this.circleArray[i].setMap(null);
      }
      this.circleArray.length = 0;
    }

    if (this.polygnPathArray.length > 0) {
      for (var i: any = 0; i < this.polygnPathArray.length; i++) {
        this.polygnPathArray[i].setMap(null);
      }
      this.polygnPathArray.length = 0;
    }
    if (this.mapLabelArray.length > 0) {
      for (var i: any = 0; i < this.mapLabelArray.length; i++) {
        this.mapLabelArray[i].setMap(null);
      }
      this.mapLabelArray.length = 0;
    }
  }
}

interface data {
  id: string,
  value: string
}
interface IListBoxItem {
  value: string;
  text: string;
  regNo: any;
}
interface IItemsMovedEvent {
  available: Array<{}>;
  selected: Array<{}>;
  movedItems: Array<{}>;
  from: 'selected' | 'available';
  to: 'selected' | 'available';
}
