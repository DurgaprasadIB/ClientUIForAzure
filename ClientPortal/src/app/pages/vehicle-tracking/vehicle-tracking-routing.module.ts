import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './map-view/map-view.component';
import { VehicleSummaryComponent } from './vehicle-summary/vehicle-summary.component';
import { SensorSummaryComponent } from './sensor-summary/sensor-summary.component';

const routes: Routes = [
  {
    path:'VehicleSummary',
    component:VehicleSummaryComponent,
    data: {
      title: "Vehicle Summary",
    }
  },
  {
    path:'SensorSummary',
    component:SensorSummaryComponent,
    data: {
      title: "Sensor Summary",
    }
  },
  {
    path:'MapView',
    component:MapViewComponent,
    data: {
      title: "Map View",
    }
  },
  {
    path:'',
    redirectTo:'MapView',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleTrackingRoutingModule { }
