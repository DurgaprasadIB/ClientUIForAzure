import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        // data: {
        //   title: "Dashboard",
        // }
      },
      {
        path: 'tracking',
        loadChildren: './tracking/tracking.module#TrackingModule',
        // data: {
        //   title: "Live",
        // }
      },
      {
        path: 'VehicleTracking',
        loadChildren: './vehicle-tracking/vehicle-tracking.module#VehicleTrackingModule',
        data: {
          title: "Vehicle",
        }
      },
      {
        path: 'master',
        loadChildren: './master/master.module#MasterModule',
        
        // data: {
        //   title: "Master",
        // }
      },
      {
        path: 'setup',
        loadChildren: './setup/setup.module#SetupModule',
        data: {
          title: "SetUp",
        }
      },
      {
        path: 'geofence',
        loadChildren: './geofence/geofence.module#GeofenceModule',
        data: {
          title: "Geofence",
        }
      },
      {
        path: 'alerts',
        loadChildren: './alerts/alerts.module#AlertsModule',
        // data: {
        //   title: "Alerts",
        // }
      },
      {
        path: 'reports',
        loadChildren: './reports/reports.module#ReportsModule',
        // data: {
        //   title: "Reports",
        // }
      },
      {
        path: 'iot-reports',
        loadChildren: './iot-reports/iot-reports.module#IotReportsModule',
        data: {
          title: "Smart Sensoring",
        }
      },
      {
        path: '',
        redirectTo: 'guest-management',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
