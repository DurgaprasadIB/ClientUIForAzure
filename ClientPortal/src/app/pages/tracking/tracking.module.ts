import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingComponent } from './tracking.component';
import { TrackingRoutingModule } from './tracking.routing.module';
import { LiveTrackComponent } from './live-track/live-track.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TrackerInsightsComponent } from './tracker-insights/tracker-insights.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateModule } from '@ngx-translate/core';
import { MapViewComponent } from './map-view/map-view.component';
import { TabModule } from 'angular-tabs-component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { LiveViewComponent } from './live-view/live-view.component';
import { LivechartsComponent } from './livecharts/livecharts.component';
import { SensorViewComponent } from './sensor-view/sensor-view.component';
import { DashboardPinsComponent } from './dashboard-pins/dashboard-pins.component';
import { TemperatureViewComponent } from './temperature-view/temperature-view.component';
import { MapComponent } from './map/map.component';
import { ListViewTempComponent } from './list-view-temp/list-view-temp.component';
import { EnergymeterViewComponent } from './energymeter-view/energymeter-view.component';
// import { ChartModule } from 'angular-highcharts';

// import { ChartModule } from 'angular2-highcharts';
// import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
// import { platformBrowserDynamic }  from '@angular/platform-browser-dynamic';

declare var require:any;
// export function HighchartsFactory () {
//   const hc = require('highcharts/highstock');
//   const hd = require('highcharts/modules/exporting');
//   var expdt = require('highcharts/modules/export-data');
//   hd(hc);
//   expdt(hc);
//   return hc; 
// }

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
    TrackingRoutingModule,
    NgSelectModule,
    UiSwitchModule,
    SharedModule,
    TabModule,
    AngularSlickgridModule.forRoot(),
    TranslateModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule, 
    
  //  ChartModule,//.forRoot(require('highcharts')),
  ],
  declarations: [
    TrackingComponent,
    LiveTrackComponent,
    TrackerInsightsComponent,
    MapViewComponent,
    LiveViewComponent,
    LivechartsComponent,
    SensorViewComponent,
    DashboardPinsComponent,
    TemperatureViewComponent,    
    MapComponent, ListViewTempComponent,
    EnergymeterViewComponent
  ],
  providers: [
    // {
    //   provide: HighchartsStatic,
    //   useFactory: HighchartsFactory
    // }
    //  { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    //  { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ]
})
export class TrackingModule { }
// platformBrowserDynamic().bootstrapModule(TrackingModule);