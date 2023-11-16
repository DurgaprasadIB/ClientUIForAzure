import { Directive, ElementRef, HostListener } from '@angular/core';
import { IdeaBService } from '../pages/GlobalServices/ideab.service';

@Directive({
  selector: '[appAlphaNumericsWithSpaceMinus]'
})
export class AlphaNumericsWithSpaceMinusDirective {

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  
 // private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];
 private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home'];

 constructor(private el: ElementRef, private _commanService: IdeaBService) {
  }
  private regex: RegExp = this._commanService.AlphaNumericsWithSpaceMinus;
  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
  //debugger
  if (this.specialKeys.indexOf(event.key) !== -1) {
  return;
  }
  let current: string = this.el.nativeElement.value;
  let next: string = current.concat(event.key);
  if (!String(next).match(this.regex)) {
            event.preventDefault();
      }
  }
}
