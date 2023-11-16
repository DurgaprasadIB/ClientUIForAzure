import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteDashboardComponent } from './site-dashboard/site-dashboard.component';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
  {
    path:'Site',
    component:SiteDashboardComponent,
    data:{
      title:"Site"
    }
  },{
    //path:'charts',
    path:'statistics',
    component:ChartsComponent,
    data:{
      title:"statistics"
    }
  },
  {
    path:'',
    redirectTo:'Site',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
