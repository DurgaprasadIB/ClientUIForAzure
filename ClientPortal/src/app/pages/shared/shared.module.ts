import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmailcheckDirective } from 'src/app/directives/emailcheck.directive';
import { LatLonCheckDirective } from 'src/app/directives/lat-lon-check.directive';
import { MobilecheckDirective } from 'src/app/directives/mobilecheck.directive';
import { NumberOnlyDirective } from 'src/app/directives/number-only.directive';
import { StrongpasswordDirective } from 'src/app/directives/strongpassword.directive';
import { AlphaNumerics } from 'src/app/directives/alphaNumerics.directive';
import { MobileStartingWithNumber } from 'src/app/directives/phoneNumberStarting.directive'
import { AcceptFirstCharacter } from 'src/app/directives/acceptFirstCharacter.directive';
import { AlphaNumericsWithSpaceMinusDirective } from 'src/app/directives/alpha-numerics-with-space-minus.directive';
import { NameLengthCheckDirective } from 'src/app/directives/name-length-check.directive';
//import { NumberStartWith } from 'src/app/directives/NumberStartsWith.directive';
import { TranslateModule } from '@ngx-translate/core';
import { DateFormatCustomPipePipePipe } from 'src/app/directives/date-format-custom-pipe-pipe.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalComponent,
    EmailcheckDirective,
    LatLonCheckDirective,
    MobilecheckDirective,
    NumberOnlyDirective,
    StrongpasswordDirective,
    AlphaNumerics,
    AcceptFirstCharacter,
    MobileStartingWithNumber,
    AlphaNumericsWithSpaceMinusDirective,
    NameLengthCheckDirective,
    DateFormatCustomPipePipePipe
    // NumberStartWith

  ],
  exports: [ModalComponent,
    EmailcheckDirective,
    LatLonCheckDirective,
    MobilecheckDirective,
    NumberOnlyDirective,
    StrongpasswordDirective,
    AlphaNumerics,
    AcceptFirstCharacter,
    MobileStartingWithNumber,
    AlphaNumericsWithSpaceMinusDirective,
    NameLengthCheckDirective,
    TranslateModule
    //NumberStartWith
  ]
})
export class SharedModule { }
