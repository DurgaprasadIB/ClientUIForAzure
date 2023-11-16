import { Directive, HostListener, ElementRef } from '@angular/core';
import { IdeaBService } from '../pages/GlobalServices/ideab.service';

@Directive({
    selector: '[acceptFirstCharacter]'
})
export class AcceptFirstCharacter {

    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home

    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];
    constructor(private el: ElementRef, private _commanService: IdeaBService) {
    }

    private regex: RegExp = this._commanService.AcceptFirstChar_REGX;
    //     @HostListener('keydown', [ '$event' ])
    //     onKeyDown(event: KeyboardEvent) {
    //    // debugger;
    //     if (this.specialKeys.indexOf(event.key) !== -1) {
    //     return;
    //     }
    //     let current: string = this.el.nativeElement.value;
    //     let next: string = current.concat(event.key);
    //     if(next.length>0 && String(next)==" ")
    //      {
    //           event.preventDefault();
    //      }
    //    else if (next && !String(next).match(this.regex))
    //     {
    //         event.preventDefault();
    //     }
    // }

    @HostListener('focusout')
    onFocusOut() {
        // debugger;
        let current: string = this.el.nativeElement.value;
        if (current != "") {
            if (current && !String(current).match(this.regex)) {

                this.el.nativeElement.style.borderLeft = "1px solid #f3120e";
            } else {
                this.el.nativeElement.style.borderLeft = "";
            }
        } else {
            this.el.nativeElement.style.borderLeft = "";
        }
    }


    ngOnInit() {
        // debugger;
    }
}
