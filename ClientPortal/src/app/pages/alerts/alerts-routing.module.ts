import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';

const routes: Routes = [
  {
   path:'AlertSettings',
   component:AlertsettingsComponent,
   data: {
    title: "Alert Settings",
  }
  },  
  {
   // /pages/alerts/AlertSettings pages/alerts/AlertSettings 
    path:'',
    redirectTo:'AlertSettings',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
