import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
  display(value: boolean) {
    this.status.next(value);
  }
}
