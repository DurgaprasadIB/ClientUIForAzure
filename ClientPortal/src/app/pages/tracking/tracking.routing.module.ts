import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveTrackComponent } from './live-track/live-track.component';
import { TrackerInsightsComponent } from './tracker-insights/tracker-insights.component';
import { MapViewComponent } from './map-view/map-view.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { LivechartsComponent } from './livecharts/livecharts.component';
import { SensorViewComponent } from './sensor-view/sensor-view.component';
import { DashboardPinsComponent } from './dashboard-pins/dashboard-pins.component';
import { TemperatureViewComponent } from './temperature-view/temperature-view.component';
import { MapComponent } from './map/map.component';
import { ListViewTempComponent } from './list-view-temp/list-view-temp.component';
import { EnergymeterViewComponent } from './energymeter-view/energymeter-view.component';

const routes: Routes = [
  {
    path: 'TrackerInsights',
    component: TrackerInsightsComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'LiveView',
    component: LiveViewComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'ListView',
    component: ListViewTempComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  //
  {
    path: 'TempView',
    component: TemperatureViewComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  }, {
    path: 'LiveChart',
    component: LivechartsComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'LiveTrack',
    component: LiveTrackComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'SensorView',
    component: SensorViewComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'Map',
    component: MapComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'MapView',
    component: MapViewComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  }, {
    path: 'AnalyticsView',
    component: DashboardPinsComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'EnergyView',
    component: EnergymeterViewComponent,
    data: {
      title: "Energy View",
    }
  },
  {
    path: '',
    component: LiveViewComponent,
    data: {
      title: "Live View",
    }
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { }
