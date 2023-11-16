import { Directive, HostListener, ElementRef } from '@angular/core';
import { IdeaBService } from '../pages/GlobalServices/ideab.service';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {
 
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  
 // private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '-' ];
  private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home' ];

 constructor(private el: ElementRef, private _commanService: IdeaBService) {
  }

  private regex: RegExp = this._commanService.NUMBERONLY_REGX;

  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
  
  if (this.specialKeys.indexOf(event.key) !== -1) {
  return;
  }
  let current: string = this.el.nativeElement.value;
  let next: string = current.concat(event.key);
  if (next && !String(next).match(this.regex)) {
            event.preventDefault();
      }
  }
  ngOnInit(){
    //debugger;
  }
}

