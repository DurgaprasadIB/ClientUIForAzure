import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IdeaBService } from '../../GlobalServices/ideab.service';

@Component({
  selector: 'app-image-files',
  templateUrl: './image-files.component.html',
  styleUrls: ['./image-files.component.css']
})
export class ImageFilesComponent implements OnInit {


  url: SafeResourceUrl;

  constructor(private _detailService: ReportService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private _commanService: IdeaBService) { }

  videoFileList: any
  zoom: any = 80;

  hasChart: boolean;
  clientFeatures: any;

  ngOnInit() {

    this.hasChart = false;

    this.clientFeatures = {};
    this.clientFeatures = JSON.parse(sessionStorage.getItem('Client_Feature'));

    this.clientFeatures.forEach(fe => {
      if (fe.featureId.toUpperCase() == '6F5B60E3-1473-45B2-86DF-91EF6612D1F4') {
        this.hasChart = true;
      }

    });

    sessionStorage.setItem('liveScreen', "imageFiles");

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("https://iotadmin.iotsolution.net/FTP_Sensorcnt/coe_images/camera.png");

    this.loadImageFiles();
    this.zoom = 100;
  }

  loadImageFiles() {

    this.videoFileList = [];

    var resp: any = [];

    this._detailService.ImageFiles().subscribe(result => {
      resp = result;
      debugger
      if (resp.sts == "200") {
        resp.videoFile.forEach(v => {
          this.videoFileList.push(v);
        });
        debugger
      }
      else {

      }
    });
  }

  changeView(path: any) {

    this._commanService.ActionType = path;

    sessionStorage.setItem("USER_PREF", "");
    if (path == "live") {
      this.router.navigateByUrl('/pages/tracking/LiveView')
    }
    else
    if (path == "pin") {
      this.router.navigateByUrl('/pages/tracking/AnalyticsView')
    }
    else {
      this.router.navigateByUrl('/pages/tracking/LiveChart')
    }

  }

  showImage(name: any) {

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(name);
  }

  zoomIn() {
    debugger
    this.zoom = this.zoom + 5;
  }
  zoomOut() {
    debugger
    if (this.zoom != 100) {
      this.zoom = this.zoom - 5;
    }
  }

  original() {
    this.zoom = 100;
  }
}
