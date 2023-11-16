import { Directive, ElementRef, HostListener } from '@angular/core';
import { IdeaBService } from '../pages/GlobalServices/ideab.service';

@Directive({
  selector: '[appMobilecheck]'
})
export class MobilecheckDirective {

 
  constructor(private el: ElementRef, private _commanService: IdeaBService) { }
  private Lenregex: RegExp = this._commanService.MOBILE_REGX;
  @HostListener('focusout')
  onFocusOut() {
    //debugger;
    let current: string = this.el.nativeElement.value;
    if (current != "") {
      if (current && !String(current).match(this.Lenregex)) {
         this.el.nativeElement.style.borderLeft = "1px solid #f3120e";
      } else {
        this.el.nativeElement.style.borderLeft = "";
      }
    }else{
      this.el.nativeElement.style.borderLeft = "";
    }
  }

}
