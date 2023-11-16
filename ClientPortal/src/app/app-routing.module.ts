import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './guards/auth.guard';
//import { UserprofileComponent } from './pages/master/userprofile/userprofile.component';
const routes: Routes = [

    {
        path: 'IoT',
        loadChildren: './jio-login/jio-login.module#JioLoginModule',
        data: {
            title: 'IoT'
        }
    },
    {
        path: 'pages',
        canActivate: [AuthGuard],
        loadChildren: './pages/pages.module#PagesModule'
    },
    // {
    //     path: 'userProfile',
    //     component: UserprofileComponent,
    //     data: {
    //         title: "Edit Profile",
    //     }
    // },
    {
        path: 'default-password',
        loadChildren: './defaultpassword/defaultpassword.module#DefaultpasswordModule'
    },
    {
        path: '',
        redirectTo: 'IoT',
        pathMatch: 'full'
    },


];
const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

