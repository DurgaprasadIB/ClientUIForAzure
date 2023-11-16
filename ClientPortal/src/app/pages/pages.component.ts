import { Component, OnInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { Subscription } from 'rxjs';

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { UserIdleService } from 'angular-user-idle';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

const HTTPOPTIONS_ASSET = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + sessionStorage.getItem('ASSET_TOKEN') })
}

@Component({
  selector: 'app-pages',
  template: //(valueChange)='languageChange($event)'
    `
  <app-appheader ></app-appheader>
  <app-appmenu></app-appmenu>
  
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
    
        <!-- Main content -->
        <div class="divisionHeight">
          <section class="content">
            <router-outlet>
            <span  *ngIf="showLoader" class="loading | async"> </span>
            </router-outlet>
            
          </section>
       </div>
     </div>
     <app-appfooter></app-appfooter>
  `,
  styleUrls: ['./pages.component.css']

})
export class PagesComponent implements OnInit, OnDestroy {
  @Output() lngChange = new EventEmitter();

  showLoader: boolean = false;
  subscription: Subscription;
  constructor(
    private loaderService: LoaderService
    , private cd: ChangeDetectorRef,
    private userIdle: UserIdleService,
    private _toaster: ToastrService,
    private _router: Router
  ) {
    this.showLoader = false;
  }
  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
      this.cd.detectChanges();
    });
    debugger
    $(document).ready(function () {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
      };
    });

    // this.userIdle.startWatching();
    // this.userIdle.onTimerStart().subscribe();//count => console.log(count)
    // this.userIdle.onTimeout().subscribe(() =>this.sessionExprie());
  }

  languageChange(lng) {
    debugger
    alert(lng + "PageComponent");
    this.lngChange.emit(lng);
  }

  ngOnDestroy() {
    //this.cd.detectChanges();
    // this.subscription.unsubscribe();
  }
  // sessionExprie(){
  //   this.userIdle.stopTimer();
  //   this.userIdle.stopWatching();
  //   sessionStorage.clear();
  //   this._toaster.warning("Your session is experied..");
  //   this._router.navigateByUrl('jio-login');
  //   location.reload();
  // }
  // stop() {
  //   this.userIdle.stopTimer();
  // }

  // stopWatching() {
  //   this.userIdle.stopWatching();
  // }

  // startWatching() {
  //   this.userIdle.startWatching();
  // }

  GetAccessToken() {
    return HTTPOPTIONS_ASSET;
  }

}

