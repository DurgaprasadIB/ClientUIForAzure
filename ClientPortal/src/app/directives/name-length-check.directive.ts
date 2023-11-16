import { Directive, ElementRef, HostListener } from '@angular/core';
import { IdeaBService } from '../pages/GlobalServices/ideab.service';

@Directive({
  selector: '[appNameLengthCheck]'
})
export class NameLengthCheckDirective {

  constructor(private el: ElementRef, private _commanService: IdeaBService) { }
  @HostListener('focusout')
  onFocusOut() {
    debugger;
    let current: string = this.el.nativeElement.value;
    if (current != "") {
      if (current.length >= this._commanService.nameLengthMin 
        && current.length <= this._commanService.nameLengthMax) {
        this.el.nativeElement.style.borderLeft = "";
      } else {
        this.el.nativeElement.style.borderLeft = "1px solid #f3120e";        
      }
    }else{
      this.el.nativeElement.style.borderLeft = "";
    }
  }

}
