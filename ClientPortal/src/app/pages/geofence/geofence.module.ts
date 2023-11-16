import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeofenceRoutingModule } from './geofence-routing.module';
import { GeofenceComponent } from './geofence.component';
import { GeofencesComponent } from './geofences/geofences.component';
import { MapgeofenceComponent } from './mapgeofence/mapgeofence.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { PagesModule } from '../pages.module';

@NgModule({
  imports: [
    CommonModule,
    GeofenceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,PagesModule
  ],
  exports:[
    ReactiveFormsModule
  ],
  declarations: [GeofenceComponent, GeofencesComponent, MapgeofenceComponent]
})
export class GeofenceModule { }
