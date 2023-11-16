import { Directive, HostListener, ElementRef } from '@angular/core';
import { IdeaBService } from '../pages/GlobalServices/ideab.service';

@Directive({
    selector: '[appMobileStartingWithNumber]'
  })

  export class MobileStartingWithNumber{

    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];
    constructor(private el: ElementRef, private _commanService: IdeaBService) {
    }
   private regex: RegExp = this._commanService.ALPHANUMERICS_REGX;
   currentString:string="";
   @HostListener('keypress', [ '$event' ])
   onKeyPress(event: KeyboardEvent){
   debugger

let current: string = this.el.nativeElement.value;
let next: string = current.concat(event.key);
//if (next && !String(next).match(this.regex))
if (this.regex.test(event.key))
{
    return
}
else
{
  event.preventDefault();
}



   }
  }