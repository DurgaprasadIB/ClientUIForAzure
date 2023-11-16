import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeofencesComponent } from './geofences/geofences.component';
import { MapgeofenceComponent } from './mapgeofence/mapgeofence.component';


const routes: Routes = [
  {
    path:'AddGeofence',
    component:GeofencesComponent,
    data: {
    title: "Add Geofence",
    }
  },
  {
  path:'AssignGeofence',
  component:MapgeofenceComponent,
  data: {
   title: "Assign Geofence",
 }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeofenceRoutingModule { }
