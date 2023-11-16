import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-files',
  templateUrl: './video-files.component.html',
  styleUrls: ['./video-files.component.css']
})
export class VideoFilesComponent implements OnInit {

  url: SafeResourceUrl;

  constructor(private _detailService: ReportService,
    private sanitizer: DomSanitizer,
    private router: Router) { }

  ngOnInit() {
    
    sessionStorage.setItem('liveScreen', "videoFiles");
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("https://iotadmin.iotsolution.net/FTP_Sensorcnt/nird_recordings/video.png");
    this.loadVideoFiles();
  }

  videoFileList: any

  loadVideoFiles() {

    this.videoFileList = [];

    var resp: any = [];

    this._detailService.VideoFiles().subscribe(result => {
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
    sessionStorage.setItem("USER_PREF", "");
    if (path == "Live") {
      this.router.navigateByUrl('/pages/tracking/LiveView')
    }
    else {
      this.router.navigateByUrl('/pages/tracking/LiveChart')
    }

  }

  playVideo(name: any) {

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("https://iotadmin.iotsolution.net/FTP_Sensorcnt/nird_recordings/" + name);
  }


}
