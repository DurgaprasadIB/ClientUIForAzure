import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorSummaryComponent } from './sensor-summary.component';

describe('SensorSummaryComponent', () => {
  let component: SensorSummaryComponent;
  let fixture: ComponentFixture<SensorSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
