import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
const datePipe = new DatePipe('en-US');

@Injectable({
  providedIn: 'root'
})

export class TestService {
    AppName:string;
  constructor(
  
  ) {}

GetApplicationName(){
    this.AppName =" GR Consulatance";
    return this.AppName;
}

}
