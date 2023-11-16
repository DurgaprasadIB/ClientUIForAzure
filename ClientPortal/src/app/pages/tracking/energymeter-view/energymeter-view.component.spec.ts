import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergymeterViewComponent } from './energymeter-view.component';

describe('EnergymeterViewComponent', () => {
  let component: EnergymeterViewComponent;
  let fixture: ComponentFixture<EnergymeterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergymeterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergymeterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
