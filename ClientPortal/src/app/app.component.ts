import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { LoaderService } from './services/loader.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IdeaBService } from './pages/GlobalServices/ideab.service';
import { UserIdleConfig, UserIdleService } from 'angular-user-idle';
// AppheaderComponent




@Component({
  selector: 'app-root',
  template: //'<app-pages  (lngChange)="displayCounter($event)"></app-pages>'+
    '<router-outlet>' +
    '<span *ngIf="showLoader" class="loading"> </span> ' +
    '<div *ngIf="showScrollDiv" [ngClass]="{navigationArrow: showScrollDiv == true}" (click)="MoveToUp()">' +
    '<i class="fa fa-angle-up"></i>' +
    '</div>' +
    '</router-outlet>',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  configIdle: UserIdleConfig = {
    idle: 6000,
    timeout: 2,
    ping: 1
  };

  showLoader: boolean = false;
  subscription: Subscription;
  lng: any = 'en';
  showScrollDiv: boolean = false;


  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    titleService: Title,
    private router: Router,
    activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private _comman: IdeaBService,
    private userIdle: UserIdleService,
  ) {

    ////
    try {
      if (sessionStorage.getItem("language") != null)
        this.lng = sessionStorage.getItem("language");
    } catch (e) {
      e = null;
    }
    /////////Ganeswari
    //._comman.ChangeMapScript();
    /////////Ganeswari

    this.translate.use(this.lng);


    ////
    this.showScrollDiv = false;
    this.showLoader = false;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        var title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' - ');
        titleService.setTitle(title);
      }
    });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('IoT')

  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll() {
    ////
    if (window.scrollY <= 80) {
      this.showScrollDiv = false;
    } else {
      this.showScrollDiv = true;
    }
  }

  displayCounter(count) {
    //
    alert(count);
  }

  getTitle(state, parent) {
    //
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnInit() {
    
    if (sessionStorage.getItem('IdleMins')) {

      this.configIdle["idle"] = Number(sessionStorage.getItem('IdleMins')) * 60;
      this.userIdle.setConfigValues(this.configIdle);

      this.userIdle.startWatching();

      // Start watching when user idle is starting.
      this.userIdle.onTimerStart().subscribe(event => console.log(event));

      // Start watch when time is up.
      this.userIdle.onTimeout().subscribe(() => this.logout());

    }
    this.loaderService.status.subscribe((val: boolean) => {
      //
      this.showLoader = val;
      this.cdr.detectChanges();
    });


  }



  DynamicLoadMapScript() {

    // if (sessionStorage.getItem("MAP_TYPE") != null) {
    //   this.lng = sessionStorage.getItem("MAP_TYPE").toString();
    // }

    const dynamicScripts = ["https://maps.googleapis.com/maps/api/js?key=AIzaSyAlMUA4urzqNM3xoI7SxUwTFAZ7Q13fiUc&libraries=geometry,drawing,places&language=" + this.lng];

    for (var i = 0; i < dynamicScripts.length; i++) {
      try {
        let node = document.createElement('script');
        node.setAttribute('id', 'MapScript');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = true;
        node.defer = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('body')[0].appendChild(node);
      } catch (e) {
        e = null;
      }
    }
  }

  ngOnDestroy() {
    this.cdr.detach();
    this.subscription.unsubscribe();
  }


  MoveToUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
