import { Directive, HostListener, ElementRef } from '@angular/core';
import { IdeaBService } from '../pages/GlobalServices/ideab.service';

@Directive({
  selector: '[alphaNumerics]'
})
export class AlphaNumerics {

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home

  // private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef, private _commanService: IdeaBService) {
  }

  private regex: RegExp = this._commanService.ALPHANUMERICS_REGX;
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    debugger
    var input = <HTMLInputElement>event.srcElement;

    ////// name length check -- Ganeswari

    // if (this.specialKeys.indexOf(event.key) == 1) {//Tab
    //   if (input.value.length == 0) {
    //     input.style.borderLeft = "";
    //     return;
    //   }
    //   else if (input.value.length < this._commanService.nameLengthMin) {
    //     input.style.borderLeft = "1px solid #f3120e";
    //     event.preventDefault();
    //   }
    //   else if (input.value.length > this._commanService.nameLengthMax) {
    //     input.style.borderLeft = "1px solid #f3120e";
    //     event.preventDefault();
    //   }
    //   else {
    //     input.style.borderLeft = "";
    //     return;
    //   }
    // } else {
    //   return;
    // }
    //////
    let current: string = this.el.nativeElement.value;
    let next1: string = event.key.concat(current);
    let next: string = current.concat(event.key);


    if (this.specialKeys.indexOf(event.key) !== -1) {
      if (next1.startsWith("Tab ")) {
        event.preventDefault();
        input.style.borderLeft = "1px solid #f3120e";
      } else{
        return
      }
    }
   
    if (next.length > 0 && String(next) == " ") {
      event.preventDefault();
    }
    else if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
    else if (input.selectionStart == 0 && next1.startsWith(" ")) {
      event.preventDefault();
    }

    if (next1.length > this._commanService.nameLengthMax) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    //debugger;
  }
}
