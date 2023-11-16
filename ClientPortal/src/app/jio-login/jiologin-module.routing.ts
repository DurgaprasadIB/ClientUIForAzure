import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';




const routes: Routes = [
    {
        path:'login',
        component:LoginComponent,
        data:{
            title:'Login'
        }
    },
    
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
   
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JioLoginRoutingModule { }

