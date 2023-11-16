import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertsDetailsComponent } from './alerts-details/alerts-details.component';

import { SharedModule } from '../shared/shared.module';
import { IotReportComponent } from './iot-report/iot-report.component';
import { VideoFilesComponent } from './video-files/video-files.component';
import { ImageFilesComponent } from './image-files/image-files.component';
import { SaveAnalyticsComponent } from './save-analytics/save-analytics.component';
import { TabComponent } from './tab/tab.component';
import { LogComponent } from './log/log.component';

const routes: Routes = [
  {
    path: 'videoRecordings',
    component: VideoFilesComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  }, {
    path: 'images',
    component: ImageFilesComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'alertdetails',
    component: AlertsDetailsComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'iotreport',
    component: IotReportComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'analytics',
    component: SaveAnalyticsComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'tab',
    component: TabComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'log',
    component: LogComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  //SaveAnalyticsComponent
  {
    path: '',
    redirectTo: 'tripanalysisreport',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
