import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleTrackingRoutingModule } from './vehicle-tracking-routing.module';
import { MapViewComponent } from './map-view/map-view.component';
import { VehicleSummaryComponent } from './vehicle-summary/vehicle-summary.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { TabModule } from 'angular-tabs-component';
import { AngularSlickgridModule } from 'angular-slickgrid';
//import { TranslateModule } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule ,DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { SensorSummaryComponent } from './sensor-summary/sensor-summary.component';
//import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
//import { MY_CUSTOM_FORMATS } from '../GlobalServices/atpl.service'

// const MY_CUSTOM_FORMATS = {

//   // if(sessionStorage.getItem("DateFormat") != null)
//   // {
//   parseInput: sessionStorage["DateFormat"].toString() + " hh:mm A", //'DD/MM/YYYY hh:mm A',
//   fullPickerInput: sessionStorage["DateFormat"].toString() + " hh:mm A",
//   datePickerInput: sessionStorage["DateFormat"].toString(),
//   timePickerInput: 'hh:mm A',
//   monthYearLabel: 'MMM YYYY',
//   dateA11yLabel: sessionStorage["DateFormat"].toString() + " hh:mm A",
//   monthYearA11yLabel: sessionStorage["DateFormat"].toString() + " hh:mm A"
//   //}
// };

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VehicleTrackingRoutingModule,
    NgSelectModule,
    SharedModule,
    TabModule,
    AngularSlickgridModule.forRoot(),
    //TranslateModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [
    MapViewComponent,
    VehicleSummaryComponent,
    SensorSummaryComponent
  ],
  providers: [
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
]
})
export class VehicleTrackingModule { }
