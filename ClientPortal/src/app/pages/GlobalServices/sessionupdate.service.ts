import { Injectable } from '@angular/core';
import { FuelSensorId, SLISensorId, TemparatureSensorId, PressureSensorId } from 'src/assets/GlobalStatic';
import { TrackingService } from '../tracking/services/tracking.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SessionupdateService {

  sessionItems = new SessionItems();
  peopleListData: any = [];
  vehicleListData: any = [];
  constructor(private _trackingService: TrackingService, private _toaster: ToastrService) { }

  // UpdatingThePeopleSession(peopleObj: any) {

  //   //For People Session
  //   var sessionPeopleData1 = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_PEOPLE"));
  //   var latestPeople = peopleObj;
  //   for (let i = 0; i < sessionPeopleData1.length; i++) {
  //     for (let j = 0; j < latestPeople.length; j++) {
  //       if (sessionPeopleData1[i].deviceNo == latestPeople[j].deviceNo) {
  //         sessionPeopleData1[i].deviceNo = latestPeople[j].deviceNo;
  //         sessionPeopleData1[i].assetNo = latestPeople[j].assetNo;
  //         sessionPeopleData1[i].assetType = latestPeople[j].assetType;
  //         break;
  //       }
  //     }
  //   }
  //   sessionStorage.setItem("ASSETS_TYPES_PEOPLE", JSON.stringify(sessionPeopleData1));

  //   //For People Session Live Data
  //   var ExitsessionPeopleData = JSON.parse(sessionStorage.getItem("PEOPLE_TOTALDATA"));
  //   ExitsessionPeopleData = ExitsessionPeopleData == null ? [] : ExitsessionPeopleData;
  //   if (ExitsessionPeopleData.length != 0) {
  //     var sessionPeopleData = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_PEOPLE"));
  //     for (let i = 0; i < ExitsessionPeopleData.length; i++) {
  //       for (let j = 0; j < sessionPeopleData.length; j++) {
  //         if (ExitsessionPeopleData[i].imi == sessionPeopleData[j].deviceNo) {
  //           ExitsessionPeopleData[i].imi = sessionPeopleData[j].deviceNo;
  //           ExitsessionPeopleData[i].dvt = sessionPeopleData[j].assetNo;
  //           break;
  //         }
  //       }
  //     }
  //     sessionStorage.setItem("PEOPLE_TOTALDATA", JSON.stringify(ExitsessionPeopleData));
  //   }

  // }

  // UpdatingTheVehicleSessionStorage(vehicleobj: any) {

  //   var sessionVehicleData1 = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));
  //   var latestVehicle = vehicleobj;

  //   for (let i = 0; i < sessionVehicleData1.length; i++) {
  //     for (let j = 0; j < latestVehicle.length; j++) {
  //       if (sessionVehicleData1[i].deviceNo == latestVehicle[j].deviceNo) {
  //         sessionVehicleData1[i].deviceNo = latestVehicle[j].deviceNo;
  //         sessionVehicleData1[i].assetNo = latestVehicle[j].assetNo;
  //         sessionVehicleData1[i].assetType = latestVehicle[j].assetType;
  //         break;
  //       }
  //     }
  //   }
  //   sessionStorage.setItem("ASSETS_TYPES_VEHICLE", JSON.stringify(sessionVehicleData1));



  //   //For Vehicle Session Live Data
  //   var ExitsessionVehicleData = JSON.parse(sessionStorage.getItem("VEHICLE_TOTALDATA"));
  //   ExitsessionVehicleData = ExitsessionVehicleData == null ? [] : ExitsessionVehicleData
  //   if (ExitsessionVehicleData.length != 0) {
  //     var sessionVehicleData = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));
  //     for (let i = 0; i < ExitsessionVehicleData.length; i++) {
  //       for (let j = 0; j < sessionVehicleData.length; j++) {
  //         if (ExitsessionVehicleData[i].imi == sessionVehicleData[j].deviceNo) {
  //           ExitsessionVehicleData[i].imi = sessionVehicleData[j].deviceNo;
  //           ExitsessionVehicleData[i].vldvt = sessionVehicleData[j].assetNo;
  //           break;
  //         }
  //       }
  //     }
  //     sessionStorage.setItem("VEHICLE_TOTALDATA", JSON.stringify(ExitsessionVehicleData));

  //   }

  // }


  sessionUpdate() {
    this.sessionItems.userId = sessionStorage.getItem("LOGINUSERID");
    this.sessionItems.userType = sessionStorage.getItem("USER_TYPE");
    this._trackingService.getUserDevices(this.sessionItems).subscribe(result => {
      debugger;
      this.peopleListData = result;
      sessionStorage.setItem("ASSETS_TYPES_PEOPLE", JSON.stringify(this.peopleListData.userPPLAssets));
      sessionStorage.setItem("ASSETS_TYPES_VEHICLE", JSON.stringify(this.peopleListData.userVLAssets));
      sessionStorage.removeItem("FUEL_TOTALDATA");
      sessionStorage.removeItem("TEMPARATURE_DATA");
    }, error => {
      this._toaster.warning(error.error.Message);
    })

  }


}

export class SessionItems {
  public userId: string;
  public userType: string;

}
