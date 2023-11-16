import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IdeaBService } from './ideab.service';

@Injectable(//{
    //// providedIn: 'root'
    //}
)
export class CustomErrorHandlerService implements ErrorHandler {
    constructor(private injector: Injector, private _comman: IdeaBService) { }
    handleError(error) {
       // alert(error);
        console.warn('Handler caught an error', error);

        if (error instanceof HttpErrorResponse) {
            //Backend returns unsuccessful response codes such as 404, 500 etc.				  
            console.error('Backend returned status code: ', error.status);
            console.error('Response body:', error.message);
        }

        if (error.message.includes("google")) {
            debugger
           
           // this._comman.ChangeMapScript();
            //window.history.back();
        }
    }
}