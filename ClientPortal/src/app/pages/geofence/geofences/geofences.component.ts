import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { GeofenceService } from '../services/geofence.service';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

declare var MapLabel: any;
import "../../../../js/maplabel.js";
import { TranslateService } from '@ngx-translate/core';

const swalWithBootstrapButtons = Swal.mixin({
  confirmButtonClass: 'btn btn-success',
  cancelButtonClass: 'btn btn-danger',
  buttonsStyling: false,
  //allowOutsideClick: false
})

@Component({
  selector: 'app-geofences',
  templateUrl: './geofences.component.html',
  styleUrls: ['./geofences.component.css']
})
export class GeofencesComponent implements OnInit {

  @Output() userAction = new EventEmitter();

  [x: string]: any;
  @ViewChild('mapDiv') gmapElement: any;

  @ViewChild('searchFilter') searchValue: any;

  mapsample: any;
  font: any;
  map: google.maps.Map;
  geofennceType: string;
  mapLabelArray: any = [];
  geofenceobj = new Geofence();
  IsSaveSpan: boolean = false;
  IsEditSpan: boolean = true;
  selectedGID: any = 0;
  polygonLatLongs: any = [];

  geofence_name: any;
  geofence_id: any;
  RequestList: any = {};

  selectedGeofence: any = "";
  NewGeofence:any


  saveMode: string = "";
  // selectedEditDiv: any = 0;
  // selectedSaveDiv: any = 0;
  /*constructor(
    private toastr: ToastrService, private http: HttpClient, private modalService: NgbModal,
    private _geofenceService: GeofenceService, private _commnService: IdeaBService
  ) {
    const activeModal: any = "";
  }*/
  @ViewChild('modalRoot') modalRootPopUp: any;

  @ViewChild('txtGeofenecName') txtGeofenceName: ElementRef;

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private _commnService: IdeaBService,
    private _geofenceService: GeofenceService,
    private translate: TranslateService
  ) {
    const activeModal: any = "";

  }
  resultlist: {} = {};
  //drawingManager: any;
  polygonData: any;
  geofenceData: any;
  _latitude: any = [];
  _longitude: any = [];


  isRecordsCount: boolean = false;
  isGeofencesCount: boolean = false;
  isPolygonsCount: boolean = false;
  isNoRecords: boolean = false;


  grofenceList: any = {};
  polygonList: any = {};
  grofenceList1: any = [];
  polygonList1: any = [];

  //gLatitude:any;
  //gLongitude: string;
  radius: string;
  resresult: any;

  userid: number
  modalHeader: string = "";
  geofenceName: string;
  prevSelectedDiv: number = 0;
  sltShape: any;


  InvalidgeofenceName: any;
  EnterGeofenceName: any
  Ok: any;
  cancel: any;
  GeofenceRemove: any
  GeofenceAdd: any

  ngOnInit() {
    //Translator for converting messages.
    //debugger
    this.InvalidgeofenceName = this.translate.instant('InvalidgeofenceName');
    this.EnterGeofenceName = this.translate.instant('EnterGeofenceName');
    this.GeofenceRemove = this.translate.instant('GeofenceRemove')
    this.GeofenceAdd = this.translate.instant('GeofenceAdd');
    this.Ok = this.translate.instant('Ok');
    this.Cancel = this.translate.instant('Cancel');

    var centerLatLng = new google.maps.LatLng(Number(sessionStorage.getItem("DEFAULT_LATITUDE")),
      Number(sessionStorage.getItem("DEFAULT_LONGITUDE")));
    var mapProp = {
      center: centerLatLng,
      zoom: 15,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DEFAULT,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      fullscreenControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    var autoLoc = <HTMLInputElement>document.getElementById('txtLoc');
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(autoLoc);
    //this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(autoLoc);
    var geocoder = new google.maps.Geocoder();
    var autocomplete = new google.maps.places.Autocomplete(autoLoc);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      // debugger
      var place = autocomplete.getPlace();
      if (place.geometry) {
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();
        var mylatlong = new google.maps.LatLng(latitude, longitude);
        that.map.setCenter(mylatlong);
        that.map.setZoom(18);

        var locationName = (<HTMLInputElement>document.getElementById('txtLoc')).value;
      }
      else {
        this.toastr.warning(this.translate.instant('geofenceLocationValid'));
      }
    });

    // this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById("view-more-button"));
    // this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();

    var selectedShape = null;
    this.loadGeofences();

    var drawingManager = new google.maps.drawing.DrawingManager({
      //drawingMode: CURSOR,
      drawingControl: true,
      drawingControlOptions: {
        // position: google.maps.ControlPosition.TOP_LEFT,
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON,]
      },
      circleOptions:
      {
        fillColor: '#3598DC',
        fillOpacity: 0.5,
        strokeWeight: 1,
        strokeColor: '#3598DC',
        clickable: false,
        // editable: true,
        zIndex: 1
      },
      polygonOptions:
      {
        fillColor: '#3598DC',
        fillOpacity: 0.5,
        strokeColor: '#3598DC',
        strokeWeight: 2,
        clickable: false,
        //editable: true,
        zIndex: 1
      }

    });


    this.geofennceType = "";
    var that = this;
    drawingManager.setMap(this.map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
      //debugger
      drawingManager.setDrawingMode(null);
      that.saveMode = "CREATE";
      that.OpenModal('create');
      that.modalRootPopUp.show();
      //that.txtGeofenceName.nativeElement.focus();

      var newShape = event.overlay;
      newShape.type = event.type;
      that.sltShape = newShape;
      setSelection(newShape);

      that.geofence_id = "";

      if (event.type == 'circle') {

        that.gLatitude = event.overlay.center.lat();
        that.gLongitude = event.overlay.center.lng();
        that.radius = event.overlay.getRadius().toFixed(8);
        that.geofennceType = "G";
      }

      if (event.type == 'polygon') {

        that.polygonLatLongs = [];
        that.geofennceType = "P";
        // var latLog = event.overlay.getPath().getArray();
        var coordinates = event.overlay.getPath().getArray();
        /*   for (var i = 0; i < latLog.length; i++) {
             that.polygonLatLongs.push({ index: i + 1, x: latLog[i].lat(), y: latLog[i].lng() });
   
             if (i == latLog.length - 1) {
               that.polygonLatLongs.push({ index: i + 2, x: latLog[0].lat(), y: latLog[0].lng() });
             }
           }*/
        for (var i = 0; i < coordinates.length; i++) {
          that.polygonLatLongs.push({ index: i + 1, x: coordinates[i].lat(), y: coordinates[i].lng() });

          if (i == coordinates.length - 1) {
            that.polygonLatLongs.push({ index: i + 2, x: coordinates[0].lat(), y: coordinates[0].lng() });
          }
        }
        that.polygonLatLongs = that.resetShape(that.polygonLatLongs)
      }
    });

    google.maps.event.addListener(drawingManager, 'drawingmode_changed', function () {
      that.clearSelection(drawingManager, selectedShape)
    });
    google.maps.event.addListener(this.map, 'click', function () {
      that.clearSelection(drawingManager, selectedShape)
    });

    function setSelection(shape) {
      selectedShape = shape;
    }


  } //ngOnInit end



  resetShape(coordinates) {

    var iValue = 0;
    var cordinateData = [];
    var lat = "";

    for (var i = 0; i < coordinates.length; i++) {
      //if (parseInt(i)=== 0) {
      if (i === 0) {
        lat = coordinates[i].x;
        iValue = i;
      }
      else {
        // if (parseFloat(lat) < parseFloat(coordinates[i].lat())) {
        if (parseFloat(lat) < parseFloat(coordinates[i].x)) {
          // lat = coordinates[i].lat();
          lat = coordinates[i].x;
          iValue = i;
        }
      }

    }
    //console.log(iValue);
    if (iValue == 0) {

      if (parseFloat(coordinates[1].y) > parseFloat(coordinates[0].y) && parseFloat(coordinates[coordinates.length - 1].y) > parseFloat(coordinates[0].y)) {

        if (parseFloat(coordinates[1].y) > parseFloat(coordinates[coordinates.length - 1].y)) {
          for (var k = 0; k < coordinates.length; k++) {
            cordinateData.push({ index: k + 1, x: coordinates[k].x, y: coordinates[k].y })
          }
        }
        else {
          for (var l = coordinates.length - 1; l >= 0; l--) {
            cordinateData.push({ index: l + 1, x: coordinates[l].x, y: coordinates[l].y })
          }
        }
      }
      else if (parseFloat(coordinates[1].y) < parseFloat(coordinates[0].y) && parseFloat(coordinates[coordinates.length - 1].y) < parseFloat(coordinates[0].y)) {

        if (parseFloat(coordinates[1].y) > parseFloat(coordinates[coordinates.length - 1].y)) {
          for (var k = 0; k < coordinates.length; k++) {
            cordinateData.push({ index: k + 1, x: coordinates[k].x, y: coordinates[k].y })
          }
        }

        else {
          cordinateData.push({ lat: coordinates[iValue].x, lng: coordinates[iValue].y });
          for (var l = coordinates.length - 1; l > iValue; l--) {
            cordinateData.push({ index: l + 1, x: coordinates[l].x, y: coordinates[l].y })
          }

        }
      }

      else if (parseFloat(coordinates[1].y) > parseFloat(coordinates[0].y)) {

        for (var k = 0; k < coordinates.length; k++) {
          cordinateData.push({ index: k + 1, x: coordinates[k].x, y: coordinates[k].y })
        }
      }
      else {
        for (var l = coordinates.length - 1; l >= 0; l--) {
          cordinateData.push({ index: l + 1, x: coordinates[l].x, y: coordinates[l].y })
        }
      }
    }
    else if (iValue == coordinates.length - 1) {

      if (parseFloat(coordinates[iValue - 1].y) < parseFloat(coordinates[iValue].y) && parseFloat(coordinates[0].y) < parseFloat(coordinates[iValue].y)) {

        if (parseFloat(coordinates[iValue - 1].y) > parseFloat(coordinates[0].y)) {

          for (var i = coordinates.length - 1; i >= 0; i--) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }
        else {

          cordinateData.push({ lat: coordinates[iValue].x, lng: coordinates[iValue].y })

          for (var i = 0; i < iValue; i++) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }

      }
      else if (parseFloat(coordinates[iValue - 1].y) > parseFloat(coordinates[iValue].y) && parseFloat(coordinates[0].y) > parseFloat(coordinates[iValue].y)) {
        if (parseFloat(coordinates[iValue - 1].y) > parseFloat(coordinates[0].y)) {

          for (var i = coordinates.length - 1; i >= 0; i--) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }
        else {

          cordinateData.push({ lat: coordinates[iValue].x, lng: coordinates[iValue].y })
          // alert(iValue);
          for (var i = 0; i < iValue; i++) {
            // alert(coordinates[iValue].lat() + "," + coordinates[iValue].lng() + "  " + coordinates[i].lat() + "," + coordinates[i].lng());
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }
      }
      else if (parseFloat(coordinates[iValue - 1].y) > parseFloat(coordinates[iValue].y)) {
        for (var d = coordinates.length - 1; d >= 0; d--) {
          cordinateData.push({ index: d + 1, x: coordinates[d].x, y: coordinates[d].y })
        }

      }
      else {
        cordinateData.push({ lat: coordinates[iValue].x, lng: coordinates[iValue].y })
        for (var d = 0; d < iValue; d++) {
          cordinateData.push({ index: d + 1, x: coordinates[d].x, y: coordinates[d].y })
        }
      }
    }
    else {
      if (parseFloat(coordinates[iValue].y) < parseFloat(coordinates[iValue + 1].y) && parseFloat(coordinates[iValue].y) < parseFloat(coordinates[iValue - 1].y)) {
        if (parseFloat(coordinates[iValue + 1].y) > parseFloat(coordinates[iValue - 1].y)) {
          for (var i = iValue; i < coordinates.length; i++) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
          for (var i = 0; i < iValue; i++) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }
        else {
          for (var i = iValue; i >= 0; i--) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
          for (var i = coordinates.length - 1; i > iValue; i--) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }

      }
      else if (parseFloat(coordinates[iValue].y) > parseFloat(coordinates[iValue + 1].y) && parseFloat(coordinates[iValue].y) > parseFloat(coordinates[iValue - 1].y)) {


        if (parseFloat(coordinates[iValue + 1].y) > parseFloat(coordinates[iValue - 1].y)) {

          for (var i = iValue; i < coordinates.length; i++) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }

          for (var i = 0; i < iValue; i++) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }
        else {
          for (var i = iValue; i >= 0; i--) {
            cordinateData.push({ inex: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
          for (var i = coordinates.length - 1; i > iValue; i--) {
            cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
          }
        }
      }
      else if (parseFloat(coordinates[iValue].y) < parseFloat(coordinates[iValue + 1].y)) {

        for (var i = iValue; i < coordinates.length; i++) {
          cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
        }
        for (var j = 0; j < iValue; j++) {
          cordinateData.push({ index: j + 1, x: coordinates[j].x, y: coordinates[j].y })
        }
      }
      else {
        for (var j = iValue; j >= 0; j--) {
          // alert(coordinates[j].lat() + ',' + parseFloat(coordinates[j].lng()));
          cordinateData.push({ index: j + 1, x: coordinates[j].x, y: coordinates[j].y })
        }
        for (var i = coordinates.length - 1; i > iValue; i--) {
          cordinateData.push({ index: i + 1, x: coordinates[i].x, y: coordinates[i].y })
        }
      }
    }
    return cordinateData;

  }
  clearSelection(drawingManager: any, selectedShape: any) {
    this.loadGeofences();

    //document.getElementById("custombutton").style.display = "none";
    drawingManager.setOptions({
      drawingControl: true
    });
    if (selectedShape) {
      selectedShape.setMap(null);
    }
  }


  onCloseModal() {
    this.loadGeofences();
  }


  clearMap() {
    if (this.circleArray.length > 0) {
      for (var i: any = 0; i < this.circleArray.length; i++) {
        this.circleArray[i].geoMap.setMap(null);
      }
      this.circleArray = [];
    }

    if (this.polygnPathArray.length > 0) {
      for (var i: any = 0; i < this.polygnPathArray.length; i++) {
        this.polygnPathArray[i].geoMap.setMap(null);
      }
      this.polygnPathArray = [];
    }
    if (this.mapLabelArray.length > 0) {
      for (var i: any = 0; i < this.mapLabelArray.length; i++) {
        this.mapLabelArray[i].setMap(null);
      }
      this.mapLabelArray = [];
    }
  }

  filterData(text: string) {
    // debugger
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

  }

  EditGeofence(geofence: any, gType: any) {
   // debugger
    (<HTMLInputElement>document.getElementById('txtLoc')).value = "";
   // (<HTMLInputElement>document.getElementById('txtLoc')).value = geofence.geofenceName;
    this.saveMode = "";
    this.geofennceType = "";
    if (this.selectedGID != 0) {

      this.closeEdit(this.selectedGID);
      this.selectedGID = 0;
      //this.selectedSaveDiv = 0;
    }
    var saveSpan1 = document.getElementById('divEdit' + geofence.geofenceID);
    saveSpan1.setAttribute("style", "display:none;");
    this.selectedGID = geofence.geofenceID;

    var editSpan1 = document.getElementById('divSave' + geofence.geofenceID);
    editSpan1.setAttribute("style", "display:block;");
    this.selectedSaveDiv = 'divSave' + geofence.geofenceID;

    this.geofence_id = geofence.geofenceID;

    this.activeElement = geofence.geofenceID;
    var that1 = this;

    if (gType == "P") {
      if (this.polygnPathArray.length > 0) {
        // this.gefenceShow=true;
        for (var i: any = 0; i < this.polygnPathArray.length; i++) {

          if (this.polygnPathArray[i].geoID == this.geofence_id) {

            var bounds = new google.maps.LatLngBounds;
            this.polygnPathArray[i].geoMap.getPath().forEach(function (element, index) {
              bounds.extend(element);
            });

            this.map.fitBounds(bounds);

            this.polygnPathArray[i].geoMap.setEditable(true);
            this.selectedGeofence = this.polygnPathArray[i].geoMap;


            google.maps.event.addListener(this.selectedGeofence.getPath(), 'set_at', function () {
              //alert(this.j.length);
              that1.geofennceType = gType;
              that1.saveMode = "MODIFY";

              that1.polygonLatLongs = [];

              for (var i = 0; i < this.j.length; i++) {
                that1.polygonLatLongs.push({ index: i + 1, x: this.j[i].lat(), y: this.j[i].lng() });
              }

            });

            google.maps.event.addListener(this.selectedGeofence.getPath(), 'insert_at', function () {
              that1.polygonLatLongs = [];
              that1.geofennceType = gType;
              that1.saveMode = "MODIFY";
              for (var i = 0; i < this.j.length; i++) {
                that1.polygonLatLongs.push({ index: i + 1, x: this.j[i].lat(), y: this.j[i].lng() });
              }
            });

          }
          else {
            if (this.polygnPathArray[i].geoMap.editable == true) {
              this.polygnPathArray[i].geoMap.setEditable(false);
            }
          }

        }
      }


    }

    if (gType == "G") {
      if (this.circleArray.length > 0) {
        // this.gefenceShow=true;
        for (var i: any = 0; i < this.circleArray.length; i++) {
          //alert(this.circleArray[i].geoMap.setEditable);
          if (this.circleArray[i].geoID == this.geofence_id) {

            this.map.fitBounds(this.circleArray[i].geoMap.getBounds());


            //this.map.setCenter(new google.maps.LatLng(geofence.latitude, geofence.longitude));
            this.circleArray[i].geoMap.setEditable(true);
            this.selectedGeofence = this.circleArray[i].geoMap;

            google.maps.event.addListener(this.circleArray[i].geoMap, 'radius_changed', function (event) {
              //alert(this.radius);
              that1.saveMode = "MODIFY";
              that1.geofennceType = gType;
              that1.gLatitude = this.center.lat();
              that1.gLongitude = this.center.lng();
              that1.radius = this.radius;
              ///alert(this.getCenter() + ',' + this.radius);
            });

            google.maps.event.addListener(this.circleArray[i].geoMap, 'center_changed', function (event) {
              that1.saveMode = "MODIFY";
              that1.geofennceType = gType;
              that1.gLatitude = this.center.lat();
              that1.gLongitude = this.center.lng();
              that1.radius = this.radius;
              //if(circle.getCenter().toString() !== center.toString()) circle.setCenter(center);
            });

            // google.maps.event.addListener(this.circleArray[i].geoMap.getPath(), 'set_at', function () {
            //   alert('Hi')
            // });

            // google.maps.event.addListener(this.circleArray[i].geoMap.getPath(), 'insert_at', function () {
            //   alert('Hi');
            // });


          }
          else {
            if (this.circleArray[i].geoMap.editable == true) {
              this.circleArray[i].geoMap.setEditable(false);
            }

          }

        }
      }
    }


  }
Geofencedeletetoaster:any
  DeleteGeofence(geofence: any) {

    if (this.selectedGID != 0) {
      this.closeEdit(this.selectedGID);
    }

    this.geofence_id = geofence.geofenceID;

    this.geofence_name = geofence.geofenceName;


    swalWithBootstrapButtons({
      title: this.GeofenceRemove + this.geofence_name,
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.Ok,
      cancelButtonText: this.Cancel,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

       // debugger
        // var cmValue = "Do you want to Remove ?  " + this.geofence_name + " ..\n Click OK to Proceed "
        // if (confirm(cmValue)) {

        this._geofenceService.deleteGeofenceDetails(this.geofence_id).subscribe(data => {
       //   debugger
          this.ResponseList = data;
          if (this.ResponseList.HTTPStatus == "200") {
            this.loadGeofences();
        //    debugger
            this.Geofencedeletetoaster=this.ResponseList.Message
            if (this.ResponseList.Status == "Warning") {
             
               this.toastr.warning(this.translate.instant(this.Geofencedeletetoaster));
            }
            else {
            (<HTMLInputElement>document.getElementById('txtLoc')).value = "";
              this.toastr.success(this.translate.instant(this.Geofencedeletetoaster));
            }
          } else {
            this.toastr.warning(this.translate.instant('NotDeleted'));
          }
        },
          error => {
            this.toastr.warning(this.translate.instant('NotDeleted'));
          });
      }
    });
    // }
    // else {

    //   return false;
    // }
  }

  ModifyGeofence(geofence: any, type: any) {
    // debugger
    swalWithBootstrapButtons({
      title: this.GeofenceAdd,
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.Ok,
      cancelButtonText: this.Cancel,
      reverseButtons: true
    }).then((result) => {
      //  debugger
      if (result.dismiss) {
        this.loadGeofences();
      }
      else {
        if (result.value) {
          //  this.Save("");
          this.Save(geofence.geofenceName);
          this.closeEdit(geofence.geofenceID);
        }
      }
    });
  }


  CancelGeofence(geofence: any, type: any) {
    //debugger
    this.closeEdit(geofence.geofenceID);
    this.loadGeofences();
  }

  closeEdit(geofenceID: any) {
   // debugger
    (<HTMLInputElement>document.getElementById('txtLoc')).value = "";
    if (this.selectedGeofence != "") {
      ;
      if (this.selectedGeofence.editable == true) {
        this.selectedGeofence.setEditable(false);
      }
    }
    if (geofenceID != 0) {

      var saveSpan = document.getElementById('divSave' + geofenceID);
      saveSpan.setAttribute("style", "display:none;");

      var editSpan = document.getElementById('divEdit' + geofenceID);
      editSpan.setAttribute("style", "display:block;");

      this.selectedGID = 0;

    }
  }



  showonMap(id: any, gType: any) {

    // debugger
    (<HTMLInputElement>document.getElementById('txtLoc')).value = "";
    //(<HTMLInputElement>document.getElementById('txtLoc')).value=geofence.geofenceName;
    this.activeElement = id;
    if (this.selectedGID != 0) {
      this.closeEdit(this.selectedGID);
    }

    if (this.prevSelectedDiv != 0 && this.prevSelectedDiv !== undefined && this.prevSelectedDiv != null) {
      var prevdivcntrl = document.getElementById("div" + this.prevSelectedDiv);
      if (prevdivcntrl != null) {
        prevdivcntrl.setAttribute("style", "border-right:0px solid #03243B");
      }
    }

    var divcntrl = document.getElementById("div" + id);
    //Naveen Modified
    // divcntrl.setAttribute("style", "border-right:4px solid #03243B;padding:10px 9px 60px 22px;");


    if (gType == 'P') {
      var bounds = new google.maps.LatLngBounds();
      for (var i: any = 0; i < this.polygnPathArray.length; i++) {
        if (this.polygnPathArray[i].geoID == id) {
          this.polygnPathArray[i].geoMap.getPath().forEach(function (element, index) {
            bounds.extend(element);
          });
          this.map.fitBounds(bounds);
          //this.map.fitBounds(this.polygnPathArray[i].geoMap.getBounds());
        }
      }

    }
    else {
      for (var i: any = 0; i < this.circleArray.length; i++) {
        if (this.circleArray[i].geoID == id) {
          this.map.fitBounds(this.circleArray[i].geoMap.getBounds());
          //this.map.setCenter(new google.maps.LatLng(geofence.latitude, geofence.longitude));

        }
      }
      // var latlng = new google.maps.LatLng(geofence.latitude, geofence.longitude)
      // this.map.setCenter(latlng);
    }
    this.prevSelectedDiv = id;
  }



  OpenModal(status: string) {
    if (status == 'create') {
      this.NewGeofence=this.translate.instant('New Geofence')
      this.geofence_id = "";
      this.geofenceobj = new Geofence();
    }

  }

  Save(geofenceName: string) {

   // debugger

    //if (geofenceName != "") {
    if (!this._commnService.AcceptFirstChar_REGX.test(geofenceName)) {
      this.toastr.warning(this.InvalidgeofenceName);
      return false;
    }
    if (this.saveMode == "CREATE" && (geofenceName == undefined || geofenceName == "")) {
      this.toastr.warning(this.EnterGeofenceName);
    }
    else {

      var latLongs: any = [];
      var gType: string;
      var rad: string;

      var resulList: any;
      if (this.geofennceType == "P") {
        if (this.polygonLatLongs.length > 0) {
       //    debugger
          this._geofenceService.savePolygon(geofenceName, "", this.polygonLatLongs, this.geofennceType, this.geofence_id, this.saveMode)
            .subscribe(res => {
         //     debugger
              resulList = res;
              //Naveen 
              this.polygonLatLongs = "";
              this.geofennceType = "";
              //Naveen 

              if (resulList.status == "001") {
                this.toastr.success(resulList.message);
                (<HTMLInputElement>document.getElementById('txtLoc')).value = "";
                this.modalRootPopUp.hide();
              }
              else {
                this.toastr.warning(resulList.message);
                if(this.saveMode!= "CREATE"){
                  this.loadGeofences();
                }else{
                  this.modalRootPopUp.hide();
                }
                
              }
            },
              error => {
                this.toastr.warning(this.translate.instant('Errorinsave'));
              });


        }
      }
      else {
        if ((this.gLatitude == "" || this.gLatitude == undefined) &&
          (this.gLongitude == "" || this.gLongitude == undefined)) {

        } else {
          this._geofenceService.saveGeofence(geofenceName, " ", this.gLatitude, this.gLongitude, this.radius, this.geofennceType, this.geofence_id, this.saveMode)
            .subscribe(res => {

              this.gLatitude = "";
              this.gLongitude = "";
              this.radius = "";
              this.geofennceType = "";
              this.geofence_id = ""


              resulList = res;
              //this.loadGeofences();
              if (resulList.status == "001") {
                (<HTMLInputElement>document.getElementById('txtLoc')).value = "";
                this.toastr.success(resulList.message);
                this.modalRootPopUp.hide();
              }
              else {
                this.toastr.warning(resulList.message);
              }
              //this.loadGeofences();
            },
              error => {
                //this.loadGeofences();
                this.toastr.warning(this.translate.instant('Errorinsave'));
              });
        }
      }

    }
    // } else {
    //   this.toastr.warning('Error in save ');
    // }

  }

  geofenceList: any = {};
  circleArray: any = [];

  polygnPathArray: any = [];
  gefenceShow: boolean = false;


  loadGeofences() {
   // debugger
    if (this.sltShape != null) {
      this.sltShape.setMap(null);
    }
    this.clearMap();
    var ClientID = this._commnService.getClientID();
    this._geofenceService.GetGeofences(ClientID)
      .subscribe(res => {
        //  debugger
        this.resultList = res;

        if (this.resultList.status == "001") {


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
          //  debugger

          this.grofenceList1 = this.resultList.geofence;
          this.polygonList1 = this.resultList.polygon;
          this.searchValue.nativeElement.value = "";


          this.resultList.geofence.forEach(element => {
            this.AddCircle(new google.maps.LatLng(element.latitude, element.longitude), element.geofenceName, Number(element.radius), element.geofenceID);
          });

          this.resultList.polygon.forEach(element => {
            var geoName = element.geofenceName;
            var geoId = element.geofenceID;

            var geoColor = "#3598DC";

            var commanarray = new Array()
            {
              element.latLongs.forEach(childelement => {


                var latLngPoly = new google.maps.LatLng(childelement.lat, childelement.lng);
                commanarray.push(latLngPoly);

              });

              this.polygon(commanarray, geoName, geoColor, geoId)
            }

          });
        }

      });
  }


  polygon(Polygonarray: any, gbname: string, gbcolor: string, gbID: any) {

    var gbcolorvalue = gbcolor;

    var flightPath = new google.maps.Polygon({
      paths: Polygonarray,
      strokeColor: gbcolorvalue,
      //strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: gbcolorvalue,
      //fillOpacity: 0.25,
      map: this.map
    });

    flightPath.setMap(this.map);

    // var listner = google.maps.event.addListener(flightPath, 'click', showArrays);
    //var listner = google.maps.event.addListener(flightPath, 'mouseout', mouseoutpolygon);

    this.polygnPathArray.push({ "geoMap": flightPath, "geoID": gbID });

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
    //infowindow = new google.maps.InfoWindow();
    //function mouseoutpolygon() {
    //    infowindow.open(null);
    //}
  }

  AddCircle(latLng: any, gname: any, radius: any, geoID: any) {

    var CircleOptions = {
      strokeColor: "#3598DC",
      fillColor: "#3598DC",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillOpacity: 0.35,
      clickable: true,
      map: this.map,
      clickble: false,
      editable: false,
      center: latLng,
      title: gname,
      radius: parseFloat(radius)
    };

    var Drawcircle = new google.maps.Circle(CircleOptions);
    this.circleArray.push({ "geoMap": Drawcircle, "geoID": geoID });
    Drawcircle.setMap(this.map);


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

  public activeElement = 1;
  public selectedItem(id) {
    this.activeElement = id;
  }

}
export class Geofence {
  public geofenceName: string;

}